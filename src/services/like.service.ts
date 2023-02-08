import { likesInfo, myLikeStatus } from "../models/likes.models";

class likeService {

    public async counterLike(likeStatusBody: string, likesInfo: likesInfo):
    Promise<likesInfo>
    {

        const likeCaseString: string = likeStatusBody + likesInfo.myStatus;

        const result: likesInfo = { likesCount: likesInfo.likesCount,
                                    dislikesCount: likesInfo.dislikesCount,
                                    myStatus: myLikeStatus[0]};

        switch (likeCaseString) {
            case ('LikeLike'):
                return {
                    likesCount: likesInfo.likesCount--,
                    dislikesCount: likesInfo.dislikesCount,
                    myStatus: myLikeStatus[0]
                    }
                break
            case ('LikeDislike'):
                return {
                    likesCount: likesInfo.likesCount++,
                    dislikesCount: likesInfo.dislikesCount--,
                    myStatus: myLikeStatus[1]
                    }
                break
            case ('LikeNone'):
                return {
                    likesCount: likesInfo.likesCount++,
                    dislikesCount: likesInfo.dislikesCount,
                    myStatus: myLikeStatus[1]
                    }
                break
            case ('DislikeLike'):
                return {
                    likesCount: likesInfo.likesCount--,
                    dislikesCount: likesInfo.dislikesCount++,
                    myStatus: myLikeStatus[2]
                    }
            case ('DislikeDislike'):
                return {
                    likesCount: likesInfo.likesCount,
                    dislikesCount: likesInfo.dislikesCount--,
                    myStatus: myLikeStatus[0]
                    }
                break
            case ('DislikeNone'):
                return {
                    likesCount: likesInfo.likesCount,
                    dislikesCount: likesInfo.dislikesCount++,
                    myStatus: myLikeStatus[2]
                    }
            default: return result     
        }
    }

}

export default new likeService();