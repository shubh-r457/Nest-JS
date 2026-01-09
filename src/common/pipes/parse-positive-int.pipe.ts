import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * TOPIC: Custom Pipes
 * 
 * Pipes transform and validate data before it reaches route handlers
 * This example shows a custom validation pipe
 */

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);

    if (isNaN(val)) {
      throw new BadRequestException(`"${value}" is not a valid number`);
    }

    if (val <= 0) {
      throw new BadRequestException(`Value must be a positive integer, got ${val}`);
    }

    return val;
  }
}
