import {blogObjectResult, blogReqType} from "../models/blog.models";
import {blogRepository} from '../data/repository/blog.repository';
import {BlogModel} from "../data/entity/blog.entity";

class BlogService {

    public async getOneBlog(blogID: string):
        Promise<null | blogObjectResult> {
        const oneBlog: null | blogObjectResult = await blogRepository.findOneById(blogID)

        return oneBlog
    }

    public async createNewBlog(blogDTO: blogReqType):
        Promise<string> {
        const createdBlog: blogObjectResult = await blogRepository.createBlog(blogDTO)

        const newBlogSmart = await BlogModel.createBlog(blogDTO)

        await blogRepository.save(newBlogSmart)

        return newBlogSmart._id
    }

    public async updateBlog(blogID: string, blogDTO: blogReqType):
        Promise<boolean> {
        //smarBtblog = repo.getById
        //smartblog.updateBlog(dto)
        //repo.save(smartBlog)
        const updatedBlogResult: boolean = await blogRepository.updateBlog(blogID, blogDTO)

        return updatedBlogResult
    }

    public async deleteBlog(blogID: string):
        Promise<boolean> {
        const deletedBlogResult: boolean = await blogRepository.deleteBlog(blogID)

        return deletedBlogResult
    }
}

export const blogService = new BlogService()
