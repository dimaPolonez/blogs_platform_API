import {ERRORS_CODE} from "../data/db.data";
import {ObjectId} from "mongodb";
import {commentObjectResult, commentOfPostBDType, commentReqType} from "../models/comment.models";
import {userBDType} from "../models/user.models";
import {postBDType, postOfBlogReqType} from "../models/post.models";
import {countObject, likesBDType, likesCounter, myLikeStatus} from "../models/likes.models";
import LikeService from "./like.service";
import { PostModel } from "../data/entity/post.entity";
import CommentRepository from "../data/repository/comment.repository";

class CommentService {

    public async getOneComment(commentID: string, userID: ObjectId | null):
        Promise<null | commentObjectResult> 
    {
        const findComment: null | commentObjectResult = await CommentRepository.findOneById(commentID, userID)

        if (!findComment) {
            return null
        }

        return findComment
    }

    public async createCommentOfPost(postID: string, commentDTO: commentReqType, userID: ObjectId):
        Promise<null | commentObjectResult> 
    {
        const createdComment: null | commentObjectResult = await CommentRepository.createCommentOfPost(postID, commentDTO, userID)

        if (!createdComment) {
            return null
        }

        return createdComment    
    }

    public async updateComment(commentID: string, commentDTO: commentReqType, userID: ObjectId):
        Promise<number> 
    {
        const updatedCommentResult: number = await CommentRepository.updateComment(commentID, commentDTO, userID)

        return updatedCommentResult
    }

    public async commentLike(likeStatus: string, commentURIId: string, user: userBDType):
        Promise<boolean> 
    {
        const bodyID: ObjectId = new ObjectId(commentURIId)

        /*const findComment: null | commentOfPostBDType = await this.findComment(bodyID)

        if (!findComment) {
            return false
        }

        const likesInfoComment: countObject = {
            typeId: findComment._id,
            type: 'comment',
            likesCount: findComment.likesInfo.likesCount,
            dislikesCount: findComment.likesInfo.dislikesCount
        }

        const newObjectLikes: likesCounter = await LikeService.counterLike(likeStatus, likesInfoComment, user)

        await COMMENTS.updateOne({_id: bodyID}, {
            $set: {
                "likesInfo.likesCount": newObjectLikes.likesCount,
                "likesInfo.dislikesCount": newObjectLikes.dislikesCount,
            }
        })
    */
        return true
    }

    public async deleteComment(commentID: string, userID: ObjectId):
        Promise<number> 
    {
        const deletedCommentResult: number = await CommentRepository.deleteComment(commentID, userID)

        return deletedCommentResult
    }

}

export default new CommentService()