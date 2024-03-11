import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/sing-up')
  async singUp(@Body() createUserDto: CreateUserDto) {
    const response = await this.authService.singUp(createUserDto);
    return {
      status: HttpStatus.CREATED,
      message: 'user created successfully',
      data: response,
    };
  }
}
