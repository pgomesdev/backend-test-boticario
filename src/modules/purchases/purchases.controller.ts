import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { Request as RequestInterface } from 'express';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { User } from '../users/schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('purchases')
export class PurchasesController {
  constructor(private purchaseService: PurchasesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async createPurchase(
    @Request() req: RequestInterface,
    @Body() createPurchaseDto: CreatePurchaseDto
  ) {
    const purchase = await this.purchaseService.createPurchase(createPurchaseDto, (req.user as User).cpf);

    const { _id, code, value, date, cpf, status, cashbackPercentage } = purchase;

    return { _id, code, value, date, cpf, status, cashbackPercentage };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listPurchases(@Request() req: RequestInterface) {
    return this.purchaseService.listPurchases((req.user as User).cpf);
  }
}
