import express, {Request, Response} from 'express'
import {startBD} from "./data/db.data";
import blogRouter from "./routes/blog.router";
import postRouter from "./routes/post.router";
import {allDeleteBase} from "./services/index.service";
import {ERRORS_CODE} from "./data/errors.data";


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

startApp();

app.use(express.json());

app.use('/blogs', blogRouter);
app.use('/posts', postRouter);

app.get('/', (req: Request, res: Response) => {
    res.json('Server start!')
})

app.delete(
    '/testing/all-data', (req: Request, res: Response) => {
        allDeleteBase();
        res.status(ERRORS_CODE.NO_CONTENT_204);
    }
);
