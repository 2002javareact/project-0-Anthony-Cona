import { HttpError } from "./HttpError";


export class BadCredentialError extends HttpError{
    constructor(){
        super('Invalid Credentials', 500)
    }
}