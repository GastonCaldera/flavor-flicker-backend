import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { mockUser } from '../../user/test/testData';
import { HttpStatus } from '@nestjs/common';
import { CheckUniqueEmailMiddleware } from '../middlewares/check-unique-email.middleware';
import { UserService } from '../../user/services/user.service';
import { Request, Response } from 'express';

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
            create: jest.fn().mockResolvedValue(mockUser),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(middleware).toBeDefined();
  });

  describe('create()', () => {
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
      expect(res.json).toHaveBeenCalledWith({
        status: HttpStatus.CONFLICT,
        message: 'Email address already in use',
        data: '',
      });
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should create a new User', async () => {
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce({ access_token: '1234' });
      const response = await controller.create(mockUser);
      expect(createSpy).toHaveBeenCalledWith(mockUser);
      expect({
        status: HttpStatus.CREATED,
        message: 'user created successfully',
        data: { access_token: '1234' },
      }).toEqual(response);
    });
  });
});
