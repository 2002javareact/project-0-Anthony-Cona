import { Reimbursement } from "../models/Reimbursement";
import { PoolClient } from "pg"
import { connectionPool } from ".";
import { InternalServerError } from "../errors/InternalServerError";
import { reimbursementDTOToReimbursementConverter } from "../util/reimbursement-dto-to-reimbursement-converter";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import session = require("express-session");


//Takes a (statusId) number in, query's results based of that number, maps them to the Reimbursement Model and returns them back to the client 
export async function daoFindByStatusId(id: number): Promise<Reimbursement[]> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query('select * from projectzero.reimbursement where status = $1', [id])
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

//Takes a (userId) number in, query's results based of that number, maps them to the Reimbursement Model and returns them back to the client 
export async function daoFindByUserId(id: number): Promise<Reimbursement[]> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query('select * from projectzero.reimbursement where author = $1', [id])
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


//Takes in a reimbursement Object and runs an insert statement to add data to the DB
export async function daoAddReimbursement(newReimbursement: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient
    try {

        client = await connectionPool.connect()
        let result = await client.query('insert into projectzero.reimbursement (author,amount,dateSubmitted,dateResolved,description,resolver,status,"type")  values  ($1,$2,$3,$4,$5,$6,$7,$8) returning reimbursementId;',
            [newReimbursement.author, newReimbursement.amount, newReimbursement.dateSubmitted, newReimbursement.dateResolved, newReimbursement.description, newReimbursement.resolver, newReimbursement.status, newReimbursement.type])
        //Because the reimbursementid is added by the DB, this allows us to set the id after the reimbursement
        newReimbursement.reimbursementId = result.rows[0].reimbursementid
        return newReimbursement
    } catch (e) {
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}

//Takes in reimbursement information, query's the reimbursement to be update by required id value, stores the new information into the reimbursement
//Runs an update statement with the new information, then returns the updated information 
export async function daoUpdateReimbursement(reimbursementUpdate: any): Promise<Reimbursement> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let result = await client.query('select * from projectzero.reimbursement where reimbursementid = $1', [reimbursementUpdate.reimbursementid])
        let currentReimbursement = reimbursementDTOToReimbursementConverter(result.rows[0])

        //use Default operators checks for exsisting data to change and keeps old data if their is no new data 
        currentReimbursement.author = reimbursementUpdate.author || currentReimbursement.author
        currentReimbursement.amount = reimbursementUpdate.amount || currentReimbursement.amount
        currentReimbursement.dateResolved = reimbursementUpdate.dateResolved || currentReimbursement.dateResolved
        currentReimbursement.dateSubmitted = reimbursementUpdate.dateSubmitted || currentReimbursement.dateSubmitted
        currentReimbursement.description = reimbursementUpdate.description || currentReimbursement.description
        currentReimbursement.resolver = reimbursementUpdate.resolver || currentReimbursement.resolver
        currentReimbursement.status = reimbursementUpdate.status || currentReimbursement.status
        currentReimbursement.type = reimbursementUpdate.type || currentReimbursement.type

        await client.query('update projectzero.reimbursement set author = $1 , amount = $2 , dateSubmitted = $3, dateResolved = $4, resolver = $5 , status = $6 , "type" = $7 where reimbursementid = $8;',
            [currentReimbursement.author, currentReimbursement.amount, currentReimbursement.dateSubmitted, currentReimbursement.dateResolved, currentReimbursement.resolver, currentReimbursement.status, currentReimbursement.type, currentReimbursement.reimbursementId])

        return currentReimbursement
    } catch (e) {
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}
