import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
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
    const order = this.orderRepository.create({
      ...createOrderDto,
      totalPrice,
      status: 'pending',
    });

    const savedOrder = await this.orderRepository.save(order);

    // Update product stock
    await this.productsService.updateStock(product.id, -createOrderDto.quantity);

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'product'],
    });
  }

  async findByUser(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { status },
      relations: ['user', 'product'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, updateStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = updateStatusDto.status;
    return await this.orderRepository.save(order);
  }

  async cancel(id: number): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status === 'delivered') {
      throw new BadRequestException('Cannot cancel a delivered order');
    }

    if (order.status === 'cancelled') {
      throw new BadRequestException('Order is already cancelled');
    }

    // Restore product stock
    await this.productsService.updateStock(order.productId, order.quantity);

    order.status = 'cancelled';
    return await this.orderRepository.save(order);
  }
}
