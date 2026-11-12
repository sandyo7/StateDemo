import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchHotels, Hotel } from '../api/hotels';
import { useFavorites } from '../store/favorites';

export function HotelList() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['hotels'],
    queryFn: fetchHotels,
    staleTime: 60_000,
  });

  const favIds = useFavorites(s => s.ids);
  const toggle = useFavorites(s => s.toggle);
  const sortAsc = useFavorites(s => s.sortAsc);
  const toggleSort = useFavorites(s => s.toggleSort);

  const sorted = useMemo(() => {
    const list = [...(data ?? [])];
    list.sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id));
    return list;
  }, [data, sortAsc]);

  const renderItem = useCallback(
    ({ item }: { item: Hotel }) => (
      <Pressable style={styles.row} onPress={() => toggle(item.id)}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text>{favIds.includes(item.id) ? '★' : '☆'}</Text>
      </Pressable>
    ),
    [favIds, toggle],
  );

  if (isLoading) {
    return <ActivityIndicator style={styles.center} />;
  }
  if (isError) {
    return <Text style={styles.center}>Error: {(error as Error).message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.sortBtn} onPress={toggleSort}>
        <Text style={styles.sortText}>Sort: {sortAsc ? 'ID ↑' : 'ID ↓'}</Text>
      </Pressable>
      <FlatList
        data={sorted}
        keyExtractor={i => String(i.id)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  center: { flex: 1, textAlign: 'center', marginTop: 100 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { flex: 1, marginRight: 12 },
  sortBtn: { backgroundColor: '#222', padding: 10 },
  sortText: { color: '#fff', textAlign: 'center' },
});
