const db=require('../database/main')
const getreview = async(id)=>{
   
  const result =await db.query('SELECT * FROM episode_review WHERE episode_id = $1',[id])
  return result.rows

}
module.exports ={getreview}