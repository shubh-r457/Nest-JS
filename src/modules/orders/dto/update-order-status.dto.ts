import { IsString, IsEnum } from 'class-validator';

enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: 'Status must be: pending, confirmed, shipped, delivered, or cancelled',
  })
  status: OrderStatus;
}
