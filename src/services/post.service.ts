import {POSTS} from "../data/db.data";
import {ObjectId} from "mongodb";
import {postBDType, postObjectResult, postOfBlogReqType, postReqType} from "../models/post.models";
import {blogBDType} from "../models/blog.models";
import { userBDType } from "../models/user.models";
import {countObject, likesBDType, likesCounter, myLikeStatus, newestLikes} from "../models/likes.models";
import LikeService from "./like.service";
import BlogService from "./blog.service";

class PostService {

    public async findPost(bodyID: ObjectId):
        Promise<postBDType | null> 
    {
        const findOnePost: postBDType | null = await POSTS.findOne({_id: bodyID})

        if (!findOnePost) {
            return null
        }

        return findOnePost
    }

    public async getOnePost(postURIId: string, userId: ObjectId | null):
        Promise<null | postObjectResult> 
    {
        const bodyID: ObjectId = new ObjectId(postURIId)

        const findOnePost: postBDType | null = await this.findPost(bodyID)

        if (!findOnePost) {
            return null
        }

        let myUserStatus: myLikeStatus = myLikeStatus.None
        let allMapsUserLikesArray: newestLikes [] | [] = []

        if (userId) {
            const userObjectId: ObjectId = new ObjectId(userId)

            const checked: null | likesBDType = await LikeService.checkedLike(findOnePost._id, userObjectId)

            if (checked) {
                myUserStatus = checked.user.myStatus
            }
        }

        const threeUserLikesArray: likesBDType [] | null =  await LikeService.threeUserLikesArray(findOnePost._id)

        if (threeUserLikesArray) {

            allMapsUserLikesArray = threeUserLikesArray.map((fieldUserLikes: likesBDType) => {

                return {    
                            addedAt: fieldUserLikes.addedAt,
                            userId: fieldUserLikes.user.userId,
                            login: fieldUserLikes.user.login
                        }
                    
                }
            );
        }

        return {
                    id: findOnePost._id,
                    title: findOnePost.title,
                    shortDescription: findOnePost.shortDescription,
                    content: findOnePost.content,
                    blogId: findOnePost.blogId,
                    blogName: findOnePost.blogName,
                    createdAt: findOnePost.createdAt,
                    extendedLikesInfo: {
                        likesCount: findOnePost.extendedLikesInfo.likesCount,
                        dislikesCount: findOnePost.extendedLikesInfo.dislikesCount,
                        myStatus: myUserStatus,
                        newestLikes: allMapsUserLikesArray
                }
        }
    }

    public async createPost(body: postReqType):
        Promise<postObjectResult> 
    {
        const blogId: ObjectId = new ObjectId(body.blogId);

        let blogName: string = ''

        const postNewId: ObjectId = new ObjectId();

        const blogFind: null | blogBDType = await BlogService.findBlogById(blogId);

        if (blogFind) {
            blogName = blogFind.name
        }

        

        await POSTS.insertOne({
                                _id: postNewId,
                                title: body.title,
                                shortDescription: body.shortDescription,
                                content: body.content,
                                blogId: blogId,
                                blogName: blogName,
                                createdAt: new Date().toISOString(),
                                extendedLikesInfo: {
                                    likesCount: 0,
                                    dislikesCount: 0,
                                    myStatus: myLikeStatus.None,
                                    newestLikes: []
                                }
                            })


        return {
                id: postNewId,
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId,
                blogName: blogName,
                createdAt: new Date().toISOString(),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: myLikeStatus.None,
                    newestLikes: []
                }
            }
    }

    public async updatePost(postURIId: string, body: postReqType):
        Promise<boolean> 
    {
        const bodyID: ObjectId = new ObjectId(postURIId)

        const blogId: ObjectId = new ObjectId(body.blogId)

        let blogName: string = ''

        const findPost: null | postBDType = await this.findPost(bodyID)

        if (!findPost) {
            return false
        }

        const blogFind: null | blogBDType = await BlogService.findBlogById(blogId)

        if (blogFind) {
            blogName = blogFind.name
        }

        await POSTS.updateOne({_id: bodyID}, {
                                                $set: {
                                                    title: body.title,
                                                    shortDescription: body.shortDescription,
                                                    content: body.content,
                                                    blogId: blogId,
                                                    blogName: blogName
                                                }
                                            })

        return true
    }

    public async postLike(likeStatus: string, postURIId: string, user: userBDType):
        Promise<boolean> 
    {
        const bodyID: ObjectId = new ObjectId(postURIId)

        const findPost: null | postBDType = await this.findPost(bodyID)

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

        await POSTS.updateOne({_id: bodyID}, {
                                                $set: {
                                                    "extendedLikesInfo.likesCount": newObjectLikes.likesCount,
                                                    "extendedLikesInfo.dislikesCount": newObjectLikes.dislikesCount,
                                                }
                                            })

        return true
    }

    public async deletePost(postURIId: string):
        Promise<boolean> 
    {
        const bodyID: ObjectId = new ObjectId(postURIId)

        const findPost: null | postBDType = await this.findPost(bodyID)

        if (!findPost) {
            return false
        }

        await POSTS.deleteOne({_id: bodyID})

        return true
    }

    public async createOnePostOfBlog(blogURIId: string, body: postOfBlogReqType):
        Promise<null | postObjectResult> 
    {
        let blogName: string = ''

        const postNewId: ObjectId = new ObjectId()

        const bodyID: ObjectId = new ObjectId(blogURIId)

        const blogFind: null | blogBDType = await BlogService.findBlogById(bodyID)

        if (blogFind) {
            blogName = blogFind.name
        }

        await POSTS.insertOne({
                                _id: postNewId,
                                title: body.title,
                                shortDescription: body.shortDescription,
                                content: body.content,
                                blogId: bodyID,
                                blogName: blogName,
                                createdAt: new Date().toISOString(),
                                extendedLikesInfo: {
                                                    likesCount: 0,
                                                    dislikesCount: 0,
                                                    myStatus: myLikeStatus.None,
                                                    newestLikes: []
                                                    }
                                })
        return {
                id: postNewId,
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: bodyID,
                blogName: blogName,
                createdAt: new Date().toISOString(),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: myLikeStatus.None,
                    newestLikes: []
                }
        }                                        
    }
}

export default new PostService()
