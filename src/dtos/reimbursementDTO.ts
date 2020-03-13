export class ReimbursementDTO {
    reimbursementid: number
    author: number
    amount: number
    datesubmitted: string
    dateresolved: string
    description:string
    resolver: number
    status: number
    type: number

    constructor(
        reimbursementId: number,
        author: number,
        amount: number,
        dateSubmitted: string,
        dateResolved: string,
        description: string,
        resolver: number,
        status: number,
        type: number) {

        this.reimbursementid = reimbursementId
        this.author = author
        this.amount = amount
        this.datesubmitted = dateSubmitted
        this.dateresolved = dateResolved
        this.description = description
        this.resolver = resolver
        this.status = status
        this.type = type
    }
}