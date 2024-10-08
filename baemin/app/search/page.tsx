'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TypeSelector from './type';
import AreaSelector from './area';
import FilterSelector from './filter';
import ResultFood from './result';
import { useSearchRestaurants, useRestaurantsByCategory } from '@/hooks/useApi';

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const limit = 10;

  const query = searchParams?.get('q') || '';
  const categoryId = searchParams?.get('category') || '';

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchRestaurants({
    query,
    page,
    limit,
  });

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useRestaurantsByCategory(Number(categoryId), page, limit, {
    enabled: !!categoryId,
  });

  const isLoading = isSearchLoading || isCategoryLoading;
  const error = searchError || categoryError;
  const data = categoryId ? categoryData : searchData;

  useEffect(() => {
    // Reset page when query or category changes
    setPage(1);
  }, [query, categoryId]);

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
  }

  const restaurants = categoryId ? data?.restaurants || [] : data?.items || [];

  const totalPages = categoryId
    ? Math.ceil((data?.totalCount || 0) / limit)
    : data?.totalPages || 1;

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
      {categoryId && data && <h2>Category: {data.categoryName}</h2>}
      <ResultFood
        items={restaurants}
        isLoading={isLoading}
        error={error as Error | null}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Page;
