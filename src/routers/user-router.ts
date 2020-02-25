import * as express from 'express'
import { authFactory, authCheckId } from '../middleware/auth-middleware'
import { User } from '../models/User'
import { findAllUsers, findUserById, updateUser } from '../services/user-services'


export const userRouter = express.Router()
// this will work almost exactly like it does with userRouter up in index


//generally a get request to the root of a path
//will give you every single one of those resources
userRouter.get('', authFactory(['admin','finance-manager']), async (req, res) => {
    //get all of our users
    //format them to json
    //use the response obj to send them back
    let users: User[] = await findAllUsers()
    res.json(users)// this will format the object into json and send it back
})

// generally in rest convention
// a post request to the root of a resource will make one new of that resource
userRouter.patch('', authFactory(['admin']), async (req,res)=>{
    let { userName, password, 
    email, userId,
    firstName, lastName,
    role } = req.body// this will be where the data the sent me is
    // the downside is this is by default just a string of json, not a js object
   // console.log(req.body);
    
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

// in express we can add a path variable by using a colon in the path
// this will add it to the request object and the colon makes it match anything
userRouter.get('/:id', authFactory(['admin','finance-manager','user']), authCheckId, async (req, res) => {
    const id = +req.params.id// the plus sign is to type coerce into a number
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        // look through the "database"
        try {
            let user = await findUserById(id)
            res.json(user)
        } catch (e) {
            res.status(e.status).send(e.message)

        }
    }
})