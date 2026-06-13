'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ProductInput, ProductUpdate } from '@adulis/shared';
import { api } from '@/lib/api';
import { qk } from './keys';

export function useProducts(query?: Parameters<typeof api.listProducts>[0]) {
  return useQuery({
    queryKey: qk.products(query),
    queryFn: async () => (await api.listProducts(query)).products,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: qk.product(id ?? ''),
    enabled: Boolean(id),
    queryFn: async () => (await api.getProduct(id!)).product,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) => api.createProduct(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductUpdate }) =>
      api.updateProduct(id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: qk.product(id) });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}
