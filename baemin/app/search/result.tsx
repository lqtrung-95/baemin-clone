'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { restaurants } from '@prisma/client';

interface ResultFoodProps {
  items: restaurants[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ResultFood({
  items,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}: ResultFoodProps) {
  const router = useRouter();

  const handleNavigate = (id: number) => {
    router.push(`/restaurant/${id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="mt-3 flex flex-row flex-wrap gap-3">
        {items.map((item) => (
          <div
            onClick={() => handleNavigate(item.restaurant_id)}
            key={item.restaurant_id}
            className="group w-[19%] h-56 bg-white flex flex-col cursor-pointer"
          >
            <div className="group-hover:brightness-105 w-full h-[60%] relative">
              <Image
                layout="fill"
                objectFit="cover"
                src="/images/baemin-1.jpg"
                alt={item.name}
              />
            </div>
            <div className="group-hover:bg-slate-50 w-full h-[40%] pr-3 border border-solid">
              <div className="ml-3 w-full truncate text-base h-[30%]">
                <span className="font-bold text-[#252525]">{item.name}</span>
              </div>
              <div
                className="ml-3 w-full truncate text-sm h-[30%]"
                style={{ color: '#959595' }}
              >
                <span>{item.address}</span>
              </div>
              <div className="flex items-center w-full text-sm border-t border-beamin-50 h-[30%]">
                <span className="ml-3">{item.cuisine_type || 'Quán Ăn'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
}
