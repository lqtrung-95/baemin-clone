import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FeaturedContentResponseDto } from './dto/featured-content-response.dto';
import { RestaurantDto } from './dto/restaurant.dto';
import { SearchRestaurantDto } from './dto/search-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async getFeaturedContent(
    page: string | number,
    limit: string | number,
  ): Promise<FeaturedContentResponseDto> {
    const { validatedPage, validatedLimit } = this.validatePaginationParams(
      page,
      limit,
    );

    const featuredRestaurants = await this.getFeaturedRestaurants(
      validatedPage,
      validatedLimit,
    );
    const specialDeals = await this.getSpecialDeals(
      validatedPage,
      validatedLimit,
    );

    return {
      featuredRestaurants,
      specialDeals,
    };
  }

  private validatePaginationParams(
    page: string | number,
    limit: string | number,
  ): { validatedPage: number; validatedLimit: number } {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (isNaN(parsedPage) || isNaN(parsedLimit)) {
      throw new BadRequestException('Invalid page or limit parameter');
    }

    const validatedPage = Math.max(1, parsedPage);
    const validatedLimit = Math.min(50, Math.max(1, parsedLimit)); // Limiting to max 50 items per page

    return { validatedPage, validatedLimit };
  }

  private async getFeaturedRestaurants(
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<RestaurantDto>> {
    const skip = (page - 1) * limit;

    const [restaurants, total] = await Promise.all([
      this.prisma.restaurants.findMany({
        where: {
          /* Add criteria for featured restaurants */
        },
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
        include: { menu_items: { take: 1 } },
      }),
      this.prisma.restaurants.count({
        where: {
          /* Same criteria as above */
        },
      }),
    ]);

    const items = restaurants.map(this.mapRestaurantToDto);

    return this.createPaginatedResponse(items, total, page, limit);
  }

  private async getSpecialDeals(
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<RestaurantDto>> {
    const skip = (page - 1) * limit;

    const [restaurants, total] = await Promise.all([
      this.prisma.restaurants.findMany({
        where: {
          /* Add criteria for special deals */
        },
        skip,
        take: Number(limit),
        orderBy: {
          /* Add appropriate ordering */
        },
        include: { menu_items: { take: 1 } },
      }),
      this.prisma.restaurants.count({
        where: {
          /* Same criteria as above */
        },
      }),
    ]);

    const items = restaurants.map(this.mapRestaurantToDto);

    return this.createPaginatedResponse(items, total, page, limit);
  }

  async searchRestaurants(
    searchDto: SearchRestaurantDto,
  ): Promise<PaginatedResponseDto<RestaurantDto>> {
    const { query, page = 1, limit = 10 } = searchDto;
    const { validatedPage, validatedLimit } = this.validatePaginationParams(
      page,
      limit,
    );

    const skip = (validatedPage - 1) * validatedLimit;

    const [restaurants, total] = await Promise.all([
      this.prisma.restaurants.findMany({
        where: {
          OR: [{ name: { contains: query, mode: 'insensitive' } }],
        },
        skip,
        take: validatedLimit,
        orderBy: { rating: 'desc' },
        include: { menu_items: { take: 1 } },
      }),
      this.prisma.restaurants.count({
        where: {
          OR: [{ name: { contains: query, mode: 'insensitive' } }],
        },
      }),
    ]);

    const items = restaurants.map(this.mapRestaurantToDto);

    return this.createPaginatedResponse(
      items,
      total,
      validatedPage,
      validatedLimit,
    );
  }

  private mapRestaurantToDto(restaurant: any): RestaurantDto {
    return {
      id: restaurant.restaurant_id,
      name: restaurant.name,
      imageUrl: restaurant.menu_items[0]?.image_url || '',
      address: restaurant.address,
      rating: restaurant.rating,
      cuisineType: restaurant.cuisine_type,
    };
  }

  private createPaginatedResponse<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponseDto<T> {
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
