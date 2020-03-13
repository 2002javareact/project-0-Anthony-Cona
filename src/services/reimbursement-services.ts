import { Reimbursement } from "../models/Reimbursement";
import { daoFindByStatusId, daoFindByUserId, daoAddReimbursement, daoUpdateReimbursement } from "../repositories/reimbursement-dao";
//Bridge between client side and server side

export async function findByStatusId(id:number):Promise<Reimbursement[]>{
    return await daoFindByStatusId(id)
}

export async function findByUserId(id:number):Promise<Reimbursement[]>{
    return await daoFindByUserId(id)
}


export async function addReimbursement(newReimbursement:Reimbursement):Promise<Reimbursement>{
    return await daoAddReimbursement(newReimbursement)
}

export async function updateReimbursement(reimbursementUpdate:Reimbursement):Promise<Reimbursement>{
    return await daoUpdateReimbursement(reimbursementUpdate)
}
