import { app } from '../index';
import { blogRouter } from './blog.router';
import { postRouter } from './post.router';
import { testingRouter } from './testing.router';
import { indexMiddleware } from '../middleware/index.middleware';

app.use(indexMiddleware.JSON_PARSER);
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);
app.use('/testing/all-data', testingRouter);
