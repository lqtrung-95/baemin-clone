import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FoodCategoryDto } from './dto/food-category.dto';

@Injectable()
export class FoodCategoriesService {
  constructor(private prisma: PrismaService) {}

  async getFoodCategories(): Promise<FoodCategoryDto[]> {
    const categories = await this.prisma.food_categories.findMany({
      orderBy: {
        display_order: 'asc',
      },
    });

    return categories.map((category) => ({
      id: category.category_id,
      name: category.name,
      iconUrl: category.icon_url,
      displayOrder: category.display_order,
    }));
  }
}
