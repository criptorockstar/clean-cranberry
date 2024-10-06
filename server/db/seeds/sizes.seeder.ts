import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from '../../src/modules/products/entities/size.entity';

@Injectable()
export class SizeSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
  ) {}

  async onModuleInit() {
    await this.seedSizes();
  }

  async seedSizes() {
    const count = await this.sizeRepository.count();
    if (count > 0) {
      console.log('Los tamaños ya están insertados.');
      return;
    }

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((name) => ({
      name,
    }));

    await this.sizeRepository.save(sizes);
    console.log('Tamaños insertados');
  }
}
