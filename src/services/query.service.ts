import {BLOGS, COMMENTS, POSTS, USERS} from "../core/db.data";
import {ObjectId} from "mongodb";
import LikeService from "../helpers/like.service";
import BlogService from "../public/blogs/application/blog.service";
import PostService from "../public/posts/application/post.service";
import {
    BlogAllMapsType,
    BlogBDType, CommentAllMapsType, CommentOfPostBDType,
    LikesBDType,
    MyLikeStatus,
    NewestLikesType,
    NotStringQueryReqPagOfSearchNameType,
    NotStringQueryReqPagSearchAuthType,
    NotStringQueryReqPagType,
    PostAllMapsType,
    PostBDType,
    ResultBlogObjectType,
    ResultCommentObjectType,
    ResultPostObjectType,
    ResultUserObjectType,
    UserAllMapsType,
    UserBDType
} from "../core/models";

function sortObject(sortDir: string)
{
    return (sortDir === 'desc') ? -1 : 1
}

function skippedObject(pageNum: number, pageSize: number)
{
    return (pageNum - 1) * pageSize
}

class QueryService {

    public async getAllBlogs(
        queryAll: NotStringQueryReqPagOfSearchNameType
    ):Promise<ResultBlogObjectType>{
        const allBlogs: BlogBDType [] = await BLOGS
                                                .find({name: new RegExp(queryAll.searchNameTerm, 'gi')})
                                                .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                .limit(queryAll.pageSize)
                                                .sort({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}).toArray()

        const allMapsBlog: BlogAllMapsType[] = allBlogs.map((field: BlogBDType) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        })

        const allCount: number = await BLOGS.countDocuments({name: new RegExp(queryAll.searchNameTerm, 'gi')})

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMapsBlog
        }
    }

    public async getAllPosts(
        queryAll: NotStringQueryReqPagType,
        userId: ObjectId | null)
        :Promise<ResultPostObjectType>{
        const allPostsFind: PostBDType [] = await POSTS.find({})
                                                                .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                                .limit(queryAll.pageSize)
                                                                .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()

        const allPostMapping: PostAllMapsType [] = await Promise.all(allPostsFind.map(async (fieldPost: PostBDType) => {

                let userLikeStatus: MyLikeStatus = MyLikeStatus.None
                let allLikeUserMapping: NewestLikesType[] | [] = []

                if (userId) {
                    const likeUserArray: null | LikesBDType = await LikeService.checkedLike(fieldPost._id, userId)

                    if (likeUserArray) {
                        userLikeStatus = likeUserArray.user.myStatus
                    }
                }

                const resultUserLikeMapping: NewestLikesType[] | null = await LikeService.userLikeMaper(fieldPost._id)

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

    public async getAllPostsOfBlog(
        blogURIId: string,
        queryAll: NotStringQueryReqPagType,
        userId: ObjectId | null
    ):Promise<ResultPostObjectType | null>{
        const blogParamsId: ObjectId = new ObjectId(blogURIId)

        const blogFind: null | BlogBDType = await BlogService.findBlogById(blogParamsId)

        if (!blogFind) {
            return null
        }

        const postsOfFindBlog: PostBDType [] = await POSTS.find({blogId: blogParamsId})
                                                                                        .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                                                        .limit(queryAll.pageSize)
                                                                                        .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()

        const allPostMapping: PostAllMapsType[] = await Promise.all(postsOfFindBlog.map(async (fieldPost: PostBDType) => {

                let userLikeStatus: MyLikeStatus = MyLikeStatus.None
                let allLikeUserMapping: NewestLikesType[] | [] = []

                if (userId) {
                    const likeUserArray: null | LikesBDType = await LikeService.checkedLike(fieldPost._id, userId)

                    if(likeUserArray) {
                        userLikeStatus = likeUserArray.user.myStatus
                    }
                }

                const resultUserLikeMapping: NewestLikesType[] | null = await LikeService.userLikeMaper(fieldPost._id)

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

        const allPostsOfBlog: ResultPostObjectType = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items:  allPostMapping
        }

        return allPostsOfBlog
    }

    public async getAllUsers(
        queryAll: NotStringQueryReqPagSearchAuthType
    ):Promise<ResultUserObjectType>{
        const usersAll: UserBDType [] = await USERS
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
                                                    .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()

        const allMapsUsers: UserAllMapsType[] = usersAll.map((fieldUser: UserBDType) => {
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

    public async getAllCommentsOfPost(
        postURIId: string,
        queryAll: NotStringQueryReqPagType,
        userId: ObjectId | null
    ):Promise<null | ResultCommentObjectType>{
        const postID: ObjectId = new ObjectId(postURIId)

        const findPost: null | PostBDType = await PostService.findPost(postID)

        if (!findPost) {
            return null
        }

        const comments: CommentOfPostBDType[] = await COMMENTS.find({postId: postID})
                                                                                        .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                                                        .limit(queryAll.pageSize)
                                                                                        .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()

        const allMapsComments: CommentAllMapsType[] = await Promise.all(comments.map(async (fieldComment: CommentOfPostBDType) => {

            let myUserStatus: MyLikeStatus = MyLikeStatus.None

            if (userId) {

            const checkLikeComment: null | LikesBDType = await LikeService.checkedLike(fieldComment._id, userId)

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