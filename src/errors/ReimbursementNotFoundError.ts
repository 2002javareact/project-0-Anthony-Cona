import { HttpError } from "./HttpError";

export class ReimbursementNotFoundError extends HttpError {
    constructor(){
        super('Status Not Found', 404)
    }
}