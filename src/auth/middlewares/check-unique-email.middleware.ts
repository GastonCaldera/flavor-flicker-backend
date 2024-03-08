import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class CheckUniqueEmailMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email; // Assuming email is sent in the request body
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      return res.status(HttpStatus.CONFLICT).json({
        status: HttpStatus.CONFLICT,
        message: 'Email address already in use',
        data: '',
      });
    }
    next();
  }
}
