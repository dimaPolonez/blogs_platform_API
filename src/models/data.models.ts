import { ObjectId } from "mongodb";

export type blogsFieldsType = {
        id: string;
        name: string;
        description: string;
        websiteUrl: string;
    }


export type postsFieldsType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
}

export type errorsFieldsType = [
    { message: string; field: string }
];
