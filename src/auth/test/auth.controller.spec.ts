import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { mockUser } from '../../user/test/testData';
import { HttpStatus } from '@nestjs/common';
import { CheckUniqueEmailMiddleware } from '../middlewares/check-unique-email.middleware';
import { UserService } from '../../user/user.service';
import { Request, Response } from 'express';
import {
  mockResponseCreated,
  mockResponseOk,
  mockSignIn,
  mockResponseConflict,
} from './testData';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let middleware: CheckUniqueEmailMiddleware;
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        CheckUniqueEmailMiddleware,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockResolvedValue(mockResponseCreated),
            signIn: jest.fn().mockResolvedValue(mockResponseOk),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    middleware = module.get<CheckUniqueEmailMiddleware>(
      CheckUniqueEmailMiddleware,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(middleware).toBeDefined();
  });

  describe('signUp()', () => {
    it('should call next() if email is unique', async () => {
      const req: Request = { body: { email: mockUser.email } } as Request;
      const res: Response = {} as Response;
      const nextFn = jest.fn();

      const findByEmailSpy = jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(null);

      await middleware.use(req, res, nextFn);
      expect(findByEmailSpy).toHaveBeenCalledWith(mockUser.email);
      expect(nextFn).toHaveBeenCalled();
    });

    it('should return CONFLICT status if email is not unique', async () => {
      const req: Request = { body: { email: 'test@example.com' } } as Request;
      const res: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const nextFn = jest.fn();

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(mockUser);

      await middleware.use(req, res, nextFn);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(res.json).toHaveBeenCalledWith(mockResponseConflict);
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should create a new User', async () => {
      const createSpy = jest.spyOn(service, 'signUp');

      const response = await controller.signUp(mockUser);
      expect(createSpy).toHaveBeenCalledWith(mockUser);
      expect(mockResponseCreated).toEqual(response);
    });
  });

  describe('signIn()', () => {
    it('should signIn a User', async () => {
      const createSpy = jest.spyOn(service, 'signIn');

      const response = await controller.signIn(mockSignIn);
      expect(createSpy).toHaveBeenCalledWith(mockSignIn);
      expect(mockResponseOk).toEqual(response);
    });
  });
});
