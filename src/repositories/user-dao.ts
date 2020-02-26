import { connectionPool } from "../repositories"
import { PoolClient } from "pg"
import { userDTOToUserConverter } from "../util/user-dto-to-user-converter"
import { User } from "../models/User"
import { InternalServerError } from "../errors/InternalServerError"
import { BadCredentialError } from "../errors/BadCredentialError"
import { UserNotFoundError } from "../errors/UserNotFoundError"
import { findUserById } from "../services/user-services"

//Takes in 2 strings and checks to see if the values match in the DB, returns the user inform
//Used for login purposes
export async function daoFindUserByUsernameAndPassword(username: string, password: string): Promise<User> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()

        let results = await client.query('SELECT * FROM projectzero.users U inner join projectzero.roles R on U."role" = R.roleid  WHERE username = $1  and "password" = $2', [username, password])

        if (results.rowCount === 0) {
            throw new Error('User Not Found')
        }
        return userDTOToUserConverter(results.rows[0])
    } catch (e) {
        if (e.message === 'User Not Found') {
            throw new BadCredentialError()
        }
    } finally {
        client && client.release()
    }
}

//Returns all uses from the DB
export async function daoFindAllUsers(): Promise<User[]> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query('SELECT * FROM projectzero.users U inner join projectzero.roles R on U."role" = R.roleid order by u.userid')
        return results.rows.map(userDTOToUserConverter)
    } catch (e) {
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}

//Takes in an id number and returns out the user with that id
export async function daoFindUserById(id: number): Promise<User> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let result = await client.query('SELECT * FROM projectzero.users U inner join projectzero.roles R on U."role" = R.roleid WHERE U.userid = $1', [id])
        if (result.rowCount === 0) {
            throw new Error('User Not Found')
        }
        return userDTOToUserConverter(result.rows[0])
    } catch (e) {
        if (e.message === 'User Not Found') {
            throw new UserNotFoundError()
        }
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}

//takes in user information, finds user to be updated, compares update values to old values, runs update query and returns the updated user
export async function daoUpdateUser(userUpdate: any): Promise<User> {

    let client: PoolClient
    try {
        let id = userUpdate.userId
        let user = await findUserById(id)

        //use Default operators checks for exsisting data to change and keeps old data if their is no new data 
        user.userName = userUpdate.userName || user.userName;
        user.firstName = userUpdate.firstName || user.firstName;
        user.lastName = userUpdate.lastName || user.lastName
        user.email = userUpdate.email || user.email
        user.password = userUpdate.password || user.password
        user.role.roleId = userUpdate.roleId || user.role.roleId

        client = await connectionPool.connect()
        await client.query('update projectzero.users set username = $1 , "password" = $2, firstName = $3, lastName = $4, email = $5, "role" = $6 where userId = $7;',
            [user.userName, user.password, user.firstName, user.lastName, user.email, user.role.roleId, user.userId]);

        //Because of the role class inside of users, another query of the DB is needed to grab that information
        user = await findUserById(id)
        return user
    } catch (e) {
        console.log(e);
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}