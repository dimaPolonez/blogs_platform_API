import { Request, Response } from 'express';
import postService from '../services/post.service';
import {ERRORS_CODE} from "../data/db.data";
import {ObjectId} from "mongodb";

class postController {

  async getOne(req: Request, res: Response) {

    try {
      const bodyId: ObjectId = new ObjectId(req.params.id);
      const post = await postService.getOne(bodyId);

      if (post) {
        res.status(ERRORS_CODE.OK_200).json(post);
      } else {
        res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
      }
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const post = await postService.create(req.body);

      if (post) {
        res.status(ERRORS_CODE.CREATED_201).json(post);
      } else {
        res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
      }
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const bodyId: ObjectId = new ObjectId(req.params.id);

      const post = await postService.update(bodyId,req.body);

      if (post) {
        res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
      } else {
        res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
      }
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const bodyId: ObjectId = new ObjectId(req.params.id);

      const post = await postService.delete(bodyId);

      if (post) {
        res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
      } else {
        res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
      }
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }
}

export default new postController();
