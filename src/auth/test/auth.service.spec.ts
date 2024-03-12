import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { mockUser } from '../../user/test/testData';
import { User } from '../../user/schemas/user.schema';
import { Model } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import {
  mockResponseCreated,
  mockResponseOk,
  mockSignIn,
  mockResponseUnauthorized,
} from './testData';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;
  let userService: UserService;
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
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken('User'));
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    jest.spyOn(jwtService, 'sign').mockReturnValue('1234');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp()', () => {
    it('should insert a new user', async () => {
      const createSpy = jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser as any));
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(() => Promise.resolve(mockUser.password));
      const response = await service.signUp(mockUser);
      expect(createSpy).toHaveBeenCalledWith(mockUser);
      expect(response).toEqual(mockResponseCreated);
    });
  });

  describe('signIn()', () => {
    it('should signIn', async () => {
      const findByEmailSpy = jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(true));
      const response = await service.signIn(mockSignIn);
      expect(findByEmailSpy).toHaveBeenCalledWith(mockSignIn.email);
      expect(response).toEqual(mockResponseOk);
    });

    it('should not signIn, email invalid', async () => {
      const findByEmailSpy = jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(true));

      const response = await service.signIn(mockSignIn);
      expect(findByEmailSpy).toHaveBeenCalledWith(mockSignIn.email);
      expect(response).toEqual(mockResponseUnauthorized);
    });

    it('should not signIn, password invalid', async () => {
      const findByEmailSpy = jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(false));

      const response = await service.signIn(mockSignIn);
      expect(findByEmailSpy).toHaveBeenCalledWith(mockSignIn.email);
      expect(response).toEqual(mockResponseUnauthorized);
    });
  });
});
