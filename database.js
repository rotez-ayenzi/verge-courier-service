const {Pool} = require("pg");
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'verge_courier_service',
password: 'biski960611',
port: 5432
})
pool.on("connect" , ()=>{
    console.log("connected to db successfully")
})
pool.on("error", (err)=>{
    console.log("could no connect to database", err)
})
module.exports = pool