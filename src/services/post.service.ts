import {newBodyPost, requestBodyPost} from "../models/request.models";
import {POSTS} from "../data/posts.data";
import {returnByBlogName, returnByID} from "./index.service";
import {BLOGS} from "../data/blogs.data";

export function postPostFunc(postBody: newBodyPost) {

    let newPost =
        {
            id: String(POSTS.length + 1),
            title: postBody.title,
            shortDescription: postBody.shortDescription,
            content: postBody.content,
            blogId: postBody.blogId,
            blogName: returnByBlogName(postBody.blogId)
        }

    POSTS.push(newPost);

    return newPost
}

export function putPostFunc(idObject: any, postBody: any) {

    idObject.title = postBody.title
    idObject.shortDescription = postBody.shortDescription
    idObject.content = postBody.content
    idObject.blogId = postBody.blogId
    idObject.blogName = returnByBlogName(postBody.blogId)
}
