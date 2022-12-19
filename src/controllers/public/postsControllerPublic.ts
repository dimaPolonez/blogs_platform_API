import { Router, Request, Response } from 'express';
import { POSTS } from '../../data/posts.data';
import { ERRORS_CODE } from '../../data/errors.data';
import { requestId, RequestParams } from '../../models/request.models';
import { returnByAll, returnByID } from '../../services/index.service';

export const postsRouterPublic = Router({});

postsRouterPublic.get('/', (req: Request, res: Response) => {
  res.status(ERRORS_CODE.OK_200).json(returnByAll(POSTS));
});

postsRouterPublic.get(
  '/:id',
  (req: RequestParams<requestId>, res: Response) => {
    let result = returnByID(req.params.id, POSTS);

    if (result.length > 0) {
      res.status(ERRORS_CODE.OK_200).json(result[0]);
    } else {
      res.status(ERRORS_CODE.NOT_FOUND_404);
    }
  }
);
