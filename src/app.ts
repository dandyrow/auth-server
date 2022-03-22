import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import 'reflect-metadata';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './routes/auth.route';
import adminRouter from './routes/admin.route';
import userRouter from './routes/user.route';
import cookieParser from 'cookie-parser';
import openApiSpecification from './helper/swaggerJsDoc';

const server = async () => {
    const app = express();
    app.use(helmet());
    app.use(cors({ origin: 'http://localhost:8100', credentials: true }));
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(openApiSpecification),
    );

    app.use('/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/admin', adminRouter);

    app.listen(process.env.PORT, () => {
        console.log(`Auth server running on port ${process.env.PORT}`);
    });
};

server();
