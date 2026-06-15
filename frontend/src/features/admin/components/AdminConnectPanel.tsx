'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import type { NewsSection } from '@adulis/shared';

export default function AdminConnectPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [section, setSection] = useState<NewsSection>('eri_news');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: articles = [] } = useQuery({
    queryKey: ['admin', 'news', section],
    queryFn: async () => (await api.listNews(section)).articles,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createNewsArticle({
        section,
        title,
        body,
        imageUrl: imageUrl.trim() || undefined,
      });
      setTitle('');
      setBody('');
      setImageUrl('');
      queryClient.invalidateQueries({ queryKey: ['admin', 'news'] });
      queryClient.invalidateQueries({ queryKey: ['connect'] });
      toast('Article published.', 'success');
    } catch {
      toast('Failed to publish.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <form onSubmit={onSubmit} className="bg-white border border-black/10 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-black">Publish news</h3>
        <select
          value={section}
          onChange={(e) => setSection(e.target.value as NewsSection)}
          className="w-full border border-black/10 rounded-xl px-3 py-2 text-sm"
        >
          <option value="eri_news">Eri-News</option>
          <option value="uga_news">Uga-News</option>
        </select>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full border border-black/10 rounded-xl px-3 py-2 text-sm"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Article body"
          required
          rows={6}
          className="w-full border border-black/10 rounded-xl px-3 py-2 text-sm"
        />
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
          className="w-full border border-black/10 rounded-xl px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-sky-600 text-white rounded-xl font-bold text-sm disabled:opacity-60"
        >
          Publish
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="font-bold text-black">Recent ({section})</h3>
        {articles.length === 0 ? (
          <p className="text-sm text-black/50">No articles in this section.</p>
        ) : (
          articles.slice(0, 8).map((a) => (
            <div key={a.id} className="bg-slate-50 border border-black/10 rounded-xl p-4">
              <p className="font-bold text-sm">{a.title}</p>
              <p className="text-xs text-black/60 line-clamp-2 mt-1">{a.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
