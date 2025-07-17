const db = require('../database/main')
const seriesonly = async (id)=>{
    const result = await db.query('SELECT * FROM series WHERE id = $1',[id])
    return result.rows[0]
}
const findseries = async (id)=>{
    const result = await db.query(`
SELECT
  series.id AS series_id,
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
  streamed.country, 
  season.id AS season_id,
  season.season_number,
  season.release_date AS season_release_date,
  season.season_name,
  episode.episode_number,
  episode.title AS episode_title,
  episode.description AS episode_description,
  episode.duration_minutes,
  episode.release_date AS episode_release_date,
  episode.videos_id,
  episode.subs_id,
  epuser.username AS epusername,
  episode_review.comment AS ep_comment,
  episode_review.thumbs_up,
  streamed_review.id AS streamed_review_id,
  streamed_review.rating,
  streamed_review.user_id,
  streamed_review.comment,

  users.username
FROM series
LEFT JOIN streamed ON series.streamed_id = streamed.id
LEFT JOIN streamed_review ON series.streamed_id = streamed_review.streamed_id
LEFT JOIN users ON  streamed_review.user_id = users.id  
LEFT JOIN season ON series.id = season.series_id
LEFT JOIN episode ON season.id = episode.season_id
LEFT JOIN episode_review ON episode.id = episode_review.id
LEFT JOIN users AS epuser ON episode_review.episode_id = users.id
WHERE series.id = $1;
        `,[id])
return result.rows

}
const serieses =async()=>{
 const result = await db.query(`SELECT id FROM series`)
return result.rows

}
const createseries = async(data)=>{
  const key = Object.keys(data)
  const value = Object.values(data)
  const columns = key.join(', ')
  const placeholder = key.map((_,i)=>`$${i+1}`).join(',')
  const query = `INSERT INTO series (${columns})
  VALUES (${placeholder})
  RETURNING *
  `
   const result = await db.query(query,value)
  return result.rows[0]
}
const updateseries = async (id,data)=>{
     const keys = Object.keys(data)
     const value = Object.values(data)
     const placeholder = keys.map((key,i)=>`${key} = $${i+1}`).join(', ')
     const query =`
     UPDATE series SET ${placeholder} WHERE id = $${value.length+1}`
     value.push(id)
     const result = await db.query(query,value)
     return result.rows[0]
}
module.exports = {findseries,seriesonly,serieses,createseries,updateseries}