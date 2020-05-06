import { HttpError } from "./HttpError";

//This is for a demo
export class DemoError extends HttpError{
    constructor(){
        super('I am a teapot', 418)



        
    }
}