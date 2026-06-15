import ConnectView from '@/features/connect/components/ConnectView';

export const metadata = {
  title: 'Connect — Nehna',
  description: 'Eri-News, Uga-News, and community updates from Eritrean businesses in Kampala.',
};

export default function ConnectPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-mobile-nav md:pb-8 flex-1">
      <ConnectView />
    </main>
  );
}
