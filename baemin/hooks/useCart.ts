import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/api';

export interface CartItem {
  id: number;
  cart_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  image_url: string;
  name: string;
  description: string;
  isSelected: boolean;
}

interface Cart {
  id: number;
  user_id: number;
  cart_items: CartItem[];
}

interface AddToCartPayload {
  menuItemId: number;
  quantity: number;
}

interface UpdateCartItemPayload {
  menuItemId: number;
  quantity: number;
}

// Fetch current cart
export const useCart = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: () => apiService.get<Cart>('/cart').then((res) => res.data),
  });

  const toggleItemSelection = (itemId: number) => {
    queryClient.setQueryData<Cart>(['cart'], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        cart_items: oldData.cart_items.map((item) =>
          item.id === itemId ? { ...item, isSelected: !item.isSelected } : item,
        ),
      };
    });
  };

  const toggleAllSelection = (selectAll: boolean) => {
    queryClient.setQueryData<Cart>(['cart'], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        cart_items: oldData.cart_items.map((item) => ({
          ...item,
          isSelected: selectAll,
        })),
      };
    });
  };

  return {
    ...query,
    toggleItemSelection,
    toggleAllSelection,
  };
};

// Add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, AddToCartPayload>({
    mutationFn: (payload) =>
      apiService.post<Cart>('/cart/add', payload).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
    },
  });
};

// Update cart item quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, UpdateCartItemPayload>({
    mutationFn: (payload) =>
      apiService.put<Cart>('/cart/update', payload).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
    },
  });
};

// Remove item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, number>({
    mutationFn: (menuItemId) =>
      apiService.delete<Cart>(`/cart/${menuItemId}`).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
    },
  });
};

// Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: () => apiService.delete('/cart'),
    onSuccess: () => {
      queryClient.setQueryData(['cart'], { id: 0, user_id: 0, cart_items: [] });
    },
  });
};

export const useToggleCartItemSelection = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, number>({
    mutationFn: (itemId) => {
      const currentCart = queryClient.getQueryData<Cart>(['cart']);
      if (!currentCart) throw new Error('Cart not found');

      const updatedCartItems = currentCart.cart_items.map((item) =>
        item.id === itemId ? { ...item, isSelected: !item.isSelected } : item,
      );

      const updatedCart = { ...currentCart, cart_items: updatedCartItems };
      return Promise.resolve(updatedCart);
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
    },
  });
};
