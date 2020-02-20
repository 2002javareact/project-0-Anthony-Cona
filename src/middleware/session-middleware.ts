import * as session from 'express-session'

const sessionConfig = {
    secret: 'secret',
    cookies: { secure: false },
    resave: false,
    saveUninitialized: false
}


//Steal comments after he pushes it
//session will be an object that conects one session to out API
export const sessionMiddleware = session(sessionConfig)
