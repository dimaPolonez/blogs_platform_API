import {Router, Request, Response} from 'express';
import {postBlogFunc, putBlogFunc} from "../../services/blogs.service";
import {ERRORS_CODE} from "../../data/errors.data";
import {requestId, RequestParams} from "../../models/request.models";
import {returnByID} from "../../services/index.service";
import {BLOGS, blogsDeleteById} from "../../data/blogs.data";
import {indexMiddleware} from "../../middleware/index.middleware";

export const blogsRouterAdmin = Router({});



blogsRouterAdmin.post(
    '/',indexMiddleware.BASIC_AUTHORIZATION,indexMiddleware.BLOGS_VALIDATOR,indexMiddleware.ERRORS_VALIDATOR,
    (req: Request, res: Response) => {

        let result = postBlogFunc(req.body);

        res
            .json(result)
            .sendStatus(201);

    }
);

blogsRouterAdmin.put(
    '/:id',indexMiddleware.BASIC_AUTHORIZATION,indexMiddleware.BLOGS_VALIDATOR,indexMiddleware.ERRORS_VALIDATOR,
    (req: RequestParams<requestId>, res: Response) => {

        let resultID = returnByID(req.params.id, BLOGS);

        if (resultID.length > 0) {
            putBlogFunc(resultID[0], req.body)
            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        } else {
            res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
        }
    }
);

blogsRouterAdmin.delete(
    '/:id',indexMiddleware.BASIC_AUTHORIZATION,(req: RequestParams<requestId>, res: Response) => {

        let result = blogsDeleteById(req.params.id)

        if(result != true) {
            res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
        } else {
            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        }

    }
);