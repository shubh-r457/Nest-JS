import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsBoolean } from 'class-validator';

/**
 * TOPIC: DTO Inheritance with PartialType
 * 
 * PartialType makes all properties from CreateUserDto optional
 * Additional properties can be added for update-specific fields
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}
