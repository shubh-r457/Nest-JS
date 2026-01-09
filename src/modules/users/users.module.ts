import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './entities/user.entity';
import { LoggerService } from '../../common/services/logger.service';
import { CacheService } from '../../common/services/cache.service';

/**
 * TOPIC: Modular Architecture
 * 
 * Modules organize the application into cohesive blocks
 * Each module encapsulates a feature area
 */

@Module({
  imports: [
    // Import Mongoose schema for User entity
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController], // Controllers for this module
  providers: [
    UsersService, // Services for this module
    LoggerService, // Custom providers
    CacheService,
  ],
  exports: [UsersService], // Export for use in other modules
})
export class UsersModule {}
