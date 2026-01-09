import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    // Configuration Module - loads environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available throughout the app
      envFilePath: '.env',
    }),

    // Database Module - TypeORM configuration
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'learning.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-sync schema (don't use in production!)
      logging: true, // Log SQL queries
    }),

    // Feature Modules
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
