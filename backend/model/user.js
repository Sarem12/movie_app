const { join } = require('path')
const db = require('../database/main')
const { profile } = require('console')

const createuser = async (data) =>{
 
   const keys = Object.keys(data)
     const value = Object.values(data)
     const columns = keys.join(', ')
     const placeholder = keys.map((_,i)=>`$${i+1}`).join(', ')
     const query =`
     INSERT INTO users (${columns})
     VALUES (${placeholder})
     RETURNING *;
     `
     const result = await db.query(query,value)
     return result.rows[0]

}


const users = async ()=>{
    const result =await db.query('SELECT * FROM users')
    return result.rows
}
const finduser =  async (id) => {
  const result = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
};
const updateuser = async (id, data) => {
   const update_time = new Date()
   const keys = Object.keys(data)
     const value = Object.values(data)
     const placeholder = keys.map((key,i)=>`${key}= $${i+1}`).join(', ')
     const query =` UPDATE users SET ${placeholder}, update_date = $${value.length+1} WHERE id = $${value.length+2}`
     value.push(update_time)
     value.push(id)
     const result = await db.query(query,value)
     return result.rows[0]
};
const removeuser = async (id)=>{
    await db.query('DELETE FROM users WHERE id = $1',[id])
}
module.exports ={
    users,finduser,updateuser,removeuser,users,createuser
}
