import { Router, Request, Response } from 'express';
import { BLOGS } from '../../data/blogs.data';
import { ERRORS_CODE } from '../../data/errors.data';
import { blogsFieldsType } from '../../models/data.models';
import { RequestParams } from '../../models/request.models';
import { ResponseBody } from '../../models/response.models';
import { returnByID } from '../../services/blogsService';

export const blogsRouterPublic = Router({});

blogsRouterPublic.get(
  '/',
  (req: Request, res: ResponseBody<blogsFieldsType>) => {
    res.json(BLOGS);
  }
);

blogsRouterPublic.get(
  '/:id',
  (req: Request<RequestParams>, res: ResponseBody<blogsFieldsType>) => {
    const result = returnByID(req.params.id);

    if (result) {
      res.json(result).sendStatus(ERRORS_CODE.OK_200);
    } else {
      res.json('Not Found').sendStatus(ERRORS_CODE.NOT_FOUND_404);
    }
  }
);
