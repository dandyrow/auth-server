import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export function authentication(req: Request, res: Response, next: NextFunction) {
    try {
        const header = req.headers['authorization'];

        if (!header) {
            throw new Error('not authenticated');
        }

        const token = header.split(' ')[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        res.locals.payload = payload;
        next();
    } catch (err) {
        next(err);
    }
}
