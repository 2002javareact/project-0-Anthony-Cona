import * as express from 'express'
import { sessionMiddleware } from './middleware/session-middleware'
import * as bodyparser from 'body-parser'
import { BadCredentialError } from './errors/BadCredentialError'
import { findUserByUsernameAndPassword } from './services/user-services'
import { loggingMiddleware } from './middleware/logging-middleware'
import {userRouter} from './routers/user-router'
import { reimbursementRouter } from './routers/reimbursement-router'
import { corsFilter } from './middleware/cors-filter'

const app = express()

//parses information into json
app.use('/', bodyparser.json())

//logs information back to the terminal
app.use(loggingMiddleware)

//sets up a session
app.use(sessionMiddleware)

app.use(corsFilter)

//calls userRouter to use request on that url
app.use('/users', userRouter)

//calls reimbursementRouter to use request on that url
app.use('/reimbursements', reimbursementRouter)

//logs user in via a post request
app.post('/login', async (req, res) => {
    const { username, password } = req.body 
    
    if (!username || !password) {
        res.status(400).send('Please Include Username and Password')
    } else {
        try {
            let user = await findUserByUsernameAndPassword(username, password)            
            req.session.user = user
            
            res.status(200).json(user)//for ourself for the future
        } catch (e) {
            throw new BadCredentialError()
        }
    }
})

//Creates a connection on the localhost 2002
app.listen(2002, () => {
    console.log('app has started on port 2002');
})