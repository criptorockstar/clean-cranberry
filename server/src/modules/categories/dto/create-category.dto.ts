import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'name: El nombre es obligatorio' })
  @IsString({ message: 'name: Fomato no admitido' })
  name: string;

  @IsNotEmpty({ message: 'image: Debe ingresar una imagen' })
  @IsString({ message: 'image: Formato no admitido' })
  image: string;
}
