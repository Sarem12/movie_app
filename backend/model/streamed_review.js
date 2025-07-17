const db = require('../database/main')
const CreatReview =  async(stream_id,data)=>{
    const key = Object.keys(data)
    const value = Object.values(data) 
    
    const columns = key.join(', ')
    const placeholder = key.map((_,i)=>`$${i+1}`).join(', ')
    const query = `
    INSERT INTO streamed_review  (${columns} , streamed_id)
     VALUES (${placeholder}, $${key.length+1}) RETURNING *`
   value.push(stream_id)
   const result = await db.query(query,value)
  return result.rows[0]
}
const findbyuser =async (user_id)=>{
    const result = await db.query(`SELECT * FROM streamed_review WHERE user_id = $1`, [user_id]);
  return result.rows;
}
const findbystream =async (id)=>{
    const result = await db.query(`SELECT * FROM streamed_review WHERE streamed_id = $1`, [id]);
  return result.rows;
}
const CreatuserReview =  async(user_id,data)=>{
    const key = Object.keys(data)
    const value = Object.values(data) 
    
    const columns = key.join(', ')
    const placeholder = key.map((_,i)=>`$${i+1}`).join(', ')
    const query = `
    INSERT INTO streamed_review  (${columns} , user_id)
     VALUES (${placeholder}, $${key.length+1}) RETURNING *`
   value.push(user_id)
   const result = await db.query(query,value)
  return result.rows[0]
}
const deletestreamedreviews = async (id) =>{
  await db.query('DELETE FROM streamed_review WHERE streamed_id = $1',[id])
} 
const deleteuserreviews =  async (id) =>{
  await db.query('UPDATE streamed_review SET user_id = 0 where user_id = $1',[id])
}
const commentfromstream=async(stream_id)=>{
const result =await db.query(`
  SELECT
  streamed_review.rating,
  streamed_review.user_id,
  streamed_review.comment,
  users.username
FROM streamed_review
LEFT JOIN users ON streamed_review.user_id = users.id
WHERE streamed_review.streamed_id = $1`,[stream_id])
return  result.rows
}

module.exports = {CreatReview,findbyuser,findbystream,CreatuserReview,deletestreamedreviews,deleteuserreviews,commentfromstream};