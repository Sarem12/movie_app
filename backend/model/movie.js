const db =require('../database/main')
const findmovie = async (id)=>{
    const result = await db.query(`
SELECT
  movie.id AS movie_id,
  movie.videos_id,
  movie.subs_id,
  streamed.title,
  streamed.release_date,
  streamed.description,
  streamed.language,
  streamed.id AS streamed_id,
  streamed.rating_average,
  streamed.cover_image_url,
  streamed.banner_image_url,
  streamed.trailer_url,
  streamed.age_rating,
  streamed.status,
  streamed.country, -- <--- THIS IS WHERE THE MISSING COMMA IS CRITICAL
  v.quality,
  v.file_url,
  sb.language AS sub_language,
  sb.file_url AS sub_url,
  streamed_review.id AS streamed_review_id,
  streamed_review.rating,
  streamed_review.user_id,
  streamed_review.comment,
  users.username
FROM movie
LEFT JOIN streamed ON movie.streamed_id = streamed.id
LEFT JOIN video AS v ON movie.videos_id = v.videos_id -- Ensure you are aliasing 'video' to 'v'
LEFT JOIN sub AS sb ON movie.subs_id = sb.subs_id 
LEFT JOIN streamed_review ON movie.streamed_id = streamed_review.streamed_id
LEFT JOIN users ON  streamed_review.user_id = users.id   -- Ensure you are aliasing 'sub' to 'sb'
WHERE movie.id = $1;
`,[id])
return result.rows

}
const movies = async ()=>{
  const result = await db.query(`SELECT id FROM movie`)
return result.rows

}
const creatmovie = async (data)=>{
  const key = Object.keys(data)
  const value = Object.values(data)
  const columns = key.join(', ')
  const placeholder = key.map((_,i)=>`$${i+1}`).join(',')
  const query = `INSERT INTO movie (${columns})
  VALUES (${placeholder})
  RETURNING id;
  `
  const result = await db.query(query,value)
  return result.rows[0]
} 
const moviesonly =  async (id)=>{
   const result = await db.query('SELECT * FROM movie WHERE id = $1',[id])
   return result.rows[0]
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
const updatemovies =  async(id,data)=>{
  const key = Object.keys(data)
  const value = Object.values(data)
  const placeholder = key.map((key,i)=>`${key} = $${i+1}`).join(',')
  const query = `UPDATE movie SET ${placeholder} WHERE id = $${value.length+1}`
  value.push(id)
  const result = await db.query(query,value)
  return result.rows[0]
}
const removemovie =  async(id)=>{
  await db.query('DELETE FROM movie WHERE id = $1',[id])
}
const removesubs = async(id)=>{
  await db.query('DELETE FROM subs WHERE id = $1',[id])
}
const removevidoes = async(id) =>{
  await db.query('DELETE FROM videos WHERE id= $1',[id])
}
const videos = async(id)=>{
  const result =await db.query('SELECT * FROM video WHERE videos_id = $1',[id])
  return result.rows
}
const removevideo =  async(id)=>{
  await db.query('DELETE FROM video WHERE id= $1',[id])
}
const subs = async(id)=>{
  const result =await db.query('SELECT * FROM sub WHERE subs_id = $1',[id])
  return result.rows
}
const removesub =  async(id)=>{
  await db.query('DELETE FROM sub WHERE id= $1',[id])
}
const updatesub = async(id,data)=>{
  const key = Object.keys(data)
  const value = Object.values(data)
  const placeholder = key.map((key,i)=>`${key} = $${i+1}`).join(',')
  const quary = `UPDATE sub SET ${placeholder} WHERE id = $${value.length+1}`
  value.push(id)
  await db.query(quary,value)
}
const updatevideo = async(id,data)=>{
  const key = Object.keys(data)
  const value = Object.values(data)
  const placeholder = key.map((key,i)=>`${key} = $${i+1}`).join(',')
  const quary = `UPDATE video SET ${placeholder} WHERE id = $${value.length+1}`
  value.push(id)
  await db.query(quary,value)
}
module.exports ={findmovie,movies,creatmovie,moviesonly,creatmsubs,creatvideos,
  creatsub,creatvideo,removemovie,removesubs,removevidoes,updatemovies,videos,
  removevideo,subs,removesub,updatesub,updatevideo
}
