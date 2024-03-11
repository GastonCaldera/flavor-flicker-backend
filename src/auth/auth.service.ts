import { Model } from 'mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/schemas/user.schema';
import {
  SignUpUserDto,
  AccesTokenResponse,
  SignInUserDto,
} from './dto/index.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpUserDto: SignUpUserDto): Promise<AccesTokenResponse> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(signUpUserDto.password, salt);
    const createdUser = await this.userModel.create({
      ...signUpUserDto,
      password: hash,
    });
    const payload = { user: createdUser };
    return {
      status: HttpStatus.CREATED,
      message: 'user created successfully',
      data: { access_token: this.jwtService.sign(payload) },
    };
  }
  async signIn(signInUserDto: SignInUserDto): Promise<AccesTokenResponse> {
    const user = await this.userService.findByEmail(signInUserDto.email);
    let status: HttpStatus = HttpStatus.UNAUTHORIZED;
    let message: string = 'Incorrect Email or Password';
    let accessToken: string = '';

    if (user) {
      const isMatch = await bcrypt.compare(
        signInUserDto.password,
        user.password,
      );
      if (isMatch) {
        const payload = { user };
        status = HttpStatus.OK;
        message = 'User authenticated successfully';
        accessToken = this.jwtService.sign(payload);
      }
    }

    return {
      status,
      message,
      data: { access_token: accessToken },
    };
  }
}
