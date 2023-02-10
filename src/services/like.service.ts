import {ObjectId} from "mongodb";
import {LIKES} from "../data/db.data";
import {countObject, likesBDType, likesCounter, myLikeStatus, newestLikes} from "../models/likes.models";
import {userBDType} from "../models/user.models";

class likeService {

    public async checked(objectId: ObjectId, userId: ObjectId):
        Promise<null | likesBDType> {

        const findUserLike: likesBDType | null = await LIKES.findOne({
            $and: [
                {"user.userId": userId},
                {"object.typeId": objectId}
            ]
        })

        if (!findUserLike) {
            return null
        } 
        
        return findUserLike
    }

    private async create(objectLike: likesBDType) {
        await LIKES.insertOne(objectLike)
    }

    private async update(status: myLikeStatus, objectLikeId: ObjectId) {
        await LIKES.updateOne({_id: objectLikeId}, {
            $set:{
                "user.myStatus": status
            }})
        
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
                    myStatus = myLikeStatus.Like
                    break
                case ('LikeDislike'):
                    result.likesCount++
                    result.dislikesCount--
                    myStatus = myLikeStatus.Like
                    break
                case ('LikeNone'):
                    result.likesCount++
                    myStatus = myLikeStatus.Like
                    break
                case ('DislikeLike'):
                    result.likesCount--
                    result.dislikesCount++
                    myStatus = myLikeStatus.Dislike
                    break
                case ('DislikeNone'):
                    result.dislikesCount++
                    myStatus = myLikeStatus.Dislike
                    break
                case ('DislikeDislike'):
                    myStatus = myLikeStatus.Dislike
                    break
                case ('NoneDislike'):
                    result.dislikesCount--
                    myStatus = myLikeStatus.None
                    break
                case ('NoneLike'):
                    result.likesCount--
                    myStatus = myLikeStatus.None
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

    public async threeUser(postLikeId: ObjectId):
        Promise<likesBDType [] | null>
    
    {
        const likeUserArray: likesBDType [] =  await LIKES.find({
            $and: [
                {"object.typeId": postLikeId},
                {"user.myStatus": myLikeStatus.Like}
                ]
        
        }).limit(3).sort({addedAt: -1}).toArray();

        if (likeUserArray.length === 0) {
            return null
        }

        return likeUserArray
    }

    public async userLikeMaper(objectId: ObjectId):
        Promise<newestLikes[] | null>
    {
                const threeUserArray: likesBDType [] | null =  await this.threeUser(objectId)

                if (!threeUserArray) {
                    return null
                }

                const allLikeUserMapping: newestLikes [] = threeUserArray.map((fieldLikeUser: likesBDType) => {

                return {    
                        addedAt: fieldLikeUser.addedAt,
                        userId: fieldLikeUser.user.userId,
                        login: fieldLikeUser.user.login
                    }})

                return allLikeUserMapping
    }
}

export default new likeService();