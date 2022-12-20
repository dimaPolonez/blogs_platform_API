import { Request, Response } from 'express';
import { ERRORS_CODE } from '../data/errors.data';

class blogController {
  async getAll(req: Request, res: Response) {
    try {
      const blogs = await blogService.getAll();
      res.status(ERRORS_CODE.OK_200).json(blogs);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const blog = await blogService.getOne(req.params.id);
      res.status(ERRORS_CODE.OK_200).json(blog);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const blog = await blogService.create(req.body);
      res.status(ERRORS_CODE.CREATED_201).json(blog);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedBlog = await blogService.update(req.body);
      res.status(ERRORS_CODE.NO_CONTENT_204).json(updatedBlog);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const blog = await blogService.delete(req.params.id);
      res.status(ERRORS_CODE.NO_CONTENT_204);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }
}

export default new blogController();
