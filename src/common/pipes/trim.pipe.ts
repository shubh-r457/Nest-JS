import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * Custom pipe to trim whitespace from string inputs
 */

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values: any): any {
    if (this.isObject(values)) {
      Object.keys(values).forEach((key) => {
        values[key] = this.trim(values[key]);
      });
    } else if (typeof values === 'string') {
      return values.trim();
    }
    return values;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata;

    if (type === 'body' || type === 'query') {
      return this.trim(values);
    }

    return values;
  }
}
