import { User } from './../entity/User';
import { compare } from 'bcryptjs';
import { Request, Response, Router, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
} from '../helper/tokens';
import { getConnection } from 'typeorm';

const userRouter = Router();

userRouter
    .post('/login', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const username = req.body.username;
            const password = req.body.password;
            if (!username || !password) {
                res.sendStatus(400);
                return;
            }

            const user = await User.findOne({ where: { username } });
            if (!user) {
                res.sendStatus(401);
                return;
            }

            const valid = await compare(password, user.password);
            if (!valid) {
                res.sendStatus(401);
                return;
            }

            sendRefreshToken(res, createRefreshToken(user));
            res.json({
                accessToken: createAccessToken(user),
            });
        } catch (err) {
            next(err);
        }
    })
    .post(
        '/refresh',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const token = req.cookies.chocolate;
                if (!token) {
                    res.sendStatus(401);
                }

                const payload = verify(
                    token,
                    process.env.REFRESH_TOKEN_SECRET!,
                ) as JwtPayload;

                const user = await User.findOne({ id: payload.userId });
                if (!user) {
                    res.sendStatus(401);
                    return;
                }

                if (user.tokenVersion !== payload.tokenVersion) {
                    res.send('Refresh token invalid');
                    res.sendStatus(401);
                    return;
                }

                sendRefreshToken(res, createRefreshToken(user));
                res.json({ accessToken: createAccessToken(user) });
            } catch (err) {
                next(err);
            }
        },
    )
    .get('/logout', (_, res: Response) => {
        // Send empty refresh token
        sendRefreshToken(res, '');
        res.send();
    })
    .post(
        '/revokeRefresh',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await getConnection()
                    .getRepository(User)
                    .increment({ id: req.body.userId }, 'tokenVersion', 1);
                res.sendStatus(200);
            } catch (err) {
                next(err);
            }
        },
    );

export default userRouter;
