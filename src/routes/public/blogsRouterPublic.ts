import { Router, Request, Response } from 'express';
import { BLOGS } from '../../data/blogs.data';
import { blogsFieldsType } from '../../models/data.models';
import { ResponseBody } from '../../models/response.models';

export const blogsRouterPublic = Router({});

blogsRouterPublic.get(
  '/',
  (req: Request, res: ResponseBody<blogsFieldsType>) => {
    res.json(BLOGS);
  }
);
