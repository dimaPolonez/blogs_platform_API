import {BLOGS} from '../data/db.data';
import {ObjectId} from "mongodb";
import {blogBDType, blogObjectResult, blogReqType} from "../models/blog.models";

class BlogService {

    public async findBlogById(bodyID: ObjectId):
        Promise<null | blogBDType>
    {
        const findBlogById: null | blogBDType = await BLOGS.findOne({_id: bodyID});

        if (!findBlogById) {
            return null
        }

        return findBlogById
    }

    public async getOneBlog(bodyID: ObjectId):
        Promise<null | blogObjectResult> 
    {
        const findBlog: null | blogBDType = await this.findBlogById(bodyID);

        if (!findBlog) {
            return null;
        }

        return {
                id: findBlog._id,
                name: findBlog.name,
                description: findBlog.description,
                websiteUrl: findBlog.websiteUrl,
                createdAt: findBlog.createdAt
            }
    }

    public async createNewBlog(body: blogReqType):
        Promise<blogObjectResult> 
    {
        const newGenerateId: ObjectId = new ObjectId();
        const nowDate: string = new Date().toISOString();

        await BLOGS.insertOne({
                                _id: newGenerateId,
                                name: body.name,
                                description: body.description,
                                websiteUrl: body.websiteUrl,
                                createdAt: nowDate
                            });

        return {
            id: newGenerateId,
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: nowDate
        }
    }

    public async updateBlog(bodyID: ObjectId, body: blogReqType):
        Promise<boolean> 
    {
        const findBlog: null | blogBDType = await this.findBlogById(bodyID);

        if (!findBlog) {
            return false;
        }

        await BLOGS.updateOne({_id: bodyID}, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        });

        return true;
    }

    public async deleteBlog(bodyID: ObjectId):
        Promise<boolean> 
    {

        const findBlog: null | blogBDType = await this.findBlogById(bodyID);

        if (!findBlog) {
            return false;
        }

        await BLOGS.deleteOne({_id: bodyID});

        return true;
    }
}

export default new BlogService();
