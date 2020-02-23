import { connectionPool } from "../repositories"
import {PoolClient} from "pg"
import { userDTOToUserConverter } from "../util/user-dto-to-user-converter"
import { User } from "../models/User"
import { InternalServerError } from "../errors/InternalServerError"
import { BadCredentialError } from "../errors/BadCredentialError"

export async function daoFindUserByUsernameAndPassword(username:string,password:string):Promise<User>{
    let client:PoolClient// our potential connection to db
    try {
        client = await connectionPool.connect()
        // a paramaterized query
        let results = await client.query('SELECT * FROM projectzero.users U inner join projectzero.roles R on U."role" = R.roleid  WHERE username = $1  and "password" = $2', [username,password])
        
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        
        return userDTOToUserConverter(results.rows[0])
    } catch(e){
        console.log(e);
        if(e.message === 'User Not Found'){
            throw new BadCredentialError()
        }else {
            throw new InternalServerError()
        }
    } finally {
        client && client.release()
    }
}

export async function daoFindAllUsers():Promise<User[]>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let results = await client.query('SELECT * FROM projectzero.users U inner join projectzero.roles R on U."role" = R.role_id')
        return results.rows.map(userDTOToUserConverter)
        //return null
    }catch(e){
        throw new InternalServerError()
    } finally {
        client && client.release()
    }

}


export async function daoFindUserById(id:number):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let result = await client.query('SELECT * FROM projectzero.users U inner join projectzero.roles R on U."role" = R.role_id WHERE U.user_id = $1', [id])
        if(result.rowCount === 0){
            throw new Error('User Not Found')
        }
        return userDTOToUserConverter(result.rows[0])
    }catch(e){
        // id DNE
        //need if for that
        if(e.message ==='User Not Found'){
            //throw new UserNotFoundError()
        }
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}