import mongoose, {Model, Schema} from "mongoose";
import {blogBDType, blogReqType} from "../../models/blog.models";
import {blogRepository} from "../repository/blog.repository";

type BlogStaticType = Model<blogBDType> & {
    createBlog(blogDTO: blogReqType): any,
    updateBlog(blogID: string, blogDTO: blogReqType): boolean
}

export const blogBDSchema = new Schema<blogBDType, BlogStaticType>({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String
})

blogBDSchema.static({
    async createBlog(blogDTO: blogReqType):
        Promise<any> {
        const newBlogSmart = new BlogModel({
            name: blogDTO.name,
            description: blogDTO.description,
            websiteUrl: blogDTO.websiteUrl,
            createdAt: new Date().toISOString()
        })

        return newBlogSmart
    }
})

blogBDSchema.static({
    async updateBlog(blogID: string, blogDTO: blogReqType):
        Promise<boolean> {
        const findBlogDocument = await blogRepository.findOneByIdReturnDoc(blogID)

        if (!findBlogDocument) {
            return false
        }

        findBlogDocument.name = blogDTO.name
        findBlogDocument.description = blogDTO.description
        findBlogDocument.websiteUrl = blogDTO.websiteUrl

        await blogRepository.save(findBlogDocument)

        return true
    }
})

export const BlogModel = mongoose.model<blogBDType, BlogStaticType>('blogs', blogBDSchema)



