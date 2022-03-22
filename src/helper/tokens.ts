import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { User } from '@prisma/client';

export function createAccessToken(user: User) {
    return sign(
        {
            userId: user.id,
            username: user.username,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: '10m' },
    );
}

export function createRefreshToken(user: User) {
    return sign(
        {
            userId: user.id,
            tokenVersion: user.tokenVersion,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: '1y' },
    );
}

export function sendRefreshToken(res: Response, token: string) {
    res.cookie('chocolate', token, {
        httpOnly: true,
    });
}
