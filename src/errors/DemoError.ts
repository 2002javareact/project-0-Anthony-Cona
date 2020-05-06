import { HttpError } from "./HttpError";


export class DemoError extends HttpError{
    constructor(){
        super('I am a teapot', 418)
    }
}