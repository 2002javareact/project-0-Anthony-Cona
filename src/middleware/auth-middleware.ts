export const authFactory = (roles:string[])=>{
    return(req,res,next)=>{
        if(!req.session.user){
            res.status(401).send('Please Login')
        }else if(roles.includes('Everyone')){
            next()
        }else{
            let allowed = false
            for(let role of roles){
                if(req.session.user.role === role){
                    allowed = true
                    next()
                }
            }
            if(!allowed)
            res.status(401).send('The incoming token has expired')
        }
    } 
}

export const authCheckId = (req,res,next)=>{
    if(req.session.user.id === +req.params.id){
        next()
    }else{
        res.status(401).send('The incoming token has expired')
    }

}