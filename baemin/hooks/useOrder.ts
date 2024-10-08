// hooks/useOrder.ts

import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import apiService from '@/services/api';

// Interfaces
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderDetails {
  orderId: number;
  status: string;
  restaurantName: string;
  totalAmount: number;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryInstructions: string;
  createdAt: string;
  items: OrderItem[];
}

interface UpdateOrderStatusPayload {
  orderId: number;
  status: string;
}

interface UpdateOrderStatusResponse {
  orderId: number;
  status: string;
  updatedAt: string;
}

// Hooks
export const useOrderDetails = (
  orderId: number,
  options?: UseQueryOptions<OrderDetails>,
) => {
  return useQuery<OrderDetails>({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      const response = await apiService.get<OrderDetails>(`/orders/${orderId}`);
      return response.data;
    },
    ...options,
  });
};

export const useUpdateOrderStatus = (
  options?: UseMutationOptions<
    UpdateOrderStatusResponse,
    Error,
    UpdateOrderStatusPayload
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateOrderStatusResponse,
    Error,
    UpdateOrderStatusPayload
  >({
    mutationFn: async ({ orderId, status }) => {
      const response = await apiService.patch<UpdateOrderStatusResponse>(
        `/orders/${orderId}/status`,
        { status },
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch the order details query
      queryClient.invalidateQueries({
        queryKey: ['orderDetails', data.orderId],
      });
    },
    ...options,
  });
};

export const useOrder = (orderId: number) => {
  const orderDetails = useOrderDetails(orderId);
  const updateOrderStatus = useUpdateOrderStatus();

  return {
    orderDetails,
    updateOrderStatus,
  };
};
