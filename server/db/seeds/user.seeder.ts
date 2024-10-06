import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/common/enums';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async seedUser() {
    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: 'cranberrymayorista@gmail.com' },
    });

    if (!existingUser) {
      // Hash the password
      const hashedPassword = await bcrypt.hash('cRANBERRY10', 10);

      // Create the new user
      const newUser = this.userRepository.create({
        username: 'cranberrymayorista',
        email: 'cranberrymayorista@gmail.com',
        password: hashedPassword,
        roles: Roles.ADMIN,
      });

      await this.userRepository.save(newUser);
      console.log('User seeded successfully');
    } else {
      console.log('User already exists');
    }
  }
}
