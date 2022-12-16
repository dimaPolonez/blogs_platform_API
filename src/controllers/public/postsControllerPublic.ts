import { Router, Request, Response } from 'express';
import { POSTS } from '../../data/posts.data';

export const postsRouterPublic = Router({});

postsRouterPublic.get('/', (req: Request, res: Response) => {
  res.json(POSTS);
});
