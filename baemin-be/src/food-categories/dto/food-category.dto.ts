import { ApiProperty } from '@nestjs/swagger';

export class FoodCategoryDto {
  @ApiProperty()
  category_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  iconUrl?: string;

  @ApiProperty({ required: false })
  displayOrder?: number;
}
