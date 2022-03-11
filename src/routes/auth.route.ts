import { NextFunction, Request, Response, Router } from 'express';
import { Authorisation } from '../entity/Authorisation';
import { authentication } from '../middleware/authentication.middleware';

const authRouter = Router();

authRouter
    .route('/')
    .get(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const computerId = req.query.computerId;
            const username = req.query.username;
            const otpSecret = req.query.otp;

            const auth = await Authorisation.findOne({
                where: { user: { username: username }, computerId },
                relations: ['user'],
            });

            if (!auth || !auth.authorised) {
                res.json({
                    authenticated: auth?.authorised,
                    username: '',   
                });
                return;
            }

            auth.authorised = false;
            auth.save();

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

        const auth = await Authorisation.findOne({
            where: { user: { username }, computerId },
            relations: ['user', 'computer'],
        });

        if (
            !auth ||
            auth.user.username !== username ||
            auth.computerId !== computerId
        ) {
            res.sendStatus(401);
            return;
        }

        Authorisation.update(
            { userId: auth.userId, computerId: auth.computerId },
            { authorised: true },
        );

        res.sendStatus(200);
    });

export default authRouter;
