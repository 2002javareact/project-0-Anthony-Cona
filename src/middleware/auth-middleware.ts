import { InvalidPermissionsError } from "../errors/InvalidPermissionsError"

//Takes a string array, checks against the current user and the array, if the users role matches one of the string array it calls next()
//This allows for addtional actions to be taken by authorized users
export const authFactory = (roles: string[]) => {
    return (req, res, next) => {
        if (!req.session.user) {
            res.status(401).send('Please Login')
        } else if (roles.includes('Everyone')) {
            next()
        } else {
            let allowed = false
            for (let role of roles) {
                if (req.session.user.role.role === role) {
                    
                    allowed = true
                    next()
                }
            }
            if (!allowed) {
                console.log(req.session.user.role.role);

                throw new InvalidPermissionsError()
            }
        }
    }
}

//Checks an ID value to allow users of a particular Id to view their own information
export const authCheckId = (req, res, next) => {
    if (req.session.user.role.role === 'finance-manager'|| req.session.user.role.role === 'admin') {
        next()
    } else if (req.session.user.userId === +req.params.id||req.session.user.userId === +req.params.userId) {
        next()
    } else {
        res.status(403).send('You are Unauthorized for this endpoint')
    }
}