import express from 'express';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the http-backend!');
});

app.listen(port, () => {
  console.log(`🚀 http-backend listening at http://localhost:${port}`);
});
