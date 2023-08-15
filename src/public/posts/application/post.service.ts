import {POSTS} from "../../../core/db.data";
import {ObjectId} from "mongodb";
import LikeService from "../../../helpers/like.service";
import BlogService from "../../blogs/application/blog.service";
import {
    BlogBDType, CountObjectType,
    LikesBDType, LikesCounterType,
    MyLikeStatus,
    NewestLikesType,
    PostBDType,
    PostObjectResultType, PostOfBlogReqType,
    PostReqType, UserBDType
} from "../../../core/models";

class PostService {

    public async findPost(
        bodyID: ObjectId
    ):Promise<PostBDType | null>{
        const findOnePost: PostBDType | null = await POSTS.findOne({_id: bodyID})

        if (!findOnePost) {
            return null
        }

        return findOnePost
    }

    public async getOnePost(
        postURIId: string,
        userId: ObjectId | null
    ):Promise<null | PostObjectResultType>{
        const bodyID: ObjectId = new ObjectId(postURIId)

        const findOnePost: PostBDType | null = await this.findPost(bodyID)

        if (!findOnePost) {
            return null
        }

        let myUserStatus: MyLikeStatus = MyLikeStatus.None
        let allMapsUserLikesArray: NewestLikesType [] | [] = []

        if (userId) {
            const userObjectId: ObjectId = new ObjectId(userId)

            const checked: null | LikesBDType = await LikeService.checkedLike(findOnePost._id, userObjectId)

            if (checked) {
                myUserStatus = checked.user.myStatus
            }
        }

        const threeUserLikesArray: LikesBDType [] | null =  await LikeService.threeUserLikesArray(findOnePost._id)

        if (threeUserLikesArray) {

            allMapsUserLikesArray = threeUserLikesArray.map((fieldUserLikes: LikesBDType) => {

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

    public async createPost(
        body: PostReqType
    ):Promise<PostObjectResultType>{
        const blogId: ObjectId = new ObjectId(body.blogId)

        let blogName: string = ''

        const postNewId: ObjectId = new ObjectId()

        const blogFind: null | BlogBDType = await BlogService.findBlogById(blogId)

        if (blogFind) {
            blogName = blogFind.name
        }

        const nowDate = new Date().toISOString()

        

        await POSTS.insertOne({
                                _id: postNewId,
                                title: body.title,
                                shortDescription: body.shortDescription,
                                content: body.content,
                                blogId: blogId,
                                blogName: blogName,
                                createdAt: nowDate,
                                extendedLikesInfo: {
                                    likesCount: 0,
                                    dislikesCount: 0,
                                    myStatus: MyLikeStatus.None,
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
                createdAt: nowDate,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: MyLikeStatus.None,
                    newestLikes: []
                }
            }
    }

    public async updatePost(
        postURIId: string,
        body: PostReqType
    ):Promise<boolean>{
        const bodyID: ObjectId = new ObjectId(postURIId)

        const blogId: ObjectId = new ObjectId(body.blogId)

        let blogName: string = ''

        const findPost: null | PostBDType = await this.findPost(bodyID)

        if (!findPost) {
            return false
        }

        const blogFind: null | BlogBDType = await BlogService.findBlogById(blogId)

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

    public async postLike(
        likeStatus: string,
        postURIId: string,
        user: UserBDType
    ):Promise<boolean>{
        const bodyID: ObjectId = new ObjectId(postURIId)

        const findPost: null | PostBDType = await this.findPost(bodyID)

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

        await POSTS.updateOne({_id: bodyID}, {
                                                $set: {
                                                    "extendedLikesInfo.likesCount": newObjectLikes.likesCount,
                                                    "extendedLikesInfo.dislikesCount": newObjectLikes.dislikesCount,
                                                }
                                            })

        return true
    }

    public async deletePost(
        postURIId: string
    ):Promise<boolean>{
        const bodyID: ObjectId = new ObjectId(postURIId)

        const findPost: null | PostBDType = await this.findPost(bodyID)

        if (!findPost) {
            return false
        }

        await POSTS.deleteOne({_id: bodyID})

        return true
    }

    public async createOnePostOfBlog(
        blogURIId: string,
        body: PostOfBlogReqType
    ):Promise<null | PostObjectResultType>{
        let blogName: string = ''

        const postNewId: ObjectId = new ObjectId()

        const bodyID: ObjectId = new ObjectId(blogURIId)

        const nowDate = new Date().toISOString()

        const blogFind: null | BlogBDType = await BlogService.findBlogById(bodyID)

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
                                createdAt: nowDate,
                                extendedLikesInfo: {
                                                    likesCount: 0,
                                                    dislikesCount: 0,
                                                    myStatus: MyLikeStatus.None,
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
                createdAt: nowDate,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: MyLikeStatus.None,
                    newestLikes: []
                }
        }                                        
    }
}

export default new PostService()
