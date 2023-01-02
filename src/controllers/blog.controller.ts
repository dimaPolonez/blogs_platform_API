import {Request, Response} from 'express';
import blogService from '../services/blog.service';
import {ERRORS_CODE} from "../data/db.data";
import postService from "../services/post.service";
import {ObjectId} from "mongodb";

class blogController {

    async getOne(req: Request, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const blog: object = await blogService.getOne(bodyId);

            if (blog) {
                res.status(ERRORS_CODE.OK_200).json(blog);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const blog = await blogService.create(req.body);

            if (blog) {
                res.status(ERRORS_CODE.CREATED_201).json(blog);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const blog = await blogService.update(bodyId, req.body);

            if (blog) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const blog = await blogService.delete(bodyId);

            if (blog) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async createOnePostOfBlog(req: Request, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const post = await postService.createOnePostOfBlog(bodyId, req.body);

            if (post) {
                res.status(ERRORS_CODE.CREATED_201).json(post);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }
}

export default new blogController();
