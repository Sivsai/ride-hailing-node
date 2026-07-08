import * as repo from '../repository/authRepository'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { ConflictError, InternalServerError, UnauthorizedError, NotFoundError } from '../middleware/error'
import { ensureRotation, currentSigningKey } from '../keys/keyManager'
import jwt from 'jsonwebtoken';
export const register = async (body: {
    email: string,
    password: string,
    phone_number: string,
    first_name: string,
    last_name: string,
    role: 'rider' | 'driver' | 'admin'
}) => {

    if (body.role === 'admin') throw new UnauthorizedError('Cannot self-register as admin');
    const existing = await repo.getUserByEmail(body.email);

    if (existing) throw new ConflictError('User already exists!!');

    const userId = uuidv4();
    const password_hash = await bcrypt.hash(body.password, 10);
    const user = await repo.createUser({
        id: userId,
        email: body.email,
        phone_number: body.phone_number,
        password_hash,
        first_name: body.first_name,
        last_name: body.last_name,
        role: body.role
    });

    if (body.role == 'driver') {
        try {
            const driver = await repo.createDriver({
                id: uuidv4(),
                user_id: userId,
                license_number: `PENDING-${userId.slice(0, 8)}`,
                vehicle_model: `Not Specified`,
                vehicle_plate: `PENDING-${userId.slice(0, 6)}`,
                vehicle_color: `Not Specified`,
                vehicle_year: '2020'
            });
        }
        catch (err) {
            console.log('Driver Creation failed :', err);
        }
    }
    delete user.password_hash;
    return user;


}

export const login = async (body: { email: string, password: string }) => {
    const user = await repo.getUserByEmail(body.email);

    if (!user) throw new UnauthorizedError('Invalid credentials');

    if (!user.is_active) throw new UnauthorizedError('User is Not Active');

    const valid = await bcrypt.compare(body.password, user.password_hash);

    if (!valid) throw new UnauthorizedError('Invalid credentials');

    delete user.password_hash;

    const token = await generateToken(user);

    return { user, token };


}
export const generateToken = async (user: any) => {
    await ensureRotation();
    const key = await currentSigningKey();

    if (!key) throw new InternalServerError(`No keys available`);

    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        key.secret,
        { expiresIn: '24h', keyid: key.id }
    );
}

export const getProfile = async (user_id: string) => {

    const user = await repo.getUserById(user_id);
    if (!user) throw new NotFoundError('User not found');
    delete user.password_hash;
    return user;
}