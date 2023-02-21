import mongoose, { Model, Schema } from "mongoose";
import { userBDType } from "../../models/user.models";

type UserStaticType = Model<userBDType> & {
    createUser(): any,
    updateUser(): boolean
}

export const userBDSchema =  new Schema<userBDType, UserStaticType>({
    infUser: {
        login: String,
        email: String,
        createdAt: String
    },
    activeUser: {
        codeActivated: String,
        lifeTimeCode: String,
    },
    authUser: {
        confirm: Boolean,
        hushPass: String
    }
})


userBDSchema.static({async createUser():
    Promise<any> {

    /*const newPostSmart = new PostModel({
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

    return newPostSmart*/
}
})

userBDSchema.static({async updateUser():
    Promise<boolean> {

        /*
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

        return true*/

        return true
}
})

export const USERS = mongoose.model<userBDType, UserStaticType>('users', userBDSchema)