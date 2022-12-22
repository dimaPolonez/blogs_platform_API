import { BLOGS } from '../data/blogs.data';
import { requestBodyPost } from '../models/request.models';
import { byId } from './index.service';

class blogService {
  async getAll() {
    try {
      return 'Hello world';
    } catch (e) {}
  }

  async getOne(bodyID: any) {
    try {
    } catch (e) {}
  }

  async create(body: any) {
    try {
    } catch (e) {}
  }

  async update(body: any) {
    try {
    } catch (e) {}
  }

  async delete(bodyID: any) {
    try {
    } catch (e) {}
  }
}

export default new blogService();
