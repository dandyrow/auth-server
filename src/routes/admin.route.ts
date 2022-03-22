import { Request, Response, Router, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import speakeasy from 'speakeasy';
import { hash } from 'bcryptjs';

const adminRouter = Router();
const prisma = new PrismaClient();

adminRouter
    .post(
        '/adduser',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const username = req.body.username;
                const password = req.body.password;

                const hashedPassword = await hash(password, 9);

                await prisma.user.create({
                    data: { username, password: hashedPassword },
                });

                res.sendStatus(200);
            } catch (err) {
                next(err);
            }
        },
    )
    .post(
        '/addcomputer',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const hostname = req.body.computerName;

                const computer = await prisma.computer.create({
                    data: {
                        hostname,
                        otpSecret: speakeasy.generateSecret().base32,
                    },
                });

                res.json(computer);
            } catch (err) {
                next(err);
            }
        },
    )
    .post(
        '/addauth',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const username = req.body.username;
                const hostname = req.body.computerName;

                const user = await prisma.user.findUnique({
                    where: { username },
                });

                if (!user) {
                    res.status(404);
                    res.send('Provided user not found');
                    return;
                }

                const computer = await prisma.computer.findUnique({
                    where: { hostname },
                });
                if (!computer) {
                    res.status(404);
                    res.send('Provided computer not found');
                    return;
                }

                await prisma.authorisation.create({
                    data: {
                        userId: user.id,
                        computerId: computer.id,
                    },
                });

                res.sendStatus(200);
            } catch (err) {
                next(err);
            }
        },
    );

export default adminRouter;
