import { HttpError } from "./HttpError";

export class InvalidPermissionsError extends HttpError{
    constructor(){
        super('The incoming token has expired', 401)
    }
}