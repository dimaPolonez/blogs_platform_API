import {POSTS} from "../data/posts.data";

export function returnByIDPost(bodyId: String) {
    return POSTS.filter((postId) => postId.id === bodyId);
}