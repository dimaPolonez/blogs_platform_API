import {ObjectId} from "mongodb";
import {postBDType, postObjectResult, postOfBlogReqType, postReqType} from "../models/post.models";
import { userBDType } from "../models/user.models";
import {countObject, likesBDType, likesCounter, myLikeStatus, newestLikes} from "../models/likes.models";
import LikeService from "./like.service";
import { PostModel } from "../data/entity/post.entity";
import PostRepository from "../data/repository/post.repository";

class PostService {

    public async getOnePost(postID: string, userID: ObjectId | null):
        Promise<null | postObjectResult> 
    {
        const findOnePost: postObjectResult | null = await PostRepository.findOneById(postID, userID)

        return findOnePost
    }

    public async createPost(postDTO: postReqType):
        Promise<postObjectResult> 
    {
        const createdPost: postObjectResult | null = await PostRepository.createPost(postDTO)

        return createdPost
    }

    public async updatePost(postID: string, postDTO: postReqType):
        Promise<boolean> 
    {
        const updatedPostResult: boolean = await PostRepository.updatePost(postID, postDTO)
        
        return updatedPostResult
    }

    public async postLike(likeStatus: string, postURIId: string, user: userBDType):
        Promise<boolean> 
    {
        const bodyID: ObjectId = new ObjectId(postURIId)

       /*const findPost: null | postBDType = await this.findPost(bodyID)

         if (!findPost) {
            return false
        }

        const countObject: countObject = {
            typeId: findPost._id,
            type: 'post',
            likesCount: findPost.extendedLikesInfo.likesCount,
            dislikesCount: findPost.extendedLikesInfo.dislikesCount
        }

        

        const newObjectLikes: likesCounter = await LikeService.counterLike(likeStatus, countObject, user)

        await PostModel.updateOne({_id: bodyID}, {
                                                $set: {
                                                    "extendedLikesInfo.likesCount": newObjectLikes.likesCount,
                                                    "extendedLikesInfo.dislikesCount": newObjectLikes.dislikesCount,
                                                }
                                            })*/

        return true
    }

    public async deletePost(postID: string):
        Promise<boolean> 
    {
        const deletedPostResult: boolean = await PostRepository.deletePost(postID)

        return deletedPostResult
    }

    public async createOnePostOfBlog(blogID: string, postDTOblogIdNone: postOfBlogReqType):
        Promise<null | postObjectResult> 
    {
        const postDTO: postReqType = {
            title: postDTOblogIdNone.title,
            shortDescription: postDTOblogIdNone.shortDescription,
            content: postDTOblogIdNone.content,
            blogId: blogID
        }

        const createdPost: postObjectResult = await PostRepository.createPost(postDTO)

        if (createdPost.blogName === 'blog not found') {
            return null
        }

        return createdPost                              
    }
}

export default new PostService()
