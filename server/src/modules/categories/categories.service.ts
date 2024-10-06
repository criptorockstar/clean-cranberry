import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  slugify(text: string): string {
    return text
      .normalize('NFD') // Normaliza caracteres con acentos
      .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
      .toLowerCase()
      .replace(/\s+/g, '-') // Reemplaza espacios con guiones
      .replace(/[^\w\-]+/g, ''); // Elimina caracteres no permitidos
  }

  // GET ALL
  async getAll() {
    return this.categoryRepository.find();
  }

  // GET CATEGORY BY SLUG
  async getBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  // GET PAGINATED CATEGORIES WITH SEARCH AND SORTING
  async getPaginated(page: number, limit: number, name?: string) {
    const query = this.categoryRepository.createQueryBuilder('category');

    // Filtro de búsqueda
    if (name) {
      query.andWhere('category.name LIKE :name', { name: `%${name}%` });
      // Si se busca por nombre, no aplicar paginación
      const categories = await query.getMany();
      return {
        categories,
        total: categories.length,
        totalPages: 1,
        currentPage: 1,
      };
    }

    // Paginación
    query.skip((page - 1) * limit).take(limit);

    const [categories, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      categories,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // UPDATE CATEGORY BY ID
  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    const { name, image } = updateCategoryDto;

    const slug = this.slugify(name);

    category.name = name;
    category.slug = slug;
    category.image = image;

    await this.categoryRepository.save(category);

    return category;
  }

  // DELETE CATEGORY BY ID
  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    await this.categoryRepository.remove(category);

    return { message: 'Category deleted successfully' };
  }

  // CREATE CATEGORY
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name, image } = createCategoryDto;

    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory) {
      throw new BadRequestException('name: Esa categoria ya existe');
    }

    const slug = this.slugify(name);

    const newCategory = this.categoryRepository.create({
      name,
      slug,
      image,
    });

    await this.categoryRepository.save(newCategory);

    return newCategory;
  }
}
