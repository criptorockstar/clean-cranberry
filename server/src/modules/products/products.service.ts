import { In, Not } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quantities } from 'src/common/enums';
import { ProductEntity } from './entities/product.entity';
import { Color } from './entities/color.entity';
import { Size } from './entities/size.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductImage } from './entities/image.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  slugify(text: string): string {
    return text
      .normalize('NFD') // Normaliza caracteres con acentos
      .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
      .toLowerCase()
      .replace(/\s+/g, '-') // Reemplaza espacios con guiones
      .replace(/[^\w\-]+/g, ''); // Elimina caracteres no permitidos
  }

  // GET COLORS
  async getColors() {
    return this.colorRepository.find();
  }

  // GET SIZES
  async getSizes() {
    return this.sizeRepository.find();
  }

  // GET PRODUCT BY ID
  async getBySlug(slug: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['sizes', 'images', 'colors', 'categories'],
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }

  // GET PAGINATED PRODUCTS WITH SEARCH
  async getPaginated(page: number, limit: number, name?: string) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories') // Asociar categorías
      .leftJoinAndSelect('product.colors', 'colors') // Asociar colores
      .leftJoinAndSelect('product.sizes', 'sizes') // Asociar talles
      .leftJoinAndSelect('product.images', 'images'); // Asociar imágenes

    // Filtro de búsqueda por nombre
    if (name) {
      query.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }

    // Paginación
    const [products, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      products,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // GET MAX PRICE
  async getMaxPrice(): Promise<number> {
    const maxPrice = await this.productRepository
      .createQueryBuilder('product')
      .select('MAX(product.price)', 'max')
      .getRawOne();

    return maxPrice.max ? Math.ceil(maxPrice.max) : 0;
  }

  // GET RELATED PRODUCTS
  async getRelated(categories: string) {
    const categoryArray = categories
      .split(',')
      .map((category) => category.trim());

    const relatedProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.images', 'images')
      .where('categories.id IN (:...categoryArray)', { categoryArray })
      .limit(4)
      .getMany();

    return relatedProducts;
  }

  // GET FEATURED PRODUCTS
  async getFeatured(): Promise<ProductEntity[]> {
    const featuredProducts = await this.productRepository.find({
      where: { featured: true },
      relations: ['images'],
    });

    return featuredProducts;
  }

  // GET PAGINATED PRODUCTS WITH FILTERS
  async getFiltered(
    page: number,
    limit: number,
    sizes?: string,
    colors?: string,
    categories?: string,
    minPrice?: number,
    maxPrice?: number,
  ) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories') // Asociar categorías
      .leftJoinAndSelect('product.colors', 'colors') // Asociar colores
      .leftJoinAndSelect('product.sizes', 'sizes') // Asociar talles
      .leftJoinAndSelect('product.images', 'images'); // Asociar imágenes

    // Filtro de tamaños
    if (sizes) {
      const sizeArray = sizes.split(',').map((size) => size.trim());
      query.andWhere('sizes.id IN (:...sizeArray)', { sizeArray });
    }

    // Filtro de colores
    if (colors) {
      const colorArray = colors.split(',').map((color) => color.trim());
      query.andWhere('colors.id IN (:...colorArray)', { colorArray });
    }

    // Filtro de categorías
    if (categories) {
      const categoryArray = categories
        .split(',')
        .map((category) => category.trim());
      query.andWhere('categories.id IN (:...categoryArray)', {
        categoryArray,
      });
    }

    // price filter
    if (minPrice !== undefined && maxPrice !== undefined) {
      query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    } else if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    } else if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Paginación
    const [products, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      products,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // UPDATE PRODUCT
  async updateProduct(id: number, updateProductDto: CreateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images', 'colors', 'sizes', 'categories'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    // Verificar si el nombre ya existe para evitar conflictos
    const existingProduct = await this.productRepository.findOne({
      where: { name: updateProductDto.name, id: Not(id) }, // Excluir el producto actual
    });

    if (existingProduct) {
      throw new ConflictException(
        'name: * Ya existe un producto con ese nombre',
      );
    }

    // Actualizar propiedades del producto
    product.name = updateProductDto.name;
    product.slug = this.slugify(updateProductDto.name);
    product.description = updateProductDto.description;
    product.stock = updateProductDto.stock;
    product.price = updateProductDto.price;
    product.featured = updateProductDto.featured || false;
    product.offer = updateProductDto.offer || 0;
    product.quantity =
      updateProductDto.quantity === 'ilimitado'
        ? Quantities.UNLIMITED
        : Quantities.LIMITED;

    // Actualizar categorías
    const categories = await this.categoryRepository.find();
    const categoryEntities = updateProductDto.categories.map((slug) => {
      const category = categories.find((cat) => cat.slug === slug);
      if (!category) {
        throw new ConflictException(
          `categories: categoria id "${slug}" no encontrada`,
        );
      }
      return category;
    });
    product.categories = categoryEntities;

    // Actualizar colores
    const colors = await this.colorRepository.find();
    const colorEntities = updateProductDto.colors.map((colorId) => {
      const color = colors.find((c) => c.id === parseInt(colorId));
      if (!color) {
        throw new ConflictException(
          `colors: color con id "${colorId}" no encontrado`,
        );
      }
      return color;
    });
    product.colors = colorEntities;

    // Actualizar tamaños
    const sizes = await this.sizeRepository.find();
    const sizeEntities = updateProductDto.sizes.map((sizeId) => {
      const size = sizes.find((s) => s.id === parseInt(sizeId));
      if (!size) {
        throw new ConflictException(
          `sizes: talle id "${sizeId}" no encontrado`,
        );
      }
      return size;
    });
    product.sizes = sizeEntities;

    // Actualizar imágenes
    const imageEntities = await Promise.all(
      updateProductDto.images.map(async (url: string) => {
        const image = this.productImageRepository.create({ url });
        await this.productImageRepository.save(image);
        return image;
      }),
    );
    product.images = imageEntities;

    // Guardar el producto actualizado
    await this.productRepository.save(product);

    return product;
  }

  // DELETE PRODUCT
  async deleteProduct(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    await this.productRepository.remove(product);

    return { message: 'Product deleted successfully' };
  }

  // CREATE PRODUCT
  async createProduct(createProductDto: CreateProductDto) {
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new ConflictException(
        'name: * Ya existe un producto con ese nombre',
      );
    }

    // Retrieve all entities to map from
    const colors = await this.colorRepository.find();
    const sizes = await this.sizeRepository.find();
    const categories = await this.categoryRepository.find();

    if (colors.length === 0 || sizes.length === 0 || categories.length === 0) {
      throw new ConflictException(
        `categories: No hay suficientes datos para agregar el producto`,
      );
    }

    // Map category values to actual category entities
    const categoryEntities = createProductDto.categories.map((slug) => {
      const category = categories.find((cat) => cat.slug === slug);
      if (!category) {
        throw new ConflictException(
          `categories: categoria id "${slug}" no encontrada`,
        );
      }
      return category;
    });

    // Map color values to actual color entities
    const colorEntities = createProductDto.colors.map((colorId) => {
      const color = colors.find((c) => c.id === parseInt(colorId));
      if (!color) {
        throw new ConflictException(
          `colors: color con id "${colorId}" no encontrado`,
        );
      }
      return color;
    });

    // Map size values to actual size entities
    const sizeEntities = createProductDto.sizes.map((sizeId) => {
      const size = sizes.find((s) => s.id === parseInt(sizeId));
      if (!size) {
        throw new ConflictException(
          `sizes: talle id "${sizeId}" no encontrado`,
        );
      }
      return size;
    });

    // Map image URLs to ProductImage entities
    const imageEntities = await Promise.all(
      createProductDto.images.map(async (url: string) => {
        const image = this.productImageRepository.create({ url });
        await this.productImageRepository.save(image);
        return image;
      }),
    );

    // Create and save the new product
    const newProduct = this.productRepository.create({
      name: createProductDto.name,
      slug: this.slugify(createProductDto.name),
      description: createProductDto.description,
      stock: createProductDto.stock,
      price: createProductDto.price,
      featured: createProductDto.featured || false,
      offer: createProductDto.offer || 0,
      quantity:
        createProductDto.quantity === 'ilimitado'
          ? Quantities.UNLIMITED
          : Quantities.LIMITED,
      categories: categoryEntities,
      colors: colorEntities,
      sizes: sizeEntities,
      images: imageEntities,
    });

    console.log(newProduct);

    await this.productRepository.save(newProduct);

    return newProduct;
  }
}
