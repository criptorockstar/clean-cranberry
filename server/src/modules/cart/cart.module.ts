import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { OrderEntity } from '../orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartItemEntity, OrderEntity]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
