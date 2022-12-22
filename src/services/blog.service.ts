import { BLOGS } from '../data/db.data';
import { blogsFieldsType } from '../models/data.models';
import {requestBodyPost} from "../models/request.models";

class blogService {
  async getAll() {
    const blogs = await BLOGS.find({}).toArray();
    return blogs;
  }

  async getOne(bodyID: string) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
/*    const blog = await BLOGS.find({id: bodyID});
    return blog;*/
  }

  async create(body: requestBodyPost) {
    const createdBlog = await BLOGS.insertOne({
      "id": Math.floor(Date.now() + Math.random()),
      "name": body.name,
      "description": body.description,
      "websiteUrl": body.websiteUrl
    });
    return BLOGS.find({_id: createdBlog.insertedId}).toArray();
  }

  async update(body: any) {
    if (!body) {
      throw new Error('не указан ID');
    }
/*    const updatedBlog = await BLOGS.findByIdAndUpdate(BLOGS._id, BLOGS, {
      new: true,
    });
    return updatedBlog;*/
  }

  async delete(bodyID: any) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
/*    const blog = await BLOGS.findByIdAndDelete(bodyID);
    return blog;*/
  }
}

export default new blogService();
