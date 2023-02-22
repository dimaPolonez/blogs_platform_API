import { ObjectId } from "mongodb"
import { postBDType, postObjectResult, postReqType } from "../../models/post.models"
import { PostModel } from "../entity/post.entity"
import BlogRepository from "./blog.repository";
import { blogObjectResult } from "../../models/blog.models";
import { myLikeStatus, newestLikes, countObject, likesCounter } from "../../models/likes.models";
import LikeService from "../../services/like.service";



class PostRepository {

    public async findOneByIdReturnDoc(postID: string) {

        const objectPostID: ObjectId = new ObjectId(postID)

        const findPostSmart = await PostModel.findOne({ _id: objectPostID })

        return findPostSmart
    }

    public async findOneById(postID: string, userID: string | null):
        Promise<null | postObjectResult> {
            
        const objectPostID: ObjectId = new ObjectId(postID)

        let likeStatus: myLikeStatus = myLikeStatus.None

        let newestLikes: newestLikes[] | [] = []

        const findPostSmart: null | postBDType = await PostModel.findOne({ _id: objectPostID })

        if (!findPostSmart) {
            return null
        }

        if (userID) {
            const likeStatusChecked = await LikeService.checkedLike(findPostSmart._id, userID)

            if (likeStatusChecked){
                likeStatus = likeStatusChecked.user.myStatus
            }
        }

        newestLikes =  await LikeService.threeUserLikesArray(findPostSmart._id)

        return {
            id: findPostSmart._id,
            title: findPostSmart.title,
            shortDescription: findPostSmart.shortDescription,
            content: findPostSmart.content,
            blogId: findPostSmart.blogId,
            blogName: findPostSmart.blogName,
            createdAt: findPostSmart.createdAt,
            extendedLikesInfo: {
                likesCount: findPostSmart.extendedLikesInfo.likesCount,
                dislikesCount: findPostSmart.extendedLikesInfo.dislikesCount,
                myStatus: likeStatus,
                newestLikes: newestLikes
            }
        }
    }

    public async createPost(postDTO: postReqType):
        Promise<postObjectResult> {
        const blogFind: blogObjectResult | null = await BlogRepository.findOneById(postDTO.blogId)

        let blogName: string = 'blog not found'

        if(blogFind) {
            blogName = blogFind.name
        }

        const newPostSmart = await PostModel.createPost(postDTO)

        return {
            id: newPostSmart._id,
            title: newPostSmart.title,
            shortDescription: newPostSmart.shortDescription,
            content: newPostSmart.content,
            blogId: newPostSmart.blogId,
            blogName: blogName,
            createdAt: newPostSmart.createdAt,
            extendedLikesInfo: {
                likesCount: newPostSmart.extendedLikesInfo.likesCount,
                dislikesCount: newPostSmart.extendedLikesInfo.dislikesCount,
                myStatus: newPostSmart.extendedLikesInfo.myStatus,
                newestLikes: newPostSmart.extendedLikesInfo.newestLikes
            }
        }
    }

    public async updatePost(postID: string, postDTO: postReqType):
        Promise<boolean> {
        const updatedPostResult: boolean = PostModel.updatePost(postID, postDTO)

        return updatedPostResult
    }

    public async updatePostLiked(likeDTO: string, postID: string, userID: string):
        Promise<boolean> {

       const findPost: null | postObjectResult = await this.findOneById(postID, userID)

        if (!findPost) {
            return false
        }

        const countObject: countObject = {
            typeId: findPost.id,
            type: 'post',
            likesCount: findPost.extendedLikesInfo.likesCount,
            dislikesCount: findPost.extendedLikesInfo.dislikesCount
        }

        const newObjectLikes: likesCounter = await LikeService.counterLike(likeDTO, countObject, userID)

        const updatedPostResult: boolean = PostModel.updatePostLiked(postID, newObjectLikes)

        return updatedPostResult
    }

    public async deletePost(postID: string):
        Promise<boolean> {
        const findPostModel: postObjectResult | null = await this.findOneById(postID, null)

        if (!findPostModel) {
            return false
        }

        await PostModel.deleteOne({ _id: findPostModel.id })

        return true
    }

    public async deleteAllPost() {
        await PostModel.deleteMany({})
    }

    public async save(model: any) {
        return await model.save()
    }
}

export default new PostRepository()