import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

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
      throw new BadRequestException({ error: 'A user with email or cpf already exists.' });
    }

    // TODO: validate if CPF is valid

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));

    const newUser = await this.userModel.create({ name, cpf, email, password: hashedPassword });

    await newUser.save();

    return newUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).lean();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).lean();
  }
}
