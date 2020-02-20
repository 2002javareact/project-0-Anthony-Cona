import * as express from 'express'
import { users } from './database'
import { sessionMiddleware } from './middleware/session-middleware'
import * as bodyparser from 'body-parser'
import { BadCredentialError } from './errors/BadCredentialError'

const app = express()

app.use('/', bodyparser.json())

app.use(sessionMiddleware)

app.post('/login', (req, res) => {
    const { username, password } = req.body 
    
    if (!username || !password) {
        res.status(400).send('Please Include Username and Password')
    } else {
        try {
            let user = findUserByUsernameAndPassword(username, password)
            req.session.user = user
            res.status(200).json(user)//for ourself for the future
        } catch (e) {
            res.status(e.status).send(e.message)
        }
    }

})

function findUserByUsernameAndPassword(username: string, password: string) {
    for (let user of users) {
        if (user.username === username && user.password === password) {
            return user
        }
    }
    throw new BadCredentialError()
}


app.listen(2002, () => {
    console.log('app has started on port 2002');
})