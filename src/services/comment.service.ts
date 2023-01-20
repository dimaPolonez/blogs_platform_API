import {COMMENTS, ERRORS_CODE, POSTS} from "../data/db.data";
import {ObjectId} from "mongodb";
import {commentObjectResult, commentOfPostBDType, commentReqType} from "../models/comment.models";
import {userBDType} from "../models/user.models";
import {postBDType, postOfBlogReqType} from "../models/post.models";

class commentService {

    async findComment(bodyID:ObjectId):
        Promise<commentOfPostBDType []>
    {
        const result: commentOfPostBDType [] = await COMMENTS.find({_id: bodyID}).toArray();

        return result
    }

    async getOne(bodyID: ObjectId):
        Promise<false | commentObjectResult> {

        const find: commentOfPostBDType [] = await this.findComment(bodyID);

        if (find.length === 0) {
            return false;
        }

        const objResult: commentObjectResult [] = find.map((field: commentOfPostBDType) => {
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

    async update(bodyID: ObjectId, body: commentReqType, userObject: userBDType):
        Promise<number> {

        const find: commentOfPostBDType [] = await this.findComment(bodyID);

        if (find.length === 0) {
            return ERRORS_CODE.NOT_FOUND_404;
        }

        const bearer: boolean [] = find.map((field: commentOfPostBDType) => {

            if (field.userId.toString() === userObject._id.toString()) {
                return true
            } else {
                return false
            }
        })

        if (!bearer[0]) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await COMMENTS.updateOne({_id: bodyID}, {
            $set: {
                content: body.content
            }
        });

        return ERRORS_CODE.NO_CONTENT_204;
    }

    async delete(bodyID: ObjectId, userObject: userBDType):
        Promise<number> {

        const find: commentOfPostBDType [] = await this.findComment(bodyID);

        if (find.length === 0) {
            return ERRORS_CODE.NOT_FOUND_404;
        }

        const bearer: boolean [] = find.map((field: commentOfPostBDType) => {
            if (field.userId.toString() === userObject._id.toString()) {
                return true
            } else {
                return false
            }
        })

        if (!bearer[0]) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await COMMENTS.deleteOne({_id: bodyID});

        return ERRORS_CODE.NO_CONTENT_204;
    }

    async createCommentOfPost(postId: ObjectId, body: postOfBlogReqType, objectUser: userBDType):
        Promise<false | commentObjectResult>
        {
        let newDateCreated: string = new Date().toISOString();

        const postFind: postBDType [] = await POSTS.find({_id: postId}).toArray();

        if (postFind.length === 0) {
            return false;
        }

        const createdComment = await COMMENTS.insertOne({
            _id: new ObjectId(),
            content: body.content,
            userId: objectUser._id,
            userLogin: objectUser.infUser.login,
            postId: postId,
            createdAt: newDateCreated
        });

        let result: commentOfPostBDType [] = await COMMENTS.find({_id: createdComment.insertedId}).toArray();

        const objResult: commentObjectResult [] = result.map((field:commentOfPostBDType) => {
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