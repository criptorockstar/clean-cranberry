import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { OrderEntity } from '../../orders/entities/order.entity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @Column()
  quantity: number;

  @Column()
  size: number;

  @Column()
  color: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;
}
