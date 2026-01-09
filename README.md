# NestJS Backend Learning Project 🚀

A comprehensive, hands-on learning project covering all essential NestJS backend concepts with practical examples.

## 📚 Topics Covered

### 1. NestJS CLI & Modular Architecture (1 hr)
- ✅ Project structure following NestJS best practices
- ✅ Module organization (Users, Products, Orders)
- ✅ Feature-based module architecture
- ✅ Shared common modules

### 2. Controllers, Routing, and Request Decorators (1 hr)
- ✅ HTTP methods (GET, POST, PUT, PATCH, DELETE)
- ✅ Route parameters (`@Param`)
- ✅ Query parameters (`@Query`)
- ✅ Request body (`@Body`)
- ✅ Headers (`@Headers`)
- ✅ Request/Response objects (`@Req`, `@Res`)
- ✅ Custom status codes (`@HttpCode`)

### 3. Providers and Dependency Injection (1.5 hrs)
- ✅ Service providers with constructor injection
- ✅ Custom providers (LoggerService, CacheService)
- ✅ Provider scopes (Singleton, Request, Transient)
- ✅ Repository pattern with TypeORM

### 4. DTO Implementation with Class-Validator & Pipes (1.5 hrs)
- ✅ DTOs with comprehensive validation decorators
- ✅ Global validation pipe configuration
- ✅ Custom pipes (ParsePositiveIntPipe, TrimPipe)
- ✅ Nested DTO validation
- ✅ PartialType for update DTOs

### 5. Exception Filters and Global Error Handling (1 hr)
- ✅ HTTP exception filter
- ✅ Global exception filter (catch-all)
- ✅ Custom error response formatting
- ✅ Error logging

### 6. Database Integration using TypeORM (2 hrs)
- ✅ SQLite database setup (easy for learning)
- ✅ Entity definitions with decorators
- ✅ Repository pattern
- ✅ CRUD operations
- ✅ Relations (ManyToOne, OneToMany)
- ✅ Query builders and advanced queries

## 🏗️ Project Structure

```
src/
├── main.ts                      # Application entry point
├── app.module.ts                # Root module
├── common/                      # Shared utilities
│   ├── filters/
│   │   ├── http-exception.filter.ts
│   │   └── all-exceptions.filter.ts
│   ├── pipes/
│   │   ├── parse-positive-int.pipe.ts
│   │   └── trim.pipe.ts
│   └── services/
│       ├── logger.service.ts
│       └── cache.service.ts
└── modules/                     # Feature modules
    ├── users/
    │   ├── entities/
    │   │   └── user.entity.ts
    │   ├── dto/
    │   │   ├── create-user.dto.ts
    │   │   └── update-user.dto.ts
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   └── users.module.ts
    ├── products/
    │   ├── entities/
    │   │   └── product.entity.ts
    │   ├── dto/
    │   │   ├── create-product.dto.ts
    │   │   └── update-product.dto.ts
    │   ├── products.controller.ts
    │   ├── products.service.ts
    │   └── products.module.ts
    └── orders/
        ├── entities/
        │   └── order.entity.ts
        ├── dto/
        │   ├── create-order.dto.ts
        │   └── update-order-status.dto.ts
        ├── orders.controller.ts
        ├── orders.service.ts
        └── orders.module.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Or using yarn
yarn install
```

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The server will start on `http://localhost:3000`

## 📖 API Documentation

### Users API

#### Create User
```bash
POST /users
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "age": 25,
  "role": "user",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "coding"],
  "phoneNumber": "+1234567890"
}
```

#### Get All Users
```bash
GET /users?page=1&limit=10&search=john
```

#### Get User by ID
```bash
GET /users/:id
```

#### Update User
```bash
PATCH /users/:id
Content-Type: application/json

{
  "firstName": "Jane",
  "age": 26
}
```

#### Delete User
```bash
DELETE /users/:id
```

#### Advanced Search
```bash
GET /users/search/advanced?name=john&email=example.com&minAge=18&maxAge=50
```

### Products API

#### Create Product
```bash
POST /products
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop for developers",
  "price": 1299.99,
  "stock": 50,
  "category": "Electronics",
  "images": ["laptop1.jpg", "laptop2.jpg"],
  "specifications": {
    "brand": "TechBrand",
    "ram": "16GB",
    "storage": "512GB SSD"
  }
}
```

#### Get All Products
```bash
GET /products
GET /products?category=Electronics
```

#### Get Low Stock Products
```bash
GET /products/low-stock?threshold=10
```

#### Update Product Stock
```bash
POST /products/:id/stock
Content-Type: application/json

{
  "quantity": 10
}
```

### Orders API

#### Create Order
```bash
POST /orders
Content-Type: application/json

{
  "userId": 1,
  "productId": 1,
  "quantity": 2,
  "notes": "Please deliver before 5 PM",
  "shippingAddress": {
    "street": "456 Oak Ave",
    "city": "Boston",
    "country": "USA",
    "zipCode": "02101"
  }
}
```

