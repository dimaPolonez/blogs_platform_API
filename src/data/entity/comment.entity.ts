import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { commentOfPostBDType } from "../../models/comment.models";

export const commentOfPostBDSchema =  new Schema<commentOfPostBDType>({
    content: String,
    commentatorInfo: {
        userId: ObjectId,
        userLogin: String
    },
    postId: ObjectId,
    createdAt: String,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String}
})