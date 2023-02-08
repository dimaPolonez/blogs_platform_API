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

    public async counterLike(likeStatusBody: string, object: countObject, user: userBDType):
        Promise<likesCounter> {
        let addDate: string = new Date().toISOString();
        let result: likesCounter = {
            likesCount: object.likesCount,
            dislikesCount: object.dislikesCount
        };
        let myStatus: myLikeStatus = myLikeStatus.None

        const findLike: false | likesBDType = await this.checked(object.typeId, user._id);

        if (findLike) {
            const likeCaseString = likeStatusBody + findLike.user.myStatus;

            switch (likeCaseString) {
                case ('LikeLike'):
                    result.likesCount--
                    break
                case ('LikeDislike'):
                    result.likesCount++
                    result.dislikesCount--
                    myStatus = myLikeStatus.Like
                    break
                case ('DislikeLike'):
                    result.likesCount--
                    result.dislikesCount++
                    myStatus = myLikeStatus.Dislike
                    break
                case ('DislikeDislike'):
                    result.dislikesCount--
                    break
                case ('NoneDislike'):
                    result.dislikesCount--
                    break
                case ('NoneLike'):
                    result.likesCount--
                    break
            }

            await this.update(myStatus, findLike._id)

        } else {

            switch (likeStatusBody) {
                case ('Like'):
                    result.likesCount++
                    myStatus = myLikeStatus.Like
                    break

                case ('Dislike'):
                    result.dislikesCount++
                    myStatus = myLikeStatus.Dislike
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