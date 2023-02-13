import {Response} from 'express';
import blogService from '../services/blog.service';
import {ERRORS_CODE} from "../data/db.data";
import postService from "../services/post.service";
import {ObjectId} from "mongodb";
import {bodyReqType, paramsAndBodyReqType, paramsId, paramsReqType} from "../models/request.models";
import {blogObjectResult, blogReqType} from "../models/blog.models";
import {postObjectResult, postOfBlogReqType} from "../models/post.models";

class blogController {

    async getOne(req: paramsReqType<paramsId>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const blog: false | blogObjectResult = await blogService.getOneBlog(bodyId);

            if (blog) {
                res.status(ERRORS_CODE.OK_200).json(blog);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async create(req: bodyReqType<blogReqType>, res: Response) {
        try {
            const blog: blogObjectResult = await blogService.createNewBlog(req.body);

            if (blog) {
                res.status(ERRORS_CODE.CREATED_201).json(blog);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async update(req: paramsAndBodyReqType<paramsId, blogReqType>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const blog: boolean = await blogService.updateBlog(bodyId, req.body);

            if (blog) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async delete(req: paramsReqType<paramsId>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const blog: boolean = await blogService.deleteBlog(bodyId);

            if (blog) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async createOnePostOfBlog(req: paramsAndBodyReqType<paramsId, postOfBlogReqType>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const post: false | postObjectResult = await postService.createOnePostOfBlog(bodyId, req.body);

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
