import express, {Request, Response} from 'express';
import {BLOGS, ERRORS_CODE, POSTS, startBD, USERS} from './data/db.data';
import blogRouter from './routes/blog.router';
import postRouter from './routes/post.router';
import userRouter from "./routes/user.router";
import {indexMiddleware} from "./middleware/index.middleware";
import userService from "./services/user.service";

const PORT = process.env.PORT || 5000;

export const app = express();

async function startApp() {
    try {
        await startBD();
        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

startApp()

app.use(express.json());

app.use('/users', userRouter);
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);

app.get('/', (req: Request, res: Response) => {
    res.json('Server start!');
});

app.post('/auth/login',
    indexMiddleware.USER_AUTH,
    indexMiddleware.ERRORS_VALIDATOR,
    async (req: Request, res: Response) => {
        try {
            const auth = await userService.auth(req.body)

            if (auth) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    });

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    try {
        await BLOGS.deleteMany({});
        await POSTS.deleteMany({});
        await USERS.deleteMany({});
        res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
});
