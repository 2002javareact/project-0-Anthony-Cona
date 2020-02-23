import { UserDTO } from "../dtos/userDTO";
import { User } from "../models/User";
import { Role } from "../models/Role";


export function userDTOToUserConverter(userDTO:UserDTO):User{
    console.log(userDTO);
    
    console.log(userDTO.firstname);
     
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