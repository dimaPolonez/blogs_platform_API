import { ObjectId } from "mongodb";
import { commentObjectResult, commentOfPostBDType, commentReqType, commentDTOAll } from "../../models/comment.models";
import { myLikeStatus } from "../../models/likes.models";
import { postObjectResult } from "../../models/post.models";
import { userBDType } from "../../models/user.models";
import { ERRORS_CODE } from "../db.data";
import { CommentModel } from "../entity/comment.entity";
import PostRepository from "./post.repository";


class CommentRepository {

    public async findOneByIdReturnDoc(commentID: string){

        const objectCommentID: ObjectId = new ObjectId(commentID)

        const findCommentSmart: null | commentOfPostBDType = await CommentModel.findOne({ _id: objectCommentID })

        return findCommentSmart
    }

    public async findOneById(commentID: string, userID: ObjectId | null):
        Promise<null | commentObjectResult>
    {
        const objectCommentID: ObjectId = new ObjectId(commentID)

        const findCommentSmart: null | commentOfPostBDType = await CommentModel.findOne({ _id: objectCommentID })

        if (!findCommentSmart){
            return null
        }

        let likeStatus: myLikeStatus = myLikeStatus.None

        if (userID) {
            // likeStatus = await LikeService.checkedLike(findPostSmart._id, userID)
         }

        return {
            id: findCommentSmart._id,
            content: findCommentSmart.content,
            commentatorInfo: {
                userId: findCommentSmart.commentatorInfo.userId,
                userLogin: findCommentSmart.commentatorInfo.userLogin,
            },
            createdAt: findCommentSmart.createdAt,
            likesInfo: {
                likesCount: findCommentSmart.likesInfo.likesCount,
                dislikesCount: findCommentSmart.likesInfo.dislikesCount,
                myStatus: likeStatus
            }
        }
    }   
    
    public async createCommentOfPost(postID: string, commentDTO: commentReqType, userID: ObjectId):
        Promise<null | commentObjectResult>
    {
        const userFind = {
            infUser: {
                login: ''
            }
        }

        const postFind: null | postObjectResult = await PostRepository.findOneById(postID, null)

        if (!postFind) {
            return null
        }

        const commentDTOAll: commentDTOAll = {
            content: commentDTO.content,
            commentatorInfo: {
                userId: userID,
                userLogin: userFind.infUser.login
            },
            postId: postID
        }

        const newCommentSmart = await CommentModel.createComment(commentDTOAll)

        return {
            id: newCommentSmart._id,
            content: newCommentSmart.content,
            commentatorInfo: {
                userId: newCommentSmart.userId,
                userLogin: newCommentSmart.userLogin
            },
            createdAt: newCommentSmart.createdAt,
            likesInfo: {
                likesCount: newCommentSmart.likesInfo.likesCount,
                dislikesCount: newCommentSmart.likesInfo.dislikesCount,
                myStatus: newCommentSmart.likesInfo.myStatus
            }
        }

    }

    public async updateComment(commentID: string, commentDTO: commentReqType, userID: ObjectId):
        Promise<number>
    {

        const findComment: null | commentObjectResult = await this.findOneById(commentID, null)

        if(!findComment) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (!(findComment.commentatorInfo.userId.toString() === userID.toString())) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        CommentModel.updateComment(commentID, commentDTO)

        return ERRORS_CODE.NO_CONTENT_204
    }

    public async deleteComment(commentID: string, userID: ObjectId):
        Promise<number>
    {

        const findComment: null | commentObjectResult = await this.findOneById(commentID, null)

        if(!findComment) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (!(findComment.commentatorInfo.userId.toString() === userID.toString())) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        CommentModel.deleteOne({_id: findComment.id})

        return ERRORS_CODE.NO_CONTENT_204
    }

    public async deleteAllComment() {
        await CommentModel.deleteMany({})
    }

    public async save(model:any) {
        return await model.save()
    }
    
}

export default new CommentRepository()