import { Request, Response } from 'express';
import { indexMiddleware } from '../middleware/index.middleware';
import blogRouter from './blog.router';
import postRouter from './post.router';
import testingRouter from './testing.router';
import { ERRORS_CODE } from '../data/errors.data';
import { app } from '../index';

app.use(indexMiddleware.JSON_PARSER);
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);
app.use('/testing/all-data', testingRouter);

app.get('/', (req: Request, res: Response) => {
  try {
    res.status(ERRORS_CODE.OK_200).json('Server start!');
  } catch (e) {
    res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
  }
});
