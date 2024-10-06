// hooks/useAuth.js

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService, { removeToken, setToken } from '@/services/api';
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
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
    mutationFn: (userData) => apiService.post('/auth/signup', userData),
    // You might want to automatically log the user in after signup
    // or handle the response in some other way
  });
}

// Profile hook
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiService.get('/auth/profile').then((res) => res.data),
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
