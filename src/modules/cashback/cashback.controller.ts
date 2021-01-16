import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { CashbackService } from './cashback.service';
import { Request as RequestInterface } from 'express';
import { User } from '../users/schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cashback')
export class CashbackController {
  constructor(private cashbackService: CashbackService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCurrentBalance(@Request() req: RequestInterface) {
    const balance = await this.cashbackService.getCurrentBalance((req.user as User).cpf);

    return { balance };
  }
}
