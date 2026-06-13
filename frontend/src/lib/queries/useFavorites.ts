'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { FavoriteInput } from '@adulis/shared';
import { api } from '@/lib/api';
import { qk } from './keys';

export function useFavorites() {
  return useQuery({
    queryKey: qk.favorites,
    queryFn: async () => (await api.listFavorites()).favorites,
  });
}

export function useAddFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: FavoriteInput) => api.addFavorite(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.favorites }),
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemType, itemId }: { itemType: 'business' | 'product'; itemId: string }) =>
      api.removeFavorite(itemType, itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.favorites }),
  });
}
