import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export enum PurchaseStatus {
  PENDING = 'Em validação',
  APPROVED = 'Aprovado',
};

@Schema()
export class Purchase extends Document {
  @Prop({ unique: true, required: true })
  code: number;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  cpf: string;

  @Prop({ type: String, enum: Object.values(PurchaseStatus), required: true })
  status: PurchaseStatus;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
