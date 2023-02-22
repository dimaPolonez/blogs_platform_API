import { ObjectId } from "mongodb";
import mongoose, { Model, Schema } from "mongoose";
import { countObject, likesBDType, myLikeStatus} from "../../models/likes.models";
import { userObjectResult } from "../../models/user.models";
import LikesRepository from "../repository/likes.repository";

type LikesStaticType = Model<likesBDType> & {
    createLike(findUser: userObjectResult, object: countObject, myStatus: myLikeStatus): any,
    updateLike(status: myLikeStatus, objectLikeId: ObjectId): boolean
}

export const likesBDSchema =  new Schema<likesBDType, LikesStaticType>({
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


likesBDSchema.static({async createLike(findUser: userObjectResult, object: countObject, myStatus: myLikeStatus):
    Promise<any> {

    const newLikeSmart = new LikesModel({
        user: {
            userId: findUser.id,
            login: findUser.login,
            myStatus: myStatus
        },
        object: {
            typeId: object.typeId,
            type: object.type
        },
        addedAt: new Date().toISOString()
    })

    await LikesRepository.save(newLikeSmart)
}
})

likesBDSchema.static({async updateLike(status: myLikeStatus, likeID: ObjectId):
Promise<boolean> {

const findLikesDocument = await LikesRepository.findOneByIdReturnDoc(likeID)

if (!findLikesDocument) {
    return false
}

findLikesDocument.user.myStatus = status

await LikesRepository.save(findLikesDocument)

return true

}
})


export const LikesModel = mongoose.model<likesBDType, LikesStaticType>('likes', likesBDSchema)