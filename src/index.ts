import express, {Request, Response} from 'express';
import {ACTIVE_DEVICE, ERRORS_CODE, LIKES, OBJECT_IP, startBD, USERS} from './data/db.data';
import blogRouter from './routes/blog.router';
import postRouter from './routes/post.router';
import userRouter from "./routes/user.router";
import authRouter from "./routes/auth.router";
import commentRouter from "./routes/comment.router";
import cookieParser from 'cookie-parser';
import guardRouter from "./routes/quard.routes";
import BlogRepository from './data/repository/blog.repository';
import PostRepository from './data/repository/post.repository';
import CommentRepository from './data/repository/comment.repository';

const PORT = process.env.PORT || 5000

export const app = express()

async function startApp() {

        await startBD()

        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Example app listening on port ${PORT}`)
            })
          }
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
        await BlogRepository.deleteAllBlog()
        await PostRepository.deleteAllPost()
        await USERS.deleteMany({})
        await CommentRepository.deleteAllComment()
        await ACTIVE_DEVICE.deleteMany({})
        await OBJECT_IP.deleteMany({})
        await LIKES.deleteMany({})

        res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
    }
})
