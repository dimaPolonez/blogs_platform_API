import { BLOGS } from '../data/blogs.data';

export function returnByID(bodyId: String) {
 return BLOGS.filter((blogsId) => blogsId.id === bodyId);
}