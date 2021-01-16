import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @HttpCode(201)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { _id, name, cpf, email } = await this.userService.createUser(createUserDto);

    return { _id, name, cpf, email };
  }
}
