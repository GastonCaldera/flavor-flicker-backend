import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto/index.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/sign-up')
  async signUp(@Body() signUpUserDto: SignUpUserDto) {
    const response = await this.authService.signUp(signUpUserDto);
    return response;
  }
  @Post('/sign-in')
  @HttpCode(200)
  async signIn(@Body() signInUserDto: SignInUserDto) {
    const response = await this.authService.signIn(signInUserDto);
    return response;
  }
}
