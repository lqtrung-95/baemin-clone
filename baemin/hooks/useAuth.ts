'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService, { removeToken, setToken } from '@/services/api';
import { users } from '@prisma/client';
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

interface SignUpDto {
  email: string;
  password: string;
  phone_number: string;
  address: string;
  first_name: string;
  last_name: string;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) =>
      apiService
        .post<LoginResponse>('/auth/login', credentials)
        .then((res) => res.data),
    onSuccess: (data) => {
      const token = data.access_token;
      localStorage.setItem('authToken', token);
      // Set the token in your API service for future requests
      setToken(token);
      // Invalidate and refetch any necessary queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Signup hook
export function useSignup() {
  return useMutation({
    mutationFn: (userData: SignUpDto) =>
      apiService.post('/auth/signup', userData),
  });
}

// Profile hook
export function useProfile() {
  return useQuery<users>({
    queryKey: ['profile'],
    queryFn: () =>
      apiService.get<users>('/auth/profile').then((res) => res.data),
    // The profile should only be fetched if we have a token
    enabled: !!localStorage.getItem('authToken'),
  });
}

// Logout function (not a hook, but useful to have here)
export function logout() {
  const queryClient = useQueryClient();
  removeToken();
  // Clear any auth-related queries from the cache
  queryClient.clear();
}
