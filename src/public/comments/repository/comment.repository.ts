import {ObjectId} from "mongodb";
import {COMMENTS} from "../../../core/db.data";
import {CommentOfPostBDType, LikesCounterType, MyLikeStatus, PostOfBlogReqType, UserBDType} from "../../../core/models";

class CommentRepository {

    async findOne(
        commentId: string
    ):Promise<CommentOfPostBDType | null>{
        return await COMMENTS.findOne({_id: new ObjectId(commentId)})
    }

    async createComment(
        postId: string,
        body: PostOfBlogReqType,
        objectUser: UserBDType
    ):Promise<string>{
        const newIdComment = new ObjectId()

        await COMMENTS.insertOne({
            _id: newIdComment,
            content: body.content,
            commentatorInfo: {
                userId: objectUser._id,
                userLogin: objectUser.infUser.login
            },
            postId: new ObjectId(postId),
            createdAt: new Date().toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: MyLikeStatus.None
            }
        })

        return newIdComment.toString()
    }

    async updateComment(
        commentId: string,
        content: string
    ){
        await COMMENTS.updateOne({_id: new ObjectId(commentId)}, {
            $set: {
                content: content
            }
        })
    }

    async updateLikesCount(
        commentId: string,
        newObjectLikes: LikesCounterType
    ){
        await COMMENTS.updateOne({_id: new ObjectId(commentId)}, {
            $set: {
                "likesInfo.likesCount": newObjectLikes.likesCount,
                "likesInfo.dislikesCount": newObjectLikes.dislikesCount,
            }
        })
    }

    async deleteComment(
        commentId: string
    ){
        await COMMENTS.deleteOne({_id: new ObjectId(commentId)})
    }
}

export default new CommentRepository()