#### Get All Orders
```bash
GET /orders
GET /orders?status=pending
GET /orders?userId=1
```

#### Update Order Status
```bash
PATCH /orders/:id/status
Content-Type: application/json

{
  "status": "shipped"
}
```

#### Cancel Order
```bash
DELETE /orders/:id
```

## 🎓 Learning Path

### Hour 1: NestJS CLI & Modular Architecture
1. Explore the project structure
2. Understand how modules are organized
3. See how `app.module.ts` imports feature modules
4. Review `main.ts` bootstrap process
5. **Exercise**: Create a new module (e.g., Categories)

### Hour 2: Controllers & Routing
1. Study `users.controller.ts` for routing examples
2. Test different HTTP methods using Postman or curl
3. Experiment with `@Param`, `@Query`, `@Body` decorators
4. Try the headers and request demo endpoints
5. **Exercise**: Add new routes to products controller

### Hours 3-4: Providers & Dependency Injection
1. Analyze `users.service.ts` and its dependencies
2. Understand constructor injection pattern
3. Review custom providers (LoggerService, CacheService)
4. See how services interact (OrdersService uses ProductsService)
5. **Exercise**: Create a custom provider for email service

### Hours 5-6: DTOs & Validation
1. Study `create-user.dto.ts` for validation examples
2. Test validation by sending invalid data
3. Understand `class-validator` decorators
4. See how global ValidationPipe works
5. **Exercise**: Add more validation rules and test them

### Hour 7: Exception Filters
1. Review `http-exception.filter.ts`
2. Trigger different exceptions (404, 400, 500)
3. See error response formatting
4. Study `all-exceptions.filter.ts` as safety net
5. **Exercise**: Create a custom exception filter

### Hours 8-9: Database Integration
1. Explore entity definitions (user.entity.ts, etc.)
2. Understand TypeORM decorators
3. Study repository pattern usage in services
4. Test CRUD operations
5. Explore relations in orders module
6. **Exercise**: Add a new entity with relations

## 🧪 Testing the Application

### Using curl

```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "firstName": "Test",
    "lastName": "User",
    "age": 25,
    "hobbies": ["coding"]
  }'

# Get all users
curl http://localhost:3000/users

# Get user by ID
curl http://localhost:3000/users/1
```

### Using PowerShell (Windows)

```powershell
# Create a user
Invoke-RestMethod -Uri http://localhost:3000/users `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "email": "test@example.com",
    "password": "Test1234",
    "firstName": "Test",
    "lastName": "User",
    "age": 25,
    "hobbies": ["coding"]
  }'
```

## 🔍 Key Concepts Demonstrated

### Dependency Injection
```typescript
// Services are injected via constructor
constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  private readonly logger: LoggerService,
) {}
```

### Validation
```typescript
// DTOs with validation decorators
@IsEmail()
@IsNotEmpty()
email: string;

@MinLength(8)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
password: string;
```

### Exception Handling
```typescript
// Throwing exceptions
throw new NotFoundException(`User with ID ${id} not found`);
throw new BadRequestException('Invalid input');
```

### Database Operations
```typescript
// TypeORM repository methods
await this.userRepository.find();
await this.userRepository.findOne({ where: { id } });
await this.userRepository.save(user);
await this.userRepository.remove(user);
```

## 💡 Tips for Learning

1. **Start the Server**: Run `npm run start:dev` and test the endpoints
2. **Read the Code**: Start with `main.ts`, then explore each module
3. **Make Changes**: Modify code and see what happens (hot reload enabled)
4. **Test Validation**: Send invalid data to see validation in action
5. **Check Database**: The SQLite database file is created automatically
6. **Use Logging**: Watch console output to understand the flow
7. **Experiment**: Try breaking things to understand error handling

## 🎯 Practice Exercises

1. **Add Authentication**: Implement JWT authentication
2. **Add Pagination**: Enhance pagination with sorting
3. **Add Relations**: Create one-to-many relationships
4. **Add Swagger**: Integrate API documentation with Swagger
5. **Add Tests**: Write unit tests for services and controllers
6. **Add Middleware**: Create custom middleware for logging
7. **Add Guards**: Implement authorization guards
8. **Add Interceptors**: Create response transformation interceptors

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Class Validator](https://github.com/typestack/class-validator)
- [NestJS Best Practices](https://github.com/nestjs/nest/blob/master/CONTRIBUTING.md)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in main.ts or set environment variable
PORT=3001 npm run start:dev
```

### Database Issues
```bash
# Delete the database file and restart
rm learning.db
npm run start:dev
```

### Validation Not Working
- Ensure global ValidationPipe is configured in `main.ts`
- Check that `class-validator` and `class-transformer` are installed

## 📝 License

This is a learning project - feel free to use and modify as needed.

---

**Happy Learning! 🎉**

Remember: The best way to learn NestJS is by building and experimenting. Don't be afraid to break things!
