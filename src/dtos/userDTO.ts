// this is what the field names from the database are


export class UserDTO {
    userid:number
    username:string
    password:string
    firstname:string
    lastname:string
    email:string
    
    role:string
    roleid:number
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