import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import openApiSpecification from './helper/swaggerJsDoc';

const server = async () => {
    const app = express();
    app.use(helmet());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(openApiSpecification),
    );

    await createConnection();

    app.listen(process.env.PORT, () => {
        console.log(`Auth server running on port ${process.env.PORT}`);
    });
};

server();
