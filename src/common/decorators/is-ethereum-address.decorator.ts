import { 
  registerDecorator, 
  ValidationOptions, 
  ValidationArguments 
} from 'class-validator';
import { ethers } from 'ethers';

/**
 * Custom validator decorator for Ethereum addresses
 */
export function IsEthereumAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEthereumAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          return ethers.isAddress(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Ethereum address`;
        },
      },
    });
  };
}
