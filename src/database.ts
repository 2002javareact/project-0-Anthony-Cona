import { User } from "./models/User";
import { Role } from "./models/Role";

//this is a fake database We should not use this in our Project ZERO

export const users = [
 
    new User(1,'ahmad_hash', 'password', 'Ahmad', 'Adil','ahmad@toocool4school.com', new Role(1, 'Admin')),
    new User(2,'cperry', 'password', 'Charles', 'Perry', 'charles@jsiscool.com', new Role(2, 'User')),
    new User(3, 'abatson', 'password', 'Alec', 'Batson', 'trainer@toocool4school.com', new Role(1, 'Admin'))


]

