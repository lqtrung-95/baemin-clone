'use client';

import {
  ClockCircleTwoTone,
  DollarTwoTone,
  DoubleRightOutlined,
  LikeFilled,
  PlusOutlined,
  SearchOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Input } from 'antd';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import {
  useRestaurantDetails,
  useRestaurantSubmenus,
  useRestaurantMenu,
} from '@/hooks/useApi';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function RestaurantDetail() {
  const params = useParams();
  const restaurantId =
    typeof params.id === 'string' ? parseInt(params.id, 10) : null;

  const {
    data: restaurant,
    isLoading: isLoadingRestaurant,
    error: restaurantError,
  } = useRestaurantDetails(restaurantId);
  const {
    data: submenus,
    isLoading: isLoadingSubmenus,
    error: submenusError,
  } = useRestaurantSubmenus(restaurantId);
  console.log('🚀 ~ RestaurantDetail ~ submenus:', submenus);

  const [selectedSubmenuId, setSelectedSubmenuId] = useState<number | null>(
    null,
  );

  const {
    data: menuItems,
    isLoading: isLoadingMenu,
    error: menuError,
  } = useRestaurantMenu(restaurantId, selectedSubmenuId);
  console.log('🚀 ~ RestaurantDetail ~ menuItems:', menuItems);

  const [searchTerm, setSearchTerm] = useState('');

  console.log('🚀 ~ RestaurantDetail ~ selectedSubmenuId:', selectedSubmenuId);
  useEffect(() => {
    if (submenus && submenus.length > 0 && selectedSubmenuId === null) {
      setSelectedSubmenuId(submenus[0].submenu_id);
    }
  }, [submenus, selectedSubmenuId]);

  const displayRating = (rating: string | null | undefined): string => {
    if (rating === null || rating === undefined) return 'N/A';
    const numRating = Number(rating);
    return isNaN(numRating) ? 'N/A' : numRating.toFixed(1);
  };

  const getFilledStars = (rating: string | null | undefined): number => {
    if (rating === null || rating === undefined) return 0;
    const numRating = Number(rating);
    return isNaN(numRating) ? 0 : Math.floor(numRating);
  };

  if (!restaurantId) return <div>Invalid restaurant ID</div>;
  if (isLoadingRestaurant || isLoadingSubmenus) return <div>Loading...</div>;
  if (restaurantError || submenusError)
    return <div>Error loading restaurant details</div>;
  if (!restaurant) return <div>Restaurant not found</div>;

  const filteredMenuItems = menuItems?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false),
  );

  return (
    <div className="flex flex-col w-full h-auto">
      <div className="bg-white w-full h-80 flex">
        <div className="w-[45%] h-full py-4 px-10">
          <div className="w-full relative h-full">
            <Image
              layout="fill"
              objectFit="cover"
              src={restaurant.image_url || '/food/ga1.jpg'}
              alt={restaurant.name}
            ></Image>
          </div>
        </div>
        <div className="w-[55%] h-full relative">
          <div className="absolute top-0 left-0 px-8 py-4">
            <span className="text-[13px] text-[#187CAA]">
              <Link href="/">Home</Link>{' '}
              <DoubleRightOutlined className="text-[10px]" />
              <Link href="/restaurants">TP.HCM</Link>{' '}
              <DoubleRightOutlined className="text-[10px]" />
              <span>{restaurant.name}</span>
            </span>
            <div className="flex flex-row text-[11px] justify-start items-center mt-3">
              <div className="bg-beamin text-white p-1 mr-2 cursor-pointer tracking-wider flex gap-1">
                <LikeFilled />
                <span>Yêu thích</span>
              </div>
              <span className="text-[#959595]">
                {restaurant.cuisine_type || 'QUÁN ĂN'} -{' '}
                <a href="" className="text-[#0288D1]">
                  Chi nhánh
                </a>
              </span>
            </div>
            <div className="text-[22px] font-bold mt-2">{restaurant.name}</div>
            <div className="text-[13px] mt-1">{restaurant.address}</div>
            <div className="flex flex-row text-[14px] gap-2 justify-start items-center">
              <ol className="flex flex-row text-[#FFC107] gap-1">
                {[...Array(5)].map((_, i) => (
                  <li key={i}>
                    {i < getFilledStars(restaurant.rating) ? (
                      <StarFilled />
                    ) : (
                      <StarOutlined />
                    )}
                  </li>
                ))}
              </ol>
              <p className="bg-[#FFC107] py-[2px] px-1 text-white rounded-md">
                {displayRating(restaurant.rating)}
              </p>
              <span>đánh giá trên Baemin</span>
            </div>
            <div className="flex flex-row gap-4 justify-start items-center my-1 text-[15px]">
              <div className="flex flex-row gap-1 text-[#6CC942] justify-start items-center">
                <div className="w-2 h-2 bg-[#6CC942] rounded-full"></div>
                <span>Mở cửa</span>
              </div>
              <div className="flex flex-row gap-1 justify-start items-center">
                <ClockCircleTwoTone twoToneColor={'#3AC5C9'} />
                <span>{restaurant.opening_hours}</span>
              </div>
            </div>
            <div className="flex flex-row gap-1 justify-start items-center text-[#959595] text-[15px]">
              <DollarTwoTone twoToneColor={'#c0c0c0'} className="text-[16px]" />
              <span>{restaurant.price_range}</span>
            </div>
          </div>

          <div className="w-full flex flex-col absolute bottom-0 left-0 px-8 mb-4 text-[#959595] text-[13px]">
            <div className="border-t-[1px]"></div>
            <div className="flex flex-row gap-4 justify-start items-center py-[10px]">
              <div className="flex flex-col">
                <span>PHÍ DỊCH VỤ</span>
                <span className="text-beamin font-bold text-[14px]">
                  {`${restaurant.service_charge}% Phí dịch vụ`}
                </span>
              </div>
              <div className="border-l border-solid h-6"></div>
              <div className="flex flex-col">
                <span>DỊCH VỤ BỞI</span>
                <span className="text-beamin font-bold text-[14px]">
                  Baemin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="py-[13px] px-[26px] font-bold text-beamin text-[14px]">
          THỰC ĐƠN
        </div>
        <div className="w-full flex flex-row gap-3">
          <div className="w-[20%] bg-white p-5">
            <ul className="space-y-3">
              {submenus?.map((submenu) => (
                <li
                  key={submenu.submenu_id}
                  className={`cursor-pointer flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    selectedSubmenuId === submenu.submenu_id
                      ? 'bg-[#E8F5E9] text-[#4CAF50]'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedSubmenuId(submenu.submenu_id)}
                >
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/baemin-1.jpg"
                      alt={submenu.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{submenu.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-[50%] h-auto bg-white py-3 flex flex-col px-4">
            <div className="w-full mb-5">
              <Input
                addonBefore={<SearchOutlined />}
                placeholder="Search menu items"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full pl-1 gap-3">
              <div className="font-medium">
                {submenus?.find((s) => s.submenu_id === selectedSubmenuId)
                  ?.name || 'Menu Items'}
              </div>
              <div className="flex flex-col w-full gap-4 border-b">
                {isLoadingMenu ? (
                  <div>Loading menu items...</div>
                ) : menuError ? (
                  <div>Error loading menu items</div>
                ) : filteredMenuItems?.length === 0 ? (
                  <div>No menu items found</div>
                ) : (
                  filteredMenuItems?.map((item) => (
                    <div key={item.item_id} className="flex flex-row mb-4">
                      <div className="w-[15%] relative h-16">
                        <Image
                          layout="fill"
                          objectFit="cover"
                          src={item.image_url || '/images/baemin-1.jpg'}
                          alt={item.name}
                        />
                      </div>
                      <div className="w-[60%] flex flex-col gap-1 px-2">
                        <span className="font-bold text-[#464646]">
                          {item.name}
                        </span>
                        <span className="text-wrap text-sm text-[#464646]">
                          {item.description}
                        </span>
                      </div>
                      <div className="w-[15%] flex justify-center items-center">
                        <span className="text-[#0288d1] font-bold text-base">
                          {item.price.toLocaleString()}đ
                        </span>
                      </div>
                      <div className="w-[10%] flex justify-center items-center">
                        <div className="h-6 w-6 rounded-md flex justify-center items-center bg-beamin text-white font-bold cursor-pointer hover:brightness-110">
                          <PlusOutlined />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="w-[30%] bg-white p-4">
            <h2 className="font-bold text-lg mb-4">Your Order</h2>
            <div className="text-center text-gray-500">Your cart is empty</div>
          </div>
        </div>
      </div>
    </div>
  );
}
