import {Request, Response} from 'express';
import blogService from '../services/blog.service';
import {ERRORS_CODE} from "../data/db.data";
import postService from "../services/post.service";

class blogController {
    async getAll(req: Request, res: Response) {
        try {
            const blogs = await blogService.getAll();
            res.status(ERRORS_CODE.OK_200).json(blogs);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const blog: object = await blogService.getOne(req.params.id);

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
            const blog = await blogService.update(req.params.id, req.body);

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
            const blog = await blogService.delete(req.params.id);

            if (blog) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async getAllPostsOfBlog(req: Request, res: Response) {
        try {
            const post: object = await postService.getAllPostsOfBlog(req.params.id);

            if (post) {
                res.status(ERRORS_CODE.OK_200).json(post);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async createOnePostOfBlog(req: Request, res: Response) {
        try {
            const post = await postService.createOnePostOfBlog(req.params.id, req.body);

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
