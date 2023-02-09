import {BLOGS, POSTS} from "../data/db.data";
import {ObjectId} from "mongodb";
import {postAllMaps, postBDType, postObjectResult, postOfBlogReqType, postReqType} from "../models/post.models";
import {blogBDType} from "../models/blog.models";
import { userBDType } from "../models/user.models";
import {countObject, likesBDType, likesCounter, likesInfoPost, myLikeStatus, newestLikes} from "../models/likes.models";
import likeService from "./like.service";

class postService {

    async findPost(bodyID: ObjectId):
        Promise<postBDType []> {
        const result: postBDType [] = await POSTS.find({_id: bodyID}).toArray();

        return result
    }

    async getOne(bodyID: ObjectId, userId: string):
        Promise<false | postObjectResult> {

        const find: postBDType [] = await this.findPost(bodyID);

        if (find.length === 0) {
            return false;
        }

        let myUserStatus: myLikeStatus = myLikeStatus.None

        if (userId !== 'quest') {
            const userObjectId: ObjectId = new ObjectId(userId);

            const checked: false | likesBDType = await likeService.checked(find[0]._id, userObjectId)


            if (checked) {
                myUserStatus = checked.user.myStatus;
            }
        }

        const threeUser: likesBDType [] =  await likeService.threeUser(find[0]._id)

        const allMaps: newestLikes [] = threeUser.map((field: likesBDType) => {

                return {    userId: field.user.userId,
                            login: field.user.login,
                            addedAt: field.addedAt
                        }
                    
                }
            );

        const objResult: postObjectResult [] = find.map((field: postBDType) => {
            return {
                id: field._id,
                title: field.title,
                shortDescription: field.shortDescription,
                content: field.content,
                blogId: field.blogId,
                blogName: field.blogName,
                createdAt: field.createdAt,
                extendedLikesInfo: [{
                    likesCount: field.extendedLikesInfo[0].likesCount,
                    dislikesCount: field.extendedLikesInfo[0].dislikesCount,
                    myStatus: myUserStatus,
                    newestLikes: allMaps
                }]
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
            createdAt: newDateCreated,
            extendedLikesInfo: [{
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myLikeStatus.None,
                newestLikes: [{
                    addedAt: '',
                    login: '',
                    userId: new ObjectId('')
                }]
            }]
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
                createdAt: field.createdAt,
                extendedLikesInfo: [{
                    likesCount: field.extendedLikesInfo[0].likesCount,
                    dislikesCount: field.extendedLikesInfo[0].dislikesCount,
                    myStatus: field.extendedLikesInfo[0].myStatus,
                    newestLikes: [{
                        userId: field.extendedLikesInfo[0].newestLikes[0].userId,
                        login: field.extendedLikesInfo[0].newestLikes[0].login,
                        addedAt: field.extendedLikesInfo[0].newestLikes[0].addedAt
                    }]
                }]
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

    async postLike(likeStatus: string, bodyID: ObjectId, user: userBDType):
        Promise<boolean> {

        const find: postBDType [] = await this.findPost(bodyID);

            if (find.length === 0) {
                return false;
            }

        const countObject: countObject = {
            typeId: find[0]._id,
            type: 'post',
            likesCount: find[0].extendedLikesInfo[0].likesCount,
            dislikesCount: find[0].extendedLikesInfo[0].dislikesCount
        }

        const newObjectLikes: likesCounter = await likeService.counterLike(likeStatus, countObject, user);

        await POSTS.updateOne({_id: bodyID}, {
            $set: {
                "likesInfo.likesCount": newObjectLikes.likesCount,
                "likesInfo.dislikesCount": newObjectLikes.dislikesCount,
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
            createdAt: newDateCreated,
            extendedLikesInfo: [{
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myLikeStatus.None,
                newestLikes: [{
                    addedAt: '',
                    login: '',
                    userId: new ObjectId('')
                }]
            }]
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
                createdAt: field.createdAt,
                extendedLikesInfo: [{
                    likesCount: field.extendedLikesInfo[0].likesCount,
                    dislikesCount: field.extendedLikesInfo[0].dislikesCount,
                    myStatus: field.extendedLikesInfo[0].myStatus,
                    newestLikes: [{
                        userId: field.extendedLikesInfo[0].newestLikes[0].userId,
                        login: field.extendedLikesInfo[0].newestLikes[0].login,
                        addedAt: field.extendedLikesInfo[0].newestLikes[0].addedAt
                    }]
                }]
            }
        });

        return objResult[0]
    }
}

export default new postService();
