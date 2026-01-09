import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

/**
 * Custom Pipe for MongoDB ObjectId Validation
 * 
 * Validates that a string is a valid MongoDB ObjectId
 */

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`"${value}" is not a valid MongoDB ObjectId`);
    }

    return value;
  }
}
