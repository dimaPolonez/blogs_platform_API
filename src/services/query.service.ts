import {BLOGS, POSTS} from "../data/db.data";
import {requestQuery, typeBodyID} from "../models/request.models";

class queryService {
    async getAllBlogs(
        searchNameTerm: requestQuery, pageNum: requestQuery,
        pageSize: requestQuery, sortBy: requestQuery, sortDir: requestQuery) {

        const sort = (sortDir === 'desc') ? -1 : 1

        const skipped = (+pageNum - 1) * (+pageSize);

        const blogs = await BLOGS.find({}).skip(skipped).limit(+pageSize).sort(( { sortBy : sort } )).toArray();
        return blogs;
    }

    async getAllPosts(pageNum: requestQuery, pageSize: requestQuery, sortBy: requestQuery, sortDir: requestQuery) {

        const sort = (sortDir === 'desc') ? -1 : 1

        const skipped = (+pageNum - 1) * (+pageSize);

        const posts = await POSTS.find({}).skip(skipped).limit(+pageSize).sort(( { sortBy : sort } )).toArray();
        return posts;
    }

    async getAllPostsOfBlog(bodyID: typeBodyID, pageNum: requestQuery, pageSize: requestQuery,
                            sortBy: requestQuery, sortDir: requestQuery) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }

        const sort = (sortDir === 'desc') ? -1 : 1

        const skipped = (+pageNum - 1) * (+pageSize);

        const posts = await POSTS.find({}).skip(skipped).limit(+pageSize).sort(( { sortBy : sort } )).toArray();
        return posts;

    }

}

export default new queryService();