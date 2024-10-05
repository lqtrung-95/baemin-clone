import { ApiProperty } from '@nestjs/swagger';
import { RestaurantDto } from './restaurant.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

export class FeaturedContentResponseDto {
  @ApiProperty({ type: () => PaginatedResponseDto })
  featuredRestaurants: PaginatedResponseDto<RestaurantDto>;

  @ApiProperty({ type: () => PaginatedResponseDto })
  specialDeals: PaginatedResponseDto<RestaurantDto>;
}
