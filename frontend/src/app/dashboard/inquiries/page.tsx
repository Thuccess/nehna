import { redirect } from 'next/navigation';

export default function DashboardInquiriesRedirect() {
  redirect('/dashboard/orders');
}
