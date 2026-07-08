
import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from './error'
import jwt from 'jsonwebtoken'
import { query } from '../config/db'
export const authenticate = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) throw new UnauthorizedError('Token not avaliable');
        const decoded = jwt.decode(token, { complete: true });

        const kid = decoded?.header?.kid;

        if (!kid) throw new UnauthorizedError('Invalid Token');

        const result = await query(`SELECT * FROM signing_keys WHERE id = $1`, [kid]);

        const key = result.rows[0];
        if (!key) throw new UnauthorizedError('Signing Key not found');

        req.user = jwt.verify(token, key.secret);

        next();
    }
    catch (err) {
        next(err);
    }


}

