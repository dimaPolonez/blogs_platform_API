import {ObjectId} from "mongodb";
import {commentObjectResult, commentOfPostBDType, commentReqType, commentDTOAll} from "../../models/comment.models";
import {countObject, likesCounter, myLikeStatus} from "../../models/likes.models";
import {postObjectResult} from "../../models/post.models";
import {userObjectResult} from "../../models/user.models";
import {ERRORS_CODE} from "../db.data";
import {CommentModel} from "../entity/comment.entity";
import {likeService} from "../../services/like.service";
import {userRepository} from "./user.repository";
import {postRepository} from "./post.repository";


class CommentRepository {

    public async findOneByIdReturnDoc(commentID: string) {

        const objectCommentID: ObjectId = new ObjectId(commentID)

        const findCommentSmart = await CommentModel.findOne({_id: objectCommentID})

        return findCommentSmart
    }

    public async findOneById(commentID: string, userID: string | null):
        Promise<null | commentObjectResult> {
        const objectCommentID: ObjectId = new ObjectId(commentID)

        const findCommentSmart: null | commentOfPostBDType = await CommentModel.findOne({_id: objectCommentID})

        if (!findCommentSmart) {
            return null
        }

        let likeStatus: myLikeStatus = myLikeStatus.None

        if (userID) {
            const likeStatusChecked = await likeService.checkedLike(findCommentSmart._id, userID)

            if (likeStatusChecked) {
                likeStatus = likeStatusChecked.user.myStatus
            }
        }

        return {
            id: findCommentSmart._id,
            content: findCommentSmart.content,
            commentatorInfo: {
                userId: findCommentSmart.commentatorInfo.userId,
                userLogin: findCommentSmart.commentatorInfo.userLogin,
            },
            createdAt: findCommentSmart.createdAt,
            likesInfo: {
                likesCount: findCommentSmart.likesInfo.likesCount,
                dislikesCount: findCommentSmart.likesInfo.dislikesCount,
                myStatus: likeStatus
            }
        }
    }

    public async createCommentOfPost(postID: string, commentDTO: commentReqType, userID: string):
        Promise<null | commentObjectResult> {
        const userFind: userObjectResult | null = await userRepository.findOneById(userID)

        if (!userFind) {
            return null
        }

        const postFind: null | postObjectResult = await postRepository.findOneById(postID, null)

        if (!postFind) {
            return null
        }

        const commentDTOAll: commentDTOAll = {
            content: commentDTO.content,
            commentatorInfo: {
                userId: userID,
                userLogin: userFind.login
            },
            postId: postID
        }

        const newCommentSmart = await CommentModel.createComment(commentDTOAll)

        return {
            id: newCommentSmart._id,
            content: newCommentSmart.content,
            commentatorInfo: {
                userId: userID,
                userLogin: userFind.login
            },
            createdAt: newCommentSmart.createdAt,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myLikeStatus.None
            }
        }

    }

    public async updateComment(commentID: string, commentDTO: commentReqType, userID: string):
        Promise<number> {

        const findComment: null | commentObjectResult = await this.findOneById(commentID, null)

        if (!findComment) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (!(findComment.commentatorInfo.userId.toString() === userID.toString())) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        CommentModel.updateComment(commentID, commentDTO)

        return ERRORS_CODE.NO_CONTENT_204
    }

    public async updateCommentLiked(likeDTO: string, commentID: string, userID: string):
        Promise<boolean> {
        const findComment: commentObjectResult | null = await this.findOneById(commentID, userID)

        if (!findComment) {
            return false
        }

        const likesInfoComment: countObject = {
            typeId: findComment.id,
            type: 'comment',
            likesCount: findComment.likesInfo.likesCount,
            dislikesCount: findComment.likesInfo.dislikesCount
        }

        const newObjectLikes: likesCounter = await likeService.counterLike(likeDTO, likesInfoComment, userID)

        const updatedPostResult: boolean = CommentModel.updateCommentLiked(commentID, newObjectLikes)

        return updatedPostResult

    }

    public async deleteComment(commentID: string, userID: string):
        Promise<number> {

        const findComment: null | commentObjectResult = await this.findOneById(commentID, null)

        if (!findComment) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (!(findComment.commentatorInfo.userId.toString() === userID.toString())) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        CommentModel.deleteOne({_id: findComment.id})

        return ERRORS_CODE.NO_CONTENT_204
    }

    public async deleteAllComment() {
        await CommentModel.deleteMany({})
    }

    public async save(model: any) {
        return await model.save()
    }

}

export const commentRepository = new CommentRepository()