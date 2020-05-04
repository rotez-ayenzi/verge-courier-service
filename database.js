const dotenv = require('dotenv')
const {Pool} = require('pg')
  dotenv.config();
  const connectionString = process.env.DATABASE_URL
const pool = new Pool({
    
     connectionString:connectionString
})
pool.on("connect", ()=>{
    console.log("connected to db successfully")
})
pool.on("error", (err)=>{
     console.log("could no connect to database", err)
     })
 module.exports = pool



//  const dotenv = require('dotenv')
// const {Pool} = require("pg");
// //   dotenv.config();
// //   const connectionString = process.env.DATABASE_URL
// const connectionString = 'postgresql://postgres:biski960611@localhost:5432/verge_courier_service'
// const pool = new Pool({
//    connectionString:connectionString   

// // user: 'postgres',
// // host: 'localhost',
// // database: 'verge_courier_service',
// // password: 'biski960611',
// // port: 5432/
// })
// pool.on("connect" , ()=>{
//     console.log("connected to db successfully")
// })
// pool.on("error", (err)=>{
//     console.log("could no connect to database", err)
// })
// module.exports = pool