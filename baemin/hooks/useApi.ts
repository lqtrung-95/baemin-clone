import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import apiService from '@/services/api';
import {
  banner_carousel,
  food_categories,
  restaurants,
  menu_items,
  orders,
  users,
  reviews,
  restaurant_submenu,
} from '@prisma/client';

// Banner Carousel
export const useBanners = (options?: UseQueryOptions<banner_carousel[]>) =>
  useQuery<banner_carousel[]>({
    queryKey: ['banners'],
    queryFn: () =>
      apiService.get<banner_carousel[]>('/banners').then((res) => res.data),
    ...options,
  });

// Food Categories
export const useFoodCategories = (
  options?: UseQueryOptions<food_categories[]>,
) =>
  useQuery<food_categories[]>({
    queryKey: ['foodCategories'],
    queryFn: () =>
      apiService
        .get<food_categories[]>('/food-categories')
        .then((res) => res.data),
    ...options,
  });

interface RestaurantSection {
  items: restaurants[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FeaturedContentResponse {
  featuredRestaurants: RestaurantSection;
  specialDeals: RestaurantSection;
}

export const useFeaturedContent = (
  options?: UseQueryOptions<FeaturedContentResponse>,
) =>
  useQuery<FeaturedContentResponse>({
    queryKey: ['featuredContent'],
    queryFn: () =>
      apiService
        .get<FeaturedContentResponse>('/restaurants/featured-content')
        .then((res) => res.data),
    ...options,
  });
type Restaurant = Omit<restaurants, 'rating'> & {
  rating: string | null;
  price_range?: string;
  service_charge?: string;
};

export const useRestaurantDetails = (
  id: number | null,
  options?: UseQueryOptions<Restaurant>,
) =>
  useQuery<Restaurant>({
    queryKey: ['restaurant', id],
    queryFn: () =>
      id
        ? apiService
            .get<Restaurant>(`/restaurants/${id}`)
            .then((res) => res.data)
        : Promise.reject('Invalid ID'),
    ...options,
    enabled: !!id,
  });

export const useRestaurantSubmenus = (
  id: number | null,
  options?: UseQueryOptions<restaurant_submenu[]>,
) =>
  useQuery<restaurant_submenu[]>({
    queryKey: ['restaurantSubmenus', id],
    queryFn: () =>
      id
        ? apiService
            .get<restaurant_submenu[]>(`/restaurants/${id}/submenus`)
            .then((res) => res.data)
        : Promise.reject('Invalid ID'),
    ...options,
    enabled: !!id,
  });

export const useRestaurantMenu = (
  id: number | null,
  submenuId: number | null,
  options?: UseQueryOptions<menu_items[]>,
) =>
  useQuery<menu_items[]>({
    queryKey: ['restaurantMenu', id, submenuId],
    queryFn: () => {
      if (!id) return Promise.reject('Invalid restaurant ID');
      const url = submenuId
        ? `/restaurants/${id}/menu?submenuId=${submenuId}`
        : `/restaurants/${id}/menu`;
      return apiService.get<menu_items[]>(url).then((res) => res.data);
    },
    ...options,
    enabled: !!id && submenuId !== null,
  });

interface SearchResponse {
  items: restaurants[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export const useSearchRestaurants = (
  params: SearchParams,
  options?: UseQueryOptions<SearchResponse>,
) => {
  return useQuery<SearchResponse>({
    queryKey: ['searchRestaurants', params],
    queryFn: () =>
      apiService
        .get<SearchResponse>('/restaurants/search', {
          params: {
            query: params.query.toString(),
            page: params.page,
            limit: params.limit,
          },
        })
        .then((res) => res.data),
    ...options,
  });
};

// Orders
export const useUserOrders = (
  userId: number,
  options?: UseQueryOptions<orders[]>,
) =>
  useQuery<orders[]>({
    queryKey: ['userOrders', userId],
    queryFn: () =>
      apiService
        .get<orders[]>(`/users/${userId}/orders`)
        .then((res) => res.data),
    ...options,
  });

export const useCreateOrder = (
  options?: UseMutationOptions<orders, Error, Omit<orders, 'order_id'>>,
) =>
  useMutation<orders, Error, Omit<orders, 'order_id'>>({
    mutationFn: (newOrder) =>
      apiService.post<orders>('/orders', newOrder).then((res) => res.data),
    ...options,
  });

// Reviews
export const useRestaurantReviews = (
  restaurantId: number,
  options?: UseQueryOptions<reviews[]>,
) =>
  useQuery<reviews[]>({
    queryKey: ['restaurantReviews', restaurantId],
    queryFn: () =>
      apiService
        .get<reviews[]>(`/restaurants/${restaurantId}/reviews`)
        .then((res) => res.data),
    ...options,
  });

export const useCreateReview = (
  options?: UseMutationOptions<reviews, Error, Omit<reviews, 'review_id'>>,
) =>
  useMutation<reviews, Error, Omit<reviews, 'review_id'>>({
    mutationFn: (newReview) =>
      apiService.post<reviews>('/reviews', newReview).then((res) => res.data),
    ...options,
  });

// User
export const useUserProfile = (
  userId: number,
  options?: UseQueryOptions<users>,
) =>
  useQuery<users>({
    queryKey: ['userProfile', userId],
    queryFn: () =>
      apiService.get<users>(`/users/${userId}`).then((res) => res.data),
    ...options,
  });

export const useUpdateUserProfile = (
  options?: UseMutationOptions<users, Error, Partial<users>>,
) =>
  useMutation<users, Error, Partial<users>>({
    mutationFn: (updatedUser) =>
      apiService
        .put<users>(`/users/${updatedUser.user_id}`, updatedUser)
        .then((res) => res.data),
    ...options,
  });

interface RestaurantsByCategoryResponse {
  categoryName: string;
  restaurants: {
    restaurant_id: number;
    name: string;
    address: string;
    rating: string | null;
    cuisineType: string | null;
    imageUrl: string;
  }[];
  totalCount: number;
  page: number;
  limit: number;
}

export const useRestaurantsByCategory = (
  categoryId: number,
  page: number = 1,
  limit: number = 10,
  options?: UseQueryOptions<RestaurantsByCategoryResponse>,
) => {
  return useQuery<RestaurantsByCategoryResponse>({
    queryKey: ['restaurantsByCategory', categoryId, page, limit],
    queryFn: () =>
      apiService
        .get<RestaurantsByCategoryResponse>('/restaurants/by-category', {
          params: { categoryId, page, limit },
        })
        .then((res) => res.data),
    ...options,
  });
};
