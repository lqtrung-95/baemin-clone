// hooks/useCheckout.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/api';

interface OrderItem {
  item_id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image_url: string;
}

interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  voucher_discount: number;
  total_amount: number;
}

interface DeliveryAddress {
  address: string;
  phone_number?: string;
  delivery_instructions?: string;
}

interface DeliveryOption {
  option_id: string;
  name?: string;
}

interface PaymentMethod {
  payment_method_id: number;
  name: string;
}

interface PlaceOrderRequest {
  payment_method_id: number;
  delivery_instructions: string;
}

interface PlaceOrderResponse {
  order_id: number;
  status: string;
  total_amount: number;
  created_at: string;
}

// Get order summary
export const useOrderSummary = () => {
  return useQuery<OrderSummary>({
    queryKey: ['orderSummary'],
    queryFn: () =>
      apiService
        .get<OrderSummary>('/checkout/order-summary')
        .then((res) => res.data),
  });
};

// Set or update delivery address
export const useSetDeliveryAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderSummary, Error, DeliveryAddress>({
    mutationFn: (address) =>
      apiService
        .post<OrderSummary>('/checkout/delivery-address', address)
        .then((res) => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['orderSummary'], data);
    },
  });
};

// Apply voucher
export const useApplyVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderSummary, Error, { code: string }>({
    mutationFn: ({ code }) =>
      apiService
        .post<OrderSummary>('/checkout/apply-voucher', { code })
        .then((res) => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['orderSummary'], data);
    },
  });
};

// Remove voucher
export const useRemoveVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderSummary, Error, void>({
    mutationFn: () =>
      apiService
        .post<OrderSummary>('/checkout/remove-voucher')
        .then((res) => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['orderSummary'], data);
    },
  });
};

// Get delivery options
export const useDeliveryOptions = () => {
  return useQuery<{ options: DeliveryOption[] }>({
    queryKey: ['deliveryOptions'],
    queryFn: () =>
      apiService
        .get<{ options: DeliveryOption[] }>('/checkout/delivery-options')
        .then((res) => res.data),
  });
};

// Set delivery option
export const useSetDeliveryOption = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderSummary, Error, DeliveryOption>({
    mutationFn: (option) =>
      apiService
        .post<OrderSummary>('/checkout/set-delivery-option', option)
        .then((res) => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['orderSummary'], data);
    },
  });
};

// Get payment methods
export const usePaymentMethods = () => {
  return useQuery<{ methods: PaymentMethod[] }>({
    queryKey: ['paymentMethods'],
    queryFn: () =>
      apiService
        .get<{ methods: PaymentMethod[] }>('/checkout/payment-methods')
        .then((res) => res.data),
  });
};

// Place order
export const usePlaceOrder = () => {
  return useMutation<PlaceOrderResponse, Error, PlaceOrderRequest>({
    mutationFn: (orderDetails) =>
      apiService
        .post<PlaceOrderResponse>('/checkout/place-order', orderDetails)
        .then((res) => res.data),
  });
};
