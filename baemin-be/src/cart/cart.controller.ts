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
import { AddToCartDto, CartDto, UpdateCartItemDto } from './dto/cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('cart')
@Controller('cart')
@Auth()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get user's cart" })
  @ApiResponse({
    status: 200,
    description: "User's cart retrieved successfully",
    type: CartDto,
  })
  async getCart(@User() userId: number): Promise<CartDto> {
    return this.cartService.getCart(userId);
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
