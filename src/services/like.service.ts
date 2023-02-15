import {ObjectId} from "mongodb";
import {LIKES} from "../data/db.data";
import {countObject, likesBDType, likesCounter, myLikeStatus, newestLikes} from "../models/likes.models";
import {userBDType} from "../models/user.models";

class LikeService {

    public async checkedLike(objectId: ObjectId, userId: ObjectId):
        Promise<null | likesBDType> 
    {

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

    private async createLike(user: userBDType, object: countObject, likeStatus: myLikeStatus) 
    {
        await LIKES.insertOne({
                                _id: new ObjectId(),
                                user: {
                                    userId: user._id,
                                    login: user.infUser.login,
                                    myStatus: likeStatus
                                },
                                object: {
                                    type: object.type,
                                    typeId: object.typeId
                                },
                                addedAt: new Date().toISOString()
                            })
    }

    private async updateLike(status: myLikeStatus, objectLikeId: ObjectId) 
    {
        await LIKES.updateOne({_id: objectLikeId}, {
                                                    $set:{
                                                        "user.myStatus": status
                                                    }})
        
    }

    public async counterLike(likeStatusBody: string, object: countObject, user: userBDType):
        Promise<likesCounter> 
    {

        let userLikesCount: likesCounter = {
            likesCount: object.likesCount,
            dislikesCount: object.dislikesCount
        }
        
        let myStatus: myLikeStatus = myLikeStatus.None

        const findLike: null | likesBDType = await this.checkedLike(object.typeId, user._id)

        if (findLike) {

            const likeCaseString = likeStatusBody + findLike.user.myStatus

            switch (likeCaseString) {
                case ('LikeLike'):
                    myStatus = myLikeStatus.Like
                    break
                case ('LikeDislike'):
                    userLikesCount.likesCount++
                    userLikesCount.dislikesCount--
                    myStatus = myLikeStatus.Like
                    break
                case ('LikeNone'):
                    userLikesCount.likesCount++
                    myStatus = myLikeStatus.Like
                    break
                case ('DislikeLike'):
                    userLikesCount.likesCount--
                    userLikesCount.dislikesCount++
                    myStatus = myLikeStatus.Dislike
                    break
                case ('DislikeNone'):
                    userLikesCount.dislikesCount++
                    myStatus = myLikeStatus.Dislike
                    break
                case ('DislikeDislike'):
                    myStatus = myLikeStatus.Dislike
                    break
                case ('NoneDislike'):
                    userLikesCount.dislikesCount--
                    myStatus = myLikeStatus.None
                    break
                case ('NoneLike'):
                    userLikesCount.likesCount--
                    myStatus = myLikeStatus.None
                    break
            }

            await this.updateLike(myStatus, findLike._id)

        } else {
            
            switch (likeStatusBody) {
                case ('Like'):
                    userLikesCount.likesCount++
                    myStatus = myLikeStatus.Like
                    break
    
                case ('Dislike'):
                    userLikesCount.dislikesCount++
                    myStatus = myLikeStatus.Dislike
                    break
            }
    
            await this.createLike(user, object, myStatus)
        }




        return userLikesCount
    }

    public async threeUserLikesArray(postLikeId: ObjectId):
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
        const threeUserArray: likesBDType [] | null =  await this.threeUserLikesArray(objectId)

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

export default new LikeService()