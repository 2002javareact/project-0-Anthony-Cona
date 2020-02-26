import { Role } from './Role'
export class User {
    userId: number
    userName: string
    password: string 
    firstName: string 
    lastName: string 
    email: string 
    role: Role

    constructor(userId: number, userName: string, password: string, firstName: string, lastName: string, email: string, role: Role) {
        this.userId = userId
        this.userName = userName
        this.password = password
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.role = role
    }
}