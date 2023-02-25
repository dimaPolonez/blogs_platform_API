import {blogAllMaps, blogBDType, blogObjectResult, resultBlogObjectType} from "../../models/blog.models"
import {commentAllMaps, commentOfPostBDType, resultCommentObjectType} from "../../models/comment.models"
import {likesBDType, myLikeStatus} from "../../models/likes.models"
import {postAllMaps, postBDType, postObjectResult, resultPostObjectType} from "../../models/post.models"
import {
    notStringQueryReqPag,
    notStringQueryReqPagOfSearchName,
    notStringQueryReqPagSearchAuth
} from "../../models/request.models"
import {resultUserObjectType, userAllMaps, userBDType} from "../../models/user.models"
import {BlogModel} from "../entity/blog.entity"
import {CommentModel} from "../entity/comment.entity"
import {PostModel} from "../entity/post.entity"
import {UserModel} from "../entity/user.entity"
import {blogRepository} from "./blog.repository";
import {postRepository} from "./post.repository";
import {likeService} from "../../services/like.service";

function sortObject(sortDir: string) {
    return (sortDir === 'desc') ? -1 : 1
}

function skippedObject(pageNum: number, pageSize: number) {
    return (pageNum - 1) * pageSize
}

class QueryRepository {

    public async getAllBlogs(queryAll: notStringQueryReqPagOfSearchName):
        Promise<resultBlogObjectType> {
        const allBlogs: blogBDType[] = await BlogModel
            .find({name: new RegExp(queryAll.searchNameTerm, 'gi')})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})

        const allMapsBlog: blogAllMaps[] = allBlogs.map((field: blogBDType) => {
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

    public async getAllPostsOfBlog(blogID: string, queryAll: notStringQueryReqPag, userID: string):
        Promise<null | resultPostObjectType> {
        const blogFind: blogObjectResult | null = await blogRepository.findOneById(blogID)

        if (!blogFind) {
            return null
        }

        const postsOfFindBlog: postBDType[] = await PostModel
            .find({blogId: blogID})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}))

        const allPostMapping: postAllMaps[] = await Promise.all(postsOfFindBlog.map(async (fieldPost: postBDType) => {

            let likeStatus: myLikeStatus = myLikeStatus.None

            if (userID) {
                const likeStatusChecked: likesBDType | null = await likeService.checkedLike(fieldPost._id, userID)

                if (likeStatusChecked) {
                    likeStatus = likeStatusChecked.user.myStatus
                }
            }

            const newestLikes = await likeService.threeUserLikesArray(fieldPost._id)

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
                    myStatus: likeStatus,
                    newestLikes: newestLikes
                }
            }
        }))

        const allCount: number = await PostModel.countDocuments({blogId: blogID})
        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        const allPostsOfBlog: resultPostObjectType = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allPostMapping
        }

        return allPostsOfBlog

    }

    public async getAllPosts(queryAll: notStringQueryReqPag, userID: string):
        Promise<resultPostObjectType> {
        const allPostsFind: postBDType [] = await PostModel
            .find({})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}))

        const allPostMapping: postAllMaps [] = await Promise.all(allPostsFind.map(async (fieldPost: postBDType) => {

            let likeStatus: myLikeStatus = myLikeStatus.None

            if (userID) {
                const likeStatusChecked = await likeService.checkedLike(fieldPost._id, userID)

                if (likeStatusChecked) {
                    likeStatus = likeStatusChecked.user.myStatus
                }
            }

            const newestLikes = await likeService.threeUserLikesArray(fieldPost._id)

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
                    myStatus: likeStatus,
                    newestLikes: newestLikes
                }
            }
        }))

        const allCount: number = await PostModel.countDocuments({})

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allPostMapping
        }
    }

    public async getAllUsers(queryAll: notStringQueryReqPagSearchAuth):
        Promise<resultUserObjectType> {
        const usersAll: userBDType [] = await UserModel
            .find({
                $or: [
                    {"infUser.login": new RegExp(queryAll.searchLoginTerm, 'gi')},
                    {"infUser.email": new RegExp(queryAll.searchEmailTerm, 'gi')}
                ]
            })
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}))

        const allMapsUsers: userAllMaps [] = usersAll.map((fieldUser: userBDType) => {
            return {
                id: fieldUser._id,
                login: fieldUser.infUser.login,
                email: fieldUser.infUser.email,
                createdAt: fieldUser.infUser.createdAt
            }
        })

        const allCount: number = await UserModel
            .countDocuments({
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

    public async getAllCommentsOfPost(postID: string, queryAll: notStringQueryReqPag, userID: string):
        Promise<null | resultCommentObjectType> {

        const findPost: null | postObjectResult = await postRepository.findOneById(postID, null)

        if (!findPost) {
            return null
        }

        const comments: commentOfPostBDType [] = await CommentModel
            .find({postId: findPost.id})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}))

        const allMapsComments: commentAllMaps [] = await Promise.all(comments.map(async (fieldComment: commentOfPostBDType) => {

            let myUserStatus: myLikeStatus = myLikeStatus.None

            if (userID) {

                const checkLikeComment: null | likesBDType = await likeService.checkedLike(fieldComment._id, userID)

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

        const allCount: number = await CommentModel.countDocuments({postId: findPost.id})

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

export const queryRepository = new QueryRepository()