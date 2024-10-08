'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService, { removeToken, setToken } from '@/services/api';
import { users } from '@prisma/client';
import { jwtDecode } from 'jwt-decode';

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

interface DecodedToken {
  exp: number;
}

// Function to check if the token is expired
function isTokenExpired(token: string): boolean {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
}

// Function to get the token and check if it's valid
export function getValidToken(): string | null {
  const token = localStorage.getItem('authToken');
  if (token && !isTokenExpired(token)) {
    return token;
  }
  removeToken();
  return null;
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
    queryFn: async () => {
      const token = getValidToken();
      if (!token) {
        throw new Error('No valid token');
      }
      return apiService.get<users>('/auth/profile').then((res) => res.data);
    },
    enabled: !!getValidToken(),
  });
}

// Logout function (not a hook, but useful to have here)
export function logout() {
  const queryClient = useQueryClient();
  removeToken();
  queryClient.clear();
}
