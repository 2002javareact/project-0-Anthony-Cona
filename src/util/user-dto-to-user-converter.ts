import { UserDTO } from "../dtos/userDTO";
import { User } from "../models/User";
import { Role } from "../models/Role";

//Convers the DTO model to the non-DTO model
export function userDTOToUserConverter(userDTO:UserDTO):User{
    return new User(
        userDTO.userid,
        userDTO.username,
        userDTO.password,
        userDTO.firstname,
        userDTO.lastname,
        userDTO.email,
        new Role(userDTO.roleid,userDTO.role)
    )
}