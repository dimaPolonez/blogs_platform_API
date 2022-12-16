import { BLOGS } from '../data/blogs.data';

export function returnByIDBlog(bodyId: String) {
 return BLOGS.filter((blogsId) => blogsId.id === bodyId);
}