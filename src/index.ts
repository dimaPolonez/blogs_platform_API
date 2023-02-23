import express, {Request, Response} from 'express';
import {ERRORS_CODE, startBD} from './data/db.data';
import userRouter from "./routes/user.router";
import authRouter from "./routes/auth.router";
import cookieParser from 'cookie-parser';
import guardRouter from "./routes/quard.routes";
import { userRepository } from './data/repository/user.repository';
import { ipGuardRepository } from './data/repository/ipGuard.repository';


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

//app.use('/blogs', blogRouter)
//app.use('/posts', postRouter)
app.use('/users', userRouter)
//app.use('/comments', commentRouter)
app.use('/auth', authRouter)
app.use('/security', guardRouter)

app.get('/', async (req: Request, res: Response) => 
{
    res.json('Server start!')
})

app.delete('/testing/all-data', async (req: Request, res: Response) => 
{
    try {
        //await BlogRepository.deleteAllBlog()
        //await PostRepository.deleteAllPost()
        await userRepository.deleteAllUser()
        //await CommentRepository.deleteAllComment()
        await ipGuardRepository.deleteAllUser()
        //await LikesRepository.deleteAllLike()

        res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
    }
})
