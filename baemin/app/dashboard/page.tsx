'use client';

import HeaderNav from '@/components/headerNav';
import ScrollBar from '@/components/scrollBar';
import ScrollFood from '@/components/scrollFood';
import Image from 'next/image';
import React from 'react';
import {
  useBanners,
  useFoodCategories,
  useFeaturedContent,
} from '@/hooks/useApi';

export default function Home() {
  const {
    data: banners,
    isLoading: isBannersLoading,
    error: bannersError,
  } = useBanners();
  const {
    data: foodCategories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useFoodCategories();
  const {
    data: featuredContent,
    isLoading: isFeaturedLoading,
    error: featuredError,
  } = useFeaturedContent();

  const items =
    foodCategories?.map((category) => ({
      name: category.name,
      imageSrc: category.icon_url || '/images/burger.jpg',
      description: 'Food Category',
    })) || [];

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 pt-3 pl-8 pr-8 z-40">
          <div className="flex flex-col fixed bg-white w-64 rounded-2xl pl-3 pt-2 pb-5 gap-3">
            <span>Thực đơn</span>
            {isCategoriesLoading ? (
              <div>Loading categories...</div>
            ) : categoriesError ? (
              <div>Error loading categories</div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex flex-row items-center gap-1">
                    <Image
                      src={item.imageSrc || '/images/baemin-1.jpg'}
                      width={30}
                      height={30}
                      alt={item.description}
                    />
                    <span>{item.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="col-span-9 w-full pt-3 pr-8 gap-3 flex flex-col">
          <ScrollBar
            banners={banners || []}
            isLoading={isBannersLoading}
            error={bannersError}
          />
          <ScrollFood
            title="Nhà hàng nổi bật"
            restaurants={featuredContent?.featuredRestaurants.items || []}
            isLoading={isFeaturedLoading}
          />
          <ScrollFood
            title="Ưu đãi đặc biệt"
            restaurants={featuredContent?.specialDeals.items || []}
            isLoading={isFeaturedLoading}
          />
        </div>
      </div>
    </>
  );
}
