import {BLOGS} from '../data/blogs.data';
import {requestBodyPost} from "../models/request.models";

export function postBlogFunc(blogBody: requestBodyPost) {

    let newBlog =
        {
            id: String(BLOGS.length + 1),
            name: blogBody.name,
            description: blogBody.description,
            websiteUrl: blogBody.websiteUrl
        }

    BLOGS.push(newBlog);

    return newBlog
}