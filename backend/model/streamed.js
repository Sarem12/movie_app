
const { title } = require('process')
const db =  require('../database/main')
const Streamedes= async () =>{
     const result =await db.query('SELECT * FROM streamed')
     return result.rows
}
const createStream= async (data) =>{
     const keys = Object.keys(data)
     const value = Object.values(data)
     const columns = keys.join(', ')
     const placeholder = keys.map((_,i)=>`$${i+1}`).join(', ')
     const query =`
     INSERT INTO streamed (${columns})
     VALUES (${placeholder})
     RETURNING *;
     `
     const result = await db.query(query,value)
     return result.rows[0]

}
const findstream = async(id)=>{
     const result = await db.query(`SELECT * FROM streamed WHERE id = $1`,[id])
     return result.rows[0]
}
const updatestream = async (id,data)=>{
     const update_time = new Date()
     const keys = Object.keys(data)
     const value = Object.values(data)
     const placeholder = keys.map((key,i)=>`${key} = $${i+1}`).join(', ')
     const query =`
     UPDATE streamed SET ${placeholder}, updated_at = $${keys.length+1} WHERE id = $${value.length+2}`
     value.push(update_time)
     value.push(id)
     const result = await db.query(query,value)
     return result.rows[0]
}
const removstremd = async(id)=>{
     await db.query('DELETE FROM streamed WHERE id = $1',[id])
}
module.exports = {createStream,Streamedes,findstream,removstremd,updatestream}

