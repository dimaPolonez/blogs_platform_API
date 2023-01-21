import {BLOGS} from '../data/db.data';
import {ObjectId} from "mongodb";
import {blogBDType, blogObjectResult, blogReqType} from "../models/blog.models";

class blogService {
    async findBlog(bodyID: ObjectId):
        Promise<blogBDType []> {
        const result: blogBDType [] = await BLOGS.find({_id: bodyID}).toArray();

        return result
    }

    async getOne(bodyID: ObjectId):
        Promise<false | blogObjectResult> {

        const find: blogBDType [] = await this.findBlog(bodyID);

        if (find.length === 0) {
            return false;
        }

        const blog: blogBDType [] = await BLOGS.find({_id: bodyID}).toArray();

        const objResult: blogObjectResult [] = blog.map((field: blogBDType) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        });

        return objResult[0]
    }

    async create(body: blogReqType):
        Promise<blogObjectResult> {
        const newDateCreated: string = new Date().toISOString();

        const createdBlog = await BLOGS.insertOne({
            _id: new ObjectId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: newDateCreated
        });

        let result: blogBDType [] = await BLOGS.find({_id: createdBlog.insertedId}).toArray();

        const objResult: blogObjectResult [] = result.map((field: blogBDType) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        });

        return objResult[0]
    }

    async update(bodyID: ObjectId, body: blogReqType):
        Promise<boolean> {

        const find: blogBDType [] = await this.findBlog(bodyID);

        if (find.length === 0) {
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

    async delete(bodyID: ObjectId):
        Promise<boolean> {

        const find: blogBDType [] = await this.findBlog(bodyID);

        if (find.length === 0) {
            return false;
        }

        await BLOGS.deleteOne({_id: bodyID});

        return true;
    }
}

export default new blogService();
