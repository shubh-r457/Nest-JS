import {
  IsString,
  IsEmail,
  IsInt,
  IsOptional,
  IsBoolean,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsNotEmpty,
  Matches,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * TOPIC: DTO Implementation with Class-Validator
 * 
 * DTOs (Data Transfer Objects) define the shape of data
 * Class-validator provides decorators for validation
 */

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  zipCode?: string;
}

export class CreateUserDto {
  /**
   * User's email address
   * @example john.doe@example.com
   */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  /**
   * User's password
   * Must be at least 8 characters with uppercase, lowercase, and number
   */
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number',
  })
  password: string;

  /**
   * User's first name
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  /**
   * User's last name
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  /**
   * User's age
   * Must be between 18 and 120
   */
  @IsInt()
  @Min(18, { message: 'User must be at least 18 years old' })
  @Max(120, { message: 'Please provide a valid age' })
  @Type(() => Number) // Transform string to number
  age: number;

  /**
   * User's role
   */
  @IsEnum(UserRole, { message: 'Role must be admin, user, or guest' })
  @IsOptional()
  role?: UserRole;

  /**
   * Whether the user account is active
   */
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  /**
   * User's address (nested DTO)
   */
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  /**
   * User's hobbies/interests
   */
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'At least one hobby is required' })
  @IsOptional()
  hobbies?: string[];

  /**
   * User's phone number (optional)
   * Format: +1234567890 or 1234567890
   */
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please provide a valid phone number',
  })
  @IsOptional()
  phoneNumber?: string;

  /**
   * User's birth date
   */
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birthDate?: Date;
}
