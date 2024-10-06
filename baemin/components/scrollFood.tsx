'use client';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { restaurants } from '@prisma/client';

interface ScrollFoodProps {
  title: string;
  restaurants: restaurants[];
  isLoading: boolean;
}

export default function ScrollFood({
  title,
  restaurants,
  isLoading,
}: ScrollFoodProps) {
  console.log('🚀 ~ restaurants:', restaurants);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (restaurantId: number) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  const handleNext = () => {
    if (containerRef.current && restaurants.length - 1 > currentIndex) {
      setCurrentIndex(currentIndex + 1);
      containerRef.current.scrollBy({ left: 180, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (containerRef.current && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      containerRef.current.scrollBy({ left: -180, behavior: 'smooth' });
    }
  };

  if (isLoading && restaurants.length === 0)
    return <div>Loading restaurants...</div>;

  return (
    <div className="bg-white rounded-2xl w-full" style={{ height: '300px' }}>
      <div
        className="w-full h-full flex flex-col px-4 pt-4 pb-2"
        style={{ height: '300px' }}
      >
        <div className="relative ml-3 text-xl font-bold mb-2">{title}</div>
        <div className="w-full relative h-full">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute hover:text-beamin hover:bg-slate-50 bg-white top-20 w-8 h-8 rounded-full z-20"
            >
              <LeftOutlined />
            </button>
          )}
          <div
            ref={containerRef}
            className="scroll-container w-full h-full flex flex-row gap-3"
          >
            {restaurants.map((restaurant) => (
              <div
                onClick={() => handleNavigate(restaurant.restaurant_id)}
                className="group w-48 h-full cursor-pointer"
                key={restaurant.restaurant_id}
              >
                <div className="w-full h-2/3">
                  <div
                    className="group-hover:brightness-75"
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Image
                      layout="fill"
                      objectFit="cover"
                      src={'/images/baemin-1.jpg'}
                      alt={restaurant.name}
                    />
                  </div>
                </div>
                <div className="group-hover:bg-slate-50 w-full h-1/3 flex flex-col pl-2 pr-2 border-solid border-2 border-beamin-50">
                  <div className="w-full truncate text-base">
                    <span>{restaurant.name}</span>
                  </div>
                  <div
                    className="w-full truncate text-sm"
                    style={{ color: '#959595' }}
                  >
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="w-full text-sm border-t border-beamin-50 mt-2">
                    <span className="mt-2">
                      {restaurant.cuisine_type || 'Quán ăn'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {currentIndex < restaurants.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute hover:text-beamin hover:bg-slate-50 bg-white top-20 right-1 w-8 h-8 rounded-full z-20"
            >
              <RightOutlined />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
