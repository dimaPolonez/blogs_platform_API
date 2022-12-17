import {Router, Request, Response} from 'express';
import {postBlogFunc, putBlogFunc} from "../../services/blogs.service";
import {ERRORS_CODE} from "../../data/errors.data";
import {blogsRouterPublic} from "../public/blogsControllerPublic";
import {requestId, RequestParams} from "../../models/request.models";
import {returnByID} from "../../services/index.service";
import {BLOGS, blogsDeleteById} from "../../data/blogs.data";


export const blogsRouterAdmin = Router({});

blogsRouterPublic.post(
    '/',
    (req: Request, res: Response) => {

        let result = postBlogFunc(req.body);

        res.json(result).sendStatus(ERRORS_CODE.OK_200);

    }
);

blogsRouterPublic.put(
    '/:id',
    (req: RequestParams<requestId>, res: Response) => {

        let resultID = returnByID(req.params.id, BLOGS);

        putBlogFunc(resultID[0], req.body)

        res.sendStatus(ERRORS_CODE.OK_200);

    }
);

blogsRouterPublic.delete(
    '/:id',
    (req: RequestParams<requestId>, res: Response) => {

        blogsDeleteById(req.params.id)

        res.sendStatus(ERRORS_CODE.NO_CONTENT_204);

    }
);