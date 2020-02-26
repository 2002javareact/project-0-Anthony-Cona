import { Pool } from 'pg';

//Sets up connection to Database, allows for calling of a connection rather then just having an open connection always
//We use ENVs to stop unauthorized access to our DB
export const connectionPool:Pool = new Pool({
    host:process.env['WEBFLICKS_HOST'],
    user:process.env['WEBFLICKS_USER'],
    password:process.env['WEBFLICKS_PASSWORD'],
    database:process.env['WEBFLICKS_DB_NAME'],
    port:5432,
    max:5 
})