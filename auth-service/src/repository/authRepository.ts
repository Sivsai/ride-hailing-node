import { query} from "../config/db"


export const getUserByEmail = async (email:string)=>{
    const result  =await query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0]|| null;
};
export const getUserById = async (id:string)=>{
    const result  =await query(
        `SELECT * FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0]||null;
};

export const createUser = async(user:{
    id:string,
    email:string,
    phone_number:string,
    password_hash : string,
    first_name:string,
    last_name:string,
    role:string
})=>
    {
        const result = await query(
            `INSERT INTO users (id,email,phone_number,password_hash,first_name,last_name,role) 
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [user.id,user.email,user.phone_number,user.password_hash,user.first_name,user.last_name,user.role]
        );
        return result.rows[0];   
};

export const updateUser = async(user:{
    id:string,
    first_name?:string,
    last_name?:string,
    phone_number?:string
}) =>{
    const result = await query(
        `UPDATE users SET first_name = $1 ,last_name = $2, phone_number = $3 WHERE id = $4 RETURNING *`,
        [user.first_name,user.last_name,user.phone_number,user.id]
    );
    return result.rows[0];
};
export const createDriver = async (driver:{
    id:string,
    user_id: string,
    license_number:string,
    vehicle_model:string,
    vehicle_plate:string,
    vehicle_color:string,
    vehicle_year:string
}) =>{
    const result = await query(
        `INSERT INTO drivers(id,user_id,license_number,vehicle_model,vehicle_plate,vehicle_color,vehicle_year) 
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [driver.id,driver.user_id,driver.license_number,driver.vehicle_model,driver.vehicle_plate,driver.vehicle_color,driver.vehicle_year]
    );
    return result.rows[0];
};
