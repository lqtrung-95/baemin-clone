import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BannerDto } from './dto/banner.dto';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async getBanners(): Promise<BannerDto[]> {
    const banners = await this.prisma.banner_carousel.findMany({
      orderBy: {
        display_order: 'asc',
      },
    });

    return banners.map((banner) => ({
      id: banner.banner_id,
      imageUrl: banner.image_url,
      title: banner.title,
      description: banner.description,
      linkUrl: banner.link_url,
    }));
  }
}
