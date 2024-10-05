import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FoodCategoriesService } from './food-categories.service';
import { FoodCategoryDto } from './dto/food-category.dto';

@ApiTags('food-categories')
@Controller('food-categories')
export class FoodCategoriesController {
  constructor(private readonly foodCategoriesService: FoodCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all food categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all food categories',
    type: [FoodCategoryDto],
  })
  async getFoodCategories(): Promise<FoodCategoryDto[]> {
    return this.foodCategoriesService.getFoodCategories();
  }
}
