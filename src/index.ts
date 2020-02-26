import * as express from 'express'
import { sessionMiddleware } from './middleware/session-middleware'
import * as bodyparser from 'body-parser'
import { BadCredentialError } from './errors/BadCredentialError'
import { findUserByUsernameAndPassword } from './services/user-services'
import { loggingMiddleware } from './middleware/logging-middleware'
import {userRouter} from './routers/user-router'
import { reimbursementRouter } from './routers/reimbursement-router'

const app = express()

app.use('/', bodyparser.json())

app.use(loggingMiddleware)

app.use(sessionMiddleware)

app.use('/users', userRouter)

app.use('/reimbursements', reimbursementRouter)


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

app.listen(2002, () => {
    console.log('app has started on port 2002');
})