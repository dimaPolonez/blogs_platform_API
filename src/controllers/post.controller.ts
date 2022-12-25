import { Request, Response } from 'express';
import postService from '../services/post.service';
import {ERRORS_CODE} from "../data/db.data";

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
      await postService.update(req.params.id,req.body);
      res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await postService.delete(req.params.id);
      res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }
}

export default new postController();
