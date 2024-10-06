import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from '../../src/modules/products/entities/color.entity';

@Injectable()
export class ColorSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async onModuleInit() {
    await this.seedColors();
  }

  async seedColors() {
    const count = await this.colorRepository.count();
    if (count > 0) {
      console.log('Los colores ya están insertados.');
      return;
    }

    // Define colors with their corresponding hex codes
    const colors = [
      { name: 'Rojo', code: '#FF0000' },
      { name: 'Verde', code: '#00FF00' },
      { name: 'Azul', code: '#0000FF' },
      { name: 'Amarillo', code: '#FFFF00' },
      { name: 'Negro', code: '#000000' },
      { name: 'Blanco', code: '#FFFFFF' },
      { name: 'Gris', code: '#808080' },
      { name: 'Naranja', code: '#FFA500' },
      { name: 'Marrón', code: '#A52A2A' },
      { name: 'Rosa', code: '#FFC0CB' },
    ];

    await this.colorRepository.save(colors);
    console.log('Colores insertados');
  }
}
