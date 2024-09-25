import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Color } from './color.entity';
import { Size } from './size.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from './image.entity';
import { Quantities } from 'src/common/enums';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Quantities,
    default: Quantities.UNLIMITED,
  })
  quantity: Quantities;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Column()
  offer: number;

  @Column({ default: false })
  featured: boolean;

  @ManyToMany(() => Color, (color) => color.products)
  @JoinTable({
    name: 'product_colors',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'color_id', referencedColumnName: 'id' },
  })
  colors: Color[];

  @ManyToMany(() => Size, (size) => size.products)
  @JoinTable({
    name: 'product_sizes',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'size_id', referencedColumnName: 'id' },
  })
  sizes: Size[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
