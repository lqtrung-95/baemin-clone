import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class RestaurantDto {
  @ApiProperty()
  restaurant_id: number;

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

export class RestaurantsByCategoryDto {
  @ApiProperty()
  categoryName: string;

  @ApiProperty({ type: [RestaurantDto] })
  restaurants: RestaurantDto[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
