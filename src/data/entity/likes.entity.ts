import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { likesBDType} from "../../models/likes.models";

export const likesBDSchema =  new Schema<likesBDType>({
    user: {
        userId: ObjectId,
        login: String,
        myStatus: ['None', 'Like', 'Dislike']
    },
    object: {
        typeId: ObjectId,
        type: String
    },
    addedAt: String
})