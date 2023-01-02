import {BLOGS, POSTS} from "../data/db.data";
import {requestBodyPost, requestBodyPostOfBlog, typeBodyID} from "../models/request.models";
import {ObjectId} from "mongodb";

class postService {

  async getOne(bodyID: typeBodyID) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
    const post = await POSTS.find({ _id: bodyID }).toArray();

    return post.map((field) => {
      return {
        id: field._id,
        title: field.title,
        shortDescription: field.shortDescription,
        content: field.content,
        blogId: field.blogId,
        blogName: field.blogName,
        createdAt: field.createdAt
      }
    });
  }

  async create(body: requestBodyPost) {
    let newDateCreated = new Date().toISOString();
    const blogBodyId: ObjectId = new ObjectId(body.blogId);

    const blogFind = await BLOGS.find({ _id: blogBodyId}).toArray();
    const blogName = String(blogFind.map((field) => {return field.name}))

    const createdPost = await POSTS.insertOne({
      _id: new ObjectId(),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: blogBodyId,
      blogName: blogName,
      createdAt: newDateCreated
    });

    let result = await POSTS.find({_id: createdPost.insertedId}).toArray();

    return result.map((field) => {
      return {
        id: field._id,
        title: field.title,
        shortDescription: field.shortDescription,
        content: field.content,
        blogId: field.blogId,
        blogName: field.blogName,
        createdAt: field.createdAt
      }
    });
  }

  async update(bodyID: typeBodyID, body: requestBodyPost) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }

    const result = await POSTS.find({_id: bodyID}).toArray()

    if (result.length === 0) {
      return false;
    }
    const blogBodyId: ObjectId = new ObjectId(body.blogId);

    const blogFind = await BLOGS.find({ _id: blogBodyId}).toArray();
    const blogName = String(blogFind.map((field) => {return field.name}))

    await POSTS.updateOne({_id: bodyID}, {
      $set: {
        title: body.title,
        shortDescription: body.shortDescription,
        content: body.content,
        blogId: blogBodyId,
        blogName: blogName
      }});

    return true;
  }

  async delete(bodyID: typeBodyID) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }

    const result = await POSTS.find({_id: bodyID}).toArray()

    if (result.length === 0) {
      return false;
    }

    await POSTS.deleteOne({_id: bodyID});

    return true;
  }

  async createOnePostOfBlog(bodyID: typeBodyID, body: requestBodyPostOfBlog) {

    let newDateCreated = new Date().toISOString();
    const blogBodyId: ObjectId = new ObjectId(bodyID);

    const blogFind = await BLOGS.find({ _id: blogBodyId}).toArray();
    const blogName = String(blogFind.map((field) => {return field.name}))

    const createdPost = await POSTS.insertOne({
      _id: new ObjectId(),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: blogBodyId,
      blogName: blogName,
      createdAt: newDateCreated
    });

    let result = await POSTS.find({_id: createdPost.insertedId}).toArray();

    return result.map((field) => {
      return {
        id: field._id,
        title: field.title,
        shortDescription: field.shortDescription,
        content: field.content,
        blogId: field.blogId,
        blogName: field.blogName,
        createdAt: field.createdAt
      }
    });
  }

}

export default new postService();
