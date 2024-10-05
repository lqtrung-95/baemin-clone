import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class RestaurantDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  rating: Decimal;

  @ApiProperty({ required: false })
  cuisineType?: string;
}
