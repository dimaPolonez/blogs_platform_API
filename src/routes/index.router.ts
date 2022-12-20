import { app } from '../index';
import { indexMiddleware } from '../middleware/index.middleware';
import blogRouter from "./blog.router";
import postRouter from "./post.router";
import testingRouter from "./testing.router";

app.use(indexMiddleware.JSON_PARSER);
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);
app.use('/testing/all-data', testingRouter);
