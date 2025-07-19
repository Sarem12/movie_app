const db= require('../database/main')
const  findbyactor = async (id)=>{
    const result = await db.query('SELECT * FROM streamed_actors WHERE actor_id=$1 ',[id])
    return result.rows 
}
const findbystreamd = async (id)=>{
    const result = await db.query('SELECT * FROM streamed_actors WHERE streamed_id=$1 ',[id])
    return result.rows
}
module.exports = {findbyactor,findbystreamd}