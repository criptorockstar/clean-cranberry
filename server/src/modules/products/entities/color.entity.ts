import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('colors')
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @ManyToMany(() => ProductEntity, (product) => product.colors)
  products: ProductEntity[];
}
