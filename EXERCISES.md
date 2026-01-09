# Hands-On Exercises

Complete these exercises to solidify your NestJS knowledge. Solutions are provided at the end.

---

## Exercise 1: Create a Categories Module (30 min)

**Goal:** Create a new module for managing product categories.

**Requirements:**
1. Create a `Category` entity with: id, name, description, isActive
2. Create `CreateCategoryDto` with validation
3. Implement CRUD operations in `CategoriesService`
4. Add routes in `CategoriesController`
5. Update `Product` entity to have a relation with `Category`

**Files to create:**
- `src/modules/categories/entities/category.entity.ts`
- `src/modules/categories/dto/create-category.dto.ts`
- `src/modules/categories/categories.service.ts`
- `src/modules/categories/categories.controller.ts`
- `src/modules/categories/categories.module.ts`

**Hints:**
- Use `@Entity()` decorator for the entity
- Use `@ManyToOne()` for Product -> Category relationship
- Import `CategoriesModule` in `AppModule`

---

## Exercise 2: Add Email Validation (15 min)

**Goal:** Prevent duplicate email registration.

**Requirements:**
1. In `UsersService.create()`, check if email already exists
2. Throw `ConflictException` if email is taken
3. Write a reusable method `findByEmail()`
4. Test with duplicate emails

**Hint:**
```typescript
const existing = await this.userRepository.findOne({ 
  where: { email: createUserDto.email } 
});
if (existing) {
  throw new ConflictException('Email already registered');
}
```

---

## Exercise 3: Custom Validation Decorator (20 min)

**Goal:** Create a custom validator for strong passwords.

**Requirements:**
1. Create `@IsStrongPassword()` decorator
2. Password must have: 8+ chars, uppercase, lowercase, number, special char
3. Use it in `CreateUserDto`
4. Test with weak passwords

**Hint:**
```typescript
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          // Your validation logic
          return typeof value === 'string' && 
                 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
      },
    });
  };
}
```

---

## Exercise 4: Pagination Helper (25 min)

**Goal:** Create a reusable pagination utility.

**Requirements:**
1. Create `src/common/dto/pagination.dto.ts`
2. Include: page, limit, sort, order
3. Add validation for pagination params
4. Use in all controllers that list data

**Solution Structure:**
```typescript
export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
```

---

## Exercise 5: Logging Interceptor (30 min)

**Goal:** Create an interceptor to log all requests.

**Requirements:**
1. Create `src/common/interceptors/logging.interceptor.ts`
2. Log: method, URL, duration, status code
3. Apply globally in `main.ts`

**Hint:**
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        console.log(`${method} ${url} - ${duration}ms`);
      }),
    );
  }
}
```

---

## Exercise 6: Soft Delete Implementation (35 min)

**Goal:** Implement soft delete for all entities.

**Requirements:**
1. Add `deletedAt` column to entities
2. Create `@Exclude()` decorator to hide soft-deleted records
3. Update `remove()` methods to set `deletedAt` instead of deleting
4. Add `restore()` method to undelete records
5. Filter out deleted records in find queries

**Hint:**
```typescript
@Column({ type: 'datetime', nullable: true })
deletedAt: Date;

async remove(id: number): Promise<void> {
  const entity = await this.findOne(id);
  entity.deletedAt = new Date();
  await this.repository.save(entity);
}

async findAll() {
  return await this.repository.find({
    where: { deletedAt: null },
  });
}
```

---

## Exercise 7: Search Functionality (40 min)

**Goal:** Implement full-text search across users.

**Requirements:**
1. Create `SearchDto` with query and filters
2. Implement search in `UsersService`
3. Search across: firstName, lastName, email
4. Add pagination to search results
5. Create endpoint `GET /users/search`

**Bonus:** Add sorting and filtering by role/status

---

## Exercise 8: Order Statistics (30 min)

**Goal:** Add analytics endpoints for orders.

**Requirements:**
1. Create `GET /orders/stats` endpoint
2. Return: total orders, total revenue, orders by status
3. Add date range filtering
4. Calculate average order value

**Example Response:**
```json
{
  "totalOrders": 150,
  "totalRevenue": 125430.50,
  "averageOrderValue": 836.20,
  "byStatus": {
    "pending": 12,
    "confirmed": 45,
    "shipped": 38,
    "delivered": 50,
    "cancelled": 5
  }
}
```

---

## Exercise 9: Rate Limiting (45 min)

**Goal:** Implement rate limiting to prevent abuse.

**Requirements:**
1. Install `@nestjs/throttler`
2. Configure global rate limiting (10 requests per minute)
3. Apply stricter limits to POST/DELETE endpoints
4. Test by making rapid requests

**Installation:**
```bash
npm install @nestjs/throttler
```

**Usage:**
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
```

---

## Exercise 10: API Versioning (25 min)

**Goal:** Implement API versioning.

**Requirements:**
1. Enable versioning in `main.ts`
2. Create v1 and v2 of the users controller
3. v1: Returns basic user info
4. v2: Returns enhanced user info with computed fields
5. Test both versions

**Hint:**
```typescript
// main.ts
app.enableVersioning({
  type: VersioningType.URI,
});

// Controller
@Controller({
  path: 'users',
  version: '1',
})
```

---

## Challenge Exercises (Advanced)

### Challenge 1: Authentication System
Implement JWT-based authentication with:
- Login/Register endpoints
- Password hashing with bcrypt
- JWT token generation
- Auth guard to protect routes
- Refresh token mechanism

### Challenge 2: File Upload
Implement file upload for user avatars:
- Use `@nestjs/platform-express` multer
- Store files locally or cloud (S3)
- Validate file types and size
- Generate thumbnails
- Serve uploaded files

### Challenge 3: Real-time Notifications
Implement WebSocket notifications:
- Use `@nestjs/websockets`
- Send notification when order status changes
- Real-time user online status
- Chat system between users

### Challenge 4: Caching Layer
Implement Redis caching:
- Install `@nestjs/cache-manager`
- Cache frequently accessed data
- Implement cache invalidation
- Add cache statistics endpoint

---

## Testing Your Knowledge

### Quiz Questions

1. What's the difference between `@Param()` and `@Query()`?
2. When should you use `PUT` vs `PATCH`?
3. What's the default provider scope in NestJS?
4. How do you make a DTO property optional?
5. What's the purpose of `@InjectRepository()`?
6. How do exception filters differ from pipes?
7. What's the execution order: Middleware → Guard → Interceptor → Pipe → Controller?
8. When should you use `@Res()` decorator?

### Answers
1. `@Param()` extracts route parameters, `@Query()` extracts query strings
2. `PUT` replaces entire resource, `PATCH` updates partial resource
3. `SINGLETON` (Scope.DEFAULT)
4. Use `@IsOptional()` decorator
5. Injects TypeORM repository for an entity
6. Filters handle errors after they occur, pipes validate/transform before handler
7. Middleware → Guard → Interceptor (before) → Pipe → Controller → Interceptor (after) → Filter (if error)
8. When you need manual response handling or streaming

---

## Solutions

### Exercise 2 Solution: Email Validation

```typescript
// users.service.ts
async create(createUserDto: CreateUserDto): Promise<User> {
  // Check for existing email
  const existing = await this.findByEmail(createUserDto.email);
  if (existing) {
    throw new ConflictException('Email already registered');
  }

  const user = this.userRepository.create({
    ...createUserDto,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return await this.userRepository.save(user);
}

async findByEmail(email: string): Promise<User | null> {
  return await this.userRepository.findOne({ where: { email } });
}
```

---

**Keep practicing! The more you build, the better you'll understand NestJS! 🚀**
