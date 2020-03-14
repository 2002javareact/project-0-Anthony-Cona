import { Request, Response, NextFunction } from "express";

//Used to view the kind of request is being sent and from where
export function loggingMiddleware(req:Request,res:Response,next:NextFunction){

    console.log(`Request Url is ${req.url} and Request Method is ${req.method} `)
    next()
    
}