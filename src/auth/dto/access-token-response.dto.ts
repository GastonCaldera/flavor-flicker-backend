import { HttpStatus } from '@nestjs/common';

export class AccesTokenResponse {
  status: HttpStatus;
  message: string;
  data: { access_token: string };
}
