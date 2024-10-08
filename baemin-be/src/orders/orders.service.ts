import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderDetailsDto, OrderStatusUpdateDto } from './dto/order.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getOrderDetails(
    orderId: number,
    userId: number,
  ): Promise<OrderDetailsDto> {
    const order = await this.prisma.orders.findUnique({
      where: { order_id: orderId },
      include: {
        restaurants: true,
        order_items: {
          include: { menu_items: true },
        },
        order_payments: {
          include: { payment_methods: true },
        },
        users: true,
      },
    });
    console.log('🚀 ~ OrdersService ~ order:', order);

    if (!order || order.user_id !== userId) {
      throw new NotFoundException('Order not found');
    }

    return {
      orderId: order.order_id,
      status: order.status as OrderStatus,
      restaurantName: order.restaurants?.name || 'Unknown Restaurant',
      totalAmount: Number(order.total_amount),
      paymentMethod:
        order.order_payments[0]?.payment_methods?.name || 'Unknown',
      customerName:
        `${order.users?.first_name || ''} ${order.users?.last_name || ''}`.trim(),
      customerPhone: order.users?.phone_number || 'Not provided',
      deliveryAddress: order.delivery_address || 'Not provided',
      deliveryInstructions: order.delivery_instructions || 'None',
      createdAt: order.created_at?.toISOString() || new Date().toISOString(),
      items: order.order_items.map((item) => ({
        name: item.menu_items.name,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
      })),
    };
  }

  async updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus,
  ): Promise<OrderStatusUpdateDto> {
    const updatedOrder = await this.prisma.orders.update({
      where: { order_id: orderId },
      data: { status: newStatus },
    });

    return {
      orderId: updatedOrder.order_id,
      status: updatedOrder.status as OrderStatus,
      updatedAt: new Date(),
    };
  }
}
