import { Reimbursement} from "../models/Reimbursement";
import { PoolClient } from "pg"
import { connectionPool } from ".";
import { InternalServerError } from "../errors/InternalServerError";
import { reimbursementDTOToReimbursementConverter } from "../util/reimbursement-dto-to-reimbursement-converter";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import session = require("express-session");



/*********** Write SQL query ***********/
export async function daoFindByStatusId(id: number): Promise<Reimbursement[]> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query('select * from projectzero.reimbursement where status = $1',[id])
        if (results.rowCount === 0) {
            throw new Error('Reimbursements Not Found');
        }
        return results.rows.map(reimbursementDTOToReimbursementConverter)
    } catch (e) {
        if (e.message === 'Reimbursements Not Found') {
            throw new ReimbursementNotFoundError();
        }
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}

/*********** Write SQL query ***********/
export async function daoFindByUserId(id: number): Promise<Reimbursement[]> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query('select * from projectzero.reimbursement where author = $1',[id])
        if (results.rowCount === 0) {
            throw new Error('Reimbursement Not Found');
        }
        return results.rows.map(reimbursementDTOToReimbursementConverter)
    } catch (e) {
        if (e.message === 'Reimbursement Not Found') {
            throw new ReimbursementNotFoundError();
        }
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}


/******Need to rework this to pass in a new Reimbursement and not the req.body********/
export async function daoAddReimbursement(newReimbursement: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient
    try {

        client = await connectionPool.connect()
        let result = await client.query('insert into projectzero.reimbursement (author,amount,dateSubmitted,dateResolved,description,resolver,status,"type")  values  ($1,$2,$3,$4,$5,$6,$7,$8) returning reimbursementId;', 
                        [newReimbursement.author,newReimbursement.amount,newReimbursement.dateSubmitted,newReimbursement.dateResolved,newReimbursement.description,newReimbursement.resolver,newReimbursement.status,newReimbursement.type])
        newReimbursement.reimbursementId = result.rows[0].reimbursementid
        return newReimbursement
    } catch(e){
        console.log(e);
        
        throw new InternalServerError()

    } finally {
        client && client.release()
    }
}

/******* ******************/
export async function daoUpdateReimbursement(reimbursementUpdate: any): Promise<Reimbursement> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let result = await client.query('select * from projectzero.reimbursement where reimbursementid = $1',[reimbursementUpdate.reimbursementid])
        console.log(result.rows[0]);
        
        let currentReimbursement = reimbursementDTOToReimbursementConverter(result.rows[0])

        currentReimbursement.author = reimbursementUpdate.author || currentReimbursement.author
        currentReimbursement.amount = reimbursementUpdate.amount || currentReimbursement.amount
        currentReimbursement.dateResolved = reimbursementUpdate.dateResolved || currentReimbursement.dateResolved
        currentReimbursement.dateSubmitted = reimbursementUpdate.dateSubmitted || currentReimbursement.dateSubmitted
        currentReimbursement.description = reimbursementUpdate.description || currentReimbursement.description
        currentReimbursement.resolver = reimbursementUpdate.resolver || currentReimbursement.resolver
        currentReimbursement.status = reimbursementUpdate.status || currentReimbursement.status
        currentReimbursement.type = reimbursementUpdate.type || currentReimbursement.type

        await client.query('update projectzero.reimbursement set author = $1 , amount = $2 , dateSubmitted = $3, dateResolved = $4, resolver = $5 , status = $6 , "type" = $7 where reimbursementid = $8;',
        [currentReimbursement.author,currentReimbursement.amount,currentReimbursement.dateSubmitted,currentReimbursement.dateResolved,currentReimbursement.resolver,currentReimbursement.status,currentReimbursement.type, currentReimbursement.reimbursementId])

        return currentReimbursement
    } catch (e) {
        console.log(e);
        
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}
