import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from '../users/decorators/user.decorator';
import { CartService } from './cart.service';
import {
  AddToCartDto,
  CartDto,
  CartItemDto,
  UpdateCartItemDto,
} from './dto/cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('cart')
@Controller('cart')
@Auth()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly prisma: PrismaService,
  ) {}

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

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
    type: CartDto,
  })
  async addToCart(
    @User() userId: number,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartDto> {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
    type: CartDto,
  })
  async updateCartItem(
    @User() userId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartDto> {
    return this.cartService.updateCartItem(userId, updateCartItemDto);
  }

  @Delete(':menuItemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
    type: CartDto,
  })
  async removeFromCart(
    @User() userId: number,
    @Param('menuItemId') menuItemId: number,
  ): Promise<CartDto> {
    return this.cartService.removeFromCart(userId, menuItemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(@User() userId: number): Promise<{ message: string }> {
    return this.cartService.clearCart(userId);
  }
}
