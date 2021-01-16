import { HttpService, Injectable } from '@nestjs/common';

type ApiReturn = {
  statusCode: number;
  body: {
    credit: number;
  };
};

@Injectable()
export class CashbackService {
  constructor(private httpService: HttpService) {}

  async getCurrentBalance(userCpf: string): Promise<number> {
    const balance = await this.httpService
      .get<ApiReturn>(process.env.APP_CASHBACK_API_URL, {
        params: { cpf: userCpf },
        headers: { token: process.env.APP_CASHBACK_API_TOKEN }
      })
      .toPromise();

    return balance.data.body.credit;
  }
}
