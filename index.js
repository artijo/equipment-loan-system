import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './Routes.js';

const app = express();
app.use(morgan('dev'));
app.use(cors(
    {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

dotenv.config();

app.use('/api', router);
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World!',
//     });
// });

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});