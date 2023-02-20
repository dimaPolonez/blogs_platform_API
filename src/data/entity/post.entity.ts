import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { postBDType } from "../../models/post.models";

export const postBDSchema =  new Schema<postBDType>({
    title: String,
    shortDescription: String,
    content: String,
    blogId: ObjectId,
    blogName: String,
    createdAt: String,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        newestLikes: [
            {
            addedAt: String,
            userId: ObjectId,
            login: String
            }
        ]
    }
})