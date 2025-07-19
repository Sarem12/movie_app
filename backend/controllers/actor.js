const model =  require('../model/actor')
const strmodel = require('../model/streamed_actor')
const model_stremd = require('../model/streamed')
const getactor = async (req, res, next) => {
  try {
    const {id} = req.params
    const data =  await model.findactor(id)
    const stremad = await strmodel.findbyactor(data.id)
    const stremades =[]
    for (const streme of stremad){
       const streamd = await model_stremd.findstream(streme.streamed_id)
        const stremade = {
            streamd_name:streamd.title,
            id:streme.id,
            stremed_id:streme.streamed_id,
            character_name :streme.character_name,
            }
            stremades.push(stremade)
            
    }
    stremades.sort((a,b)=>Number(a.id)-Number(b.id))
    stremades
    const result ={
        id:data.id,
        name:data.name,
        profile_image_url:data.profile_image_url,
        bio:data.bio,
        birth_date:data.birth_date,
        nationality:data.nationality,
        movies:stremades
    }
    res.status(200).json(result)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

module.exports ={getactor}