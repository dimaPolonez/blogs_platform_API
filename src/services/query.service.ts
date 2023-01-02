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

        const blogs = await BLOGS.find({}).skip(skipped(pageNum,pageSize)).limit(+pageSize)
            .sort(( { sortBy : sort(sortDir) } )).toArray();

        return blogs.map((field) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        });
    }

    async getAllPosts(pageNum: requestQuery, pageSize: requestQuery, sortBy: requestQuery, sortDir: requestQuery) {

        const posts = await POSTS.find({}).skip(skipped(pageNum,pageSize)).limit(+pageSize)
            .sort(( { sortBy : sort(sortDir) } )).toArray();

        return posts.map((field) => {
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
    }

    async getAllPostsOfBlog(bodyID: typeBodyID, pageNum: requestQuery, pageSize: requestQuery,
                            sortBy: requestQuery, sortDir: requestQuery) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }

        const posts = await POSTS.find({ blogId: bodyID}).skip(skipped(pageNum,pageSize)).limit(+pageSize)
            .sort(( { sortBy : sort(sortDir) } )).toArray();

        return posts.map((field) => {
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

    }

}

export default new queryService();