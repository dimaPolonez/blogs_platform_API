import {ObjectId} from "mongodb";
import {
    BlogAllMapsType,
    BlogBDType,
    BlogObjectResultType,
    NotStringQueryReqPagOfSearchNameType,
    ResultBlogObjectType
} from "../../../core/models";
import {BLOGS} from "../../../core/db.data";


function sortObject(sortDir: string)
{
    return (sortDir === 'desc') ? -1 : 1
}

function skippedObject(pageNum: number, pageSize: number)
{
    return (pageNum - 1) * pageSize
}

class BlogQueryRepository {

    async getOneBlog(
        blogId: string
    ):Promise<BlogObjectResultType | null>{

        const findBlog: BlogBDType | null = await BLOGS.findOne({_id: new ObjectId(blogId)})

        if (!findBlog) {
            return null
        }

        return {
            id: findBlog._id,
            name: findBlog.name,
            description: findBlog.description,
            websiteUrl: findBlog.websiteUrl,
            createdAt: findBlog.createdAt
        }
    }

    async getAllBlogs(
        queryAll: NotStringQueryReqPagOfSearchNameType
    ):Promise<ResultBlogObjectType>{
        const allBlogs: BlogBDType [] = await BLOGS
            .find({name: new RegExp(queryAll.searchNameTerm, 'gi')})
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}).toArray()

        const allMapsBlog: BlogAllMapsType[] = allBlogs.map((field: BlogBDType) => {
            return {
                id: field._id,
                name: field.name,
                description: field.description,
                websiteUrl: field.websiteUrl,
                createdAt: field.createdAt
            }
        })

        const allCount: number = await BLOGS.countDocuments({name: new RegExp(queryAll.searchNameTerm, 'gi')})

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMapsBlog
        }
    }
}
export default new BlogQueryRepository()