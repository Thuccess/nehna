'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLanguage } from '@/providers/LanguageProvider';
import type { NewsArticle, CommunityPost } from '@adulis/shared';

type ConnectTab = 'eri_news' | 'uga_news' | 'communities';

export default function ConnectView() {
  const { language } = useLanguage();
  const [tab, setTab] = useState<ConnectTab>('eri_news');

  const { data: eriArticles = [] } = useQuery({
    queryKey: ['connect', 'news', 'eri_news'],
    queryFn: async () => (await api.listNews('eri_news')).articles,
  });

  const { data: ugaArticles = [] } = useQuery({
    queryKey: ['connect', 'news', 'uga_news'],
    queryFn: async () => (await api.listNews('uga_news')).articles,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['connect', 'posts'],
    queryFn: async () => (await api.listCommunityPosts()).posts,
  });

  const tabs: { id: ConnectTab; label: string }[] = [
    {
      id: 'eri_news',
      label: language === 'en' ? 'Eri-News' : 'ኤርትራ ዜና',
    },
    {
      id: 'uga_news',
      label: language === 'en' ? 'Uga-News' : 'ዩጋ ዜና',
    },
    {
      id: 'communities',
      label: language === 'en' ? 'Communities' : 'ማሕበረሰባት',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-black tracking-tight">
          {language === 'en' ? 'Connect' : 'ርክብ'}
        </h1>
        <p className="text-sm text-black/60 mt-1 max-w-2xl">
          {language === 'en'
            ? 'Stay updated on Eritrea and Uganda, and discover what sellers are sharing in the community.'
            : 'ናይ ኤርትራን ዩጋን ዜናን ማሕበረሰባዊ ልጥፊ ሸያጢታት ርአ።'}
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`snap-start shrink-0 px-4 py-2.5 rounded-2xl font-mono text-xs font-bold uppercase transition min-h-11 ${
              tab === t.id
                ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/10'
                : 'text-black/70 bg-black/5 border border-black/10 hover:border-black/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'eri_news' && <NewsFeed articles={eriArticles} language={language} />}
      {tab === 'uga_news' && <NewsFeed articles={ugaArticles} language={language} />}
      {tab === 'communities' && <CommunitiesFeed posts={posts} language={language} />}
    </div>
  );
}

function NewsFeed({
  articles,
  language,
}: {
  articles: NewsArticle[];
  language: 'en' | 'ti';
}) {
  if (articles.length === 0) {
    return (
      <p className="text-sm text-black/50 py-12 text-center">
        {language === 'en' ? 'No articles yet. Check back soon.' : 'ዜና ኣይተመዝገበን።'}
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {articles.map((article) => (
        <article
          key={article.id}
          className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
        >
          {article.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-40 object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="p-5 space-y-2">
            <time className="text-[10px] font-mono text-black/45 uppercase">
              {new Date(article.publishedAt).toLocaleDateString()}
            </time>
            <h2 className="font-bold text-black text-lg leading-snug">{article.title}</h2>
            <p className="text-sm text-black/65 line-clamp-4">{article.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function CommunitiesFeed({
  posts,
  language,
}: {
  posts: CommunityPost[];
  language: 'en' | 'ti';
}) {
  if (posts.length === 0) {
    return (
      <p className="text-sm text-black/50 py-12 text-center">
        {language === 'en'
          ? 'No community posts yet. Sellers can share from their hub.'
          : 'ልጥፊ ኣይተመዝገበን።'}
      </p>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-3">
            {post.businessLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.businessLogo}
                alt=""
                className="h-10 w-10 rounded-xl object-cover border border-black/10"
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <Link
                href={`/businesses/${post.businessId}`}
                className="font-bold text-sm text-black hover:text-sky-600"
              >
                {post.businessName ?? 'Business'}
              </Link>
              <p className="text-[10px] font-mono text-black/45">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {post.title && <h3 className="font-bold text-black">{post.title}</h3>}
          <p className="text-sm text-black/70">{post.body}</p>
          {post.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.imageUrl}
              alt=""
              className="rounded-xl w-full max-h-64 object-cover border border-black/10"
              referrerPolicy="no-referrer"
            />
          )}
          {post.productId && (
            <Link
              href={`/products/${post.productId}`}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              {language === 'en' ? 'View product' : 'ኣቕሓ ርአ'}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
