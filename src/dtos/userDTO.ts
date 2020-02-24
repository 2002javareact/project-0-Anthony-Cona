// this is what the field names from the database are


export class UserDTO {
    userid:number
    username:string
    password:string
    firstname:string
    lastname:string
    email:string
    // a unique number for identification
    role:string
    roleid:number
     // their user permissions
    // user - for you can use the service
    // admin - you can ban people or add/remove movies
    constructor(username:string,
        password:string,
        email:string,
        userid:number,
        firstname:string,
        lastname:string,
        role:string,
        roleid:number){
            this.username = username
            this.password = password
            this.email = email
            this.userid = userid
            this.firstname = firstname
            this.lastname = lastname
            this.role = role
            this.roleid = roleid
        }
}