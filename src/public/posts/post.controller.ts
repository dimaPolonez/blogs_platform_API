import {Response} from 'express';
import PostService from './application/post.service';
import {ERRORS_CODE} from "../../core/db.data";
import CommentService from "../comments/application/comment.service";
import {
    BodyReqType, CommentObjectResultType, LikesReqType,
    ParamsAndBodyReqType,
    ParamsIdType,
    ParamsReqType,
    PostObjectResultType, PostOfBlogReqType,
    PostReqType
} from "../../core/models";

class PostController {

    public async getOnePost(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
        try {
            const post: null | PostObjectResultType = await PostService.getOnePost(req.params.id, req.userId)

            if (post) {
                res.status(ERRORS_CODE.OK_200).json(post)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createPost(
        req: BodyReqType<PostReqType>,
        res: Response
    ){
        try {
            const post: PostObjectResultType = await PostService.createPost(req.body)

            res.status(ERRORS_CODE.CREATED_201).json(post)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updatePost(
        req: ParamsAndBodyReqType<ParamsIdType, PostReqType>,
        res: Response
    ){
        try {
            const updatedPost: boolean = await PostService.updatePost(req.params.id, req.body)

            if (updatedPost) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async likeStatusPost(
        req: ParamsAndBodyReqType<ParamsIdType, LikesReqType>,
        res: Response
    ){
        try {
            const likedPost: boolean = await PostService.postLike(req.body.likeStatus, req.params.id, req.user)

            if (likedPost) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async deletePost(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
        try {
            const deletedPost: boolean = await PostService.deletePost(req.params.id)

            if (deletedPost) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createCommentOfPost(
        req: ParamsAndBodyReqType<ParamsIdType, PostOfBlogReqType>,
        res: Response
    ){
        try {
            const comment: null | CommentObjectResultType = await CommentService.createCommentOfPost(req.params.id, req.body, req.user)

            if (comment) {
                res.status(ERRORS_CODE.CREATED_201).json(comment)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }
}

export default new PostController()
