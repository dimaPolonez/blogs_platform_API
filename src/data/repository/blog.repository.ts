import { ObjectId } from "mongodb"
import { blogBDType, blogObjectResult, blogReqType } from "../../models/blog.models"
import { BlogModel } from "../entity/blog.entity"


class blogRepository {

    public async findOneByIdReturnDoc(blogID: string){

        const objectBlogID: ObjectId = new ObjectId(blogID)

        return await BlogModel.findOne({_id: objectBlogID})
    }
    
    public async findOneById(blogID: string):
        Promise<null | blogObjectResult>
    {
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
       const newBlogSmart = new BlogModel({
            name: blogDTO.name,
            description: blogDTO.description,
            websiteUrl: blogDTO.websiteUrl,
            createdAt: new Date().toISOString()
        })

        await this.save(newBlogSmart)

        return {
            id: newBlogSmart._id,
            name: newBlogSmart.name,
            description: newBlogSmart.description,
            websiteUrl: newBlogSmart.websiteUrl,
            createdAt: newBlogSmart.createdAt
        }
    }

    public async updateBlog(blogID: string, blogDTO: blogReqType){

        const findBlogDocument = await this.findOneByIdReturnDoc(blogID)

        if (!findBlogDocument) {
            return false
        }

        await findBlogDocument.updateOne(blogDTO)

        await this.save(findBlogDocument)

        return true
    }

    public async deleteBlog(blogID: string):
        Promise<boolean>
    {
        const findBlogModel: blogObjectResult | null = await this.findOneById(blogID)

        if (!findBlogModel) {
            return false
        }

        const objectBlogID: ObjectId = new ObjectId(blogID)

        await BlogModel.deleteOne({ _id: objectBlogID })

        return true
    }

    public async deleteAllBlog()
{
    await BlogModel.deleteMany({})
}

    public async save(model: any) {
        return await model.save()
    }

}

export default new blogRepository()