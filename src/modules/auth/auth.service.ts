import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<Pick<User, '_id' | 'cpf' | 'name' | 'email'> | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) return null;

    const isPasswordValid = await compare(password, user?.password);

    if (isPasswordValid) {
      const { _id, cpf, name, email } = user;

      return { _id, cpf, name, email };
    }

    return null;
  }

  async login(user: Pick<User, '_id' | 'cpf' | 'name' | 'email'>) {
    const payload = { sub: user._id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
