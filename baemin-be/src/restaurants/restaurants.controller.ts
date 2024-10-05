import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { FeaturedContentResponseDto } from './dto/featured-content-response.dto';
import { RestaurantDto } from './dto/restaurant.dto';
import { SearchRestaurantDto } from './dto/search-restaurant.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('featured-content')
  @ApiOperation({ summary: 'Get featured content for homepage' })
  @ApiResponse({
    status: 200,
    description: 'Return featured content',
    type: FeaturedContentResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getFeaturedContent(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<FeaturedContentResponseDto> {
    return this.restaurantsService.getFeaturedContent(page, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search restaurants' })
  @ApiResponse({
    status: 200,
    description: 'Return search results',
    type: PaginatedResponseDto,
  })
  async searchRestaurants(
    @Query() searchDto: SearchRestaurantDto,
  ): Promise<PaginatedResponseDto<RestaurantDto>> {
    return this.restaurantsService.searchRestaurants(searchDto);
  }
}
