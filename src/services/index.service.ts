import { BLOGS } from '../data/blogs.data';
import { POSTS } from '../data/posts.data';

export let byId = 4;

export function allDeleteBase() {}

export function returnByAll(bd: Array<object>) {
  return bd;
}
export function returnByID(bodyId: String, bd: Array<object>) {
  return bd.filter((objectId: any) => objectId.id === bodyId);
}

export function returnByBlogName(blogId: String) {
  let result = null;

  BLOGS.map((nameBlog) => {
    if (nameBlog.id === blogId) {
      result = nameBlog.name;
    }
  });

  return String(result);
}
