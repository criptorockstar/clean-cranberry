import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('sizes')
export class Size {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => ProductEntity, (product) => product.sizes)
  products: ProductEntity[];
}
