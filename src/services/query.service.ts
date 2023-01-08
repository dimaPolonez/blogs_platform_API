import {BLOGS, POSTS, USERS} from "../data/db.data";
import {queryAllUser, requestQuery, requestQueryAll, requestQuerySearch, typeBodyID} from "../models/request.models";
import {usersFieldsType} from "../models/data.models";

function sort(sortDir: string) {
    return (sortDir === 'desc') ? -1 : 1;
}

function skipped(pageNum: string | number, pageSize: string | number): number {
    return (+pageNum - 1) * (+pageSize);
}

class queryService {

    async getAllBlogs(
        searchNameTerm: requestQuerySearch, pageNum: requestQuery,
        pageSize: requestQuery, sortBy: requestQuery, sortDir: requestQuery) {

        const blogs = await BLOGS
            .find({name: new RegExp(searchNameTerm,'gi')})
            .skip(skipped(pageNum, pageSize)).limit(+pageSize)
            .sort({[sortBy]: sort(sortDir)}).toArray();


        const allMaps = blogs.map((field) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        });

        const allCount = await BLOGS.countDocuments({name: new RegExp(searchNameTerm,'gi')});
        const pagesCount = Math.ceil(+allCount / +pageSize)

        const resultObject = {
            pagesCount: pagesCount,
            page: +pageNum,
            pageSize: +pageSize,
            totalCount: allCount,
            items: allMaps
        }

        return resultObject
    }

    async getAllPosts(pageNum: requestQuery, pageSize: requestQuery, sortBy: requestQuery, sortDir: requestQuery) {

        const posts = await POSTS.find({}).skip(skipped(pageNum, pageSize)).limit(+pageSize)
            .sort(({[sortBy]: sort(sortDir)})).toArray();

        const allMaps = posts.map((field) => {
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

        const allCount = await POSTS.countDocuments({});
        const pagesCount = Math.ceil(+allCount / +pageSize)

        const resultObject = {
            pagesCount: pagesCount,
            page: +pageNum,
            pageSize: +pageSize,
            totalCount: allCount,
            items: allMaps
        }

        return resultObject
    }

    async getAllPostsOfBlog(bodyID: typeBodyID, pageNum: requestQuery, pageSize: requestQuery,
                            sortBy: requestQuery, sortDir: requestQuery) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }

        const result = await BLOGS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return false;
        }

        const posts = await POSTS.find({blogId: bodyID}).skip(skipped(pageNum, pageSize)).limit(+pageSize)
            .sort(({[sortBy]: sort(sortDir)})).toArray();

        const allMaps = posts.map((field) => {
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
        const allCount = await POSTS.countDocuments({blogId: bodyID});
        const pagesCount = Math.ceil(+allCount / +pageSize)

        const resultObject = {
            pagesCount: pagesCount,
            page: +pageNum,
            pageSize: +pageSize,
            totalCount: +allCount,
            items: allMaps
        }

        return resultObject

    }

    async getAllUsers(queryAll: queryAllUser) {

        const users = await USERS
            .find({$and:[
                {login: new RegExp(queryAll.searchLoginTerm,'gi')},
                {email: new RegExp(queryAll.searchEmailTerm,'gi')}
                ]})
            .skip(skipped(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sort(queryAll.sortDirection)})).toArray();

        const allMaps = users.map((field:usersFieldsType) => {
            return {
                id: field._id,
                login: field.login,
                email: field.email,
                createdAt: field.createdAt
            }
        });

        const allCount = await USERS.countDocuments(
            {$and:[
                    {login: new RegExp(queryAll.searchLoginTerm,'gi')},
                    {email: new RegExp(queryAll.searchEmailTerm,'gi')}
                ]});
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

}

export default new queryService();