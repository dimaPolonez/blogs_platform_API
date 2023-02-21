import { ObjectId } from "mongodb"
import { postBDType, postObjectResult, postReqType } from "../../models/post.models"
import { PostModel } from "../entity/post.entity"
import BlogRepository from "./blog.repository";
import { blogObjectResult } from "../../models/blog.models";
import { myLikeStatus, newestLikes } from "../../models/likes.models";


class PostRepository {

    public async findOneByIdReturnDoc(postID: string){

        const objectPostID: ObjectId = new ObjectId(postID)

        const findPostSmart: null | postBDType = await PostModel.findOne({ _id: objectPostID })

        return findPostSmart
    }

    public async findOneById(postID: string, userID: ObjectId | null):
        Promise<null | postObjectResult>
    {
        const objectPostID: ObjectId = new ObjectId(postID)

        let likeStatus: myLikeStatus = myLikeStatus.None

        let newestLikes: newestLikes[] | [] = []

        const findPostSmart: null | postBDType = await PostModel.findOne({_id: objectPostID})

        if (!findPostSmart) {
            return null
        }

        if (userID) {
           // likeStatus = await LikeService.checkedLike(findPostSmart._id, userID)
        }

       // newestLikes =  await LikeService.threeUserLikesArray(findOnePost.id)

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
        Promise<postObjectResult>
    {
        const blogFind: blogObjectResult | null = await BlogRepository.findOneById(postDTO.blogId)

        let blogName: string = 'blog not found'

        const newPostSmart = await PostModel.createPost(postDTO)

        if (blogFind) {
            blogName = blogFind.name
        }

        return {
                    id: newPostSmart._id,
                    title: newPostSmart.title,
                    shortDescription: newPostSmart.shortDescription,
                    content: newPostSmart.content,
                    blogId: newPostSmart.blogId,
                    blogName: blogName,
                    createdAt: newPostSmart.createdAt,
                    extendedLikesInfo: {
                                        likesCount: newPostSmart.likesCount,
                                        dislikesCount: newPostSmart.dislikesCount,
                                        myStatus: newPostSmart.myStatus,
                                        newestLikes: newPostSmart.newestLikes
                                    }
                }
        
    }

    public async updatePost(postID: string, postDTO: postReqType):
        Promise<boolean>
    {
        const updatedPostResult: boolean = PostModel.updatePost(postID, postDTO)

        return updatedPostResult
    }

    public async deletePost(postID: string):
        Promise<boolean>
    {
        const findPostModel: postObjectResult | null = await this.findOneById(postID, null)

        if(!findPostModel){
            return false
        }

        await PostModel.deleteOne( { _id: findPostModel.id } )

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