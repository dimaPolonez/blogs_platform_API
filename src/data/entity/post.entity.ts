import { ObjectId } from "mongodb";
import mongoose, { Model, Schema } from "mongoose";
import { blogObjectResult } from "../../models/blog.models";
import { likesCounter, myLikeStatus } from "../../models/likes.models";
import { postBDType, postReqType } from "../../models/post.models";
import PostRepository from "../repository/post.repository";
import BlogRepository from "../repository/blog.repository";

type PostStaticType = Model<postBDType> & {
    createPost(postDTO: postReqType): any,
    updatePost(postID: string, postDTO: postReqType): boolean,
    updatePostLiked(postID: string, newObjectLikes: likesCounter): boolean
}

export const postBDSchema =  new Schema<postBDType, PostStaticType>({
    title: String,
    shortDescription: String,
    content: String,
    blogId: ObjectId,
    blogName: String,
    createdAt: String,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        newestLikes: Array
    }
})

postBDSchema.static({async createPost(postDTO: postReqType):
    Promise<any> {

    const newPostSmart = new PostModel({
        title: postDTO.title,
        shortDescription: postDTO.shortDescription,
        content: postDTO.content,
        blogId: postDTO.blogId,
        blogName: 'blog not found',
        createdAt: new Date().toISOString(),
        extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myLikeStatus.None,
                newestLikes: []
                }
    })

    await PostRepository.save(newPostSmart)

    return newPostSmart
}
})

postBDSchema.static({async updatePost(postID: string, postDTO: postReqType):
    Promise<boolean> {

        const findPostDocument = await PostRepository.findOneByIdReturnDoc(postID)

        if (!findPostDocument) {
            return false
        }

        const blogFind: blogObjectResult | null = await BlogRepository.findOneById(postDTO.blogId)

        if (blogFind) {
            findPostDocument.blogName = blogFind.name
        }

        findPostDocument.title = postDTO.title
        findPostDocument.shortDescription = postDTO.shortDescription
        findPostDocument.content = postDTO.content
        findPostDocument.blogId = postDTO.blogId

        await PostRepository.save(findPostDocument)

        return true
}
})

postBDSchema.static({async updatePostLiked(postID: string, newObjectLikes: likesCounter):
    Promise<boolean> {

        const findPostDocument = await PostRepository.findOneByIdReturnDoc(postID)

        if (!findPostDocument) {
            return false
        }

        findPostDocument.extendedLikesInfo.likesCount = newObjectLikes.likesCount
        findPostDocument.extendedLikesInfo.dislikesCount = newObjectLikes.dislikesCount

        await PostRepository.save(findPostDocument)

        return true
}
})

export const PostModel = mongoose.model<postBDType, PostStaticType>('posts', postBDSchema)