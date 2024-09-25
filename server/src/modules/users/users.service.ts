import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
  ) {}

  // GET USER BY ID
  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('* Usuario no encontrado');
    return user;
  }

  // GET USER BY USERNAME
  async findUserByUsername(username: string) {
    return await this.usersRepository.findOne({ where: { username } });
  }

  // GET USER BY EMAIL
  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  // PASSWORD RECOVERY
  async recoverPassword(
    passwordRecoveryDto: PasswordRecoveryDto,
  ): Promise<any> {
    const { email } = passwordRecoveryDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('* Usuario no encontrado');
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        // Token expires in 1 hour
        expiresIn: '1h',
      },
    );

    // Save token in users database
    user.reset_password_token = resetToken;
    await this.usersRepository.save(user);

    // Generate URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send mail
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Recuperación de Contraseña',
        template: 'reset-password',
        context: {
          resetUrl,
        },
      });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }

    return {
      message: 'Se ha enviado el mail de recuperación',
    };
  }

  // VERIFY RESET PASSWORD TOKEN
  async verifyResetPasswordToken(token: string): Promise<any> {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      return payload;
    } catch (error) {
      return false;
    }
  }

  // RESET PASSWORD
  async resetPassword(token: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { reset_password_token: token },
    });

    if (!user) {
      throw new NotFoundException('* Usuario no encontrado');
    }

    const hashedPassword = await hash(password, 10);
    user.password = hashedPassword;
    user.reset_password_token = null;

    await this.usersRepository.save(user);

    return { message: 'Contraseña actualizada exitosamente' };
  }

  // ACCESS TOKEN
  async accessToken(user: UserEntity) {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    );
    return token;
  }

  // REFRESH TOKEN
  async refreshToken(user: UserEntity) {
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION },
    );
    return refreshToken;
  }

  // CREATE USER
  async create(createUserDto: CreateUserDto): Promise<{
    username: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }> {
    // check if username is available
    const usernameExists = await this.findUserByUsername(
      createUserDto.username,
    );
    if (usernameExists)
      throw new BadRequestException('username: * Usuario no disponible');

    // check if email is available
    const userExists = await this.findUserByEmail(createUserDto.email);
    if (userExists)
      throw new BadRequestException('email: * Correo no disponible');

    // hash password
    createUserDto.password = await hash(createUserDto.password, 10);

    // save database entry
    const user = this.usersRepository.create(createUserDto);

    const savedUser = await this.usersRepository.save(user);
    const accessToken = await this.accessToken(savedUser);
    const refreshToken = await this.refreshToken(savedUser);

    return {
      username: savedUser['username'],
      email: savedUser['email'],
      role: savedUser['roles'],
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  // AUTHENTICATE USER
  async signin(loginUserDto: AuthenticateUserDto) {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: loginUserDto.email })
      .getOne();
    if (!userExists)
      throw new BadRequestException('password: * Usuario no registrado');
    const match = await compare(loginUserDto.password, userExists.password);
    if (!match)
      throw new BadRequestException(
        'password: * Las credenciales son incorrectas',
      );
    delete userExists.password;
    return userExists;
  }

  // UPDATE USER
  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('* Usuario no encontrado');
    }

    // Verify if user is trying to update email and if it's available
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findUserByEmail(updateUserDto.email);
      if (existingUser) {
        throw new BadRequestException('email: * Correo no disponible');
      }
    }

    // Hash password and update
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    // Update needed fields
    Object.assign(user, updateUserDto);

    // Save changes in database
    return this.usersRepository.save(user);
  }

  // DELETE ACCOUNT
  async deleteAccount(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('* Usuario no encontrado');
    }

    await this.usersRepository.remove(user);
  }

  // ## ADMIN ## //

  // GET ALL USERS
  async getAllUsers(page: number, limit: number) {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // DELETE USER BY ID
  async deleteUserById(id: number): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('* Usuario no encontrado');
    }

    await this.usersRepository.remove(user);
    return { message: 'Usuario eliminado exitosamente' };
  }
}
