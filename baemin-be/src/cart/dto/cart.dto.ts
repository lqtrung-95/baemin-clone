import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'ID of the menu item to add to the cart' })
  @IsInt()
  @Min(1)
  menuItemId: number;

  @ApiProperty({ description: 'Quantity of the menu item to add' })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ description: 'ID of the menu item to update in the cart' })
  @IsInt()
  @Min(1)
  menuItemId: number;

  @ApiProperty({ description: 'New quantity of the menu item' })
  @IsInt()
  @Min(0)
  quantity: number;
}
export class CartItemDto {
  @ApiProperty({ description: 'ID of the menu item' })
  id: number;

  @ApiProperty({ description: 'Name of the menu item' })
  name: string;

  @ApiProperty({ description: 'Price of the menu item' })
  price: number;

  @ApiProperty({ description: 'Quantity of the menu item in the cart' })
  quantity: number;

  @ApiProperty({ description: 'Subtotal for this item (price * quantity)' })
  subtotal: number;

  @ApiProperty({ description: 'Image URL of the menu item' })
  image_url: string;
}

export class CartDto {
  @ApiProperty({
    type: [CartItemDto],
    description: 'Array of items in the cart',
  })
  items: CartItemDto[];

  @ApiProperty({ description: 'Total price of all items in the cart' })
  total: number;
}
