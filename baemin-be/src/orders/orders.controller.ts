// src/orders/orders.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from '../users/decorators/user.decorator';
import {
  OrderDetailsDto,
  OrderStatusUpdateDto,
  UpdateOrderStatusDto,
} from './dto/order.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
@Auth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details' })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully',
    type: OrderDetailsDto,
  })
  async getOrderDetails(
    @Param('orderId', ParseIntPipe) orderId: number,
    @User() userId: number,
  ): Promise<OrderDetailsDto> {
    return this.ordersService.getOrderDetails(orderId, userId);
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    type: OrderStatusUpdateDto,
  })
  async updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderStatusUpdateDto> {
    return this.ordersService.updateOrderStatus(
      orderId,
      updateStatusDto.status,
    );
  }
}
