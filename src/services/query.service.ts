import {BLOGS, COMMENTS, POSTS, USERS} from "../data/db.data";
import {notStringQueryReqPag, notStringQueryReqPagOfSearchName, objectId, queryAllComments, queryAllUser, queryReqPagOfSearchName, requestQuery, requestQuerySearch, resultObjectType, typeBodyID} from "../models/request.models";
import {usersFieldsType} from "../models/data.models";
import { blogAllMaps, blogBDType, resultBlogObjectType } from "../models/blog.models";
import { postAllMaps, postBDType, resultPostObjectType } from "../models/post.models";

function sortObject(sortDir: string){
    return (sortDir === 'desc') ? -1 : 1;
}

function skippedObject(pageNum: number, pageSize: number): number {
    return (pageNum - 1) * pageSize;
}

class queryService {

    async getAllBlogs(
        queryAll: notStringQueryReqPagOfSearchName) :
        Promise <resultBlogObjectType> 
        {

        const blogs: blogBDType []  = await BLOGS
            .find({name: new RegExp(queryAll.searchNameTerm, 'gi')})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}).toArray();


        const allMaps: blogAllMaps [] = blogs.map((field) => {
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

    async getAllPosts(queryAll: notStringQueryReqPag) : Promise <resultPostObjectType> {

        const posts: postBDType [] = await POSTS.find({})
        .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
        .limit(queryAll.pageSize)
        .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray();

        const allMaps: postAllMaps [] = posts.map((field) => {
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
    (bodyID: objectId, queryAll: notStringQueryReqPag): 
    Promise<resultPostObjectType | false> 
    {
        if (!bodyID) {
            throw new Error('не указан ID');
        }

        const result: blogBDType [] = await BLOGS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return false;
        }

        const posts: postBDType [] = await POSTS.find({blogId: bodyID})
        .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
        .limit(queryAll.pageSize)
        .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray();

        const allMaps: postAllMaps [] = posts.map((field) => {
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

    async getAllUsers(queryAll: queryAllUser) {

        const users = await USERS
            .find(
                {
                    $or: [
                        {login: new RegExp(queryAll.searchLoginTerm, 'gi')},
                        {email: new RegExp(queryAll.searchEmailTerm, 'gi')}
                    ]
                }
            )
            .skip(skipped(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sort(queryAll.sortDirection)})).toArray();

        const allMaps = users.map((field: usersFieldsType) => {
            return {
                id: field._id,
                login: field.login,
                email: field.email,
                createdAt: field.createdAt
            }
        });

        const allCount = await USERS.countDocuments(
            {
                $or: [
                    {login: new RegExp(queryAll.searchLoginTerm, 'gi')},
                    {email: new RegExp(queryAll.searchEmailTerm, 'gi')}
                ]
            });

        const pagesCount = Math.ceil(allCount / queryAll.pageSize)

        const resultObject = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMaps
        }

        return resultObject
    }

    async getAllCommentsOfBlog(bodyID: typeBodyID, queryAll: queryAllComments) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }

        const result = await POSTS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return false;
        }

        const comments = await COMMENTS.find({postId: bodyID})
            .skip(skipped(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sort(queryAll.sortDirection)})).toArray();

        const allMaps = comments.map((field) => {
            return {
                id: field._id,
                content: field.content,
                userId: field.userId,
                userLogin: field.userLogin,
                createdAt: field.createdAt
            }
        });
        const allCount = await COMMENTS.countDocuments({postId: bodyID});
        const pagesCount = Math.ceil(+allCount / queryAll.pageSize)

        const resultObject = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: +allCount,
            items: allMaps
        }

        return resultObject

    }

}

export default new queryService();