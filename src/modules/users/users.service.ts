import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerService } from '../../common/services/logger.service';
import { CacheService } from '../../common/services/cache.service';

/**
 * TOPIC: Providers and Dependency Injection (DI)
 * 
 * This service demonstrates:
 * - Constructor-based dependency injection
 * - Repository pattern with TypeORM
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
    // Inject TypeORM repository for User entity
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

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

    // Create user entity from DTO
    const user = this.userRepository.create({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save to database
    const savedUser = await this.userRepository.save(user);

    // Cache the user
    await this.cache.set(`user:${savedUser.id}`, savedUser, 3600);

    this.logger.log(`User created with ID: ${savedUser.id}`, 'UsersService');
    return savedUser;
  }

  /**
   * Create multiple users in batch
   */
  async createBatch(createUserDtos: CreateUserDto[]): Promise<User[]> {
    const users = createUserDtos.map((dto) =>
      this.userRepository.create({
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    return await this.userRepository.save(users);
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

    const whereCondition = search
      ? [
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  /**
   * Find active users
   */
  async findActive(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
    });
  }

  /**
   * Find one user by ID
   */
  async findOne(id: number): Promise<User> {
    // Check cache first
    const cached = await this.cache.get<User>(`user:${id}`);
    if (cached) {
      this.logger.log(`User ${id} retrieved from cache`, 'UsersService');
      return cached;
    }

    // Query database
    const user = await this.userRepository.findOne({ where: { id } });

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
  async getUserProfile(id: number): Promise<any> {
    const user = await this.findOne(id);
    
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      accountAge: this.calculateAccountAge(user.createdAt),
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
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filters.name) {
      queryBuilder.andWhere(
        '(user.firstName LIKE :name OR user.lastName LIKE :name)',
        { name: `%${filters.name}%` },
      );
    }

    if (filters.email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
    }

    if (filters.minAge !== undefined && filters.maxAge !== undefined) {
      queryBuilder.andWhere('user.age BETWEEN :minAge AND :maxAge', {
        minAge: filters.minAge,
        maxAge: filters.maxAge,
      });
    }

    return await queryBuilder.getMany();
  }

  /**
   * Update a user
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Merge updates
    Object.assign(user, updateUserDto, { updatedAt: new Date() });

    const updatedUser = await this.userRepository.save(user);

    // Invalidate cache
    await this.cache.delete(`user:${id}`);

    this.logger.log(`User ${id} updated`, 'UsersService');
    return updatedUser;
  }

  /**
   * Remove a user (soft delete)
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    
    user.isDeleted = true;
    user.updatedAt = new Date();
    
    await this.userRepository.save(user);
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
