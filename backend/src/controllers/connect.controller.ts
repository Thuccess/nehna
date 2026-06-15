import type { RequestHandler } from 'express';
import type { CommunityPostInput, NewsArticleInput, NewsArticleUpdate } from '@adulis/shared';
import { connectService } from '../services/connect.service.js';

export const connectController = {
  listNews: (async (req, res) => {
    const section = typeof req.query.section === 'string' ? req.query.section : undefined;
    const articles = await connectService.listNews(section);
    res.json({ articles });
  }) as RequestHandler,

  getNews: (async (req, res) => {
    const article = await connectService.getNews(req.params.id);
    res.json({ article });
  }) as RequestHandler,

  createNews: (async (req, res) => {
    const input = req.body as NewsArticleInput;
    const article = await connectService.createNews(req.user!.sub, input);
    res.status(201).json({ article });
  }) as RequestHandler,

  updateNews: (async (req, res) => {
    const input = req.body as NewsArticleUpdate;
    const article = await connectService.updateNews(req.params.id, input);
    res.json({ article });
  }) as RequestHandler,

  deleteNews: (async (req, res) => {
    await connectService.deleteNews(req.params.id);
    res.json({ ok: true });
  }) as RequestHandler,

  listPosts: (async (_req, res) => {
    const posts = await connectService.listPosts();
    res.json({ posts });
  }) as RequestHandler,

  createPost: (async (req, res) => {
    const input = req.body as CommunityPostInput;
    const post = await connectService.createPost(req.user!.sub, input);
    res.status(201).json({ post });
  }) as RequestHandler,

  deletePost: (async (req, res) => {
    await connectService.deletePost(req.params.id, req.user!.sub, req.user!.role);
    res.json({ ok: true });
  }) as RequestHandler,
};
