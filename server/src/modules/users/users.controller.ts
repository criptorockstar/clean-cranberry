import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthorizeGuard } from 'src/common/guards/authorization.guard';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PasswordResetGuard } from 'src/common/guards/password-reset.guard';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import { RefreshUser } from 'src/common/decorators/refresh-user.decorator';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { VerifyResetPasswordTokenDto } from './dto/verify-reset.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // VERIFY TOKEN
  @UseGuards(AuthenticationGuard)
  @Get('/verify-token')
  async veryfyToken(@CurrentUser() currentUser: UserEntity) {
    return { isValid: !!currentUser };
  }

  // REFRESH TOKEN
  @UseGuards(RefreshGuard)
  @Get('/refresh-token')
  async refresh(@RefreshUser() refreshUser: UserEntity) {
    const user = refreshUser;
    const accessToken = await this.usersService.accessToken(user);
    console.log('refresh try', user);

    return {
      accessToken,
    };
  }

  // PASSWORD RECOVERY
  @Post('/password-recovery')
  async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    await this.usersService.recoverPassword(passwordRecoveryDto);
    return {
      message: 'Se ha enviado un correo de recuperación.',
    };
  }

  // VERIFY RESET PASSWORD TOKEN
  @UseGuards(PasswordResetGuard)
  @Post('/verify-reset-password-token')
  async verifyResetPasswordToken(
    @Body() VerifyResetPasswordTokenDto: VerifyResetPasswordTokenDto,
  ) {
    const { token } = VerifyResetPasswordTokenDto;
    const isValid = await this.usersService.verifyResetPasswordToken(token);
    return { isValid };
  }

  // PASSWORD RESET
  @UseGuards(PasswordResetGuard)
  @Put('/password-reset')
  async passwordReset(
    @Body() passwordResetDto: PasswordResetDto,
    @Headers('authorization') authorization: string,
  ) {
    const { password } = passwordResetDto;

    // Extract token from Bearer
    const token = authorization.split(' ')[1];

    // Perform updates
    const result = await this.usersService.resetPassword(token, password);

    return result;
  }

  // CREATE USER
  @Post('/sign-up')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ email: string }> {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  // AUTHENTICATE USER
  @Post('/sign-in')
  async signin(@Body() loginUserDto: AuthenticateUserDto): Promise<{
    username: string;
    email: string;
    role: any;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersService.signin(loginUserDto);

    const accessToken = await this.usersService.accessToken(user);
    const refreshToken = await this.usersService.refreshToken(user);

    return {
      username: user.username,
      email: user.email,
      role: user.roles,
      accessToken,
      refreshToken,
    };
  }

  // LOGOUT
  @UseGuards(AuthenticationGuard)
  @Get('/logout')
  async logout() {
    return {
      logout: true,
    };
  }

  // UPDATE USER
  @UseGuards(AuthenticationGuard)
  @Put('/update')
  async updateUser(
    @CurrentUser() currentUser: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const updatedUser = await this.usersService.updateUser(
      currentUser.id,
      updateUserDto,
    );
    return updatedUser;
  }

  // DELETE ACCOUNT
  @UseGuards(AuthenticationGuard)
  @Delete('/delete-account')
  async deleteAccount(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<{ message: string }> {
    await this.usersService.deleteAccount(currentUser.id);
    return { message: 'Usuario eliminado exitosamente' };
  }

  // ## ADMIN ## //

  // VERIFY ADMIN ROLE
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Get('/isadmin')
  async veryfyRole(@CurrentUser() currentUser: UserEntity) {
    return currentUser.roles;
  }

  // GET ALL USERS
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Get('/all')
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.getAllUsers(page, limit);
  }

  // DELETE USER BY ID (ADMIN)
  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Delete('/:id')
  async deleteUserById(@Param('id') id: number) {
    return this.usersService.deleteUserById(id);
  }
}
