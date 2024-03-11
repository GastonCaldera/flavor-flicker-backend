import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { mockUser } from '../../user/test/testData';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken('User'));
    jwtService = module.get<JwtService>(JwtService);

    jest.spyOn(jwtService, 'sign').mockReturnValue('mockedAccessToken');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a new user', async () => {
    jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() =>
        Promise.resolve({ access_token: 'mockedAccessToken' } as any),
      );
    const newUser = await service.create(mockUser);
    expect(newUser).toEqual({ access_token: 'mockedAccessToken' });
  });
});
