import {BlogBDType, BlogReqType} from "../../../core/models";
import {BLOGS} from "../../../core/db.data";
import {ObjectId} from "mongodb";

class BlogRepository {

    async findBlog(
        blogId: string
    ):Promise<BlogBDType | null> {
        return await BLOGS.findOne({_id: new ObjectId(blogId)})
    }

    async updateBlog(
        blogId: string,
        body: BlogReqType
    ){
        await BLOGS.updateOne({_id: new ObjectId(blogId)}, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        })
    }

    async deleteBlog(
        blogId: string
    ){
        await BLOGS.deleteOne({_id: new ObjectId(blogId)})
    }

    async createBlog(
        body: BlogReqType
    ):Promise<string>{
        const newIdBlog: ObjectId = new ObjectId()

        await BLOGS.insertOne({
            _id: newIdBlog,
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString()
        })

        return newIdBlog.toString()
    }

}

export default new BlogRepository()