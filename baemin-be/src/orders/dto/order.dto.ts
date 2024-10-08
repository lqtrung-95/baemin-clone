// src/orders/dto/order.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class OrderItemDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  subtotal: number;
}

export class OrderDetailsDto {
  @ApiProperty()
  orderId: number;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  restaurantName: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerPhone: string;

  @ApiProperty()
  deliveryAddress: string;

  @ApiProperty()
  deliveryInstructions: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class OrderStatusUpdateDto {
  @ApiProperty()
  orderId: number;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  updatedAt: Date;
}
