import LikeService from "../../../helpers/like.service";
import {
    CountObjectType,
    LikesCounterType,
    PostBDType, PostOfBlogReqType,
    PostReqType, UserBDType
} from "../../../core/models";
import CheckedService from "../../../helpers/checked.service";
import PostRepository from "../repository/post.repository";
import CommentRepository from "../../comments/repository/comment.repository";

class PostService {

    public async createPost(
        body: PostReqType
    ):Promise<string>{
        const findBlogName: string | null = await CheckedService.findBlog(body.blogId.toString())

        return await PostRepository.createPost(body, findBlogName!) //наличие блога проверяется на уровне Middleware
    }

    public async updatePost(
        postId: string,
        body: PostReqType
    ):Promise<boolean>{
        const findPost: PostBDType | null = await PostRepository.findOne(postId)

        if (!findPost) {
            return false
        }

        const findBlogName: string | null = await CheckedService.findBlog(body.blogId.toString())

        if (!findBlogName){
            return false
        }

        await PostRepository.updatePost(postId, body, findBlogName)
        return true
    }

    public async postLike(
        likeStatus: string,
        postId: string,
        user: UserBDType
    ):Promise<boolean>{
        const findPost: PostBDType | null = await PostRepository.findOne(postId)

        if (!findPost) {
            return false
        }

        const countObject: CountObjectType = {
            typeId: findPost._id,
            type: 'post',
            likesCount: findPost.extendedLikesInfo.likesCount,
            dislikesCount: findPost.extendedLikesInfo.dislikesCount
        }

        const newObjectLikes: LikesCounterType = await LikeService.counterLike(likeStatus, countObject, user)

        await PostRepository.updateLikesCount(postId, newObjectLikes)
        return true
    }

    public async deletePost(
        postId: string
    ):Promise<boolean>{
        const findPost: PostBDType | null = await PostRepository.findOne(postId)

        if (!findPost) {
            return false
        }

        await PostRepository.deletePost(postId)
        return true
    }

    public async createCommentOfPost(
        postId: string,
        body: PostOfBlogReqType,
        objectUser: UserBDType
    ):Promise<string | null>{
        const findPost: PostBDType | null = await PostRepository.findOne(postId)

        if (!findPost) {
            return null
        }

        return await CommentRepository.createComment(postId, body, objectUser)
    }
}

export default new PostService()
