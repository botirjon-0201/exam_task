import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './models/user.model';
import { PasswordUserDto } from './dto/password-user.dto';
import { GetUser } from '../decorators/user.decorator';
import { Role } from '../decorators/role.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, type: User })
  @HttpCode(HttpStatus.CREATED)
  @Role('ADMIN')
  @Post()
  create(@Body() createUserDto: CreateUserDto, @GetUser('id') id: string) {
    return this.usersService.create(+id, createUserDto);
  }

  @ApiOperation({ summary: 'Find All Users' })
  @ApiResponse({ status: 200, type: [User] })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Find User by ID' })
  @ApiResponse({ status: 200, type: User })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update User by ID' })
  @ApiResponse({ status: 200, type: User })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete User by ID' })
  @ApiResponse({ status: 200, type: Object })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({ summary: 'Update User Password' })
  @ApiResponse({ status: 200, type: User })
  @HttpCode(HttpStatus.OK)
  @Role('EMPLOYEE')
  @Put('update-password/:id')
  updatePassword(
    @Param('id') id: string,
    @Body() passwordUserDto: PasswordUserDto,
  ) {
    return this.usersService.updatePassword(+id, passwordUserDto);
  }
}
