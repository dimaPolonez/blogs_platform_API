import {Response} from 'express';
import {ERRORS_CODE} from "../data/db.data";
import {bodyReqType, paramsAndBodyReqType, paramsId, paramsReqType} from "../models/request.models";
import {blogObjectResult, blogReqType} from "../models/blog.models";
import {postObjectResult, postOfBlogReqType} from "../models/post.models";
import {blogService} from "../services/blog.service";
import {postService} from "../services/post.service";

class BlogController {

    public async getOneBlog(req: paramsReqType<paramsId>, res: Response) {
        try {
            const findBlog: null | blogObjectResult = await blogService.getOneBlog(req.params.id)

            if (findBlog) {
                res.status(ERRORS_CODE.OK_200).json(findBlog)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createBlog(req: bodyReqType<blogReqType>, res: Response) {
        try {
            const createdBlogId: string = await blogService.createNewBlog(req.body)

            //const createdBlog: blogObjectResult = await blogQuery

            res.status(ERRORS_CODE.CREATED_201).json(createdBlogId)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updateBlog(req: paramsAndBodyReqType<paramsId, blogReqType>, res: Response) {
        try {
            const updatedBlog: boolean = await blogService.updateBlog(req.params.id, req.body)

            if (updatedBlog) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async deleteBlog(req: paramsReqType<paramsId>, res: Response) {
        try {
            const deletedBlog: boolean = await blogService.deleteBlog(req.params.id)

            if (deletedBlog) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createOnePostOfBlog(req: paramsAndBodyReqType<paramsId, postOfBlogReqType>, res: Response) {
        try {
            const createdPost: null | postObjectResult = await postService.createOnePostOfBlog(req.params.id, req.body)

            if (createdPost) {
                res.status(ERRORS_CODE.CREATED_201).json(createdPost)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }
}

export const blogController = new BlogController()
