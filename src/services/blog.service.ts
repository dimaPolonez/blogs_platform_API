import {BLOGS} from '../data/db.data';
import {requestBodyBlog, typeBodyID} from "../models/request.models";

const optionsBlog = {
  projection: {
    _id: 0
  }
}

class blogService {
  async getAll() {
    // @ts-ignore
    const blogs = await BLOGS.find({},optionsBlog).toArray();
    return blogs;
  }

  async getOne(bodyID: typeBodyID) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
    const blog = await BLOGS.find({id: bodyID},optionsBlog).toArray();
    return blog;
  }

  async create(body: requestBodyBlog) {
    let idDate = Math.floor(Date.now() + Math.random());
    let newDateCreated = new Date().toISOString();

    const createdBlog = await BLOGS.insertOne({
      id: String(idDate),
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: newDateCreated
    });
    return BLOGS.find({_id: createdBlog.insertedId},optionsBlog).toArray();
  }

  async update(bodyID: typeBodyID, body: requestBodyBlog) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
    await BLOGS.updateOne({id: bodyID}, {
      $set: {
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl
    }});
  }

  async delete(bodyID: typeBodyID) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
    await BLOGS.deleteOne({id: bodyID});
  }
}

export default new blogService();
