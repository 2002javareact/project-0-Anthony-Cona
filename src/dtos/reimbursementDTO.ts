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
        reimbursementid: number,
        author: number,
        amount: number,
        datesubmitted: string,
        dateresolved: string,
        description: string,
        resolver: number,
        status: number,
        type: number) {

        this.reimbursementid = reimbursementid
        this.author = author
        this.amount = amount
        this.datesubmitted = datesubmitted
        this.dateresolved = dateresolved
        this.description = description
        this.resolver = resolver
        this.status = status
        this.type = type
    }
}