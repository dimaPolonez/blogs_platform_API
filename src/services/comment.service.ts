import {requestBodyComment, typeBodyID} from "../models/request.models";
import {BLOGS, COMMENTS, POSTS} from "../data/db.data";
import {ObjectId} from "mongodb";

class commentService {

    async getOne(bodyID: typeBodyID) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }
        const comment = await COMMENTS.find({_id: bodyID}).toArray();

        const objResult = comment.map((field) => {
            return {
                id: field._id,
                content: field.content,
                userId: field.userId,
                userLogin: field.userLogin,
                createdAt: field.createdAt
            }
        });

        return objResult[0]
    }

    async update(bodyID: typeBodyID, body: requestBodyComment) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }

        const result = await COMMENTS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return false;
        }

        await COMMENTS.updateOne({_id: bodyID}, {
            $set: {
                content: body.content
            }
        });

        return true;
    }

    async delete(bodyID: typeBodyID) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }
        const result = await COMMENTS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return false;
        }

        await COMMENTS.deleteOne({_id: bodyID});

        return true;
    }

    async createCommentOfPost(postId: ObjectId, body: requestBodyComment) {
        let newDateCreated = new Date().toISOString();

        const postFind = await POSTS.find({_id: postId}).toArray();

        if (postFind.length === 0) {
            return false;
        }

        const createdComment = await COMMENTS.insertOne({
            _id: new ObjectId(),
            content: body.content,
            userId: 'body.userId',
            userLogin: 'body.userLogin',
            postId: postId,
            createdAt: newDateCreated
        });

        let result = await COMMENTS.find({_id: createdComment.insertedId}).toArray();

        const objResult = result.map((field) => {
            return {
                id: field._id,
                content: field.content,
                userId: field.userId,
                userLogin: field.userLogin,
                createdAt: field.createdAt
            }
        });

        return objResult[0]
    }
}

export default new commentService();