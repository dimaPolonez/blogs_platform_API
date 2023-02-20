import {ObjectId} from "mongodb"
import {blogBDType, blogObjectResult, blogReqType} from "../../models/blog.models"
import {blogBDSchema, BlogModel} from "../entity/blog.entity"


class blogRepository {

    public async findOneByIdReturnDoc(blogID: string) {

        const objectBlogID: ObjectId = new ObjectId(blogID)

        const findBlogSmart: null | blogBDType = await BlogModel.findOne({_id: objectBlogID})

        return findBlogSmart
    }

    public async findOneById(blogID: string):
        Promise<null | blogObjectResult> {
        const objectBlogID: ObjectId = new ObjectId(blogID)

        const findBlogSmart: null | blogBDType = await BlogModel.findOne({_id: objectBlogID})

        if (!findBlogSmart) {
            return null
        }

        return {
            id: findBlogSmart._id,
            name: findBlogSmart.name,
            description: findBlogSmart.description,
            websiteUrl: findBlogSmart.websiteUrl,
            createdAt: findBlogSmart.createdAt
        }

    }

    public async createBlog(blogDTO: blogReqType):
        Promise<blogObjectResult>
    {
        const newBlogSmart = await BlogModel.createBlog(blogDTO)

        return {
            id: newBlogSmart._id,
            name: newBlogSmart.name,
            description: newBlogSmart.description,
            websiteUrl: newBlogSmart.websiteUrl,
            createdAt: newBlogSmart.createdAt
        }
    }

    public async updateBlog(blogID: string, blogDTO: blogReqType) {

        const updatedBlogResult: boolean = BlogModel.updateBlog(blogID, blogDTO)

        return updatedBlogResult
    }

    public async deleteBlog(blogID: string):
        Promise<boolean>
    {
        const findBlogModel: blogObjectResult | null = await this.findOneById(blogID)

        if (!findBlogModel) {
            return false
        }

        const objectBlogID: ObjectId = new ObjectId(blogID)

        await BlogModel.deleteOne({_id: objectBlogID})

        return true
    }

    public async deleteAllBlog() {
        await BlogModel.deleteMany({})
    }

    public async save(model: any) {
        return await model.save()
    }

}
export default new blogRepository()