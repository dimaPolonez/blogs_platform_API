import {Response} from 'express';
import BlogService from '../services/blog.service';
import {ERRORS_CODE} from "../data/db.data";
import PostService from "../services/post.service";
import {bodyReqType, paramsAndBodyReqType, paramsId, paramsReqType} from "../models/request.models";
import {blogObjectResult, blogReqType} from "../models/blog.models";
import {postObjectResult, postOfBlogReqType} from "../models/post.models";

class BlogController {

    public async getOneBlog(req: paramsReqType<paramsId>, res: Response) 
    {
        try {
            const findBlog: null | blogObjectResult = await BlogService.getOneBlog(req.params.id)

            if (findBlog) {
                res.status(ERRORS_CODE.OK_200).json(findBlog)
                return
            }
            
            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createBlog(req: bodyReqType<blogReqType>, res: Response) 
    {
        try {
            const createdBlog: blogObjectResult = await BlogService.createNewBlog(req.body)

            res.status(ERRORS_CODE.CREATED_201).json(createdBlog)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updateBlog(req: paramsAndBodyReqType<paramsId, blogReqType>, res: Response) 
    {
        try {
            const updatedBlog: boolean = await BlogService.updateBlog(req.params.id, req.body)

            if (updatedBlog) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async deleteBlog(req: paramsReqType<paramsId>, res: Response) 
    {
        try {
            const deletedBlog: boolean = await BlogService.deleteBlog(req.params.id)

            if (deletedBlog) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createOnePostOfBlog(req: paramsAndBodyReqType<paramsId, postOfBlogReqType>, res: Response) 
    {
        try {
            const createdPost: null | postObjectResult = await PostService.createOnePostOfBlog(req.params.id, req.body)

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

export default new BlogController()
