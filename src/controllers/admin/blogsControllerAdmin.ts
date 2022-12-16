import { Router, Request, Response } from 'express';
import {postBlogFunc} from "../../services/blogsService";
import {ERRORS_CODE} from "../../data/errors.data";
import {blogsRouterPublic} from "../public/blogsControllerPublic";


export const blogsRouterAdmin = Router({});

blogsRouterPublic.post(
    '/',
    (req: Request, res: Response) => {

        let result = postBlogFunc(req.body);

        res.
            json(result).
            sendStatus(ERRORS_CODE.OK_200);

    }
);