import {BLOGS, POSTS} from '../data/db.data';
import {requestBodyBlog, typeBodyID} from "../models/request.models";

const optionsBlog = {
    projection: {
        _id: 0
    }
}

class blogService {
    async getAll() {
        const blogs = await BLOGS.find({}, optionsBlog).toArray();
        return blogs;
    }

    async getOne(bodyID: typeBodyID) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }
        const blog: Array<object> = await BLOGS.find({id: bodyID}, optionsBlog).toArray();

        return blog[0];
    }

    async create(body: requestBodyBlog) {
        let idDate = Math.floor(Date.now() + Math.random());
        let newDateCreated = new Date().toISOString();

        const createdBlog = await BLOGS.insertOne({
            id: String(idDate),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: newDateCreated
        });

        let result: Array<object> = await BLOGS.find({_id: createdBlog.insertedId}, optionsBlog).toArray();

        return result[0]
    }

    async update(bodyID: typeBodyID, body: requestBodyBlog) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }

        const result = BLOGS.find({id: bodyID}).toArray()

        if (!result) {
            return false;
        }

        await BLOGS.updateOne({id: bodyID}, {
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
        const result = BLOGS.find({id: bodyID}).toArray()

        if (!result) {
            return false;
        }

        await BLOGS.deleteOne({id: bodyID});

        return true;
    }
}

export default new blogService();
