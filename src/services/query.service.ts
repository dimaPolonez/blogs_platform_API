import {BLOGS, POSTS} from "../data/db.data";
import {requestQuery, typeBodyID} from "../models/request.models";

function sort(sortDir: string) {
    return (sortDir === 'desc') ? -1 : 1;
}

function skipped(pageNum: string, pageSize: string): number {
    return (+pageNum - 1) * (+pageSize);
}

class queryService {

    async getAllBlogs(
        searchNameTerm: requestQuery, pageNum: requestQuery,
        pageSize: requestQuery, sortBy: requestQuery, sortDir: requestQuery) {

        const blogs = await BLOGS.find({}).skip(skipped(pageNum, pageSize)).limit(+pageSize)
            .sort(({sortBy: sort(sortDir)})).toArray();


        const allMaps = blogs.map((field) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        });

        const allCount = await BLOGS.find({}).toArray();

        const pagesCount = Math.ceil(+allCount.length / +pageSize)

        const resultObject = {
            pagesCount: pagesCount,
            page: +pageNum,
            pageSize: +pageSize,
            totalCount: allCount.length,
            items: allMaps
        }

        return resultObject
    }

    async getAllPosts(pageNum: requestQuery, pageSize: requestQuery, sortBy: requestQuery, sortDir: requestQuery) {

        const posts = await POSTS.find({}).skip(skipped(pageNum, pageSize)).limit(+pageSize)
            .sort(({sortBy: sort(sortDir)})).toArray();

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

        const allCount = await BLOGS.find({}).toArray();
        const pagesCount = Math.ceil(+allCount.length / +pageSize)

        const resultObject = {
            pagesCount: pagesCount,
            page: +pageNum,
            pageSize: +pageSize,
            totalCount: allCount.length,
            items: allMaps
        }

        return resultObject
    }

    async getAllPostsOfBlog(bodyID: typeBodyID, pageNum: requestQuery, pageSize: requestQuery,
                            sortBy: requestQuery, sortDir: requestQuery) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }

        const posts = await POSTS.find({blogId: bodyID}).skip(skipped(pageNum, pageSize)).limit(+pageSize)
            .sort(({sortBy: sort(sortDir)})).toArray();

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
        const allCount = await BLOGS.find({}).toArray();
        const pagesCount = Math.ceil(+allCount.length / +pageSize)

        const resultObject = {
            pagesCount: pagesCount,
            page: +pageNum,
            pageSize: +pageSize,
            totalCount: allCount.length,
            items: allMaps
        }

        return resultObject

    }

}

export default new queryService();