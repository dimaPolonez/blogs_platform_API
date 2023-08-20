import {ObjectId} from "mongodb";
import {LIKES} from "../core/db.data";
import {
    CountObjectType,
    LikesBDType,
    LikesCounterType,
    MyLikeStatus,
    NewestLikesType,
    UserBDType
} from "../core/models";

class LikeService {

    public async checkedLike(
        objectId: ObjectId,
        userId: ObjectId
    ):Promise<null | LikesBDType>{
        const findUserLike: LikesBDType | null = await LIKES.findOne({
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

    private async createLike(
        user: UserBDType,
        object: CountObjectType,
        likeStatus: MyLikeStatus
    ){
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

    private async updateLike(
        status: MyLikeStatus,
        objectLikeId: ObjectId
    ){
        await LIKES.updateOne({_id: objectLikeId}, {
                                                    $set:{
                                                        "user.myStatus": status
                                                    }})
        
    }

    public async counterLike(
        likeStatusBody: string,
        object: CountObjectType,
        user: UserBDType
    ):Promise<LikesCounterType>{
        let userLikesCount: LikesCounterType = {
            likesCount: object.likesCount,
            dislikesCount: object.dislikesCount
        }
        
        let myStatus: MyLikeStatus = MyLikeStatus.None

        const findLike: null | LikesBDType = await this.checkedLike(object.typeId, user._id)

        if (findLike) {

            const likeCaseString = likeStatusBody + findLike.user.myStatus

            switch (likeCaseString) {
                case ('LikeLike'):
                    myStatus = MyLikeStatus.Like
                    break
                case ('LikeDislike'):
                    userLikesCount.likesCount++
                    userLikesCount.dislikesCount--
                    myStatus = MyLikeStatus.Like
                    break
                case ('LikeNone'):
                    userLikesCount.likesCount++
                    myStatus = MyLikeStatus.Like
                    break
                case ('DislikeLike'):
                    userLikesCount.likesCount--
                    userLikesCount.dislikesCount++
                    myStatus = MyLikeStatus.Dislike
                    break
                case ('DislikeNone'):
                    userLikesCount.dislikesCount++
                    myStatus = MyLikeStatus.Dislike
                    break
                case ('DislikeDislike'):
                    myStatus = MyLikeStatus.Dislike
                    break
                case ('NoneDislike'):
                    userLikesCount.dislikesCount--
                    myStatus = MyLikeStatus.None
                    break
                case ('NoneLike'):
                    userLikesCount.likesCount--
                    myStatus = MyLikeStatus.None
                    break
            }

            await this.updateLike(myStatus, findLike._id)

        } else {
            
            switch (likeStatusBody) {
                case ('Like'):
                    userLikesCount.likesCount++
                    myStatus = MyLikeStatus.Like
                    break
    
                case ('Dislike'):
                    userLikesCount.dislikesCount++
                    myStatus = MyLikeStatus.Dislike
                    break
            }
    
            await this.createLike(user, object, myStatus)
        }




        return userLikesCount
    }

    public async threeUserLikesArray(
        postLikeId: ObjectId
    ):Promise<LikesBDType[] | null>{
        const likeUserArray: LikesBDType[] =  await LIKES.find({
                                                                    $and: [
                                                                        {"object.typeId": postLikeId},
                                                                        {"user.myStatus": MyLikeStatus.Like}
                                                                        ]
                                                                
                                                                }).limit(3).sort({addedAt: -1}).toArray();

        if (likeUserArray.length === 0) {
            return null
        }

        return likeUserArray
    }

    public async userLikeMaper(
        objectId: ObjectId
    ):Promise<NewestLikesType[] | null>{
        const threeUserArray: LikesBDType [] | null =  await this.threeUserLikesArray(objectId)

        if (!threeUserArray) {
            return null
        }

        const allLikeUserMapping: NewestLikesType[] = threeUserArray.map((fieldLikeUser: LikesBDType) => {

        return {    
                addedAt: fieldLikeUser.addedAt,
                userId: fieldLikeUser.user.userId,
                login: fieldLikeUser.user.login
                }})

        return allLikeUserMapping
    }
}

export default new LikeService()