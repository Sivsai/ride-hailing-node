import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import { query } from '../config/db'

const KEY_EXPIRY_HOURS = 24;

export const ensureRotation = async () => {
    const result = await query(`SELECT * FROM signing_keys WHERE is_active= true AND expires_at>NOW()  LIMIT 1`);

    if (result.rows.length === 0) {
        await query(`UPDATE signing_keys SET is_active = false`);

        await query(`INSERT INTO signing_keys(id,secret,expires_at,is_active) VALUES($1,$2,NOW()+INTERVAL '${KEY_EXPIRY_HOURS} hours',true)`,
            [uuidv4(), crypto.randomBytes(64).toString('hex')]);
    }
};
export const currentSigningKey = async () => {
    const result = await query(`SELECT * FROM signing_keys WHERE is_active = true AND expires_at>NOW() LIMIT 1`);
    return result.rows[0];

};
export const cleanExpiredKeys = async () => {
    await query(`DELETE FROM signing_keys WHERE is_active = false AND expires_at<NOW()`);
};