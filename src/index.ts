import express, {Request, Response} from 'express';
import {ACTIVE_DEVICE, BLOGS, COMMENTS, ERRORS_CODE, LIKES, OBJECT_IP, POSTS, startBD, USERS} from './core/db.data';
import cookieParser from 'cookie-parser';
import blogRouter from "./public/blogs/blog.router";
import postRouter from "./public/posts/post.router";
import userRouter from "./public/users/user.router";
import commentRouter from "./public/comments/comment.router";
import authRouter from "./auth/auth.router";
import guardRouter from "./auth/sessions/sessions.routes";

const PORT = process.env.PORT || 5000

export const app = express()

async function startApp() {

        await startBD()

        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`)
        })
}

startApp()

app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', true)

app.use('/blogs', blogRouter)
app.use('/posts', postRouter)
app.use('/users', userRouter)
app.use('/comments', commentRouter)
app.use('/auth', authRouter)
app.use('/security', guardRouter)

app.get('/', async (req: Request, res: Response) => 
{
    res.json('Server start!')
})

app.delete('/testing/all-data', async (req: Request, res: Response) => 
{
    try {
        await BLOGS.deleteMany({})
        await POSTS.deleteMany({})
        await USERS.deleteMany({})
        await COMMENTS.deleteMany({})
        await ACTIVE_DEVICE.deleteMany({})
        await OBJECT_IP.deleteMany({})
        await LIKES.deleteMany({})

        res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
    }
})
