import {ObjectId} from "mongodb";
import {LIKES} from "../data/db.data";
import {countObject, likesBDType, likesCounter, myLikeStatus} from "../models/likes.models";
import {userBDType} from "../models/user.models";

class likeService {

    public async checked(objectId: ObjectId, userId: ObjectId):
        Promise<false | likesBDType> {
        const result: likesBDType [] = await LIKES.find({
            $and: [
                {"user.userId": userId},
                {"object.typeId": objectId}
            ]
        }).toArray();

        if (result[0]) {
            return result[0]
        } else {
            return false
        }

    }

    private async create(objectLike: likesBDType) {
        await LIKES.insertOne(objectLike)

    }

    private async update(status: string, objectLikeId: ObjectId) {
        await LIKES.updateOne({_id: objectLikeId}, {"user.myStatus": status})
    }

    private async delete(objectLikeId: ObjectId) {
        await LIKES.deleteOne({_id: objectLikeId})
    }

    public async counterLike(likeStatusBody: string, object: countObject, user: userBDType):
        Promise<likesCounter> {
        let addDate: string = new Date().toISOString();
        let result: likesCounter = {
            likesCount: object.likesCount,
            dislikesCount: object.dislikesCount
        };
        let myStatus: string = myLikeStatus[0]

        const find: false | likesBDType = await this.checked(object.typeId, user._id);

        if (find) {
            const likeCaseString = likeStatusBody + find.user.myStatus;

            switch (likeCaseString) {
                case ('LikeLike'):
                    result.likesCount--
                    break
                case ('LikeDislike'):
                    result.likesCount++
                    result.dislikesCount--
                    myStatus = myLikeStatus[1]
                    break
                case ('DislikeLike'):
                    result.likesCount--
                    result.dislikesCount++
                    myStatus = myLikeStatus[2]
                    break
                case ('DislikeDislike'):
                    result.dislikesCount--
                    break
            }

            if (myStatus === myLikeStatus[0]) {
                await this.delete(find._id)
            } else {
                await this.update(myStatus, find._id)
            }

        } else {

            switch (likeStatusBody) {
                case ('Like'):
                    result.likesCount++
                    myStatus = myLikeStatus[1]
                    break

                case ('Dislike'):
                    result.dislikesCount++
                    myStatus = myLikeStatus[2]
                    break
            }

            let objectLike: likesBDType = {
                _id: new ObjectId(),
                user: {
                    userId: user._id,
                    login: user.infUser.login,
                    myStatus: myStatus
                },
                object: {
                    type: object.type,
                    typeId: object.typeId
                },
                addedAt: addDate
            }

            await this.create(objectLike)
        }

        return result
    }

}

export default new likeService();