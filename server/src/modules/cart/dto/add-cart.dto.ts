import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddCartDto {
  @IsNotEmpty({ message: 'product: El producto es obligatorio' })
  @IsNumber(
    {},
    { message: 'product: El id del producto debe ser un valor numérico' },
  )
  product: number;

  @IsNotEmpty({ message: 'quantity: La cantidad es un valor obligatorio' })
  @IsNumber({}, { message: 'quantity: La cantidad debe ser un valor numérico' })
  quantity: number;

  @IsNotEmpty({ message: 'size: El talle es obligatorio' })
  @IsNumber({}, { message: 'size: El talle debe ser un valor numérico' })
  size: number;

  @IsNotEmpty({ message: 'color: El color es obligatorio' })
  @IsNumber({}, { message: 'color: El color debe ser un valor numérico' })
  color: number;
}
