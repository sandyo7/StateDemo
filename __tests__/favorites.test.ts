jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
    removeItem: jest.fn(async () => undefined),
  },
}));

import { useFavorites } from '../src/store/favorites';

beforeEach(() => {
  useFavorites.setState({ ids: [], sortAsc: true });
});

test('toggle adds an id, then removes it', () => {
  useFavorites.getState().toggle(3);
  expect(useFavorites.getState().ids).toEqual([3]);

  useFavorites.getState().toggle(3);
  expect(useFavorites.getState().ids).toEqual([]);
});

test('toggleSort flips the sort direction', () => {
  expect(useFavorites.getState().sortAsc).toBe(true);
  useFavorites.getState().toggleSort();
  expect(useFavorites.getState().sortAsc).toBe(false);
});
