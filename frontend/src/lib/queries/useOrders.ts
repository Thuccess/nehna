'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { OrderInput, OrderStatus } from '@adulis/shared';
import { api } from '@/lib/api';
import { qk } from './keys';

export function useOrders() {
  return useQuery({
    queryKey: qk.orders,
    queryFn: async () => (await api.listOrders()).orders,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: qk.order(id ?? ''),
    enabled: Boolean(id),
    queryFn: async () => (await api.getOrder(id!)).order,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: OrderInput) => api.createOrder(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      api.updateOrderStatus(orderId, { status }),
    onSuccess: (_data, { orderId }) => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: qk.order(orderId) });
    },
  });
}

export function useOrderMessages(orderId: string | undefined) {
  return useQuery({
    queryKey: qk.orderMessages(orderId ?? ''),
    enabled: Boolean(orderId),
    queryFn: async () => (await api.listOrderMessages(orderId!)).messages,
    refetchInterval: 15000,
  });
}

export function useSendOrderMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, body }: { orderId: string; body: string }) =>
      api.sendOrderMessage(orderId, { body }),
    onSuccess: (_data, { orderId }) => {
      qc.invalidateQueries({ queryKey: qk.orderMessages(orderId) });
    },
  });
}
