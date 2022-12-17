import {BLOGS} from '../data/blogs.data';
import {requestBodyPost} from "../models/request.models";
import {byId} from "./index.service";

export function postBlogFunc(blogBody: requestBodyPost) {

    let newBlog =
        {
            id: String(byId + 1),
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