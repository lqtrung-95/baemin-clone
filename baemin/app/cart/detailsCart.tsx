'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/hooks/useCart'; // Make sure to export this type from useCart.ts

interface DetailsCartProps {
  items: CartItem[];
  onToggleItem: (itemId: number) => void;
}

export default function DetailsCart({ items, onToggleItem }: DetailsCartProps) {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="w-full grid grid-cols-12 bg-white p-4 border-b border-gray-200"
        >
          <div className="pl-8 col-span-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.isSelected}
              onChange={() => onToggleItem(item.id)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <div className="relative h-16 w-16">
              <Image
                layout="fill"
                objectFit="cover"
                src={'/images/baemin-1.jpg'}
                alt={item.name}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-500">
                {item.description || 'No description available'}
              </span>
            </div>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            ₫{item.price.toLocaleString()}
          </div>
          <div className="col-span-2 flex items-center justify-center">
            {item.quantity}
          </div>
          <div className="col-span-2 flex items-center justify-center">
            ₫{(item.price * item.quantity).toLocaleString()}
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <button className="text-red-500 hover:text-red-700">Xóa</button>
          </div>
        </div>
      ))}
    </>
  );
}
