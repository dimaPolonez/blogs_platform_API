import {BLOGS} from '../data/db.data';
import {requestBodyBlog, typeBodyID} from "../models/request.models";
import {ObjectId} from "mongodb";

class blogService {

    async getOne(bodyID: typeBodyID) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }
        const blog = await BLOGS.find({ _id: bodyID }).toArray();

        return blog.map((field) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        });
    }

    async create(body: requestBodyBlog) {
        let newDateCreated = new Date().toISOString();

        const createdBlog = await BLOGS.insertOne({
            _id: new ObjectId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: newDateCreated
        });

        let result = await BLOGS.find({_id: createdBlog.insertedId}).toArray();

        return result.map((field) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        });
    }

    async update(bodyID: typeBodyID, body: requestBodyBlog) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }

        const result = await BLOGS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
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

    async delete(bodyID: typeBodyID) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }
        const result = await BLOGS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return false;
        }

        await BLOGS.deleteOne({_id: bodyID});

        return true;
    }
}

export default new blogService();
