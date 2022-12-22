import express, { Request, Response } from 'express';

export const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.json('Hello, server start!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
