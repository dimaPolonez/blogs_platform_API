import { BLOGS } from '../data/blogs.data';
import { requestBodyPost } from '../models/request.models';
import { byId } from './index.service';

import { db } from '../data/db.data';

class blogService {
  async getAll() {
    const blogs = await db.collection('blogs').find({}).toArray();
    return blogs;
  }

  async getOne(bodyID: any) {
    return 'Hello world';
  }

  async create(body: any) {
    return 'Hello world';
  }

  async update(body: any) {
    return 'Hello world';
  }

  async delete(bodyID: any) {
    return 'Hello world';
  }
}

export default new blogService();
