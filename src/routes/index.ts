import { app } from './server';

import { Request, Response } from 'express';
import { indexMiddleware } from '../middleware/index.middleware';
import { ResponseBody } from '../models/response.models';
import { ResponseJson } from '../models/response.models';
import { ERRORS_CODE } from '../data/errors.data';
import { blogsRouterPublic } from '../controllers/public/blogsControllerPublic';
import { postsRouterPublic } from '../controllers/public/postsControllerPublic';
import { postsRouterAdmin } from '../controllers/admin/postsControllerAdmin';
import { blogsRouterAdmin } from '../controllers/admin/blogsControllerAdmin';
import {allDeleteBase} from "../services/index.service";

app.use(indexMiddleware.JSON_PARSER);

app.get('/', (req: Request, res: ResponseBody<ResponseJson>) => {
  res.sendStatus(ERRORS_CODE.OK_200);
});

app.use('/blogs', blogsRouterPublic);
app.use('/posts', postsRouterPublic);
app.use('/posts', postsRouterAdmin);
app.use('/blogs', blogsRouterAdmin);

app.delete(
  '/testing/all-data',
  (req: Request, res: ResponseBody<ResponseJson>) => {

    allDeleteBase()
    res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
  }
);

