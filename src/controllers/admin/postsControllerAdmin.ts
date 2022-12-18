import { Router, Request, Response } from 'express';
import {postPostFunc, putPostFunc} from "../../services/post.service";
import {ERRORS_CODE} from "../../data/errors.data";
import {requestId, RequestParams} from "../../models/request.models";
import {returnByID} from "../../services/index.service";
import {POSTS, postsDeleteById} from "../../data/posts.data";
import {indexMiddleware} from "../../middleware/index.middleware";


export const postsRouterAdmin = Router({});

postsRouterAdmin.post(
    '/',indexMiddleware.POSTS_VALIDATOR,indexMiddleware.ERRORS_VALIDATOR,indexMiddleware.BASIC_AUTHORIZATION,
    (req: Request, res: Response) => {

        let result = postPostFunc(req.body);

        res.
        json(result).
        sendStatus(ERRORS_CODE.CREATED_201);

    }
);

postsRouterAdmin.put(
    '/:id',indexMiddleware.POSTS_VALIDATOR,indexMiddleware.ERRORS_VALIDATOR,indexMiddleware.BASIC_AUTHORIZATION,
    (req: RequestParams<requestId>, res: Response) => {

        let resultID = returnByID(req.params.id, POSTS);

        putPostFunc(resultID[0], req.body)

        res.
        sendStatus(ERRORS_CODE.NO_CONTENT_204);

    }
);

postsRouterAdmin.delete(
    '/:id',indexMiddleware.BASIC_AUTHORIZATION,(req: RequestParams<requestId>, res: Response) => {

        let result = postsDeleteById(req.params.id)

        if(result != true) {
            res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
        } else {
            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        }
    }
);




