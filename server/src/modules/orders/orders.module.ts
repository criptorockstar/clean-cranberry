import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ShippingEntity } from '../users/entities/shipping.entity';
import { CartEntity } from '../cart/entities/cart.entity';
import { CartItemEntity } from '../cart/entities/cart-item.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/image.entity';
import { Size } from '../products/entities/size.entity';
import { Color } from '../products/entities/color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      UserEntity,
      ShippingEntity,
      CartEntity,
      CartItemEntity,
      ProductEntity,
      ProductImage,
      Size,
      Color,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
