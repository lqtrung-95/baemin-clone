'use client';

import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useMemo } from 'react';
import { useCart, useClearCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import DetailsCart from './detailsCart';

export default function CartPage() {
  const {
    data: cart,
    isLoading,
    error,
    toggleItemSelection,
    toggleAllSelection,
  } = useCart();
  const clearCart = useClearCart();
  const router = useRouter();

  const handleClearCart = () => {
    clearCart.mutate();
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const allSelected = useMemo(() => {
    return cart?.cart_items.every((item) => item.isSelected) ?? false;
  }, [cart]);

  const handleToggleAll = () => {
    toggleAllSelection(!allSelected);
  };

  const handleToggleItem = (itemId: number) => {
    toggleItemSelection(itemId);
  };

  if (isLoading) return <div>Loading cart...</div>;
  if (error) return <div>Error loading cart: {error.message}</div>;

  const selectedItems =
    cart?.cart_items.filter((item) => item.isSelected) || [];

  const totalItems = selectedItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const totalAmount = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <>
      <div className="flex flex-row w-full h-20 bg-white ">
        <div className="w-1/2 h-full flex flex-row items-center gap-3">
          <div className="ml-10 text-4xl text-beamin font-bold">
            <ShoppingCartOutlined />
          </div>
          <div className="text-2xl text-beamin">|</div>
          <div className="text-3xl text-beamin font-bold">Giỏ hàng</div>
        </div>
      </div>
      <div className="mt-4 px-16 flex flex-col gap-4 pb-16 rounded-md">
        <div className="w-full h-16 bg-white grid grid-cols-12">
          <div className="pl-8 col-span-4 flex items-center flex-row gap-5">
            <input
              id="select-all-checkbox"
              type="checkbox"
              checked={allSelected}
              onChange={handleToggleAll}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800"
            />
            <span className="text-base font-normal">Món Ăn</span>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <span className="text-base font-normal text-gray-600">Đơn giá</span>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <span className="text-base font-normal text-gray-600">
              Số lượng
            </span>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <span className="text-base font-normal text-gray-600">Số tiền</span>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <span className="text-base font-normal text-gray-600">
              Thao tác
            </span>
          </div>
        </div>
        <DetailsCart
          items={cart?.cart_items || []}
          onToggleItem={handleToggleItem}
        />
        <div className="flex flex-row fixed bottom-0 w-[90.6%] mr-16 h-16 bg-white items-center">
          <div className="flex flex-row gap-2 w-1/2 h-full items-center ml-10"></div>
          <div className="flex flex-row gap-2 w-1/2 h-full items-center justify-end pr-2">
            <div className="">Tổng thanh toán ({totalItems} Sản phẩm):</div>
            <div className="text-red-600">₫{totalAmount.toLocaleString()}</div>
            <Button
              onClick={handleCheckout}
              className={`
    w-40 h-10 rounded-md
    text-white font-semibold
    transition-all duration-200
    ${
      selectedItems?.length === 0
        ? '!bg-gray-400 cursor-not-allowed opacity-50'
        : '!bg-beamin hover:!bg-beamin-600 active:!bg-beamin-700 !text-white'
    }
  `}
              disabled={selectedItems?.length === 0}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
