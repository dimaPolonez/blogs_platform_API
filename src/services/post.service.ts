import {BLOGS, POSTS} from "../data/db.data";
import {ObjectId} from "mongodb";
import {postBDType, postObjectResult, postOfBlogReqType, postReqType} from "../models/post.models";
import {blogBDType} from "../models/blog.models";

class postService {

    async findPost(bodyID: ObjectId):
        Promise<postBDType []> {
        const result: postBDType [] = await POSTS.find({_id: bodyID}).toArray();

        return result
    }

    async getOne(bodyID: ObjectId):
        Promise<false | postObjectResult> {

        const find: postBDType [] = await this.findPost(bodyID);

        if (find.length === 0) {
            return false;
        }

        const objResult: postObjectResult [] = find.map((field: postBDType) => {
            return {
                id: field._id,
                title: field.title,
                shortDescription: field.shortDescription,
                content: field.content,
                blogId: field.blogId,
                blogName: field.blogName,
                createdAt: field.createdAt
            }
        });

        return objResult[0]
    }

    async create(body: postReqType):
        Promise<postObjectResult> {

        let newDateCreated: string = new Date().toISOString();

        const blogId: ObjectId = new ObjectId(body.blogId);

        const blogFind: blogBDType [] = await BLOGS.find({_id: blogId}).toArray();
        const blogName: string [] = blogFind.map((field: blogBDType) => {
            return field.name
        })

        const createdPost = await POSTS.insertOne({
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId,
            blogName: blogName[0],
            createdAt: newDateCreated
        });

        let result: postBDType [] = await POSTS.find({_id: createdPost.insertedId}).toArray();

        const objResult: postObjectResult [] = result.map((field: postBDType) => {
            return {
                id: field._id,
                title: field.title,
                shortDescription: field.shortDescription,
                content: field.content,
                blogId: field.blogId,
                blogName: field.blogName,
                createdAt: field.createdAt
            }
        });

        return objResult[0]
    }

    async update(bodyID: ObjectId, body: postReqType):
        Promise<boolean> {

        const find: postBDType [] = await this.findPost(bodyID);

        if (find.length === 0) {
            return false;
        }

        const blogId: ObjectId = new ObjectId(body.blogId);

        const blogFind: blogBDType [] = await BLOGS.find({_id: blogId}).toArray();
        const blogName: string [] = blogFind.map((field: blogBDType) => {
            return field.name
        })

        await POSTS.updateOne({_id: bodyID}, {
            $set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId,
                blogName: blogName[0]
            }
        });

        return true;
    }

    async delete(bodyID: ObjectId):
        Promise<boolean> {

        const find: postBDType [] = await this.findPost(bodyID);

        if (find.length === 0) {
            return false;
        }

        await POSTS.deleteOne({_id: bodyID});

        return true;
    }

    async createOnePostOfBlog(bodyID: ObjectId, body: postOfBlogReqType):
        Promise<false | postObjectResult> {

        let newDateCreated: string = new Date().toISOString();

        const blogFind: blogBDType [] = await BLOGS.find({_id: bodyID}).toArray();

        if (blogFind.length === 0) {
            return false;
        }

        const blogName: string [] = blogFind.map((field: blogBDType) => {
            return field.name
        })

        const createdPost = await POSTS.insertOne({
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: bodyID,
            blogName: blogName[0],
            createdAt: newDateCreated
        });

        let result: postBDType [] = await POSTS.find({_id: createdPost.insertedId}).toArray();

        const objResult: postObjectResult [] = result.map((field: postBDType) => {
            return {
                id: field._id,
                title: field.title,
                shortDescription: field.shortDescription,
                content: field.content,
                blogId: field.blogId,
                blogName: field.blogName,
                createdAt: field.createdAt
            }
        });

        return objResult[0]
    }
}

export default new postService();
