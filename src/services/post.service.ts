import {BLOGS, POSTS} from "../data/db.data";
import {requestBodyPost, typeBodyID} from "../models/request.models";

class postService {
  async getAll() {
    const posts = await POSTS.find({}).toArray();
    return posts;
  }

  async getOne(bodyID: typeBodyID) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
    const post = await POSTS.find({id: bodyID}).toArray();
    return post;
  }

  async create(body: requestBodyPost) {
    let idDate = Math.floor(Date.now() + Math.random());
    let newDateCreated = new Date().toISOString();

    let blogName = await BLOGS.find({id: body.blogId}).toArray();

    const createdPost = await POSTS.insertOne({
      id: String(idDate),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: body.blogId,
      blogName: String(blogName.map((field) => {return field.name})),
      createdAt: newDateCreated
    });

    return POSTS.find({_id: createdPost.insertedId}).toArray();
  }

  async update(bodyID: typeBodyID, body: requestBodyPost) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
    let blogName = await BLOGS.find({id: body.blogId}).toArray();

    await POSTS.updateOne({id: bodyID}, {
      $set: {
        title: body.title,
        shortDescription: body.shortDescription,
        content: body.content,
        blogId: body.blogId,
        blogName: String(blogName.map((field) => {return field.name}))
      }});
  }

  async delete(bodyID: typeBodyID) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
    await POSTS.deleteOne({id: bodyID});
  }
}

export default new postService();
