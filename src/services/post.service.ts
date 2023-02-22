import {postObjectResult, postOfBlogReqType, postReqType} from "../models/post.models";
import PostRepository from "../data/repository/post.repository";

class PostService {

    public async getOnePost(postID: string, userID: string | null):
        Promise<null | postObjectResult> 
    {
        const findOnePost: postObjectResult | null = await PostRepository.findOneById(postID, userID)

        return findOnePost
    }

    public async createPost(postDTO: postReqType):
        Promise<postObjectResult> 
    {
        const createdPost: postObjectResult | null = await PostRepository.createPost(postDTO)

        return createdPost
    }

    public async updatePost(postID: string, postDTO: postReqType):
        Promise<boolean> 
    {
        const updatedPostResult: boolean = await PostRepository.updatePost(postID, postDTO)
        
        return updatedPostResult
    }

    public async postLike(likeDTO: string, postID: string, userID: string):
        Promise<boolean> 
    {
        const likedPostResult: boolean = await PostRepository.updatePostLiked(likeDTO, postID, userID)

        return likedPostResult
    }

    public async deletePost(postID: string):
        Promise<boolean> 
    {
        const deletedPostResult: boolean = await PostRepository.deletePost(postID)

        return deletedPostResult
    }

    public async createOnePostOfBlog(blogID: string, postDTOblogIdNone: postOfBlogReqType):
        Promise<null | postObjectResult> 
    {
        const postDTO: postReqType = {
            title: postDTOblogIdNone.title,
            shortDescription: postDTOblogIdNone.shortDescription,
            content: postDTOblogIdNone.content,
            blogId: blogID
        }

        const createdPost: postObjectResult = await PostRepository.createPost(postDTO)

        if (createdPost.blogName === 'blog not found') {
            return null
        }

        return createdPost                              
    }
}

export default new PostService()
