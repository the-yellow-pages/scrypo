import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import profilesRouter from './routes/profiles.routes.ts';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/profiles', profilesRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
