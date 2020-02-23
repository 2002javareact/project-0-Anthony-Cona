import { Role } from './Role'
export class User {
    userId: number // primary key
    username: string // not null, unique
    password: string // not null
    firstname: string // not null
    lastName: string // not null
    email: string // not null
    role: Role // not null

    constructor(userId: number, username: string, password: string, firstname: string, lastName: string, email: string, role: Role) {
        this.userId = userId
        this.username = username
        this.password = password
        this.firstname = firstname
        this.lastName = lastName
        this.email = email
        this.role = role
    }
}