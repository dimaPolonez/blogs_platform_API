import {Router, Request, Response} from 'express';
import {BLOGS} from "../../data/blogs.data";
import {ERRORS_CODE} from '../../data/errors.data';
import {requestId, RequestParams} from '../../models/request.models';
import {returnByID} from "../../services/index.service";

export const blogsRouterPublic = Router({});

blogsRouterPublic.get(
    '/',
    (req: Request, res: Response) => {
        res.json(BLOGS).sendStatus(ERRORS_CODE.OK_200);
    }
);

blogsRouterPublic.get(
    '/:id',
    (req: RequestParams<requestId>, res: Response) => {

        let result = returnByID(req.params.id, BLOGS);

        if (result.length > 0) {
            res.
            json(result).
            sendStatus(ERRORS_CODE.OK_200);
        } else {
            res.
            sendStatus(ERRORS_CODE.NOT_FOUND_404);
        }
    }
);
