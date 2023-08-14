import {BLOGS} from '../../../core/db.data';
import {ObjectId} from "mongodb";
import {BlogBDType, BlogObjectResultType, BlogReqType} from "../../../core/models";

class BlogService {

    public async findBlogById(
        bodyID: ObjectId
    ):Promise<null | BlogBDType>{
        const findBlogById: null | BlogBDType = await BLOGS.findOne({_id: bodyID})

        if (!findBlogById) {
            return null
        }

        return findBlogById
    }

    public async getOneBlog(
        blogURIId: string
    ):Promise<null | BlogObjectResultType>{
        const bodyID: ObjectId = new ObjectId(blogURIId)

        const findBlog: null | BlogBDType = await this.findBlogById(bodyID)

        if (!findBlog) {
            return null
        }

        return {
                id: findBlog._id,
                name: findBlog.name,
                description: findBlog.description,
                websiteUrl: findBlog.websiteUrl,
                createdAt: findBlog.createdAt
            }
    }

    public async createNewBlog(
        body: BlogReqType
    ):Promise<BlogObjectResultType>{
        const newGenerateId: ObjectId = new ObjectId()

        const nowDate: string = new Date().toISOString()

        await BLOGS.insertOne({
                                _id: newGenerateId,
                                name: body.name,
                                description: body.description,
                                websiteUrl: body.websiteUrl,
                                createdAt: nowDate
                            })

        return {
            id: newGenerateId,
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: nowDate
        }
    }

    public async updateBlog(
        blogURIId: string,
        body: BlogReqType
    ):Promise<boolean>{
        const bodyID: ObjectId = new ObjectId(blogURIId)

        const findBlog: null | BlogBDType = await this.findBlogById(bodyID)

        if (!findBlog) {
            return false
        }

        await BLOGS.updateOne({_id: bodyID}, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        })

        return true
    }

    public async deleteBlog(
        blogURIId: string
    ):Promise<boolean>{
        const bodyID: ObjectId = new ObjectId(blogURIId)

        const findBlog: null | BlogBDType = await this.findBlogById(bodyID)

        if (!findBlog) {
            return false
        }

        await BLOGS.deleteOne({_id: bodyID})

        return true
    }
}

export default new BlogService()
