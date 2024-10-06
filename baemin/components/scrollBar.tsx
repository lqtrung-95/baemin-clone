'use client';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { banner_carousel } from '@prisma/client';

interface ScrollBarProps {
  banners: banner_carousel[];
  isLoading: boolean;
  error: Error | null;
}

export default function ScrollBar({
  banners,
  isLoading,
  error,
}: ScrollBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (containerRef.current && currentIndex < banners.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (containerRef.current && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: currentIndex * 489,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  if (isLoading) return <div>Loading banners...</div>;
  if (error) return <div>Error loading banners: {error.message}</div>;

  return (
    <div className="w-full relative" style={{ height: '300px' }}>
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute hover:text-beamin hover:bg-slate-50 bg-white top-32 left-6 w-8 h-8 rounded-full z-20"
        >
          <LeftOutlined />
        </button>
      )}
      <div
        ref={containerRef}
        className="relative scroll-container flex bg-white rounded-2xl w-full p-4 gap-2 overflow-hidden"
        style={{ height: '300px' }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.banner_id}
            className="relative flex-shrink-0 w-1/2 bg-blue-200 p-4 cursor-pointer"
          >
            <Image
              layout="fill"
              objectFit="cover"
              src={banner.image_url || '/images/baemin-1.jpg'}
              alt={banner.title || ''}
            />
            {banner.title && (
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                {banner.title}
              </div>
            )}
          </div>
        ))}
      </div>
      {currentIndex < banners.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute hover:text-beamin hover:bg-slate-50 bg-white top-32 right-3 w-8 h-8 rounded-full z-20"
        >
          <RightOutlined />
        </button>
      )}
    </div>
  );
}
