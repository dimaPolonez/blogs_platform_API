import { likesInfo, myLikeStatus } from "../models/likes.models";

class likeService {

    public async counterLike(likeStatusBody: string, likesInfo: likesInfo):
    Promise<likesInfo>
    {

        const likeCaseString: string = likeStatusBody + likesInfo.myStatus;

        let result: likesInfo = { likesCount: likesInfo.likesCount,
                                    dislikesCount: likesInfo.dislikesCount,
                                    myStatus: myLikeStatus[0]};

        switch (likeCaseString) {
            case ('LikeLike'):
                result.likesCount--
                break
            case ('LikeDislike'):
                result.likesCount++
                result.dislikesCount--
                result.myStatus = myLikeStatus[1]
                break
            case ('LikeNone'):
                result.likesCount++
                result.myStatus = myLikeStatus[1]
                break
            case ('DislikeLike'):
                result.likesCount--
                result.dislikesCount++
                result.myStatus = myLikeStatus[2]
                break
            case ('DislikeDislike'):
                result.dislikesCount--
                break
            case ('DislikeNone'):
                result.dislikesCount++
                result.myStatus = myLikeStatus[2]
                break
            case ('NoneLike'):
                result.likesCount--
                result.myStatus = myLikeStatus[0]
                break
            case ('NoneDislike'):
                result.dislikesCount--
                result.myStatus = myLikeStatus[0]
                break
        }

        return result
    }

}

export default new likeService();