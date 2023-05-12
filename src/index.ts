import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { register } from 'tsconfig-paths';
import router from './router/router';
import handleErrors from './middlewares/error-middleware';

dotenv.config();
register();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(handleErrors);

const start = async () => {
  try {
      await mongoose.connect(process.env.DB_URL);
      app.listen(PORT, () => console.log(`server started on PORT: ${PORT}`));
  } catch (error) {
      console.log(error);
  }
}

start();
