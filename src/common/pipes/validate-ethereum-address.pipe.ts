import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { ethers } from 'ethers';

/**
 * Pipe to validate Ethereum addresses
 */
@Injectable()
export class ValidateEthereumAddressPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('Address must be a string');
    }

    if (!ethers.isAddress(value)) {
      throw new BadRequestException('Invalid Ethereum address format');
    }

    // Return checksummed address
    return ethers.getAddress(value);
  }
}
