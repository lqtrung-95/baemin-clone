import { Module } from '@nestjs/common';
import { FoodCategoriesController } from './food-categories.controller';
import { FoodCategoriesService } from './food-categories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FoodCategoriesController],
  providers: [FoodCategoriesService],
})
export class FoodCategoriesModule {}
