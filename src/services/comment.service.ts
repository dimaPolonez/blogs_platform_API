import {requestBodyComment, typeBodyID} from "../models/request.models";
import {BLOGS, COMMENTS, ERRORS_CODE, POSTS} from "../data/db.data";
import {ObjectId} from "mongodb";
import {usersFieldsType} from "../models/data.models";

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

    async update(bodyID: typeBodyID, body: requestBodyComment, userObject: usersFieldsType) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }

        const result = await COMMENTS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return ERRORS_CODE.NOT_FOUND_404;
        }

        const bearer = result.map((field) => {
            if(field.userId != userObject._id){
                return false
            } else {
                return true
            }
        })

        if (!bearer[0]){
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await COMMENTS.updateOne({_id: bodyID}, {
            $set: {
                content: body.content
            }
        });

        return ERRORS_CODE.NO_CONTENT_204;
    }

    async delete(bodyID: typeBodyID, userObject: usersFieldsType) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }
        const result = await COMMENTS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return ERRORS_CODE.NOT_FOUND_404;
        }

        const bearer = result.map((field) => {
            if(field.userId != userObject._id){
                return false
            } else {
                return true
            }
        })

        if (!bearer[0]){
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await COMMENTS.deleteOne({_id: bodyID});

        return ERRORS_CODE.NO_CONTENT_204;
    }

    async createCommentOfPost(postId: ObjectId, body: requestBodyComment, objectUser: usersFieldsType) {
        let newDateCreated = new Date().toISOString();

        const postFind = await POSTS.find({_id: postId}).toArray();

        if (postFind.length === 0) {
            return false;
        }

        const createdComment = await COMMENTS.insertOne({
            _id: new ObjectId(),
            content: body.content,
            userId: objectUser._id,
            userLogin: objectUser.login,
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