import { Request, Response, Router, NextFunction } from 'express';
import { Computer } from '../entity/Computer';
import speakeasy from 'speakeasy';
import { User } from '../entity/User';
import { hash } from 'bcryptjs';
import { Authorisation } from '../entity/Authorisation';

const adminRouter = Router();

adminRouter
    .post(
        '/adduser',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const username = req.body.username;
                const password = req.body.password;

                const hashedPassword = await hash(password, 9);

                await User.create({ username, password: hashedPassword }).save();

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
                const name = req.body.computerName;

                const computer = await Computer.create({
                    name,
                    otpSecret: speakeasy.generateSecret().base32,
                }).save();

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
                const computername = req.body.computerName;

                const user = await User.findOne({ where: { username } });
                if (!user) {
                    res.status(404);
                    res.send('Provided user not found');
                    return;
                }

                const computer = await Computer.findOne({
                    where: { name: computername },
                });
                if (!computer) {
                    res.status(404);
                    res.send('Provided computer not found');
                    return;
                }

                await Authorisation.create({ userId: user.id, computerId: computer.id }).save();

                res.sendStatus(200);
            } catch (err) {
                next(err);
            }
        },
    );

export default adminRouter;
