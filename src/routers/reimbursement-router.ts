import * as express from 'express'
import { authFactory } from '../middleware/auth-middleware'
import { findByStatusId, findByUserId, addReimbursement, updateReimbursement } from '../services/reimbursement-services'
import { InternalServerError } from '../errors/InternalServerError'
import { Reimbursement } from '../models/Reimbursement'

export const reimbursementRouter = express.Router()


reimbursementRouter.get('/status/:statusId', authFactory(['admin', 'finance-manager']), async (req, res) => {
    const id = +req.params.statusId
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        try {
            let status = await findByStatusId(id)
            res.json(status)
        } catch (e) {
            res.status(e.status).send(e.message)
        }
    }
})

reimbursementRouter.get('/author/userId/:userId', authFactory(['admin', 'finance-manager', 'user']), async (req, res) => {
    const id = +req.params.userId
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        try {
            let status = await findByUserId(id)
            res.json(status)
        } catch (e) {
            res.status(e.status).send(e.message)
        }
    }
})

reimbursementRouter.post('', authFactory(['admin', 'finance-manager', 'user']), async (req, res) => {
    let { reimbursementId,author, amount, dateSubmitted,
        dateResolved, description, resolver,
        status, type } = req.body

    if (amount && description && type) {
        try {

            let reimbursement = await addReimbursement(new Reimbursement(0, req.session.user.userId, amount, new Date().toLocaleDateString() , '1970/01/01', description, null, 1, type))
            
            res.json(reimbursement).sendStatus(201)
        } catch (e) {
            console.log(e);
            
            throw new InternalServerError()
        }
    } else {
        res.status(400).send('Please include all fields for Reimbursement')
    }

})

reimbursementRouter.patch('', authFactory(['admin', 'finance-manager']), async (req, res) => {
    let { reimbursementid, author, amount, datesubmitted,
        dateresolved, description, resolver,
        status, type } = req.body

    if (reimbursementid && (author || amount || datesubmitted || dateresolved || description || resolver || status || type)) {
        let reimbursement = await updateReimbursement(req.body)
        res.json(reimbursement)


    } else {
        if (!reimbursementid) {
            res.status(400).send('Please include Reimbursement Id')
        }else{
            res.status(400).send('Please include atleast one field to update')    
        }    
    }


})
