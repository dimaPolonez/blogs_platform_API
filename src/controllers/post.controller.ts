import { Request, Response } from 'express';
import { ERRORS_CODE } from '../data/errors.data';
import postService from '../services/post.service';

class postController {
  async getAll(req: Request, res: Response) {
    try {
      const posts = await postService.getAll();
      res.status(ERRORS_CODE.OK_200).json(posts);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const post = await postService.getOne(req.params.id);
      res.status(ERRORS_CODE.OK_200).json(post);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const post = await postService.create(req.body);
      res.status(ERRORS_CODE.CREATED_201).json(post);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedPost = await postService.update(req.body);
      res.status(ERRORS_CODE.NO_CONTENT_204).json(updatedPost);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const post = await postService.delete(req.params.id);
      res.status(ERRORS_CODE.NO_CONTENT_204);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }
}

export default new postController();
