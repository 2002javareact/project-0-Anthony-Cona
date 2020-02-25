import {  daoFindUserByUsernameAndPassword, daoFindAllUsers, daoFindUserById, daoUpdateUser } from "../repositories/user-dao";
import { User } from "../models/User";

export async function findUserByUsernameAndPassword(username:string, password:string): Promise<User>{
       return await daoFindUserByUsernameAndPassword(username,password)
 }

export async function findUserById(id:number):Promise<User>{
    return await daoFindUserById(id)
 }

export async function findAllUsers():Promise<User[]>{
    return await daoFindAllUsers();
}

export async function updateUser(userUpdate:any):Promise<User>{
    return await daoUpdateUser(userUpdate);
}