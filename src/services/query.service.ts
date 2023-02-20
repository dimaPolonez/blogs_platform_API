import {COMMENTS, POSTS, USERS} from "../data/db.data";
import {
    notStringQueryReqPag,
    notStringQueryReqPagOfSearchName, notStringQueryReqPagSearchAuth
} from "../models/request.models";
import {blogAllMaps, blogBDType, resultBlogObjectType} from "../models/blog.models";
import {postAllMaps, postBDType, resultPostObjectType} from "../models/post.models";
import {resultUserObjectType, userAllMaps, userBDType} from "../models/user.models";
import {commentAllMaps, commentOfPostBDType, resultCommentObjectType} from "../models/comment.models";
import {ObjectId} from "mongodb";
import {likesBDType, myLikeStatus, newestLikes} from "../models/likes.models";
import LikeService from "./like.service";
import BlogService from "./blog.service";
import PostService from "./post.service";
import { BlogModel } from "../data/entity/blog.entity";

function sortObject(sortDir: string)
{
    return (sortDir === 'desc') ? -1 : 1
}

function skippedObject(pageNum: number, pageSize: number)
{
    return (pageNum - 1) * pageSize
}

class QueryService {

    public async getAllBlogs(queryAll: notStringQueryReqPagOfSearchName):
        Promise<resultBlogObjectType> 
    {
        /*const allBlogs: blogBDType [] = await BLOGS
                                                .find({name: new RegExp(queryAll.searchNameTerm, 'gi')})
                                                .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                .limit(queryAll.pageSize)
                                                .sort({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}).toArray()*/

                                                const allBlogs: [] = []

        const allMapsBlog: blogAllMaps [] = allBlogs.map((field: blogBDType) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        })

