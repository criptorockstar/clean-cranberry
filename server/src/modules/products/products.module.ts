import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Color } from './entities/color.entity';
import { Size } from './entities/size.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductImage } from './entities/image.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      Color,
      Size,
      Category,
      ProductImage,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
