import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticateUserDto {
  @IsNotEmpty({ message: 'email: Debe ingresar un correo' })
  @IsEmail({}, { message: 'email: Debe ser un correo válido' })
  email: string;

  @IsNotEmpty({ message: 'password: Debe ingresar una contraseña' })
  password: string;
}
