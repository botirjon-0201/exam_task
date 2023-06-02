import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { PasswordUserDto } from './dto/password-user.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly organizationService: OrganizationsService,
  ) {}

  async create(userId: number, createUserDto: CreateUserDto) {
    const { email, password, confirm_password, org_id } = createUserDto;

    const user = await this.findByEmail(email);
    if (user)
      throw new BadRequestException('User with that email already exists!');

    if (password !== confirm_password)
      throw new BadRequestException('Password and confirm password not match');

    const salt = await genSalt(10);
    const hashed_password = await hash(password, salt);

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashed_password,
      created_by: userId,
    });

    const result = await this.organizationService.findById(org_id);
    await newUser.$set('organizations', [result.id]);
    newUser.organizations = [result];

    const response = {
      newUser: this.getUserField(newUser),
      message: 'New user created successfully!',
    };
    return response;
  }

  async findAll() {
    const users = await this.userModel.findAll({
      attributes: { exclude: ['password', 'refresh_token'] },
    });
    if (!users) throw new NotFoundException('No any Users');

    const response = { users, message: 'All Users' };
    return response;
  }

  async findOne(id: number) {
    const user = await this.findById(id);
    if (!user) throw new UnauthorizedException('User Not Found');

    const response = {
      user: this.getUserField(user),
      message: 'User Information',
    };
    return response;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) throw new UnauthorizedException('User not found');

    const updatedUser = await this.userModel.update(
      { ...updateUserDto },
      { where: { id }, returning: true },
    );

    const response = {
      user: this.getUserField(updatedUser[1][0]),
      message: 'User information updated successfully!',
    };
    return response;
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) throw new UnauthorizedException('User not found');
    await this.userModel.destroy({ where: { id } });

    const response = { message: `This action removes a #${id} user` };
    return response;
  }

  async updatePassword(id: number, passwordUserDto: PasswordUserDto) {
    const { password, new_password, confirm_new_password } = passwordUserDto;

    const user = await this.findById(id);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatchPass = await compare(password, user.password);
    if (!isMatchPass)
      throw new UnauthorizedException('Password is wrong, please try again');

    if (new_password !== confirm_new_password)
      throw new BadRequestException('Password and confirm password not match');

    const salt = await genSalt(10);
    const hashed_password = await hash(new_password, salt);

    const updatedUser = await this.userModel.update(
      { password: hashed_password },
      { where: { id: user.id }, returning: true },
    );

    const response = {
      user: this.getUserField(updatedUser[1][0]),
      message: 'Password updated successfully',
    };
    return response;
  }

  async findById(id: number): Promise<User | null> {
    return await this.userModel.findOne({
      where: { id },
      include: { all: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: { email },
      include: { all: true },
    });
  }

  getUserField(user: User) {
    const { password, refresh_token, ...result } = user.dataValues;
    return result;
  }
}
