import {COMMENTS, ERRORS_CODE, POSTS} from "../../../core/db.data";
import {ObjectId} from "mongodb";
import LikeService from "../../../helpers/like.service";
import {
    CommentObjectResultType,
    CommentOfPostBDType,
    CommentReqType, CountObjectType,
    LikesBDType, LikesCounterType,
    MyLikeStatus, PostBDType, PostOfBlogReqType, UserBDType
} from "../../../core/models";

class CommentService {

    private async findComment(
        bodyID: ObjectId
    ):Promise<null | CommentOfPostBDType>{
        const findComment: null | CommentOfPostBDType = await COMMENTS.findOne({_id: bodyID})

        if (!findComment) {
            return null
        }

        return findComment
    }

    public async getOneComment(
        commentURIId: string,
        userId: ObjectId | null
    ):Promise<null | CommentObjectResultType>{
        const bodyID: ObjectId = new ObjectId(commentURIId)

        const findComment: null | CommentOfPostBDType = await this.findComment(bodyID)

        if (!findComment) {
            return null
        }

        let myUserStatus: MyLikeStatus = MyLikeStatus.None

        if (userId) {
            const userObjectId: ObjectId = new ObjectId(userId)

            const checked: null | LikesBDType = await LikeService.checkedLike(findComment._id, userObjectId)

            if (checked) {
                myUserStatus = checked.user.myStatus
            }
        }

        return {
            id: findComment._id,
            content: findComment.content,
            commentatorInfo: {
                userId: findComment.commentatorInfo.userId,
                userLogin: findComment.commentatorInfo.userLogin,
            },
            createdAt: findComment.createdAt,
            likesInfo: {
                likesCount: findComment.likesInfo.likesCount,
                dislikesCount: findComment.likesInfo.dislikesCount,
                myStatus: myUserStatus
            }
        }
    }

    public async updateComment(
        commentURIId: string,
        body: CommentReqType,
        userObject: UserBDType
    ):Promise<number>{
        const bodyID: ObjectId = new ObjectId(commentURIId)
        
        const findComment: null | CommentOfPostBDType = await this.findComment(bodyID)

        if (!findComment) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (findComment.commentatorInfo.userId.toString() !== userObject._id.toString()) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await COMMENTS.updateOne({_id: bodyID}, {
            $set: {
                content: body.content
            }
        })

        return ERRORS_CODE.NO_CONTENT_204
    }

    public async commentLike(
        likeStatus: string,
        commentURIId: string,
        user: UserBDType
    ):Promise<boolean>{
        const bodyID: ObjectId = new ObjectId(commentURIId)

        const findComment: null | CommentOfPostBDType = await this.findComment(bodyID)

        if (!findComment) {
            return false
        }

        const likesInfoComment: CountObjectType = {
            typeId: findComment._id,
            type: 'comment',
            likesCount: findComment.likesInfo.likesCount,
            dislikesCount: findComment.likesInfo.dislikesCount
        }

        const newObjectLikes: LikesCounterType = await LikeService.counterLike(likeStatus, likesInfoComment, user)

        await COMMENTS.updateOne({_id: bodyID}, {
            $set: {
                "likesInfo.likesCount": newObjectLikes.likesCount,
                "likesInfo.dislikesCount": newObjectLikes.dislikesCount,
            }
        })

        return true
    }

    public async deleteComment(
        commentURIId: string,
        userObject: UserBDType
    ):Promise<number>{
        const bodyID: ObjectId = new ObjectId(commentURIId)

        const findComment: null | CommentOfPostBDType = await this.findComment(bodyID)

        if (!findComment) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (findComment.commentatorInfo.userId.toString() !== userObject._id.toString()) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await COMMENTS.deleteOne({_id: bodyID})

        return ERRORS_CODE.NO_CONTENT_204
    }

    public async createCommentOfPost(
        postURIId: string,
        body: PostOfBlogReqType,
        objectUser: UserBDType
    ):Promise<null | CommentObjectResultType>{
        const postId: ObjectId = new ObjectId(postURIId)

        const newGenerateId: ObjectId = new ObjectId()

        const nowDate: string = new Date().toISOString()

        const postFind: null | PostBDType = await POSTS.findOne({_id: postId})

        if (!postFind) {
            return null
        }

        await COMMENTS.insertOne({
                                    _id: newGenerateId,
                                    content: body.content,
                                    commentatorInfo: {
                                        userId: objectUser._id,
                                        userLogin: objectUser.infUser.login
                                    },
                                    postId: postId,
                                    createdAt: nowDate,
                                    likesInfo: {
                                        likesCount: 0,
                                        dislikesCount: 0,
                                        myStatus: MyLikeStatus.None
                                    }
                                })
        
        return {
                id: newGenerateId,
                content: body.content,
                commentatorInfo: {
                    userId: objectUser._id,
                    userLogin: objectUser.infUser.login
                },
                createdAt: nowDate,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: MyLikeStatus.None
                }
        }                 
    }
}

export default new CommentService()