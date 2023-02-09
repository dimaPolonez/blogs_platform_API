import {BLOGS, COMMENTS, POSTS, USERS} from "../data/db.data";
import {
    notStringQueryReqPag,
    notStringQueryReqPagOfSearchName, notStringQueryReqPagSearchAuth
} from "../models/request.models";
import {blogAllMaps, blogBDType, resultBlogObjectType} from "../models/blog.models";
import {postAllMaps, postBDType, resultPostObjectType} from "../models/post.models";
import {resultUserObjectType, userAllMaps, userBDType} from "../models/user.models";
import {commentAllMaps, commentOfPostBDType, resultCommentObjectType} from "../models/comment.models";
import {ObjectId} from "mongodb";
import {likesBDType, myLikeStatus} from "../models/likes.models";
import likeService from "./like.service";

function sortObject(sortDir: string) {
    return (sortDir === 'desc') ? -1 : 1;
}

function skippedObject(pageNum: number, pageSize: number): number {
    return (pageNum - 1) * pageSize;
}

class queryService {

    async getAllBlogs(
        queryAll: notStringQueryReqPagOfSearchName):
        Promise<resultBlogObjectType> {

        const blogs: blogBDType [] = await BLOGS
            .find({name: new RegExp(queryAll.searchNameTerm, 'gi')})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}).toArray();


        const allMaps: blogAllMaps [] = blogs.map((field: blogBDType) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        });

        const allCount: number = await BLOGS.countDocuments({name: new RegExp(queryAll.searchNameTerm, 'gi')});
        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        const resultObject: resultBlogObjectType = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMaps
        }

        return resultObject
    }

    async getAllPosts(queryAll: notStringQueryReqPag): Promise<resultPostObjectType> {

        const posts: postBDType [] = await POSTS.find({})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray();

        const allMaps: postAllMaps [] = posts.map((field: postBDType) => {
            return {
                id: field._id,
                title: field.title,
                shortDescription: field.shortDescription,
                content: field.content,
                blogId: field.blogId,
                blogName: field.blogName,
                createdAt: field.createdAt
            }
        });

        const allCount: number = await POSTS.countDocuments({});
        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        const resultObject: resultPostObjectType = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMaps
        }

        return resultObject
    }

    async getAllPostsOfBlog
    (bodyID: ObjectId, queryAll: notStringQueryReqPag):
        Promise<resultPostObjectType | false> {

        const result: blogBDType [] = await BLOGS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return false;
        }

        const posts: postBDType [] = await POSTS.find({blogId: bodyID})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray();

        const allMaps: postAllMaps [] = posts.map((field: postBDType) => {
            return {
                id: field._id,
                title: field.title,
                shortDescription: field.shortDescription,
                content: field.content,
                blogId: bodyID,
                blogName: field.blogName,
                createdAt: field.createdAt
            }
        });
        const allCount: number = await POSTS.countDocuments({blogId: bodyID});
        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        const resultObject: resultPostObjectType = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMaps
        }

        return resultObject

    }

    async getAllUsers(queryAll: notStringQueryReqPagSearchAuth):
        Promise<resultUserObjectType> {

        const users: userBDType [] = await USERS
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
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray();

        const allMaps: userAllMaps [] = users.map((field: userBDType) => {
            return {
                id: field._id,
                login: field.infUser.login,
                email: field.infUser.email,
                createdAt: field.infUser.createdAt
            }
        });

        const allCount: number = await USERS.countDocuments(
            {
                $or: [
                    {"infUser.login": new RegExp(queryAll.searchLoginTerm, 'gi')},
                    {"infUser.email": new RegExp(queryAll.searchEmailTerm, 'gi')}
                ]
            });

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        const resultObject: resultUserObjectType = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMaps
        }

        return resultObject
    }

    async getAllCommentsOfBlog(bodyID: ObjectId, queryAll: notStringQueryReqPag, userId: string):
        Promise<false | resultCommentObjectType> {

        const result: postBDType [] = await POSTS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return false;
        }

        const comments: commentOfPostBDType [] = await COMMENTS.find({postId: bodyID})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray();

        let myUserStatus: myLikeStatus = myLikeStatus.None



        const allMaps: commentAllMaps [] = await Promise.all(comments.map(async (field: commentOfPostBDType) => {

            if (userId !== 'quest') {
            const userObjectId: ObjectId = new ObjectId(userId);

            const checked: false | likesBDType = await likeService.checked(field._id, userObjectId)

            if (checked) {
                myUserStatus = checked.user.myStatus;
            }
            }
            return {
                id: field._id,
                content: field.content,
                commentatorInfo: {
                    userId: field.commentatorInfo.userId,
                    userLogin: field.commentatorInfo.userLogin,
                },
                createdAt: field.createdAt,
                likesInfo: {
                    likesCount: field.likesInfo.likesCount,
                    dislikesCount: field.likesInfo.dislikesCount,
                    myStatus: myUserStatus
                }
            }
        }));
        const allCount: number = await COMMENTS.countDocuments({postId: bodyID});
        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        const resultObject: resultCommentObjectType = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMaps
        }

        return resultObject
    }
}

export default new queryService();