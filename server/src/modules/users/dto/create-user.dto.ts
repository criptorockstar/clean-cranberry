import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'username: El usuario es obligatorio' })
  username: string;

  @IsNotEmpty({ message: 'email: Debe ingresar un correo' })
  @IsEmail({}, { message: 'email: Debe ser un correo válido' })
  email: string;

  @IsNotEmpty({ message: 'password: Debe ingresar una contraseña' })
  @MinLength(5, { message: 'password: La contraseña es muy corta' })
  password: string;

  @IsNotEmpty({
    message: 'passwordConfirm: Debe confirmar la contraseña',
  })
  @Validate(Match, ['password'], {
    message: 'passwordConfirm: Las contraseñas no coinciden',
  })
  passwordConfirm: string;
}
