import { 
  registerDecorator, 
  ValidationOptions, 
  ValidationArguments 
} from 'class-validator';

/**
 * Custom validator decorator for transaction hashes (32 bytes hex)
 */
export function IsTransactionHash(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTransactionHash',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          // Transaction hash should be 0x followed by 64 hex characters
          const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
          return txHashRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid transaction hash`;
        },
      },
    });
  };
}
