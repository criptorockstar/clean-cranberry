import { IsNotEmpty, IsEnum } from 'class-validator';
import { OrderStatus } from 'src/common/enums';

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'status: El Estado es obligatorio' })
  @IsEnum(OrderStatus, { message: 'status: Estado inválido' })
  status: OrderStatus;
}
