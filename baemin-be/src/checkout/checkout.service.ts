// src/checkout/checkout.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  OrderSummaryDto,
  DeliveryAddressDto,
  DeliveryOptionsDto,
  PaymentMethodsDto,
  PlaceOrderDto,
  OrderConfirmationDto,
} from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async getOrderSummary(userId: number): Promise<OrderSummaryDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: { menu_items: true },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const items = cart.cart_items.map((item) => ({
      item_id: item.menu_items.item_id,
      name: item.menu_items.name,
      price: Number(item.menu_items.price),
      quantity: item.quantity,
      subtotal: item.quantity * Number(item.menu_items.price),
      image_url: item.menu_items.image_url || '',
    }));

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const delivery_fee = 38000; // This could be calculated based on distance or other factors
    const voucher_discount = 0; // This would be calculated if a voucher is applied
    const total_amount = subtotal + delivery_fee - voucher_discount;

    return { items, subtotal, delivery_fee, voucher_discount, total_amount };
  }

  async setDeliveryAddress(
    userId: number,
    addressDto: DeliveryAddressDto,
  ): Promise<void> {
    await this.prisma.users.update({
      where: { user_id: userId },
      data: {
        address: addressDto.address,
        phone_number: addressDto.phone_number,
      },
    });
  }

  async applyVoucher(
    userId: number,
    voucherCode: string,
  ): Promise<OrderSummaryDto> {
    // Implement voucher logic here
    console.log(`Applying voucher ${voucherCode} for user ${userId}`);
    return this.getOrderSummary(userId);
  }

  async removeVoucher(userId: number): Promise<OrderSummaryDto> {
    // Implement voucher removal logic here
    console.log(`Removing voucher for user ${userId}`);
    return this.getOrderSummary(userId);
  }

  async getDeliveryOptions(userId: number): Promise<DeliveryOptionsDto> {
    // This could be dynamic based on the user's location, time of day, etc.
    return {
      options: [
        { option_id: 'standard', name: 'Standard Delivery (15-30 minutes)' },
        { option_id: 'express', name: 'Express Delivery (10-15 minutes)' },
      ],
    };
  }

  async setDeliveryOption(
    userId: number,
    optionId: string,
  ): Promise<OrderSummaryDto> {
    // Implement logic to set delivery option
    // This is a placeholder implementation
    console.log(`Setting delivery option ${optionId} for user ${userId}`);
    return this.getOrderSummary(userId);
  }

  async getPaymentMethods(): Promise<PaymentMethodsDto> {
    const methods = await this.prisma.payment_methods.findMany();
    return { methods };
  }

  async placeOrder(
    userId: number,
    orderDto: PlaceOrderDto,
  ): Promise<OrderConfirmationDto> {
    const summary = await this.getOrderSummary(userId);
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Fetch the restaurant ID from the first item in the order
    const firstItem = await this.prisma.menu_items.findUnique({
      where: { item_id: summary.items[0].item_id },
      select: { restaurant_id: true },
    });

    if (!firstItem || !firstItem.restaurant_id) {
      throw new NotFoundException('Restaurant not found for the ordered items');
    }

    const order = await this.prisma.orders.create({
      data: {
        user_id: userId,
        restaurant_id: firstItem.restaurant_id, // Add the restaurant ID here
        total_amount: summary.total_amount,
        status: 'PENDING',
        delivery_address: user.address,
        delivery_instructions: orderDto.delivery_instructions,
        order_payments: {
          create: {
            payment_method_id: orderDto.payment_method_id,
            amount: summary.total_amount,
            status: 'PENDING',
          },
        },
        order_items: {
          create: summary.items.map((item) => ({
            item_id: item.item_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Clear the user's cart
    await this.prisma.cart_items.deleteMany({
      where: { cart: { user_id: userId } },
    });

    return {
      order_id: order.order_id,
      status: order.status,
      total_amount: Number(order.total_amount),
      created_at: order.created_at?.toISOString() || new Date().toISOString(),
      restaurant_id: order.restaurant_id, // Include restaurant_id in the response
    };
  }
}
