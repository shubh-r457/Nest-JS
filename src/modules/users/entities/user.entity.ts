import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * TOPIC: Database Integration with MongoDB & Mongoose
 * 
 * Schemas are Mongoose models that map to MongoDB collections
 * Decorators define the schema
 */

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, type: Number })
  age: number;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Object, required: false })
  address?: {
    street: string;
    city: string;
    country: string;
    zipCode?: string;
  };

  @Prop({ type: [String], required: false })
  hobbies?: string[];

  @Prop({ required: false })
  phoneNumber?: string;

  @Prop({ type: Date, required: false })
  birthDate?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
