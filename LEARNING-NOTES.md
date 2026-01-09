# Learning Notes - NestJS Concepts

## 1. Modules - Building Blocks of NestJS

**What are Modules?**
- Modules organize your application into cohesive feature areas
- Each module is a class annotated with `@Module()` decorator
- Modules can import other modules to use their exports

**Example:**
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])], // Import other modules
  controllers: [UsersController],               // Controllers in this module
  providers: [UsersService],                    // Services in this module
  exports: [UsersService],                      // Export for other modules
})
export class UsersModule {}
```

---

## 2. Controllers - Handle HTTP Requests

**What are Controllers?**
- Controllers handle incoming HTTP requests
- Routes are defined using decorators
- Return values are automatically serialized to JSON

**Key Decorators:**
- `@Controller('users')` - Base route
- `@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()` - HTTP methods
- `@Param('id')` - Route parameters
- `@Query('page')` - Query strings
- `@Body()` - Request body
- `@Headers()` - Request headers

**Example:**
```typescript
@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `User with ID: ${id}`;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return `Creating user: ${createUserDto.email}`;
  }
}
```

---

## 3. Providers & Dependency Injection

**What are Providers?**
- Providers are classes that can be injected as dependencies
- Services are the most common type of provider
- Decorated with `@Injectable()`

**How DI Works:**
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private logger: LoggerService,  // Auto-injected
  ) {}
}
```

**Provider Scopes:**
- `DEFAULT` (Singleton) - One instance shared across the app
- `REQUEST` - New instance per request
- `TRANSIENT` - New instance every time it's injected

---

## 4. DTOs & Validation

**What are DTOs?**
- Data Transfer Objects define the shape of data
- Use class-validator decorators for validation
- Automatically validated with ValidationPipe

**Common Validators:**
```typescript
@IsString()          // Must be a string
@IsEmail()           // Must be valid email
@IsInt()             // Must be an integer
@IsOptional()        // Can be undefined
@IsNotEmpty()        // Cannot be empty
@MinLength(8)        // Minimum length
@MaxLength(50)       // Maximum length
@Min(18)             // Minimum value
@Max(120)            // Maximum value
@IsEnum(UserRole)    // Must be enum value
@Matches(/regex/)    // Must match regex
@ValidateNested()    // Validate nested object
```

**Example:**
```typescript
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;

  @IsInt()
  @Min(18)
  @Type(() => Number)
  age: number;
}
```

---

## 5. Pipes - Data Transformation & Validation

**What are Pipes?**
- Transform input data
- Validate input data
- Can throw exceptions

**Built-in Pipes:**
- `ValidationPipe` - Validates DTOs
- `ParseIntPipe` - Converts string to integer
- `ParseBoolPipe` - Converts string to boolean
- `DefaultValuePipe` - Provides default value

**Custom Pipe Example:**
```typescript
@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException('Must be positive integer');
    }
    return val;
  }
}
```

---

## 6. Exception Filters - Error Handling

**What are Exception Filters?**
- Catch and format exceptions
- Provide consistent error responses
- Can be global, controller-scoped, or method-scoped

**Common HTTP Exceptions:**
```typescript
throw new NotFoundException('User not found');
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Not authenticated');
throw new ForbiddenException('Access denied');
throw new ConflictException('Email already exists');
```

**Custom Filter:**
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
```

---

## 7. TypeORM & Database Integration

**Entity Definition:**
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Repository Methods:**
```typescript
// Find all
await this.userRepository.find();

// Find with conditions
await this.userRepository.find({ where: { isActive: true } });

// Find one
await this.userRepository.findOne({ where: { id } });

// Create and save
const user = this.userRepository.create(dto);
await this.userRepository.save(user);

// Update
await this.userRepository.update(id, updateDto);

// Delete
await this.userRepository.delete(id);

// Query builder (advanced)
await this.userRepository
  .createQueryBuilder('user')
  .where('user.age > :age', { age: 18 })
  .getMany();
```

**Relations:**
```typescript
// Many-to-One
@ManyToOne(() => User)
@JoinColumn({ name: 'userId' })
user: User;

// One-to-Many
@OneToMany(() => Order, order => order.user)
orders: Order[];
```

---

## Common Patterns

### Repository Pattern
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }
}
```

### Error Handling
```typescript
try {
  return await this.userRepository.save(user);
} catch (error) {
  if (error.code === 'SQLITE_CONSTRAINT') {
    throw new ConflictException('Email already exists');
  }
  throw error;
}
```

### Pagination
```typescript
async findAll(page: number, limit: number) {
  const skip = (page - 1) * limit;
  
  const [data, total] = await this.userRepository.findAndCount({
    skip,
    take: limit,
  });

  return { data, total, page, limit };
}
```

---

## Best Practices

1. **Use DTOs for all inputs** - Never trust raw data
2. **Always validate** - Use ValidationPipe globally
3. **Handle errors gracefully** - Use exception filters
4. **Keep controllers thin** - Business logic belongs in services
5. **Use dependency injection** - Don't create instances manually
6. **Type everything** - Leverage TypeScript
7. **Document your API** - Add Swagger/OpenAPI
8. **Test your code** - Write unit and e2e tests

---

## Next Steps

1. Add JWT authentication
2. Implement role-based access control (RBAC)
3. Add Swagger documentation
4. Write unit tests
5. Add caching with Redis
6. Implement WebSockets
7. Add GraphQL support
8. Deploy to production

---

**Remember:** Practice is key! Try modifying the code and see what happens.
