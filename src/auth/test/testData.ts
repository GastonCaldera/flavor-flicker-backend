import { HttpStatus } from '@nestjs/common';

export const mockSignIn = {
  email: 'pedro@gmail.com',
  password: 'Wtttttt1*',
};
export const mockResponseOk = {
  status: HttpStatus.OK,
  message: 'User authenticated successfully',
  data: { access_token: '1234' },
};

export const mockResponseCreated = {
  status: HttpStatus.CREATED,
  message: 'user created successfully',
  data: { access_token: '1234' },
};

export const mockResponseConflict = {
  status: HttpStatus.CONFLICT,
  message: 'Email address already in use',
  data: {
    access_token: '',
  },
};

export const mockResponseUnauthorized = {
  status: HttpStatus.UNAUTHORIZED,
  message: 'Incorrect Email or Password',
  data: {
    access_token: '',
  },
};
