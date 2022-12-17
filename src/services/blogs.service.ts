import {BLOGS} from '../data/blogs.data';
import {requestBodyPost} from "../models/request.models";


export function postBlogFunc(blogBody: requestBodyPost) {

    let newBlog =
        {
            id: String(new Date()),
            name: blogBody.name,
            description: blogBody.description,
            websiteUrl: blogBody.websiteUrl
        }

    BLOGS.push(newBlog);

    return newBlog
}

export function putBlogFunc(idObject: any, blogBody: any) {

    idObject.name = blogBody.name
    idObject.description = blogBody.description
    idObject.websiteUrl = blogBody.websiteUrl
}