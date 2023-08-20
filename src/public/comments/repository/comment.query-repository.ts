import {ObjectId} from "mongodb";
import {
    CommentAllMapsType,
    CommentObjectResultType,
    CommentOfPostBDType,
    LikesBDType,
    MyLikeStatus,
    NotStringQueryReqPagType, ResultCommentObjectType
} from "../../../core/models";
import LikeService from "../../../helpers/like.service";
import {COMMENTS} from "../../../core/db.data";

function sortObject(sortDir: string)
{
    return (sortDir === 'desc') ? -1 : 1
}

function skippedObject(pageNum: number, pageSize: number)
{
    return (pageNum - 1) * pageSize
}

class CommentQueryRepository {
    async getOneComment(
        commentId: string,
        userId?: ObjectId | null
    ):Promise<CommentObjectResultType | null>{
        const findComment: null | CommentOfPostBDType = await COMMENTS.findOne({_id: new ObjectId(commentId)})

        if (!findComment) {
            return null
        }

        let myUserStatus: MyLikeStatus = MyLikeStatus.None

        if (userId) {
            const userObjectId: ObjectId = new ObjectId(userId)

            const checked: null | LikesBDType = await LikeService.checkedLike(findComment._id, userObjectId)

            if (checked) {
                myUserStatus = checked.user.myStatus
            }
        }

        return {
            id: findComment._id,
            content: findComment.content,
            commentatorInfo: {
                userId: findComment.commentatorInfo.userId,
                userLogin: findComment.commentatorInfo.userLogin,
            },
            createdAt: findComment.createdAt,
            likesInfo: {
                likesCount: findComment.likesInfo.likesCount,
                dislikesCount: findComment.likesInfo.dislikesCount,
                myStatus: myUserStatus
            }
        }
    }

    public async getAllCommentsOfPost(
        postId: string,
        queryAll: NotStringQueryReqPagType,
        userId: ObjectId | null
    ):Promise<ResultCommentObjectType>{
        const comments: CommentOfPostBDType[] = await COMMENTS.find({postId: new ObjectId(postId)})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()

        const allMapsComments: CommentAllMapsType[] = await Promise.all(comments.map(async (fieldComment: CommentOfPostBDType) => {

            let myUserStatus: MyLikeStatus = MyLikeStatus.None

            if (userId) {

                const checkLikeComment: null | LikesBDType = await LikeService.checkedLike(fieldComment._id, userId)

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
        }))

        const allCount: number = await COMMENTS.countDocuments({postId: new ObjectId(postId)})

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
export default new CommentQueryRepository()