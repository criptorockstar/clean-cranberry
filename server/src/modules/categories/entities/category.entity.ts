import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  image: string;

  @ManyToMany(() => ProductEntity, (product) => product.categories)
  products: ProductEntity[];
}
