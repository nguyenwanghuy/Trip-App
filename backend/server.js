import express from 'express';
import "dotenv/config";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import { connectToDatabase } from './configs/db.js';
import {errorHandlerMiddleware} from './middlewares/error.middleware.js'

const app = express();
const PORT = 8001;

const whitelist = ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
// connect to database
connectToDatabase()
//middleware
app.use(express.json());
app.use(cors('*'));
app.use(cookieParser());
//routing
app.use('/trip', router)
//Error handler
app.use(errorHandlerMiddleware)

app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`);
})
