import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    // Configuration Module - loads environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available throughout the app
      envFilePath: '.env',
    }),

    // Database Module - MongoDB configuration
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    BlockchainModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
