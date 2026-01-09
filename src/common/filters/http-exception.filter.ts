import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * TOPIC: Exception Filters
 * 
 * HttpExceptionFilter catches all HTTP exceptions
 * Formats error responses consistently
 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Format error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? exceptionResponse.message
          : exception.message,
      error:
        typeof exceptionResponse === 'object' && 'error' in exceptionResponse
          ? exceptionResponse.error
          : HttpStatus[status],
    };

    // Log the error (in production, use proper logging service)
    console.error(`[${errorResponse.timestamp}] ${status} Error:`, {
      path: errorResponse.path,
      message: errorResponse.message,
    });

    response.status(status).json(errorResponse);
  }
}
