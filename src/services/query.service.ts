import {USERS} from "../data/db.data";
import {
    notStringQueryReqPag,
    notStringQueryReqPagOfSearchName, notStringQueryReqPagSearchAuth
} from "../models/request.models";
import {blogAllMaps, blogBDType, resultBlogObjectType} from "../models/blog.models";
import {postAllMaps, postBDType, resultPostObjectType} from "../models/post.models";
import {resultUserObjectType, userAllMaps, userBDType} from "../models/user.models";
import {commentAllMaps, commentOfPostBDType, resultCommentObjectType} from "../models/comment.models";
import {ObjectId} from "mongodb";
import {likesBDType, myLikeStatus, newestLikes} from "../models/likes.models";
import LikeService from "./like.service";
import PostService from "./post.service";
import { BlogModel } from "../data/entity/blog.entity";
import { PostModel } from "../data/entity/post.entity";



class QueryService {


    
    public async getAllUsers(queryAll: notStringQueryReqPagSearchAuth):
        Promise<resultUserObjectType> 
    {
        /*const usersAll: userBDType [] = await USERS
                                                    .find(
                                                        {
                                                            $or: [
                                                                {"infUser.login": new RegExp(queryAll.searchLoginTerm, 'gi')},
                                                                {"infUser.email": new RegExp(queryAll.searchEmailTerm, 'gi')}
                                                            ]
                                                        }
                                                    )
                                                    .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                    .limit(queryAll.pageSize)
                                                    .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()*/
                                                    const usersAll: [] = []

        const allMapsUsers: userAllMaps [] = usersAll.map((fieldUser: userBDType) => {
            return {
                id: fieldUser._id,
                login: fieldUser.infUser.login,
                email: fieldUser.infUser.email,
                createdAt: fieldUser.infUser.createdAt
            }
        })

        const allCount: number = await USERS.countDocuments(
                                                            {
                                                                $or: [
                                                                    {"infUser.login": new RegExp(queryAll.searchLoginTerm, 'gi')},
                                                                    {"infUser.email": new RegExp(queryAll.searchEmailTerm, 'gi')}
                                                                ]
                                                            })

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMapsUsers
        }
    }

    public async getAllCommentsOfPost(postURIId: string, queryAll: notStringQueryReqPag, userId: ObjectId | null):
        Promise<null | resultCommentObjectType> 
    {
        const postID: ObjectId = new ObjectId(postURIId)

        /*const findPost: null | postBDType = await PostService.findPost(postID)

        if (!findPost) {
            return null
        }

        const comments: commentOfPostBDType [] = await COMMENTS.find({postId: postID})
                                                                                        .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
                                                                                        .limit(queryAll.pageSize)
                                                                                        .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()*/

                                                                                        const comments: [] = []

        /*const allMapsComments: commentAllMaps [] = await Promise.all(comments.map(async (fieldComment: commentOfPostBDType) => {

            let myUserStatus: myLikeStatus = myLikeStatus.None

            if (userId) {

            const checkLikeComment: null | likesBDType = await LikeService.checkedLike(fieldComment._id, userId)

                if (checkLikeComment) {
                    myUserStatus = checkLikeComment.user.myStatus
                }
            }

            return {
                id: fieldComment._id,
                content: fieldComment.content,
                commentatorInfo: {
                    userId: fieldComment.commentatorInfo.userId,
                    userLogin: fieldComment.commentatorInfo.userLogin,
                },
                createdAt: fieldComment.createdAt,
                likesInfo: {
                    likesCount: fieldComment.likesInfo.likesCount,
                    dislikesCount: fieldComment.likesInfo.dislikesCount,
                    myStatus: myUserStatus
                }
            }
        }))*/ const allMapsComments: [] = []

       // const allCount: number = await COMMENTS.countDocuments({postId: postID})

       const allCount = 5

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMapsComments
        }
    }
}

export default new QueryService()