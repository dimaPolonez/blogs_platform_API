import { Router, Request, Response } from 'express';
import {postPostFunc, putPostFunc} from "../../services/post.service";
import {ERRORS_CODE} from "../../data/errors.data";
import {postsRouterPublic} from "../public/postsControllerPublic";
import {requestId, RequestParams} from "../../models/request.models";
import {returnByID} from "../../services/index.service";
import {POSTS, postsDeleteById} from "../../data/posts.data";


export const postsRouterAdmin = Router({});

postsRouterPublic.post(
    '/',
    (req: Request, res: Response) => {

        let result = postPostFunc(req.body);

        res.
        json(result).
        sendStatus(ERRORS_CODE.OK_200);

    }
);

postsRouterPublic.put(
    '/:id',
    (req: RequestParams<requestId>, res: Response) => {

        let resultID = returnByID(req.params.id, POSTS);

        putPostFunc(resultID[0], req.body)

        res.
        sendStatus(ERRORS_CODE.OK_200);

    }
);

postsRouterPublic.delete(
    '/:id',
    (req: RequestParams<requestId>, res: Response) => {

        postsDeleteById(req.params.id)

        res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
    }
);




