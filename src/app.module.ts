import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PurchasesModule } from './modules/purchases/purchases.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forRoot(process.env.MONGODB_STRING_CONN, { useCreateIndex: true }),
    AuthModule,
    UsersModule,
    PurchasesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
