import { Router, Request, Response } from 'express';
import { ERRORS_CODE } from '../data/errors.data';

const testingRouter = Router({});

testingRouter.delete(
  '/testing/all-data',
  async (req: Request, res: Response) => {
    try {
      await allDeleteBase();
      res.status(ERRORS_CODE.NO_CONTENT_204);
    } catch (e) {
      res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
  }
);
