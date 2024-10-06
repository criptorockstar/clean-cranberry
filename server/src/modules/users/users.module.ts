import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ShippingEntity } from './entities/shipping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OrderEntity, ShippingEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
