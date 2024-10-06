'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TypeSelector from './type';
import AreaSelector from './area';
import FilterSelector from './filter';
import ResultFood from './result';
import { useSearchRestaurants } from '@/hooks/useApi';

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log('🚀 ~ searchParams:', searchParams);
  const [page, setPage] = useState(1);
  const limit = 10;

  const query = searchParams?.get('q') || '';

  const { data, isLoading, error } = useSearchRestaurants({
    query,
    page,
    limit,
  });

  useEffect(() => {
    // Reset page when query changes
    setPage(1);
  }, [query]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    // Convert ReadonlyURLSearchParams to a regular object
    const currentParams = Object.fromEntries((searchParams || []).entries());

    const newSearchParams = new URLSearchParams({
      ...currentParams,
      page: newPage.toString(),
    });

    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  if (error) {
    console.error('Search error:', error);
    // You can add more sophisticated error handling here
  }

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center border-b border-solid">
        <div className="flex flex-row gap-3">
          <AreaSelector />
          <TypeSelector />
        </div>
        <div className="flex items-center justify-center">
          <FilterSelector />
        </div>
      </div>
      {error && (
        <div>Error: {(error as any).message || 'An error occurred'}</div>
      )}
      <ResultFood
        items={data?.items || []}
        isLoading={isLoading}
        error={error as Error | null}
        currentPage={data?.page || 1}
        totalPages={data?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Page;
