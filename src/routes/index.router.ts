import { Request, Response } from 'express';
import { app } from '../index';

app.get('/', (req: Request, res: Response) => {
  res.sendStatus(200);
});
