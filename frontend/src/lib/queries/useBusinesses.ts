'use client';

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import type { Business, BusinessOnboardingInput, BusinessUpdate } from '@adulis/shared';
import { api } from '@/lib/api';
import { qk } from './keys';

export function useBusinesses(
  query?: Parameters<typeof api.listBusinesses>[0],
  options?: Omit<UseQueryOptions<Business[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: qk.businesses(query),
    queryFn: async () => (await api.listBusinesses(query)).businesses,
    ...options,
  });
}

export function useBusiness(id: string | undefined) {
  return useQuery({
    queryKey: qk.business(id ?? ''),
    enabled: Boolean(id),
    queryFn: async () => (await api.getBusiness(id!)).business,
  });
}

export function useCreateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BusinessOnboardingInput) => api.createBusiness(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
}

export function useUpdateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BusinessUpdate }) =>
      api.updateBusiness(id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['businesses'] });
      qc.invalidateQueries({ queryKey: qk.business(id) });
    },
  });
}

export function useDeleteBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteBusiness(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['businesses'] }),
  });
}

export function useApproveBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.approveBusiness(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['businesses'] }),
  });
}

export function useSuspendBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.suspendBusiness(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['businesses'] }),
  });
}
