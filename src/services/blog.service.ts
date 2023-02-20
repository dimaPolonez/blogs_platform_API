import {blogObjectResult, blogReqType} from "../models/blog.models";
import blogRepository from '../data/repository/blog.repository';

class BlogService {

    public async getOneBlog(blogID: string):
        Promise<null | blogObjectResult> 
    {
        const oneBlog: null | blogObjectResult = await blogRepository.findOneById(blogID)

        return oneBlog
    }

    public async createNewBlog(blogDTO: blogReqType):
        Promise<blogObjectResult> 
    {
        const createdBlog: blogObjectResult = await blogRepository.createBlog(blogDTO) 
        
        return createdBlog

    }

    public async updateBlog(blogID: string, blogDTO: blogReqType):
        Promise<boolean> 
    {
        const updatedBlogResult: boolean = await blogRepository.updateBlog(blogID, blogDTO)

        return updatedBlogResult
    }

    public async deleteBlog(blogID: string):
        Promise<boolean> 
    {
        const deletedBlogResult: boolean = await blogRepository.deleteBlog(blogID)

        return deletedBlogResult
    }
}

export default new BlogService()
