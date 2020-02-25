import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTO } from "../dtos/reimbursementDTO";



export function reimbursementDTOToReimbursementConverter(reimbursementDTO:ReimbursementDTO):Reimbursement{
    return new Reimbursement(
        reimbursementDTO.reimbursementid,
        reimbursementDTO.author,
        reimbursementDTO.amount,
        reimbursementDTO.datesubmitted,
        reimbursementDTO.dateresolved,
        reimbursementDTO.description,
        reimbursementDTO.resolver,
        reimbursementDTO.status,
        reimbursementDTO.status
    )
}