        const allCount: number = await BlogModel.countDocuments({name: new RegExp(queryAll.searchNameTerm, 'gi')})

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMapsBlog
        }
    }

    public async getAllPosts(queryAll: notStringQueryReqPag, userId: ObjectId | null): 
        Promise<resultPostObjectType> 
    {
        /*const allPostsFind: postBDType [] = await POSTS.find({})
                                                                .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                                .limit(queryAll.pageSize)
                                                                .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()*/
                                                                const allPostsFind: [] = []

        const allPostMapping: postAllMaps [] = await Promise.all(allPostsFind.map(async (fieldPost: postBDType) => {

                let userLikeStatus: myLikeStatus = myLikeStatus.None
                let allLikeUserMapping: newestLikes[] | [] = []

                if (userId) {
                    const likeUserArray: null | likesBDType = await LikeService.checkedLike(fieldPost._id, userId)

                    if (likeUserArray) {
                        userLikeStatus = likeUserArray.user.myStatus
                    }
                }

                const resultUserLikeMapping: newestLikes[] | null = await LikeService.userLikeMaper(fieldPost._id)

                if (resultUserLikeMapping) {
                    allLikeUserMapping = resultUserLikeMapping
                }

                return {
                    id: fieldPost._id,
                    title: fieldPost.title,
                    shortDescription: fieldPost.shortDescription,
                    content: fieldPost.content,
                    blogId: fieldPost.blogId,
                    blogName: fieldPost.blogName,
                    createdAt: fieldPost.createdAt,
                    extendedLikesInfo: {
                        likesCount: fieldPost.extendedLikesInfo.likesCount,
                        dislikesCount: fieldPost.extendedLikesInfo.dislikesCount,
                        myStatus: userLikeStatus,
                        newestLikes: allLikeUserMapping
                    }
                }
        }))

        const allCount: number = await POSTS.countDocuments({})

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allPostMapping
        }
    }

    public async getAllPostsOfBlog (blogURIId: string, queryAll: notStringQueryReqPag, userId: ObjectId | null):
        Promise<resultPostObjectType | null> 
    {
        const blogParamsId: ObjectId = new ObjectId(blogURIId)

       /* const blogFind: null | blogBDType = await BlogService.findBlogById(blogParamsId)

        if (!blogFind) {
            return null
        }

        const postsOfFindBlog: postBDType [] = await POSTS.find({blogId: blogParamsId})
                                                                                        .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                                                        .limit(queryAll.pageSize)
                                                                                        .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()*/

                                                                                        const postsOfFindBlog: [] = []

        const allPostMapping: postAllMaps [] = await Promise.all(postsOfFindBlog.map(async (fieldPost: postBDType) => {

                let userLikeStatus: myLikeStatus = myLikeStatus.None
                let allLikeUserMapping: newestLikes[] | [] = []

                if (userId) {
                    const likeUserArray: null | likesBDType = await LikeService.checkedLike(fieldPost._id, userId)

                    if(likeUserArray) {
                        userLikeStatus = likeUserArray.user.myStatus
                    }
                }

                const resultUserLikeMapping: newestLikes[] | null = await LikeService.userLikeMaper(fieldPost._id)

                if (resultUserLikeMapping) {
                    allLikeUserMapping = resultUserLikeMapping
                }

                return {
                    id: fieldPost._id,
                    title: fieldPost.title,
                    shortDescription: fieldPost.shortDescription,
                    content: fieldPost.content,
                    blogId: fieldPost.blogId,
                    blogName: fieldPost.blogName,
                    createdAt: fieldPost.createdAt,
                    extendedLikesInfo: {
                        likesCount: fieldPost.extendedLikesInfo.likesCount,
                        dislikesCount: fieldPost.extendedLikesInfo.dislikesCount,
                        myStatus: userLikeStatus,
                        newestLikes: allLikeUserMapping
                    }
                }
        }))

        const allCount: number = await POSTS.countDocuments({blogId: blogParamsId})
        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        const allPostsOfBlog: resultPostObjectType = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items:  allPostMapping
        }

        return allPostsOfBlog
    }

    public async getAllUsers(queryAll: notStringQueryReqPagSearchAuth):
        Promise<resultUserObjectType> 
    {
        /*const usersAll: userBDType [] = await USERS
                                                    .find(
                                                        {
                                                            $or: [
                                                                {"infUser.login": new RegExp(queryAll.searchLoginTerm, 'gi')},
                                                                {"infUser.email": new RegExp(queryAll.searchEmailTerm, 'gi')}
                                                            ]
                                                        }
                                                    )
                                                    .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                    .limit(queryAll.pageSize)
                                                    .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()*/
                                                    const usersAll: [] = []

        const allMapsUsers: userAllMaps [] = usersAll.map((fieldUser: userBDType) => {
            return {
                id: fieldUser._id,
                login: fieldUser.infUser.login,
                email: fieldUser.infUser.email,
                createdAt: fieldUser.infUser.createdAt
            }
        })

        const allCount: number = await USERS.countDocuments(
                                                            {
                                                                $or: [
                                                                    {"infUser.login": new RegExp(queryAll.searchLoginTerm, 'gi')},
                                                                    {"infUser.email": new RegExp(queryAll.searchEmailTerm, 'gi')}
                                                                ]
                                                            })

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMapsUsers
        }
    }

    public async getAllCommentsOfPost(postURIId: string, queryAll: notStringQueryReqPag, userId: ObjectId | null):
        Promise<null | resultCommentObjectType> 
    {
        const postID: ObjectId = new ObjectId(postURIId)

        const findPost: null | postBDType = await PostService.findPost(postID)

        if (!findPost) {
            return null
        }

        /*const comments: commentOfPostBDType [] = await COMMENTS.find({postId: postID})
                                                                                        .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                                                        .limit(queryAll.pageSize)
                                                                                        .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()*/

                                                                                        const comments: [] = []

        const allMapsComments: commentAllMaps [] = await Promise.all(comments.map(async (fieldComment: commentOfPostBDType) => {

            let myUserStatus: myLikeStatus = myLikeStatus.None

            if (userId) {

            const checkLikeComment: null | likesBDType = await LikeService.checkedLike(fieldComment._id, userId)

                if (checkLikeComment) {
                    myUserStatus = checkLikeComment.user.myStatus
                }
            }

            return {
                id: fieldComment._id,
                content: fieldComment.content,
                commentatorInfo: {
                    userId: fieldComment.commentatorInfo.userId,
                    userLogin: fieldComment.commentatorInfo.userLogin,
                },
                createdAt: fieldComment.createdAt,
                likesInfo: {
                    likesCount: fieldComment.likesInfo.likesCount,
                    dislikesCount: fieldComment.likesInfo.dislikesCount,
                    myStatus: myUserStatus
                }
            }
        }))

        const allCount: number = await COMMENTS.countDocuments({postId: postID})

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMapsComments
        }
    }
}

export default new QueryService()