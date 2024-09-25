import { IsNotEmpty } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class PasswordResetDto {
  @IsNotEmpty({ message: 'password: Debe ingresar una contraseña' })
  password: string;

  @IsNotEmpty({
    message: 'password_confirmation: Debe confirmar la contraseña',
  })
  @Match('password', {
    message: 'password_confirmation: Las contraseñas no coinciden',
  })
  password_confirmation: string;
}
