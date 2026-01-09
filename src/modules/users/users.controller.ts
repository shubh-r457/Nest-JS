import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

/**
 * TOPIC: Controllers, Routing, and Request Decorators
 * 
 * This controller demonstrates:
 * - Different HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Route parameters (@Param)
 * - Query parameters (@Query)
 * - Request body (@Body)
 * - Headers (@Headers)
 * - Custom response codes (@HttpCode)
 * - Request and Response objects
 */

@Controller('users') // Base route: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================== GET REQUESTS ====================

  /**
   * GET /users
   * Retrieve all users with optional pagination and filtering
   */
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll({ page, limit, search });
  }

  /**
   * GET /users/active
   * Custom route before parameterized routes (order matters!)
   */
  @Get('active')
  findActiveUsers() {
    return this.usersService.findActive();
  }

  /**
   * GET /users/:id
   * Retrieve a single user by ID
   * Demonstrates @Param decorator with validation pipe
   */
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * GET /users/:id/profile
   * Nested route with parameters
   */
  @Get(':id/profile')
  getUserProfile(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.getUserProfile(id);
  }

  /**
   * GET /users/search/advanced
   * Demonstrates multiple query parameters
   */
  @Get('search/advanced')
  advancedSearch(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('minAge', ParseIntPipe) minAge: number,
    @Query('maxAge', ParseIntPipe) maxAge: number,
  ) {
    return this.usersService.advancedSearch({ name, email, minAge, maxAge });
  }

  // ==================== POST REQUESTS ====================

  /**
   * POST /users
   * Create a new user
   * Demonstrates @Body decorator with DTO validation
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * POST /users/batch
   * Create multiple users at once
   */
  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  createBatch(@Body() createUserDtos: CreateUserDto[]) {
    return this.usersService.createBatch(createUserDtos);
  }

  // ==================== PUT/PATCH REQUESTS ====================

  /**
   * PUT /users/:id
   * Full update of a user (replaces entire resource)
   */
  @Put(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * PATCH /users/:id
   * Partial update of a user (updates only provided fields)
   */
  @Patch(':id')
  partialUpdate(@Param('id', ParseMongoIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // ==================== DELETE REQUESTS ====================

  /**
   * DELETE /users/:id
   * Delete a user
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.remove(id);
  }

  // ==================== ADVANCED DECORATORS ====================

  /**
   * GET /users/headers/demo
   * Demonstrates accessing request headers
   */
  @Get('headers/demo')
  headersDemo(
    @Headers('user-agent') userAgent: string,
    @Headers('authorization') authorization: string,
    @Headers() allHeaders: Record<string, string>,
  ) {
    return {
      userAgent,
      authorization,
      allHeadersCount: Object.keys(allHeaders).length,
    };
  }

  /**
   * POST /users/request/demo
   * Demonstrates accessing the full Request object
   */
  @Post('request/demo')
  requestDemo(@Req() request: Request) {
    return {
      method: request.method,
      url: request.url,
      ip: request.ip,
      headers: request.headers,
    };
  }

  /**
   * GET /users/response/demo
   * Demonstrates manual response handling
   */
  @Get('response/demo')
  responseDemo(@Res() response: Response) {
    // When using @Res(), you must manually send the response
    response.status(200).json({
      message: 'Manual response handling',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * GET /users/response/auto
   * Demonstrates using @Res() with passthrough option
   */
  @Get('response/auto')
  async responseAutoDemo(@Res({ passthrough: true }) response: Response) {
    // With passthrough, you can set headers/status but still return values
    response.header('X-Custom-Header', 'CustomValue');
    return { message: 'Auto response with custom headers' };
  }
}
