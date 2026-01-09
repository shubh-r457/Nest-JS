import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true, type: Number })
  totalPrice: number;

  @Prop({ default: 'pending' })
  status: string; // pending, confirmed, shipped, delivered, cancelled

  @Prop({ required: false })
  notes?: string;

  @Prop({ type: Object, required: false })
  shippingAddress?: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
