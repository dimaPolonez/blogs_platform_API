import {ObjectId} from "mongodb";

declare global {
    namespace Express {
        export interface Request {
            user: usersFieldsType
        }
    }
}

export type blogsFieldsType = {
    _id: ObjectId,
    name: string;
    description: string;
    websiteUrl: string,
    createdAt: string
}

export type postsFieldsType = {
    _id: ObjectId,
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string,
    createdAt: string
}

export type usersFieldsType = {
    _id: ObjectId,
    login: string;
    email: string;
    hushPass: string;
    createdAt: string
}

export type commentsFieldsType = {
    _id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    postId: ObjectId,
    createdAt: string
}

export type responseBlogsType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string,
    createdAt: string
}

export type tokenObjectType = {
    _id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    createdAt: string
}
