import { InvalidPermissionsError } from "../errors/InvalidPermissionsError"

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

export const authCheckId = (req, res, next) => {
    if (req.session.user.role.role === 'finance-manager'|| req.session.user.role.role === 'admin') {
        next()
    } else if (req.session.user.userId === +req.params.id) {
        next()
    } else {
        res.status(403).send('You are Unauthorized for this endpoint')
    }
}