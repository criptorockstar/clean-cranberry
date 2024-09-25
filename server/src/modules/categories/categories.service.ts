import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

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

  // GET PAGINATED CATEGORIES
  async getAll(page: number, limit: number) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      categories,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // SEARCH CATEGORY BY NAME
  async searchCategory(name: string): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      where: { name },
    });

    return categories;
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
