const db=require('../database/main')
const getreview = async(id)=>{
   
  const result =await db.query('SELECT * FROM episode_review WHERE episode_id = $1',[id])
  return result.rows

}
const createreview = async(data)=>{
   
  const key = Object.keys(data)
  const value =Object.values(data)
 const columns = key.join(',')
 const placeholder = key.map((_,i)=>`$${i+1}`).join(',')
 const quary = ` INSERT INTO episode_review (${columns}) VALUES(${placeholder}) RETURNING *`
 const result = await db.query(quary,value) 
 return result.rows[0]
}
const removereview = async (id) => {
  try {
    await db.query(`DELETE FROM episode_review WHERE id =$1`,[id])
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}


module.exports ={getreview,createreview,removereview}