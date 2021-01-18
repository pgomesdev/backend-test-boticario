import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { hash } from 'bcrypt';
import { UsersModule } from '../users/users.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  const userPassword = 'test123';
  const user = {
    _id: '6003396234489b2464450fea',
    cpf: '15350946056',
    name: 'Jeremias',
    email: 'jeremias@gmail.com',
  } as User;

  let authService: AuthService;
  let jwtService: JwtService;
  const usersService = {
    findByEmail: jest.fn().mockResolvedValueOnce(undefined).mockResolvedValue(user),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test123' })],
      providers: [
        AuthService,
        UsersService,
        {
          provide: UsersModule,
          useValue: {},
        },
        {
          provide: getModelToken(User.name),
          useValue: {},
        }
      ],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return a null value when a given email is invalid', async () => {
    const result = await authService.validateUser(user.email, userPassword);

    expect(result).toEqual(null);
  });

  it('should validate a user email and password', async () => {
    const expected = { ...user };

    const password = await hash('test123', parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));

    user.password = password;

    const result = await authService.validateUser(user.email, userPassword);

    expect(result).toEqual(expected);
  });

  it('should return a null value when a given password is invalid', async () => {
    const password = await hash('test123', parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));

    user.password = password;

    const result = await authService.validateUser(user.email, 'test321');

    expect(result).toEqual(null);
  });

  it('should create a token from a user', async () => {
    const expected = {
      access_token: jwtService.sign({ sub: user._id }),
    };

    const result = await authService.login(user);

    expect(result).toEqual(expected);
  });
});
