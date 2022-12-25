import {BLOGS, POSTS} from "../data/db.data";
import {requestBodyPost, typeBodyID} from "../models/request.models";

const optionsBlog = {
  projection: {
    _id: 0
  }
}
class postService {
  async getAll() {
    const posts = await POSTS.find({}, optionsBlog).toArray();
    return posts;
  }

  async getOne(bodyID: typeBodyID) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }
    const post: Array<object> = await POSTS.find({id: bodyID}, optionsBlog).toArray();
    return post[0];
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

    let result: Array<object> = await POSTS.find({_id: createdPost.insertedId}, optionsBlog).toArray();

    return result[0]
  }

  async update(bodyID: typeBodyID, body: requestBodyPost) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }

    const result: Array<object> = await POSTS.find({id: bodyID}).toArray()

    if (!result) {
      return false;
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

    return true;
  }

  async delete(bodyID: typeBodyID) {
    if (!bodyID) {
      throw new Error('не указан ID');
    }

    const result: Array<object> = await POSTS.find({id: bodyID}).toArray()

    if (!result) {
      return false;
    }

    await POSTS.deleteOne({id: bodyID});

    return true;
  }
}

export default new postService();
