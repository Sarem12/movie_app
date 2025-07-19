const db =  require('../database/main')
const findactor = async (id) =>{
    const result = await db.query('SELECT * FROM actor WHERE id=$1',[id])
    return result.rows[0] 
}
const deleteactor = async (id) =>{
    await db.query('DELETE FROM actor WHERE id=$1',[id])
}
const createactor = async (data)=>{
     const keys = Object.keys(data)
     const value = Object.values(data)
     const columns = keys.join(', ')
     const placeholder = keys.map((_,i)=>`$${i+1}`).join(', ')
     const quary =`INSERT INTO actor (${columns})
     VALUE (${placeholder}) RETURNING *;
     `
     const result = await db.query(quary,value)
     return result.rows[0]
    
}
module.exports={findactor,deleteactor,createactor}