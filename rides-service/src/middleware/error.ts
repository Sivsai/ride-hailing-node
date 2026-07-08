export  class AppError extends Error{
    constructor(public message:string,public statusCode:number){
        super(message);
    }
}
export class ConflictError extends AppError{
    constructor(public msg:string) {super(msg,409)};
}
export class UnauthorizedError extends AppError{
    constructor(public msg:string) {super(msg,401)};
}
export class NotFoundError extends AppError{
    constructor(public msg:string) {super(msg,404)};
}
export class InternalServerError extends AppError{
    constructor(public msg:string) {super(msg,500)};
}