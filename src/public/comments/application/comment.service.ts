import {ERRORS_CODE} from "../../../core/db.data";
import LikeService from "../../../helpers/like.service";
import {
    CommentOfPostBDType,
    CommentReqType, CountObjectType,
    LikesCounterType,
    UserBDType
} from "../../../core/models";
import CommentRepository from "../repository/comment.repository";

class CommentService {

    public async updateComment(
        commentId: string,
        body: CommentReqType,
        userObject: UserBDType
    ):Promise<number>{

        const findComment: CommentOfPostBDType | null = await CommentRepository.findOne(commentId)

        if (!findComment) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (findComment.commentatorInfo.userId.toString() !== userObject._id.toString()) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await CommentRepository.updateComment(commentId, body.content)
        return ERRORS_CODE.NO_CONTENT_204
    }

    public async commentLike(
        likeStatus: string,
        commentId: string,
        user: UserBDType
    ):Promise<boolean>{
        const findComment: CommentOfPostBDType | null = await CommentRepository.findOne(commentId)

        if (!findComment) {
            return false
        }

        const likesInfoComment: CountObjectType = {
            typeId: findComment._id,
            type: 'comment',
            likesCount: findComment.likesInfo.likesCount,
            dislikesCount: findComment.likesInfo.dislikesCount
        }

        const newObjectLikes: LikesCounterType = await LikeService.counterLike(likeStatus, likesInfoComment, user)

        await CommentRepository.updateLikesCount(commentId, newObjectLikes)
        return true
    }

    public async deleteComment(
        commentId: string,
        userObject: UserBDType
    ):Promise<number>{
        const findComment: CommentOfPostBDType | null = await CommentRepository.findOne(commentId)

        if (!findComment) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (findComment.commentatorInfo.userId.toString() !== userObject._id.toString()) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await CommentRepository.deleteComment(commentId)
        return ERRORS_CODE.NO_CONTENT_204
    }
}

export default new CommentService()