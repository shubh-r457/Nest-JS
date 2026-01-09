import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validate user exists
    await this.usersService.findOne(createOrderDto.userId);

    // Validate product exists and has enough stock
    const product = await this.productsService.findOne(createOrderDto.productId);

    if (product.stock < createOrderDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}, Requested: ${createOrderDto.quantity}`,
      );
    }

    // Calculate total price
    const totalPrice = product.price * createOrderDto.quantity;

    // Create order
    const order = new this.orderModel({
      ...createOrderDto,
      totalPrice,
      status: 'pending',
    });

    const savedOrder = await order.save();

    // Update product stock
    await this.productsService.updateStock(createOrderDto.productId, -createOrderDto.quantity);

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find()
      .populate('userId', 'email firstName lastName')
      .populate('productId', 'name price')
      .exec();
  }

  async findByUser(userId: string): Promise<Order[]> {
    return await this.orderModel.find({ userId })
      .populate('productId', 'name price')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByStatus(status: string): Promise<Order[]> {
    return await this.orderModel.find({ status })
      .populate('userId', 'email firstName lastName')
      .populate('productId', 'name price')
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id)
      .populate('userId', 'email firstName lastName')
      .populate('productId', 'name price')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { $set: { status: updateStatusDto.status } },
      { new: true, runValidators: true }
    )
      .populate('userId', 'email firstName lastName')
      .populate('productId', 'name price')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async cancel(id: string): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status === 'delivered') {
      throw new BadRequestException('Cannot cancel a delivered order');
    }

    if (order.status === 'cancelled') {
      throw new BadRequestException('Order is already cancelled');
    }

    // Restore product stock
    await this.productsService.updateStock(order.productId.toString(), order.quantity);

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      { $set: { status: 'cancelled' } },
      { new: true }
    )
      .populate('userId', 'email firstName lastName')
      .populate('productId', 'name price')
      .exec();

    return updatedOrder;
  }
}
