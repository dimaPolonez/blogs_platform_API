import { ObjectId } from "mongodb"
import { blogAllMaps, blogBDType, blogObjectResult, resultBlogObjectType } from "../../models/blog.models"
import { myLikeStatus, newestLikes } from "../../models/likes.models"
import { postAllMaps, postBDType, resultPostObjectType } from "../../models/post.models"
import { notStringQueryReqPag, notStringQueryReqPagOfSearchName } from "../../models/request.models"
import { BlogModel } from "../entity/blog.entity"
import { PostModel } from "../entity/post.entity"
import BlogRepository from "./blog.repository"

function sortObject(sortDir: string) {
    return (sortDir === 'desc') ? -1 : 1
}


function skippedObject(pageNum: number, pageSize: number) {
    return (pageNum - 1) * pageSize
}

class QueryRepository {

    public async getAllBlogs(queryAll: notStringQueryReqPagOfSearchName):
        Promise<resultBlogObjectType> {
        const allBlogs: blogBDType[] = await BlogModel
            .find({ name: new RegExp(queryAll.searchNameTerm, 'gi') })
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort({ [queryAll.sortBy]: sortObject(queryAll.sortDirection) })

        const allMapsBlog: blogAllMaps[] = allBlogs.map((field: blogBDType) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        })

        const allCount: number = await BlogModel.countDocuments({ name: new RegExp(queryAll.searchNameTerm, 'gi') })
        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMapsBlog
        }
    }

    public async getAllPostsOfBlog(blogID: string, queryAll: notStringQueryReqPag, userID: ObjectId | null):
        Promise<null | resultPostObjectType> {
        const blogFind: blogObjectResult | null = await BlogRepository.findOneById(blogID)

        if (!blogFind) {
            return null
        }

        const postsOfFindBlog: postBDType[] = await PostModel
            .find({ blogId: blogID })
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({ [queryAll.sortBy]: sortObject(queryAll.sortDirection) }))

        const allPostMapping: postAllMaps[] = await Promise.all(postsOfFindBlog.map(async (fieldPost: postBDType) => {

            let likeStatus: myLikeStatus = myLikeStatus.None
            let newestLikes: newestLikes[] | [] = []

            if (userID) {
                // likeStatus = await LikeService.checkedLike(fieldPost._id, userID)
            }

            //newestLikes =  await LikeService.threeUserLikesArray(fieldPost._id)

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
                    myStatus: likeStatus,
                    newestLikes: newestLikes
                }
            }
        }))

        const allCount: number = await PostModel.countDocuments({ blogId: blogID })
        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        const allPostsOfBlog: resultPostObjectType = {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allPostMapping
        }

        return allPostsOfBlog

    }

    public async getAllPosts(queryAll: notStringQueryReqPag, userID: ObjectId | null):
        Promise<resultPostObjectType> 
    {
        const allPostsFind: postBDType [] = await PostModel
        .find({})
        .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
        .limit(queryAll.pageSize)
        .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}))

        const allPostMapping: postAllMaps [] = await Promise.all(allPostsFind.map(async (fieldPost: postBDType) => {

                let likeStatus: myLikeStatus = myLikeStatus.None
                let newestLikes: newestLikes[] | [] = []

                if (userID) {
                    // likeStatus = await LikeService.checkedLike(fieldPost._id, userID)
                }

                //newestLikes =  await LikeService.threeUserLikesArray(fieldPost._id)

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
                        myStatus: likeStatus,
                        newestLikes: newestLikes
                    }
                }
        }))

        const allCount: number = await PostModel.countDocuments({})

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

export default new QueryRepository()