import express, {Request, Response} from 'express';
import {ACTIVE_DEVICE, ERRORS_CODE, OBJECT_IP, startBD} from './data/db.data';
import cookieParser from 'cookie-parser';
import {blogRepository} from "./data/repository/blog.repository";
import {postRepository} from "./data/repository/post.repository";
import {userRepository} from "./data/repository/user.repository";
import {commentRepository} from "./data/repository/comment.repository";
import {likeRepository} from "./data/repository/likes.repository";
import {blogRouter} from "./routes/blog.router";
import {postRouter} from "./routes/post.router";
import {userRouter} from "./routes/user.router";
import {commentRouter} from "./routes/comment.router";
import {guardRouter} from "./routes/userSession.routes";
import {userAuthRouter} from "./routes/userAuth.router";


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
app.use('/auth', userAuthRouter)
app.use('/security', guardRouter)

app.get('/', async (req: Request, res: Response) => {
    res.json('Server start!')
})

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    try {
        await blogRepository.deleteAllBlog()
        await postRepository.deleteAllPost()
        await userRepository.deleteAllUser()
        await commentRepository.deleteAllComment()
        await ACTIVE_DEVICE.deleteMany({})
        await OBJECT_IP.deleteMany({})
        await likeRepository.deleteAllLike()

        res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
    }
})
