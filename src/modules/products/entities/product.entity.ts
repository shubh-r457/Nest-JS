import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: Number, default: 0 })
  stock: number;

  @Prop({ required: true })
  category: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: [String], required: false })
  images?: string[];

  @Prop({ type: Object, required: false })
  specifications?: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
