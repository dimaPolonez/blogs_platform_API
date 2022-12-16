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
import { BLOGS } from '../data/blogs.data';
import { POSTS } from '../data/posts.data';

app.use(indexMiddleware.JSON_PARSER);

app.get('/', (req: Request, res: ResponseBody<ResponseJson>) => {
  res.json('Hello, server start!').sendStatus(ERRORS_CODE.OK_200);
});

app.use('/blogs', blogsRouterPublic);
app.use('/posts', postsRouterPublic);
app.use('/posts', postsRouterAdmin);
app.use('/blogs', blogsRouterAdmin);

app.delete(
  '/testing/all-data',
  (req: Request, res: ResponseBody<ResponseJson>) => {
    BLOGS.length = 0;
    POSTS.length = 0;

    res.json('All data is deleted').sendStatus(ERRORS_CODE.NO_CONTENT_204);
  }
);

/*
app.post('/hometask_01/api/videos', (req: Request, res: Response) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    let keyAvai = 0;

    availableResolutions.forEach((a: string) => {
        if (arrayType.includes(a) === false) {
            keyAvai++;
        }
    })


    errorsArray = [];

    if (!title || !title.trim() || typeof title !== "string" || title.length > 40) {
        errorsArray.push(errTitle);
    }

    if (!author || !author.trim() || typeof author !== "string" || author.length > 20) {
        errorsArray.push(errAuthor);
    }

    if (keyAvai > 0) {
        errorsArray.push(errResolutions);
    }


    if (errorsArray.length > 0) {
        errors = { errorsMessages: errorsArray};
        res
            .status(400)
            .json(errors)
        return;
    }


    const newVideo = {
        id: +(newDate),
        title: req.body.title, author: req.body.author,
        canBeDownloaded: false, minAgeRestriction: null,
        createdAt: newDateCreated,
        publicationDate: newDatePublic,
        availableResolutions: req.body.availableResolutions
    }

    bdVideos.push(newVideo)

    res
        .status(201)
        .json(newVideo)
})

app.get('/hometask_01/api/videos', (req: Request, res: Response) => {
    res.json(bdVideos)
})

app.get('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
    const findId = bdVideos.find(v => v.id === +req.params.id)

    if (!findId) {
        res.sendStatus(404)
        return;
    }

    res.json(findId)
})

app.put('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
    errorsArray = [];
    let findId = bdVideos.find(v => v.id === +req.params.id)

    if (!findId) {
        res.sendStatus(404)
        return;
    }

    const title = req.body.title;
    const author = req.body.author;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = req.body.publicationDate;

    if (!title || !title.trim() || typeof title !== "string" || title.length > 40) {
        errorsArray.push(errTitle);
    }

    if (!author || !author.trim() || typeof author !== "string" || author.length > 20) {
        errorsArray.push(errAuthor);
    }

    if (typeof canBeDownloaded != "boolean") {
        errorsArray.push(errCanBeDownloaded);
    }

    if (typeof minAgeRestriction != "number" || minAgeRestriction < 1 || minAgeRestriction > 18) {
        errorsArray.push(errMinAgeRestriction);
    }

    if (typeof publicationDate != "string") {
        errorsArray.push(errPublicationDate);
    }

    if (errorsArray.length > 0) {
        errors = { errorsMessages: errorsArray};
        res
            .status(400)
            .json(errors)
        return;
    }

    findId.title = req.body.title
    findId.author = req.body.author
    findId.availableResolutions = req.body.availableResolutions
    findId.canBeDownloaded = req.body.canBeDownloaded
    findId.minAgeRestriction = req.body.minAgeRestriction
    findId.publicationDate = req.body.publicationDate
    res.sendStatus(204)
})

app.delete('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
    let findId = bdVideos.find(v => v.id === +req.params.id)

    if (!findId) {
        res.sendStatus(404)
        return;
    }

    bdVideos = bdVideos.filter(v => v.id !== +req.params.id)

    res.sendStatus(204)
})

*/
