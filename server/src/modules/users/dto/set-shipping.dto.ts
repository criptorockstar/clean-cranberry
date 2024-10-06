import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class SetShippingDto {
  @IsNotEmpty({ message: 'address: Dirección es obligatorio' })
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  door?: number;

  @IsNotEmpty({ message: 'zip: El codigo postal es obligatorio' })
  @IsString()
  zip: string;

  @IsNotEmpty({ message: 'phone: El telefono es obligatorio' })
  @IsString()
  phone: string;
}
