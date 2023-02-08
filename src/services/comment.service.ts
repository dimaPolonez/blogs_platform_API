import {COMMENTS, ERRORS_CODE, POSTS} from "../data/db.data";
import {ObjectId} from "mongodb";
import {commentObjectResult, commentOfPostBDType, commentReqType} from "../models/comment.models";
import {userBDType} from "../models/user.models";
import {postBDType, postOfBlogReqType} from "../models/post.models";
import {countObject, likesBDType, likesCounter, likesInfo, myLikeStatus} from "../models/likes.models";
import likeService from "./like.service";

class commentService {

    async findComment(bodyID: ObjectId):
        Promise<commentOfPostBDType []> {
        const result: commentOfPostBDType [] = await COMMENTS.find({_id: bodyID}).toArray();

        return result
    }

    async getOne(bodyID: ObjectId, userId: string):
        Promise<false | commentObjectResult> {

        const find: commentOfPostBDType [] = await this.findComment(bodyID);

        if (find.length === 0) {
            return false;
        }

        let myUserStatus: string = myLikeStatus[0]

        if (userId !== 'quest') {
            const userObjectId: ObjectId = new ObjectId(userId);

            const checked: false | likesBDType = await likeService.checked(find[0]._id, userObjectId)

            if (checked) {
                myUserStatus = checked.user.myStatus;
            }
        }

        const objResult: commentObjectResult [] = find.map((field: commentOfPostBDType) => {
            return {
                id: field._id,
                content: field.content,
                commentatorInfo: {
                    userId: field.commentatorInfo.userId,
                    userLogin: field.commentatorInfo.userLogin,
                },
                createdAt: field.createdAt,
                likesInfo: {
                    likesCount: field.likesInfo.likesCount,
                    dislikesCount: field.likesInfo.dislikesCount,
                    myStatus: myUserStatus
                }
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

            if (field.commentatorInfo.userId.toString() === userObject._id.toString()) {
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

    async commentLike(likeStatus: string, bodyID: ObjectId, user: userBDType):
        Promise<boolean> {

        const find: commentOfPostBDType [] = await this.findComment(bodyID);

        if (find.length === 0) {
            return false;
        }

        const countObject: countObject = {
            typeId: find[0]._id,
            type: 'comment',
            likesCount: find[0].likesInfo.likesCount,
            dislikesCount: find[0].likesInfo.dislikesCount
        }

        const newObjectLikes: likesCounter = await likeService.counterLike(likeStatus, countObject, user);

        await COMMENTS.updateOne({_id: bodyID}, {
            $set: {
                "likesInfo.likesCount": newObjectLikes.likesCount,
                "likesInfo.dislikesCount": newObjectLikes.dislikesCount,
            }
        });

        return true;

    }

    async delete(bodyID: ObjectId, userObject: userBDType):
        Promise<number> {

        const find: commentOfPostBDType [] = await this.findComment(bodyID);

        if (find.length === 0) {
            return ERRORS_CODE.NOT_FOUND_404;
        }

        const bearer: boolean [] = find.map((field: commentOfPostBDType) => {
            if (field.commentatorInfo.userId.toString() === userObject._id.toString()) {
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
        Promise<false | commentObjectResult> {
        let newDateCreated: string = new Date().toISOString();

        const postFind: postBDType [] = await POSTS.find({_id: postId}).toArray();

        if (postFind.length === 0) {
            return false;
        }

        const createdComment = await COMMENTS.insertOne({
            _id: new ObjectId(),
            content: body.content,
            commentatorInfo: {
                userId: objectUser._id,
                userLogin: objectUser.infUser.login
            },
            postId: postId,
            createdAt: newDateCreated,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myLikeStatus[0]
            }
        });

        let result: commentOfPostBDType [] = await COMMENTS.find({_id: createdComment.insertedId}).toArray();

        const objResult: commentObjectResult [] = result.map((field: commentOfPostBDType) => {
            return {
                id: field._id,
                content: field.content,
                commentatorInfo: {
                    userId: field.commentatorInfo.userId,
                    userLogin: field.commentatorInfo.userLogin
                },
                createdAt: field.createdAt,
                likesInfo: {
                    likesCount: field.likesInfo.likesCount,
                    dislikesCount: field.likesInfo.dislikesCount,
                    myStatus: field.likesInfo.myStatus
                }
            }
        });

        return objResult[0]
    }

}

export default new commentService();