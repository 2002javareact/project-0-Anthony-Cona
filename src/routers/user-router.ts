import * as express from 'express'
import { authFactory, authCheckId } from '../middleware/auth-middleware'
import { User } from '../models/User'
import { findAllUsers, findUserById, updateUser } from '../services/user-services'


export const userRouter = express.Router()

//get request that admins and finance-manages can use to return all users
userRouter.get('', authFactory(['admin','finance-manager']), async (req, res) => {
    let users: User[] = await findAllUsers()
    res.json(users)
})

//patch request that only admins can use to update a users information
userRouter.patch('', authFactory(['admin']), async (req,res)=>{
    let { userName, password, 
    email, userId,
    firstName, lastName,
    role } = req.body
    
    if(userId && (userName || password || email || firstName || lastName || role)){
        let user = await updateUser(req.body)
        res.json(user)
    } else {
        if(!userId){
        res.status(400).send('Please include User Id')
        }else{
            res.status(400).send('Please include atleast one field to update')    
        }
    }
})

//get request that can be used by admins,finance-managers, and users with that id to return a single user by id
userRouter.get('/:id', authFactory(['admin','finance-manager','user']), authCheckId, async (req, res) => {
    const id = +req.params.id
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        try {
            let user = await findUserById(id)
            res.json(user)
        } catch (e) {
            res.status(e.status).send(e.message)
        }
    }
})