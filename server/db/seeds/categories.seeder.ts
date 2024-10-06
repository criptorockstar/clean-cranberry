import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../src/modules/categories/entities/category.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategorySeeder implements OnModuleInit {
  private readonly apiUrl: string;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('API_URL');
  }

  async onModuleInit() {
    await this.seedCategories();
  }

  async seedCategories() {
    const count = await this.categoryRepository.count();
    if (count > 0) {
      console.log('Las categorías ya están insertadas.');
      return;
    }

    const categories = ['Conjuntos', 'Remeras', 'Buzos'].map((name) => ({
      name,
      slug: this.slugify(name),
      image: `${this.apiUrl}/files/${this.slugify(name)}.jpeg`,
    }));

    await this.categoryRepository.save(categories);
    console.log('Categorías insertadas');
  }

  slugify(text: string): string {
    return text
      .normalize('NFD') // Normaliza el texto
      .replace(/[\u0300-\u036f]/g, '') // Remueve acentos
      .toLowerCase()
      .replace(/\s+/g, '-') // Reemplaza espacios por guiones
      .replace(/[^\w\-]+/g, ''); // Remueve caracteres no alfanuméricos
  }
}
