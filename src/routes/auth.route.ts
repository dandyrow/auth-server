import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';
import { authentication } from '../middleware/authentication.middleware';

const authRouter = Router();
const prisma = new PrismaClient();

authRouter
    .route('/')
    .get(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const computerId = req.query.computerId as string;
            const username = req.query.username as string;
            const totp = req.query.otp;

            let auth = await prisma.authorisation.findFirst({
                where: {
                    user: { username },
                    computer: { id: computerId },
                },
                include: { user: true },
            });

            if (!auth || !auth.authenticated) {
                res.json({
                    authenticated: false,
                    username: '',
                });
                return;
            }

            auth = await prisma.authorisation.update({
                where: {
                    userId_computerId: {
                        userId: auth.userId,
                        computerId: auth.computerId,
                    },
                },
                data: { authenticated: false },
                include: { user: true },
            });

            res.json({
                authenticated: true,
                username: auth.user.username,
            });
        } catch (err) {
            next(err);
        }
    })
    .post(authentication, async (req: Request, res: Response) => {
        const computerId = req.body.computerId;
        const username = req.body.username;
        const otp = req.body.otp;

        if (!computerId || !username || !otp) {
            res.sendStatus(400);
            return;
        }

        const auth = await prisma.authorisation.findFirst({
            where: {
                user: { username },
                computerId,
            },
        });

        if (!auth) {
            res.sendStatus(401);
            return;
        }

        await prisma.authorisation.update({
            where: {
                userId_computerId: {
                    userId: auth.userId,
                    computerId: auth.computerId,
                },
            },
            data: { authenticated: true },
        });

        res.sendStatus(200);
    });

export default authRouter;
