import { BLOGS } from '../data/db.data';

class blogService {
  async getAll() {
    const blogs = await BLOGS.find({}).toArray();
    return blogs;
  }

  async getOne(bodyID: any) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
    const blog = await BLOGS.findById(bodyID);
    return blog;
  }

  async create(body: any) {
    const createdBlog = await BLOGS.create(BLOGS);
    return createdBlog;
  }

  async update(body: any) {
    if (!body) {
      throw new Error('не указан ID');
    }
    const updatedBlog = await BLOGS.findByIdAndUpdate(BLOGS._id, BLOGS, {
      new: true,
    });
    return updatedBlog;
  }

  async delete(bodyID: any) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
    const blog = await BLOGS.findByIdAndDelete(bodyID);
    return blog;
  }
}

export default new blogService();
