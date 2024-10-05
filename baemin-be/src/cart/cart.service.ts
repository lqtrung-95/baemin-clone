import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddToCartDto,
  UpdateCartItemDto,
  CartDto,
  CartItemDto,
} from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number): Promise<CartDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: { menu_items: true },
        },
      },
    });

    if (!cart) {
      return { items: [], total: 0 };
    }

    const items: CartItemDto[] = cart.cart_items.map((item) => ({
      id: item.menu_items.item_id,
      name: item.menu_items.name,
      price: Number(item.menu_items.price),
      quantity: item.quantity,
      subtotal: item.quantity * Number(item.menu_items.price),
      image_url: item.menu_items.image_url || '', // Include the image_url
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return { items, total };
  }

  async addToCart(
    userId: number,
    addToCartDto: AddToCartDto,
  ): Promise<CartDto> {
    const { menuItemId, quantity } = addToCartDto;
    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({ data: { user_id: userId } });
    }

    const existingItem = await this.prisma.cart_items.findUnique({
      where: {
        cart_id_menu_item_id: { cart_id: cart.id, menu_item_id: menuItemId },
      },
    });

    if (existingItem) {
      await this.prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await this.prisma.cart_items.create({
        data: {
          cart: { connect: { id: cart.id } },
          menu_items: { connect: { item_id: menuItemId } },
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateCartItem(
    userId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartDto> {
    const { menuItemId, quantity } = updateCartItemDto;
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (quantity > 0) {
      await this.prisma.cart_items.upsert({
        where: {
          cart_id_menu_item_id: { cart_id: cart.id, menu_item_id: menuItemId },
        },
        update: { quantity },
        create: {
          cart: { connect: { id: cart.id } },
          menu_items: { connect: { item_id: menuItemId } },
          quantity,
        },
      });
    } else {
      await this.prisma.cart_items.deleteMany({
        where: {
          cart_id: cart.id,
          menu_item_id: menuItemId,
        },
      });
    }

    return this.getCart(userId);
  }

  async removeFromCart(userId: number, menuItemId: number): Promise<CartDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cart_items.deleteMany({
      where: {
        cart_id: cart.id,
        menu_item_id: menuItemId,
      },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: number): Promise<{ message: string }> {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (cart) {
      await this.prisma.cart_items.deleteMany({
        where: { cart_id: cart.id },
      });
    }

    return { message: 'Cart cleared successfully' };
  }
}
