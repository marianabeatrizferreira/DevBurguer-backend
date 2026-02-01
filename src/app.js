import express from 'express';
import fileRoutesConfig from './config/fileroutes.cjs';
import routes from './routes.js';
import cors from 'cors';
import 'dotenv/config';




const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/product-file', fileRoutesConfig);
app.use('/category-file', fileRoutesConfig);
app.use(routes);
export default app;
