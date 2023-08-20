import {POSTS} from "../../../core/db.data";
import {LikesCounterType, MyLikeStatus, PostBDType, PostReqType} from "../../../core/models";
import {ObjectId} from "mongodb";

class PostRepository {

    async findOne(
        postId: string
    ):Promise<PostBDType | null>{
        return await POSTS.findOne({_id: new ObjectId(postId)})
    }

    async createPost(
        body: PostReqType,
        blogName: string
    ):Promise<string> {
        const newPostId = new ObjectId()

        await POSTS.insertOne({
            _id: newPostId,
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName,
            createdAt: new Date().toISOString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: MyLikeStatus.None,
                newestLikes: []
            }
        })

        return newPostId.toString()
    }

    async updatePost(
        postId: string,
        body: PostReqType,
        blogName: string
    ){
        await POSTS.updateOne({_id: new ObjectId(postId)}, {
            $set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: blogName
            }
        })
    }

    async updateLikesCount(
        postId: string,
        newObjectLikes: LikesCounterType
    ){
        await POSTS.updateOne({_id: new ObjectId(postId)}, {
            $set: {
                "extendedLikesInfo.likesCount": newObjectLikes.likesCount,
                "extendedLikesInfo.dislikesCount": newObjectLikes.dislikesCount,
            }
        })
    }

    async deletePost(
        postId: string
    ){
        await POSTS.deleteOne({_id: new ObjectId(postId)})
    }

}

export default new PostRepository()