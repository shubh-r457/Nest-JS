import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

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

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 NestJS Backend Learning Project is running!              ║
║                                                                ║
║   📡 Server URL: http://localhost:${port}                        ║
║                                                                ║
║   📚 Learning Topics Covered:                                 ║
║   ✓ Modular Architecture                                      ║
║   ✓ Controllers & Routing                                     ║
║   ✓ Dependency Injection                                      ║
║   ✓ DTOs & Validation                                         ║
║   ✓ Exception Filters                                         ║
║   ✓ Database Integration (TypeORM)                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
