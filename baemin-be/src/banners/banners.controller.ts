import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { BannerDto } from './dto/banner.dto';

@ApiTags('banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all banners' })
  @ApiResponse({
    status: 200,
    description: 'Return all banners',
    type: [BannerDto],
  })
  async getBanners(): Promise<BannerDto[]> {
    return this.bannersService.getBanners();
  }
}
