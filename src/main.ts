import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    }),
  );

  // Global Exception Filters
  app.useGlobalFilters(
    new AllExceptionsFilter(), // Catches all exceptions
    new HttpExceptionFilter(), // Catches HTTP exceptions specifically
  );

  // Enable CORS if needed
  app.enableCors();

  // Swagger API Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('NestJS Learning Project API')
    .setDescription(
      'Complete NestJS Backend Learning Project with Authentication, Blockchain Integration, and More',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('products', 'Product management endpoints')
    .addTag('orders', 'Order management endpoints')
    .addTag('blockchain', 'Blockchain integration endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 NestJS Backend Learning Project is running!              ║
║                                                                ║
║   📡 Server URL: http://localhost:${port}                        ║
║   📖 API Docs: http://localhost:${port}/api                      ║
║                                                                ║
║   📚 Learning Topics Covered:                                 ║
║   ✓ Modular Architecture                                      ║
║   ✓ Controllers & Routing                                     ║
║   ✓ Dependency Injection                                      ║
║   ✓ DTOs & Validation                                         ║
║   ✓ Exception Filters                                         ║
║   ✓ Database Integration (MongoDB + Mongoose)                 ║
║   ✓ JWT Authentication & Guards                               ║
║   ✓ Middleware & Interceptors                                 ║
║   ✓ Blockchain Integration (Ethers.js)                        ║
║   ✓ Custom Decorators & Pipes                                 ║
║   ✓ Swagger/OpenAPI Documentation                             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
