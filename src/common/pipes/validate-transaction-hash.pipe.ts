import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

/**
 * Pipe to validate transaction hashes
 */
@Injectable()
export class ValidateTransactionHashPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('Transaction hash must be a string');
    }

    // Transaction hash should be 0x followed by 64 hex characters
    const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
    
    if (!txHashRegex.test(value)) {
      throw new BadRequestException(
        'Invalid transaction hash format. Must be 0x followed by 64 hex characters',
      );
    }

    return value.toLowerCase();
  }
}
