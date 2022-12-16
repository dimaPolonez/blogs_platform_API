import {Router, Request, Response} from 'express';
import {ERRORS_CODE, ERRORS_TEXT} from '../../data/errors.data';
import {blogsFieldsType} from '../../models/data.models';
import {requestId} from '../../models/request.models';
import {RequestParams} from '../../models/request.models';
import {ResponseBody} from '../../models/response.models';
import {returnByID} from '../../services/blogsService';
import {BLOGS} from "../../data/blogs.data";

export const blogsRouterPublic = Router({});

blogsRouterPublic.get(
    '/',
    (req: Request, res: ResponseBody<blogsFieldsType>) => {
        const allBlogs: any = BLOGS;
        res.json(allBlogs).sendStatus(ERRORS_CODE.OK_200);
    }
);

blogsRouterPublic.get(
    '/:id',
    (req: RequestParams<requestId>, res: Response) => {

        let result = returnByID(req.params.id);

        if (result) {
            res.json(result).sendStatus(ERRORS_CODE.OK_200);
        } else {
            res.json(ERRORS_TEXT.NOT_FOUND_404).sendStatus(ERRORS_CODE.NOT_FOUND_404);
        }
    }
);
