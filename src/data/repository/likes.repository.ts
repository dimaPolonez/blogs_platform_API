import {ObjectId} from "mongodb"
import {countObject, likesBDType, myLikeStatus} from "../../models/likes.models"
import {userObjectResult} from "../../models/user.models"
import {LikesModel} from "../entity/likes.entity"
import {userRepository} from "./user.repository";

class LikesRepository {

    public async findOneByIdReturnDoc(likeID: ObjectId) {

        const findLikeSmart = await LikesModel.findOne({_id: likeID})

        return findLikeSmart
    }

    public async findOneById(objectID: ObjectId, userID: string):
        Promise<null | likesBDType> {

        const objectUserId: ObjectId = new ObjectId(userID)

        const findLikeSmart: null | likesBDType = await LikesModel.findOne({
            $and: [
                {"user.userId": objectUserId},
                {"object.typeId": objectID}
            ]
        })

        if (!findLikeSmart) {
            return null
        }

        return findLikeSmart
    }

    public async findLikeArray(postLikeId: ObjectId):
        Promise<[] | likesBDType []> {
        const findLikeArraySmart: null | likesBDType [] = await LikesModel
            .find({
                $and: [
                    {"object.typeId": postLikeId},
                    {"user.myStatus": myLikeStatus.Like}
                ]
            })
            .limit(3)
            .sort({addedAt: -1})

        if (!findLikeArraySmart) {
            return []
        }

        return findLikeArraySmart

    }

    public async createLike(userID: string, object: countObject, myStatus: myLikeStatus) {

        const findUser: null | userObjectResult = await userRepository.findOneById(userID)

        if (!findUser) {
            return false
        }

        await LikesModel.createLike(findUser, object, myStatus)
    }

    public async updateLike(status: myLikeStatus, likeId: ObjectId) {
        await LikesModel.updateLike(status, likeId)
    }

    public async deleteAllLike() {
        await LikesModel.deleteMany({})
    }

    public async save(model: any) {
        return await model.save()
    }

}

export const likeRepository = new LikesRepository()