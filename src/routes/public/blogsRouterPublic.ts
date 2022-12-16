import { Router, Request, Response } from 'express';
import { BLOGS } from '../../data/blogs.data';

export const blogsRouterPublic = Router({});

blogsRouterPublic.get('/', (req: Request, res: Response) => {
  res.json(BLOGS);
});
