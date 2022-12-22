import express from 'express';
import startBD from '';

const PORT = process.env.PORT || 5000;

export const app = express();

async function startApp() {
  try {
    await startBD();
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

startApp();
