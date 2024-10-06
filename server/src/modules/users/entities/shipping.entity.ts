import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Entity('shipping')
export class ShippingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column({ nullable: true })
  door: number;

  @Column()
  zip: string;

  @Column()
  phone: string;

  @OneToOne(() => UserEntity, (user) => user.shipping, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
