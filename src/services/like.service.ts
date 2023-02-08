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
                result = {
                    likesCount: likesInfo.likesCount--,
                    dislikesCount: likesInfo.dislikesCount,
                    myStatus: myLikeStatus[0]
                    }
                break
            case ('LikeDislike'):
                result = {
                    likesCount: likesInfo.likesCount++,
                    dislikesCount: likesInfo.dislikesCount--,
                    myStatus: myLikeStatus[1]
                    }
                break
            case ('LikeNone'):
                result = {
                    likesCount: likesInfo.likesCount++,
                    dislikesCount: likesInfo.dislikesCount,
                    myStatus: myLikeStatus[1]
                    }
                break
            case ('DislikeLike'):
                result = {
                    likesCount: likesInfo.likesCount--,
                    dislikesCount: likesInfo.dislikesCount++,
                    myStatus: myLikeStatus[2]
                    }
            case ('DislikeDislike'):
                result = {
                    likesCount: likesInfo.likesCount,
                    dislikesCount: likesInfo.dislikesCount--,
                    myStatus: myLikeStatus[0]
                    }
                break
            case ('DislikeNone'):
                result = {
                    likesCount: likesInfo.likesCount,
                    dislikesCount: likesInfo.dislikesCount++,
                    myStatus: myLikeStatus[2]
                    }  
        }

        return result
    }

}

export default new likeService();