import {BLOGS} from "../data/blogs.data";

export function returnByAll(bd: Array<object>) {
    return bd;
}
export function returnByID(bodyId: String, bd: Array<object>) {
    return bd.filter((objectId: any) => objectId.id=== bodyId);
}

export function returnByBlogName(blogId: String) {

    let result = null;

    BLOGS.map((nameBlog) => {
        if (nameBlog.id === blogId) {
            result = nameBlog.name
        }
    })

    return  String(result);
}