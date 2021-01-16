import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { Request as RequestInterface } from 'express';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestInterface) {
    return this.authService.login(req.user as User);
  }
}
