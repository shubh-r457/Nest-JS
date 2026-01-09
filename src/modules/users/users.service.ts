import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerService } from '../../common/services/logger.service';
import { CacheService } from '../../common/services/cache.service';

/**
 * TOPIC: Providers and Dependency Injection (DI)
 * 
 * This service demonstrates:
 * - Constructor-based dependency injection
 * - Repository pattern with Mongoose
 * - Service as a provider
 * - Custom providers (LoggerService, CacheService)
 * - Scoped providers (default is SINGLETON)
 */

@Injectable() // Makes this class a provider that can be injected
// @Injectable({ scope: Scope.REQUEST }) // Example: Request-scoped provider
export class UsersService {
  /**
   * Dependency Injection happens in the constructor
   * NestJS automatically resolves and injects these dependencies
   */
  constructor(
    // Inject Mongoose model for User entity
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    // Inject custom service providers
    private readonly logger: LoggerService,
    private readonly cache: CacheService,
  ) {
    this.logger.log('UsersService initialized', 'UsersService');
  }

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Creating new user', 'UsersService');

    // Create user document from DTO
    const user = new this.userModel(createUserDto);

    // Save to database
    const savedUser = await user.save();

    // Cache the user
    await this.cache.set(`user:${savedUser._id}`, savedUser, 3600);

    this.logger.log(`User created with ID: ${savedUser._id}`, 'UsersService');
    return savedUser;
  }

  /**
   * Create multiple users in batch
   */
  async createBatch(createUserDtos: CreateUserDto[]): Promise<any[]> {
    return await this.userModel.insertMany(createUserDtos);
  }

  /**
   * Find all users with pagination and search
   */
  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.userModel.find(searchFilter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.userModel.countDocuments(searchFilter).exec(),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Find active users
   */
  async findActive(): Promise<User[]> {
    return await this.userModel.find({ isActive: true }).exec();
  }

  /**
   * Find one user by ID
   */
  async findOne(id: string): Promise<User> {
    // Check cache first
    const cached = await this.cache.get<User>(`user:${id}`);
    if (cached) {
      this.logger.log(`User ${id} retrieved from cache`, 'UsersService');
      return cached;
    }

    // Query database
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update cache
    await this.cache.set(`user:${id}`, user, 3600);

    return user;
  }

  /**
   * Get user profile with additional data
   */
  async getUserProfile(id: string): Promise<any> {
    const user = await this.findOne(id);
    const userObj = user instanceof Object && '_id' in user ? user : user;
    
    return {
      _id: userObj['_id'],
      email: userObj['email'],
      firstName: userObj['firstName'],
      lastName: userObj['lastName'],
      age: userObj['age'],
      role: userObj['role'],
      isActive: userObj['isActive'],
      fullName: `${userObj['firstName']} ${userObj['lastName']}`,
      accountAge: this.calculateAccountAge(userObj['createdAt']),
    };
  }

  /**
   * Advanced search with multiple filters
   */
  async advancedSearch(filters: {
    name?: string;
    email?: string;
    minAge?: number;
    maxAge?: number;
  }): Promise<User[]> {
    const query: any = {};

    if (filters.name) {
      query.$or = [
        { firstName: { $regex: filters.name, $options: 'i' } },
        { lastName: { $regex: filters.name, $options: 'i' } },
      ];
    }

    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }

    if (filters.minAge !== undefined && filters.maxAge !== undefined) {
      query.age = { $gte: filters.minAge, $lte: filters.maxAge };
    }

    return await this.userModel.find(query).exec();
  }

  /**
   * Update a user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true, runValidators: true }
    ).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Invalidate cache
    await this.cache.delete(`user:${id}`);

    this.logger.log(`User ${id} updated`, 'UsersService');
    return user;
  }

  /**
   * Remove a user (soft delete)
   */
  async remove(id: string): Promise<void> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.cache.delete(`user:${id}`);

    this.logger.log(`User ${id} deleted`, 'UsersService');
  }

  /**
   * Private helper method
   */
  private calculateAccountAge(createdAt: Date): string {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  }
}
