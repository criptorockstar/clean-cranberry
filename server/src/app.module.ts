import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './common/mailer/mailer.config';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CurrentUserMiddleware } from './common/middlewares/current-user.middleware';
import { RefreshUserMiddleware } from './common/middlewares/refresh-user.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { FileModule } from './file.module';
import { SeedersModule } from '../db/seeders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    MailerModule.forRoot(mailerConfig),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    FileModule,
    SeedersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ValidationException,
    },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(RefreshUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
