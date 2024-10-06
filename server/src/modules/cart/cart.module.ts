import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { UserEntity } from '../users/entities/user.entity';
import { Size } from '../products/entities/size.entity';
import { Color } from '../products/entities/color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      OrderEntity,
      UserEntity,
      Size,
      Color,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
