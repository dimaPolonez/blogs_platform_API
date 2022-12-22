import { Request, Response } from 'express';
import { app } from '../index';

app.get('/', (req: Request, res: Response) => {
  try {
    res.status(200).json('Server start!');
  } catch (e) {
    res.status(500).json(e);
  }
});
