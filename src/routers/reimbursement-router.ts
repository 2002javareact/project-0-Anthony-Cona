import * as express from 'express'
import { authFactory, authCheckId } from '../middleware/auth-middleware'
import { findByStatusId, findByUserId, addReimbursement, updateReimbursement } from '../services/reimbursement-services'
import { InternalServerError } from '../errors/InternalServerError'
import { Reimbursement } from '../models/Reimbursement'

export const reimbursementRouter = express.Router()

//get request, only finance-managers, and admins can access that returns reimbursements by statusId
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

//get request, that finance-managers, admins, and users with the same userId can access that returns reimbursements by userId
reimbursementRouter.get('/author/userId/:userId', authFactory(['admin','finance-manager','user']), authCheckId, async (req, res) => {
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

//post request that finance-managers, admins, and users can use takes in reimbursement information (unused information is still present)
// and adds that new reimbursement to the DB
reimbursementRouter.post('', authFactory(['admin', 'finance-manager', 'user']), async (req, res) => {
    let { reimbursementId,author, amount, dateSubmitted,
        dateResolved, description, resolver,
        status, type } = req.body

    if (amount && description && type) {
        try {
            //Passing in ID 0 allows the DB to pick the next id value, new Date() <-- returns the current date, pass in 1 for status because 1 is pending in DB
            let reimbursement = await addReimbursement(new Reimbursement(0, req.session.user.userId, amount, new Date().toLocaleDateString() , '1970/01/01', description, null, 1, type))
            res.json(reimbursement).sendStatus(201)
        } catch (e) {
            throw new InternalServerError()
        }
    } else {
        res.status(400).send('Please include all fields for Reimbursement')
    }
})

//Patch request, that only admins and finance-managers can call. passes in information to be update for reimbursements
reimbursementRouter.patch('', authFactory(['admin', 'finance-manager']), async (req, res) => {
    let { reimbursementId, author, amount, dateSubmitted,
        dateResolved, description, resolver,
        status, type } = req.body

    if (reimbursementId && (author || amount || dateSubmitted || dateResolved || description || resolver || status || type)) {
        let reimbursement = await updateReimbursement(req.body)
        res.json(reimbursement)
    } else {
        if (!reimbursementId) {
            res.status(400).send('Please include Reimbursement Id')
        }else{
            res.status(400).send('Please include atleast one field to update')    
        }    
    }
})