'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UpdateUserInput } from '@adulis/shared';
import { api } from '@/lib/api';
import { qk } from './keys';

export function useUsers(query?: Parameters<typeof api.listUsers>[0]) {
  return useQuery({
    queryKey: qk.users(query),
    queryFn: async () => (await api.listUsers(query)).users,
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      api.updateUser(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useApproveUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.approveUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name?: string; phone?: string; avatarUrl?: string }) =>
      api.updateMe(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.me }),
  });
}
