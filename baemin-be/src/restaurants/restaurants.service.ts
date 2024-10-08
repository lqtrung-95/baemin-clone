import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FeaturedContentResponseDto } from './dto/featured-content-response.dto';
import { RestaurantDto, RestaurantsByCategoryDto } from './dto/restaurant.dto';
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
      restaurant_id: restaurant.restaurant_id,
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

  async getRestaurantDetails(id: number) {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { restaurant_id: id },
      include: {
        restaurant_submenu: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return {
      id: restaurant.restaurant_id,
      name: restaurant.name,
      address: restaurant.address,
      rating: restaurant.rating,
      opening_hours: restaurant.opening_hours,
      price_range: '99.000 - 399.000', // This should be calculated or stored in the database
      service_charge: 0.8, // This should be stored in the database or configuration
      categories: restaurant.restaurant_submenu.map((submenu) => submenu.name),
    };
  }

  async getRestaurantSubmenus(id: number) {
    const submenus = await this.prisma.restaurant_submenu.findMany({
      where: { restaurant_id: id },
      orderBy: { display_order: 'asc' },
    });

    if (submenus.length === 0) {
      throw new NotFoundException(
        `Sub-menus not found for restaurant with ID ${id}`,
      );
    }

    return submenus.map((submenu) => ({
      submenu_id: submenu.submenu_id,
      name: submenu.name,
      displayOrder: submenu.display_order,
    }));
  }

  async getRestaurantMenu(id: number, submenuId?: number) {
    const menuItems = await this.prisma.menu_items.findMany({
      where: {
        restaurant_id: id,
        submenu_id: submenuId,
      },
      include: {
        restaurant_submenu: true,
      },
    });

    if (menuItems.length === 0) {
      throw new NotFoundException(
        `Menu items not found for restaurant with ID ${id}`,
      );
    }

    return menuItems.map((item) => ({
      item_id: item.item_id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.image_url,
      submenu_id: item.submenu_id,
      submenu_name: item.restaurant_submenu?.name,
    }));
  }

  async getRestaurantPromotions(id: number) {
    // This would require a new table in the DB to store promotions
    // For now, we'll return a mock promotion
    return [
      {
        id: 1,
        title: 'Mua 2 Tặng 2 Gà Rán',
        description:
          'Bao gồm: 4 Miếng Gà (Cay/Không Cay), 2 Nước Vừa. Đã bao gồm 2x Tương Cà, 1x Tương Ớt Ngọt, 1x Tương Ớt Tỏi',
        price: 118000,
      },
    ];
  }

  async getRestaurantReviews(id: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.reviews.findMany({
        where: { restaurant_id: id },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { users: true },
      }),
      this.prisma.reviews.count({ where: { restaurant_id: id } }),
    ]);

    const items = reviews.map((review) => ({
      id: review.review_id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      user: {
        id: review.users.user_id,
        name: `${review.users.first_name} ${review.users.last_name}`.trim(),
      },
    }));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRestaurantsByCategory(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<RestaurantsByCategoryDto> {
    const skip = (page - 1) * limit;

    const [restaurants, totalCount] = await Promise.all([
      this.prisma.restaurants.findMany({
        where: {
          menu_items: {
            some: {
              category_id: categoryId,
            },
          },
        },
        select: {
          restaurant_id: true,
          name: true,
          address: true,
          rating: true,
          cuisine_type: true,
        },
        skip,
        take: Number(limit),
      }),
      this.prisma.restaurants.count({
        where: {
          menu_items: {
            some: {
              category_id: categoryId,
            },
          },
        },
      }),
    ]);

    if (restaurants.length === 0) {
      throw new NotFoundException(
        `No restaurants found for category ID ${categoryId}`,
      );
    }

    const category = await this.prisma.food_categories.findUnique({
      where: { category_id: categoryId },
      select: { name: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return {
      categoryName: category.name,
      restaurants: restaurants.map((restaurant) => ({
        restaurant_id: restaurant.restaurant_id,
        name: restaurant.name,
        address: restaurant.address,
        rating: restaurant.rating,
        cuisineType: restaurant.cuisine_type || null,
        imageUrl: '',
      })),
      totalCount,
      page,
      limit,
    };
  }
}
