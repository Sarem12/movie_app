const db = require('../database/main')
const getseason=async (id)=>{
    const result =await db.query(`
        SELECT
        season.id,
        season.season_number AS number,
        season.release_date AS date,
        season.season_name AS name
        FROM season WHERE series_id = $1
        `,[id])
return result.rows
}
const createseason = async(data)=>{
  delete data.id
  const key = Object.keys(data)
  const value = Object.values(data)
  const columns = key.join(', ')
  const placeholder = key.map((_,i)=>`$${i+1}`).join(', ')
  const query = `INSERT INTO season (${columns})
  VALUES (${placeholder})
  RETURNING id;
  `
  const result = await db.query(query,value)
  return result.rows[0]

}
const updateseason =  async(id,data)=>{
     const keys = Object.keys(data)
     const value = Object.values(data)
     const placeholder = keys.map((key,i)=>`${key} = $${i+1}`).join(', ')
     const query =`
     UPDATE season SET ${placeholder} WHERE id = $${value.length+1}`

     value.push(id)
    await db.query(query,value)
}
const removeseason = async(id)=>{
  await db.query('DELETE FROM season WHERE id=$1',[id])
}
module.exports ={getseason,createseason,updateseason,removeseason}