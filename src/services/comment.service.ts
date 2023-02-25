import {commentObjectResult, commentReqType} from "../models/comment.models";
import {commentRepository} from "../data/repository/comment.repository";

class CommentService {

    public async getOneComment(commentID: string, userID: string):
        Promise<null | commentObjectResult> {
        const findComment: null | commentObjectResult = await commentRepository.findOneById(commentID, userID)

        if (!findComment) {
            return null
        }

        return findComment
    }

    public async createCommentOfPost(postID: string, commentDTO: commentReqType, userID: string):
        Promise<null | commentObjectResult> {
        const createdComment: null | commentObjectResult = await commentRepository.createCommentOfPost(postID, commentDTO, userID)

        if (!createdComment) {
            return null
        }

        return createdComment
    }

    public async updateComment(commentID: string, commentDTO: commentReqType, userID: string):
        Promise<number> {
        const updatedCommentResult: number = await commentRepository.updateComment(commentID, commentDTO, userID)

        return updatedCommentResult
    }

    public async commentLike(likeDTO: string, commentID: string, userID: string):
        Promise<boolean> {
        const commentLikedResult: boolean = await commentRepository.updateCommentLiked(likeDTO, commentID, userID)

        return commentLikedResult
    }

    public async deleteComment(commentID: string, userID: string):
        Promise<number> {
        const deletedCommentResult: number = await commentRepository.deleteComment(commentID, userID)

        return deletedCommentResult
    }

}

export const commentService = new CommentService()