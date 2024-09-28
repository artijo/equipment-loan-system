import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './Routes.js';

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

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