import {ObjectId} from "mongodb";
import LikesRepository from "../data/repository/likes.repository";
import {countObject, likesBDType, likesCounter, myLikeStatus, newestLikes} from "../models/likes.models";
import {userBDType} from "../models/user.models";

class LikeService {

    public async checkedLike(objectID: ObjectId, userID: string):
        Promise<null | likesBDType> 
    {
        const findUserLike: null | likesBDType = await LikesRepository.findOneById(objectID, userID)

        if (!findUserLike) {
            return null
        } 
        
        return findUserLike
    }

    public async counterLike(likeDTO: string, object: countObject, userID: string):
        Promise<likesCounter> 
    {
        let userLikesCount: likesCounter = {
            likesCount: object.likesCount,
            dislikesCount: object.dislikesCount
        }
        
        let myStatus: myLikeStatus = myLikeStatus.None

        const findLike: null | likesBDType = await this.checkedLike(object.typeId, userID)

        if (findLike) {

            const likeCaseString = likeDTO + findLike.user.myStatus

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

            await LikesRepository.updateLike(myStatus, findLike._id)

        } else {
            
            switch (likeDTO) {
                case ('Like'):
                    userLikesCount.likesCount++
                    myStatus = myLikeStatus.Like
                    break
    
                case ('Dislike'):
                    userLikesCount.dislikesCount++
                    myStatus = myLikeStatus.Dislike
                    break
            }
    
            await LikesRepository.createLike(userID, object, myStatus)
        }

        return userLikesCount
    }

    public async threeUserLikesArray(postLikeId: ObjectId):
        Promise<newestLikes[] | []>
    
    {
        const findLikeArray: [] | likesBDType [] = await LikesRepository.findLikeArray(postLikeId)

        if (findLikeArray) {

            return findLikeArray.map((fieldUserLikes: likesBDType) => {
                return {    
                    addedAt: fieldUserLikes.addedAt,
                    userId: fieldUserLikes.user.userId,
                    login: fieldUserLikes.user.login
                }
            })
        }

        return findLikeArray
    }

/*     public async userLikeMaper(objectId: ObjectId):
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

                const allLikeUserMapping: [] = []

        return allLikeUserMapping
    } */
}

export default new LikeService()