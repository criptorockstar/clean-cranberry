import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordRecoveryDto {
  @IsNotEmpty({ message: 'email: Debe ingresar un correo' })
  @IsEmail({}, { message: 'email: Debe ser un correo válido' })
  email: string;
}
