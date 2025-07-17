const {Pool}  =  require('pg')
require('dotenv').config()
const pool = new Pool({
    user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432
})
pool.connect().then(()=>console.log("connected")).catch((err)=>console.log(err))
//pool.connect().then(()=>console.log("Connected")).catch((err=> console.log(err)))
module.exports = pool
