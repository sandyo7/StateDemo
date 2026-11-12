import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HotelList } from './src/screens/HotelList';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HotelList />
    </QueryClientProvider>
  );
}
