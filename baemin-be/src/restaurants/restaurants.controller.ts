import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant details' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant details retrieved successfully',
  })
  async getRestaurantDetails(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.getRestaurantDetails(id);
  }

  @Get(':id/submenus')
  @ApiOperation({ summary: 'Get restaurant sub-menus' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant sub-menus retrieved successfully',
  })
  async getRestaurantSubmenus(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.getRestaurantSubmenus(id);
  }

  @Get(':id/menu')
  @ApiOperation({ summary: 'Get restaurant menu' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiQuery({ name: 'submenuId', required: false, type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant menu retrieved successfully',
  })
  async getRestaurantMenu(
    @Param('id', ParseIntPipe) id: number,
    @Query('submenuId', new ParseIntPipe({ optional: true }))
    submenuId?: number,
  ) {
    return this.restaurantsService.getRestaurantMenu(id, submenuId);
  }

  @Get(':id/promotions')
  @ApiOperation({ summary: 'Get restaurant promotions' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant promotions retrieved successfully',
  })
  async getRestaurantPromotions(@Param('id') id: number) {
    return this.restaurantsService.getRestaurantPromotions(id);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get restaurant reviews' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant reviews retrieved successfully',
  })
  async getRestaurantReviews(
    @Param('id') id: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.restaurantsService.getRestaurantReviews(id, page, limit);
  }
}
