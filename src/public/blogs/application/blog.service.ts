import {
    BlogBDType,
    BlogReqType,
    PostOfBlogReqType, PostReqType
} from "../../../core/models";
import BlogRepository from "../repository/blog.repository";
import PostRepository from "../../posts/repository/post.repository";
import {ObjectId} from "mongodb";

class BlogService {

    public async createNewBlog(
        body: BlogReqType
    ):Promise<string>{
        return await BlogRepository.createBlog(body)
    }

    public async updateBlog(
        blogId: string,
        body: BlogReqType
    ):Promise<boolean>{
        const findBlog: null | BlogBDType = await BlogRepository.findBlog(blogId)

        if (!findBlog) {
            return false
        }

        await BlogRepository.updateBlog(blogId, body)
        return true
    }

    public async deleteBlog(
        blogId: string
    ):Promise<boolean>{

        const findBlog: null | BlogBDType = await BlogRepository.findBlog(blogId)

        if (!findBlog) {
            return false
        }

        await BlogRepository.deleteBlog(blogId)
        return true
    }

    public async createOnePostOfBlog(
        blogIdString: string,
        body: PostOfBlogReqType
    ):Promise<string | null>{
        const findBlog: null | BlogBDType = await BlogRepository.findBlog(blogIdString)

        if (!findBlog) {
            return null
        }

        const blogId = new ObjectId(blogIdString)

        return await PostRepository.createPost({...body, blogId}, findBlog.name)
    }
}

export default new BlogService()
