import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, cpf, email, password } = createUserDto;

    const userWithEmailOrCpfExists = await this.userModel
      .countDocuments({
        $or: [
          { email },
          { cpf }
        ],
      });

    if (!!userWithEmailOrCpfExists) {
      throw new BadRequestException({ error: 'A user with email or CPF already exists.' });
    }

    const isAValidCpf = this.validateCpf(cpf);

    if (!isAValidCpf) {
      throw new BadRequestException({ error: 'The CPF provided is invalid.' });
    }

    const hashedPassword = await hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));

    return this.userModel.create({ name, cpf, email, password: hashedPassword });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).lean();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).lean();
  }

  validateCpf(cpf: string): boolean {
    const digits = cpf.split('');

    if (digits.every(digit => digit === digits[0])) return false;

    const firstDigitCalculationSum = digits.slice(0, 9).reduce((acc, digit, index) => +digit * (10 - index) + acc, 0);
    const firstIdentifierDigit = +digits[9];
    const firstModResult = (firstDigitCalculationSum * 10) % 11;
    const normalizedFirstModResult = firstModResult < 10 ? firstModResult : 0;

    if (normalizedFirstModResult !== firstIdentifierDigit) return false;

    const secondDigitCalculationSum = digits.slice(0, 10).reduce((acc, digit, index) => +digit * (11 - index) + acc, 0);
    const secondIdentifierDigit = +digits[10];
    const secondModResult = (secondDigitCalculationSum * 10) % 11;
    const normalizedSecondModResult = secondModResult < 10 ? secondModResult : 0;

    if (normalizedSecondModResult !== secondIdentifierDigit) return false;

    return true;
  }
}
