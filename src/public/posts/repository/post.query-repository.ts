import {ObjectId} from "mongodb";
import {
    LikesBDType, MyLikeStatus, NewestLikesType,
    NotStringQueryReqPagType, PostAllMapsType, PostBDType, PostObjectResultType,
    ResultPostObjectType
} from "../../../core/models";
import {POSTS} from "../../../core/db.data";
import LikeService from "../../../helpers/like.service";


function sortObject(sortDir: string)
{
    return (sortDir === 'desc') ? -1 : 1
}

function skippedObject(pageNum: number, pageSize: number)
{
    return (pageNum - 1) * pageSize
}

class PostQueryRepository {

    async getOnePost(
        postId: string,
        userId?: ObjectId | null
    ):Promise<PostObjectResultType | null>{
        const findOnePost: PostBDType | null = await POSTS.findOne({_id: new ObjectId(postId)})

        if (!findOnePost) {
            return null
        }

        let myUserStatus: MyLikeStatus = MyLikeStatus.None
        let allMapsUserLikesArray: NewestLikesType [] | [] = []

        if (userId) {
            const checked: null | LikesBDType = await LikeService.checkedLike(findOnePost._id, new ObjectId(userId))

            if (checked) {
                myUserStatus = checked.user.myStatus
            }
        }

        const threeUserLikesArray: LikesBDType [] | null =  await LikeService.threeUserLikesArray(findOnePost._id)

        if (threeUserLikesArray) {
            allMapsUserLikesArray = threeUserLikesArray.map((fieldUserLikes: LikesBDType) => {
                    return {
                        addedAt: fieldUserLikes.addedAt,
                        userId: fieldUserLikes.user.userId,
                        login: fieldUserLikes.user.login
                    }
                }
            );
        }

        return {
            id: findOnePost._id,
            title: findOnePost.title,
            shortDescription: findOnePost.shortDescription,
            content: findOnePost.content,
            blogId: findOnePost.blogId,
            blogName: findOnePost.blogName,
            createdAt: findOnePost.createdAt,
            extendedLikesInfo: {
                likesCount: findOnePost.extendedLikesInfo.likesCount,
                dislikesCount: findOnePost.extendedLikesInfo.dislikesCount,
                myStatus: myUserStatus,
                newestLikes: allMapsUserLikesArray
            }
        }
    }
    async getAllPostsOfBlog(
        blogId: string,
        queryAll: NotStringQueryReqPagType,
        userId?: ObjectId | null
    ):Promise<ResultPostObjectType>{
        const postsOfFindBlog: PostBDType [] = await POSTS.find({blogId: new ObjectId(blogId)})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()

        const allPostMapping: PostAllMapsType[] = await Promise.all(postsOfFindBlog.map(async (fieldPost: PostBDType) => {

            let userLikeStatus: MyLikeStatus = MyLikeStatus.None
            let allLikeUserMapping: NewestLikesType[] | [] = []

            if (userId) {
                const likeUserArray: null | LikesBDType = await LikeService.checkedLike(fieldPost._id, userId)

                if(likeUserArray) {
                    userLikeStatus = likeUserArray.user.myStatus
                }
            }

            const resultUserLikeMapping: NewestLikesType[] | null = await LikeService.userLikeMaper(fieldPost._id)

            if (resultUserLikeMapping) {
                allLikeUserMapping = resultUserLikeMapping
            }

            return {
                id: fieldPost._id,
                title: fieldPost.title,
                shortDescription: fieldPost.shortDescription,
                content: fieldPost.content,
                blogId: fieldPost.blogId,
                blogName: fieldPost.blogName,
                createdAt: fieldPost.createdAt,
                extendedLikesInfo: {
                    likesCount: fieldPost.extendedLikesInfo.likesCount,
                    dislikesCount: fieldPost.extendedLikesInfo.dislikesCount,
                    myStatus: userLikeStatus,
                    newestLikes: allLikeUserMapping
                }
            }
        }))

        const allCount: number = await POSTS.countDocuments({blogId: new ObjectId(blogId)})
        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items:  allPostMapping
        }
    }

    public async getAllPosts(
        queryAll: NotStringQueryReqPagType,
        userId: ObjectId | null)
        :Promise<ResultPostObjectType>{
        const allPostsFind: PostBDType [] = await POSTS.find({})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()

        const allPostMapping: PostAllMapsType [] = await Promise.all(allPostsFind.map(async (fieldPost: PostBDType) => {

            let userLikeStatus: MyLikeStatus = MyLikeStatus.None
            let allLikeUserMapping: NewestLikesType[] | [] = []

            if (userId) {
                const likeUserArray: null | LikesBDType = await LikeService.checkedLike(fieldPost._id, userId)

                if (likeUserArray) {
                    userLikeStatus = likeUserArray.user.myStatus
                }
            }

            const resultUserLikeMapping: NewestLikesType[] | null = await LikeService.userLikeMaper(fieldPost._id)

            if (resultUserLikeMapping) {
                allLikeUserMapping = resultUserLikeMapping
            }

            return {
                id: fieldPost._id,
                title: fieldPost.title,
                shortDescription: fieldPost.shortDescription,
                content: fieldPost.content,
                blogId: fieldPost.blogId,
                blogName: fieldPost.blogName,
                createdAt: fieldPost.createdAt,
                extendedLikesInfo: {
                    likesCount: fieldPost.extendedLikesInfo.likesCount,
                    dislikesCount: fieldPost.extendedLikesInfo.dislikesCount,
                    myStatus: userLikeStatus,
                    newestLikes: allLikeUserMapping
                }
            }
        }))

        const allCount: number = await POSTS.countDocuments({})

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allPostMapping
        }
    }
}
export default new PostQueryRepository()