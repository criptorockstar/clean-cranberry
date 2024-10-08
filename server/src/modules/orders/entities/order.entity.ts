import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { OrderItemsEntity } from './order-items.entity';
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

  @OneToMany(() => OrderItemsEntity, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItemsEntity[];

  @ManyToOne(() => ShippingEntity, { nullable: true })
  @JoinColumn()
  shippingAddress: ShippingEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
