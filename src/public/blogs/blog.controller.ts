import {Response} from 'express';
import BlogService from './application/blog.service';
import {ERRORS_CODE} from "../../core/db.data";
import PostService from "../posts/application/post.service";
import {
    BlogObjectResultType,
    BlogReqType,
    BodyReqType,
    ParamsAndBodyReqType,
    ParamsIdType,
    ParamsReqType, PostObjectResultType, PostOfBlogReqType
} from "../../core/models";

class BlogController {

    public async getOneBlog(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
        try {
            const findBlog: null | BlogObjectResultType = await BlogService.getOneBlog(req.params.id)

            if (findBlog) {
                res.status(ERRORS_CODE.OK_200).json(findBlog)
                return
            }
            
            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createBlog(
        req: BodyReqType<BlogReqType>,
        res: Response){
        try {
            const createdBlog: BlogObjectResultType = await BlogService.createNewBlog(req.body)

            res.status(ERRORS_CODE.CREATED_201).json(createdBlog)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updateBlog(
        req: ParamsAndBodyReqType<ParamsIdType, BlogReqType>,
        res: Response
    ){
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

    public async deleteBlog(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
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

    public async createOnePostOfBlog(
        req: ParamsAndBodyReqType<ParamsIdType, PostOfBlogReqType>,
        res: Response
    ){
        try {
            const createdPost: null | PostObjectResultType = await PostService.createOnePostOfBlog(req.params.id, req.body)

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
