import {Response} from 'express';
import BlogService from './application/blog.service';
import {ERRORS_CODE} from "../../core/db.data";
import {
    BlogObjectResultType,
    BlogReqType,
    BodyReqType,
    NotStringQueryReqPagOfSearchNameType, NotStringQueryReqPagType,
    ParamsAndBodyReqType,
    ParamsAndQueryReqType,
    ParamsIdType,
    ParamsReqType,
    PostObjectResultType,
    PostOfBlogReqType,
    QueryReqPagOfSearchNameType,
    QueryReqPagType,
    QueryReqType,
    ResultBlogObjectType, ResultPostObjectType
} from "../../core/models";
import BlogQueryRepository from "./repository/blog.query-repository";
import PostQueryRepository from "../posts/repository/post.query-repository";

class BlogController {

    public async getOneBlog(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
        try {
            const findBlog: BlogObjectResultType | null = await BlogQueryRepository.getOneBlog(req.params.id)

            if (findBlog) {
                res.status(ERRORS_CODE.OK_200).json(findBlog)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async getAllBlog(
        req: QueryReqType<QueryReqPagOfSearchNameType>,
        res: Response
    ){
        try {
            let queryAll: NotStringQueryReqPagOfSearchNameType = {
                searchNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : '',
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            }

            const allBlogs: ResultBlogObjectType = await BlogQueryRepository.getAllBlogs(queryAll)

            res.status(ERRORS_CODE.OK_200).json(allBlogs)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createBlog(
        req: BodyReqType<BlogReqType>,
        res: Response){
        try {
            const createdBlog: string = await BlogService.createNewBlog(req.body)

            const newBlog: BlogObjectResultType | null = await BlogQueryRepository.getOneBlog(createdBlog)

            if (newBlog){
                res.status(ERRORS_CODE.CREATED_201).json(newBlog)
                return
            }
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
            const createdPostId: string | null = await
                BlogService.createOnePostOfBlog(req.params.id, req.body)

            if (createdPostId) {
                const createdPost: PostObjectResultType | null = await
                    PostQueryRepository.getOnePost(createdPostId)

                res.status(ERRORS_CODE.CREATED_201).json(createdPost)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async getAllPostsOfBlog(
        req: ParamsAndQueryReqType<ParamsIdType, QueryReqPagType>,
        res: Response
    ){
    try {
        let queryAll: NotStringQueryReqPagType = {
            sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
            sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10
        }

        const findBlog: BlogObjectResultType | null = await BlogQueryRepository.getOneBlog(req.params.id)

        if (findBlog) {
            const allPosts: ResultPostObjectType = await
                PostQueryRepository.getAllPostsOfBlog(req.params.id, queryAll, req.userId)

            res.status(ERRORS_CODE.OK_200).json(allPosts)
            return
        }

        res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
    }
    }
}

export default new BlogController()
