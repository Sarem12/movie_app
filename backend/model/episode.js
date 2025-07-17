const db = require('../database/main')
const findep = async(id)=>{
const result = await db.query(`
SELECT
episode.id,
episode.season_id,
episode.episode_number,
episode.title,
episode.description,
episode.duration_minutes,
episode.release_date,
episode.videos_id,
episode.subs_id
FROM episode WHERE season_id = $1
`,[id])
return result.rows
}
const createep=async(data)=>{
    const key = Object.keys(data)
  const value = Object.values(data)
  const columns = key.join(', ')
  const placeholder = key.map((_,i)=>`$${i+1}`).join(',')
  const query = `INSERT INTO episode (${columns})
  VALUES (${placeholder})
  RETURNING id;
  `
    const result = await db.query(query,value)
  return result.rows[0]

}
const videos = async(id)=>{
  const result =await db.query('SELECT * FROM video WHERE videos_id = $1',[id])
  return result.rows
}
const subs = async(id)=>{
  const result =await db.query('SELECT * FROM sub WHERE subs_id = $1',[id])
  return result.rows
}
const creatmsubs =  async ()=>{
  const result = await db.query('INSERT INTO subs DEFAULT VALUES RETURNING id')
  return result.rows[0]
}
const creatvideos =  async ()=>{
  const result =  await db.query('INSERT INTO videos DEFAULT VALUES RETURNING id')
  return result.rows[0]
}
const creatsub = async (data)=>{
      const key = Object.keys(data)
  const value = Object.values(data)
  const columns = key.join(', ')
  const placeholder = key.map((_,i)=>`$${i+1}`).join(',')
  const query = `INSERT INTO sub (${columns})
  VALUES (${placeholder})
  `
  const result = await db.query(query,value)
  return result.rows[0]
}

const creatvideo = async (data)=>{
      const key = Object.keys(data)
  const value = Object.values(data)
  const columns = key.join(', ')
  const placeholder = key.map((_,i)=>`$${i+1}`).join(', ')
  const query = `INSERT INTO video (${columns})
  VALUES (${placeholder})
  `
  const result = await db.query(query,value)
  return result.rows[0]
}
const updateep =  async(id,data)=>{
     const keys = Object.keys(data)
     const value = Object.values(data)
     const placeholder = keys.map((key,i)=>`${key} = $${i+1}`).join(', ')
     const query =`
     UPDATE episode SET ${placeholder} WHERE id = $${value.length+1}`

     value.push(id)
    await db.query(query,value)
}
const removeep=async(id)=>{
    await db.query('DELETE FROM episode WHERE id=$1',[id])
}
const removesubs =  async(id)=>{
  await db.query('DELETE FROM subs WHERE id= $1',[id])
}
const removevidoes = async(id) =>{
  await db.query('DELETE FROM videos WHERE id= $1',[id])
}


module.exports ={findep,subs,videos,creatsub,creatvideo,creatvideos,creatmsubs,createep,updateep,removeep,removesubs,removevidoes}