import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Purchase, PurchaseStatus } from './schemas/purchase.schema';

const whitelistedCpfs = ['15350946056'];

@Injectable()
export class PurchasesService {
  constructor(@InjectModel(Purchase.name) private purchaseModel: Model<Purchase>) {}

  async createPurchase(createPurchaseDto: CreatePurchaseDto, userCpf: string): Promise<Purchase> {
    const { code, value, date } = createPurchaseDto;
    const purchaseCodeExists = await this.purchaseModel.findOne({ code }).lean();

    if (!!purchaseCodeExists) {
      throw new BadRequestException({ error: 'A purchase with code provided already exists.' });
    }

    const cashbackPercentage = this.getCashbackPercentage(value);

    return this.purchaseModel.create({
      code,
      value,
      date: new Date(date),
      cpf: userCpf,
      status: whitelistedCpfs.includes(userCpf) ? PurchaseStatus.APPROVED : PurchaseStatus.PENDING,
      cashbackPercentage,
      cashbackValue: value * cashbackPercentage,
    });
  }

  private getCashbackPercentage(purchaseValue: number) {
    if (purchaseValue <= 1000) return 0.1;
    if (purchaseValue > 1500) return 0.2;

    return 0.15;
  }
}
