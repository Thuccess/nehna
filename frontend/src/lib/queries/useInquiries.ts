'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InquiryInput } from '@adulis/shared';
import { api } from '@/lib/api';
import { qk } from './keys';

export function useInquiries() {
  return useQuery({
    queryKey: qk.inquiries,
    queryFn: async () => (await api.listInquiries()).inquiries,
  });
}

export function useMyInquiries(enabled = true) {
  return useQuery({
    queryKey: qk.myInquiries,
    queryFn: async () => (await api.listInquiries({ mine: true })).inquiries,
    enabled,
  });
}

export function useCreateInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: InquiryInput) => api.createInquiry(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.inquiries });
      qc.invalidateQueries({ queryKey: qk.myInquiries });
    },
  });
}

export function useMarkInquiryRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markInquiryRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.inquiries }),
  });
}
