import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * TOPIC: Global Error Handling
 * 
 * AllExceptionsFilter catches ALL exceptions (HTTP and non-HTTP)
 * Provides a safety net for unexpected errors
 */

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Determine error message
    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? exceptionResponse.message
          : exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Create error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      error: HttpStatus[status] || 'Unknown Error',
    };

    // Log error with stack trace (for debugging)
    console.error('Unhandled Exception:', {
      ...errorResponse,
      stack: exception instanceof Error ? exception.stack : 'No stack trace',
    });

    response.status(status).json(errorResponse);
  }
}
