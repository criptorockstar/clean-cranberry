import { IsNotEmpty } from 'class-validator';

export class VerifyResetPasswordTokenDto {
  @IsNotEmpty({ message: 'token: Token no proporcionado' })
  token: string;
}
