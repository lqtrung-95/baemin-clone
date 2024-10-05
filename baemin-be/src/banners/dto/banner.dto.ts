import { ApiProperty } from '@nestjs/swagger';

export class BannerDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  linkUrl?: string;
}
