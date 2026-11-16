jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
    removeItem: jest.fn(async () => undefined),
  },
}));
jest.mock('../src/api/hotels');

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HotelList } from '../src/screens/HotelList';
import { fetchHotels } from '../src/api/hotels';
import { useFavorites } from '../src/store/favorites';

const mockFetch = fetchHotels as jest.MockedFunction<typeof fetchHotels>;

async function renderScreen() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <HotelList />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  useFavorites.setState({ ids: [], sortAsc: true });
  mockFetch.mockReset();
});

test('renders hotels returned by the API', async () => {
  mockFetch.mockResolvedValue([
    { id: 1, title: 'Hotel One', body: '' },
    { id: 2, title: 'Hotel Two', body: '' },
  ]);
  await renderScreen();

  expect(await screen.findByText('Hotel One')).toBeTruthy();
  expect(screen.getByText('Hotel Two')).toBeTruthy();
});

test('shows an error message when the request fails', async () => {
  mockFetch.mockRejectedValue(new Error('boom'));
  await renderScreen();

  expect(await screen.findByText('Error: boom')).toBeTruthy();
});

test('tapping a row favorites it', async () => {
  mockFetch.mockResolvedValue([
    { id: 1, title: 'Hotel One', body: '' },
    { id: 2, title: 'Hotel Two', body: '' },
  ]);
  await renderScreen();

  await fireEvent.press(await screen.findByText('Hotel One'));

  expect(await screen.findByText('★')).toBeTruthy();
  expect(screen.getAllByText('☆')).toHaveLength(1);
});
