import { ObjectId } from "mongodb";
import mongoose, { Model, Schema } from "mongoose";
import { commentDTOAll, commentOfPostBDType, commentReqType } from "../../models/comment.models";
import { myLikeStatus } from "../../models/likes.models";
import CommentRepository from "../repository/comment.repository";

type CommentStaticType = Model<commentOfPostBDType> & {
    createComment(commentDTO: commentDTOAll): any,
    updateComment(commentID: string, commentDTO: commentReqType): boolean
}

export const commentOfPostBDSchema =  new Schema<commentOfPostBDType, CommentStaticType>({
    content: String,
    commentatorInfo: {
        userId: ObjectId,
        userLogin: String
    },
    postId: String,
    createdAt: String,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String}
})

commentOfPostBDSchema.static({async createComment(commentDTO: commentDTOAll):
    Promise<any> {

    const newCommentSmart = new CommentModel({
        content: commentDTO.content,
        commentatorInfo: {
            userId: commentDTO.commentatorInfo.userId,
            userLogin: commentDTO.commentatorInfo.userLogin
        },
        postId: commentDTO.postId,
        createdAt: new Date().toISOString(),
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: myLikeStatus.None
        }
    })

    await CommentRepository.save(newCommentSmart)

    return newCommentSmart
}
})

commentOfPostBDSchema.static({async updateComment(commentID: string, commentDTO: commentReqType):
Promise<boolean> {

    const findCommentDocument = await CommentRepository.findOneByIdReturnDoc(commentID)

    if (!findCommentDocument) {
        return false
    }

    findCommentDocument.content = commentDTO.content

    await CommentRepository.save(findCommentDocument)

    return true
}
})

export const CommentModel = mongoose.model<commentOfPostBDType, CommentStaticType>('comments', commentOfPostBDSchema)