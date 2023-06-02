import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(userId: number): Promise<User | null> {
    return await this.userService.findById(userId);
  }

  async signin(loginUserDto: LoginUserDto, res: Response) {
    const { email, password } = loginUserDto;

    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException('Email is wrong or User not registered');

    const isMatchPass = await compare(password, user.password);
    if (!isMatchPass)
      throw new NotFoundException("Password isn't correct, please try again");

    const response = {
      ...(await this.getResponse(user, res)),
      message: 'User have signed in successfully!',
    };
    return response;
  }

  async signout(refresh_token: string, res: Response) {
    const userData = await this.jwtService.verify(refresh_token, {
      secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
    });
    if (!userData) throw new UnauthorizedException('User not found');

    const user = await this.userModel.findOne(userData.id);
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.userModel.update(
      { refresh_token: null },
      { where: { id: userData.id }, returning: true },
    );
    res.clearCookie('refresh_token');

    const response = {
      user: this.userService.getUserField(updatedUser[1][0]),
      message: 'User have signed out!',
    };
    return response;
  }

  async refreshToken(user_id: number, refresh_token: string, res: Response) {
    const decodedToken = this.jwtService.decode(refresh_token);
    if (user_id !== +decodedToken['id'])
      throw new UnauthorizedException('User id wrong, please try again!');

    const user = await this.userService.findById(user_id);
    if (!user || !user.refresh_token)
      throw new NotFoundException('User not found');

    const tokenMatch = await compare(refresh_token, user.refresh_token);
    if (!tokenMatch) throw new UnauthorizedException('Cannot access');

    const response = {
      ...(await this.getResponse(user, res)),
      message: 'User token has been refreshed',
    };
    return response;
  }

  async getResponse(user: User, res: Response) {
    const tokens = await this.getPairsOfTokens(user);

    const salt = await genSalt(10);
    const hashed_refresh_token = await hash(tokens.refresh_token, salt);

    const updatedUser = await this.userModel.update(
      { refresh_token: hashed_refresh_token },
      { where: { id: user.id }, returning: true },
    );

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return { user: this.userService.getUserField(updatedUser[1][0]), tokens };
  }

  async getPairsOfTokens(user: User) {
    const jwtPayload = {
      id: user.id,
      role: user.role,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_TIME'),
      }),

      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_TIME'),
      }),
    ]);

    return { access_token, refresh_token };
  }
}
