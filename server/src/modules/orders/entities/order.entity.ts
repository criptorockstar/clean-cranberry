import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CartItemEntity } from '../../cart/entities/cart-item.entity';
import { OrderStatus } from 'src/common/enums';
import { ShippingEntity } from 'src/modules/users/entities/shipping.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string;

  @Column()
  total: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.order, {
    cascade: true,
  })
  items: CartItemEntity[];

  @ManyToOne(() => ShippingEntity, { nullable: true })
  @JoinColumn()
  shippingAddress: ShippingEntity;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
