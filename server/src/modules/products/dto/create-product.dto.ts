import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Quantities } from 'src/common/enums';

export class CreateProductDto {
  @IsNotEmpty({ message: 'name: El nombre es obligatorio' })
  @IsString({ message: 'name: El formato debe ser texto' })
  name: string;

  @IsNotEmpty({ message: 'description: La descripción es obligatoria' })
  @IsString({ message: 'description: El formato debe ser texto' })
  description: string;

  @IsNotEmpty({ message: 'quantity: La cantidad es obligatoria' })
  @IsEnum(Quantities, { message: 'quantity: Valor no válido' })
  quantity: Quantities;

  @IsOptional()
  @IsNumber({}, { message: 'stock: El valor debe ser numérico' })
  stock: number;

  @IsNotEmpty({ message: 'price: El precio es obligatorio' })
  @IsNumber({}, { message: 'price: El valor debe ser numérico' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'offer: El valor debe ser numérico' })
  offer: number;

  @IsBoolean({ message: 'featured: El valor debe ser booleano' })
  featured: boolean;

  @IsArray({ message: 'colors: Debe ser un arreglo de cadenas' })
  @IsString({ each: true, message: 'colors: Cada valor debe ser una cadena' })
  colors: string[];

  @IsArray({ message: 'sizes: Debe ser un arreglo de cadenas' })
  @IsString({ each: true, message: 'sizes: Cada valor debe ser una cadena' })
  sizes: string[];

  @IsArray({ message: 'categories: Debe ser un arreglo de cadenas' })
  @IsString({
    each: true,
    message: 'categories: Cada valor debe ser una cadena',
  })
  categories: string[];

  @IsArray({ message: 'images: Debe ser un arreglo de cadenas' })
  @IsString({ each: true, message: 'images: Cada valor debe ser una cadena' })
  images: string[];
}
