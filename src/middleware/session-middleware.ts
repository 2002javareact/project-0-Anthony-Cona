import * as session from 'express-session'

//Used to store information about current activiy going on in the server
//Can store user information as well
//Sessions are bad because they can cause issues with larger scale projects
//Should be updated to JWTs
const sessionConfig = {
    secret: 'secret',
    cookies: { secure: false },
    resave: false,
    saveUninitialized: false
}
export const sessionMiddleware = session(sessionConfig)
