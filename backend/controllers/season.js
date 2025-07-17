const model = require('../model/season')
const model_ser = require('../model/series')
const model_ep =  require('../model/episode')
const modelepreview = require('../model/episode_review')
const { removeEmptyFields } = require('../utils/validate')
const postseason = async (req, res, next) => {
  try {
    const {id} = req.params
    const check = model_ser.seriesonly(id)
    if(!check){
        res.status(404).send('Not found!')
    }
    const datas = req.body 
    for(const data of datas){
         const ep_datas = data.episodes
                const season = {
                series_id:id,
                season_number:data.season_number,
                release_date:data.season_date,
                season_name:data.season_name
              }
              const newseason = await model.createseason(season)
              for(const ep_data of ep_datas){
                 const subs = ep_data.subs
                  const videos = ep_data.videos
                  const newsubs =  await model_ep.creatmsubs()
                  const newvideos = await model_ep.creatvideos()
                  for(const sub of subs){
                    const subt = {
                                 language : sub.language,
                                 file_url : sub.file_url,
                                 subs_id : newsubs.id
                            }
                            await model_ep.creatsub(subt)
                  }
                  for(const video of videos){
                           const videot = {
                             quality : video.quality,
                             file_url: video.file_url,
                             videos_id:newvideos.id
                             }
                             await model_ep.creatvideo(videot)
                        }
                  const episode = {
                season_id:newseason.id,
                title:ep_data.title,
                episode_number:ep_data.episode_number,
                description:ep_data.description,
                duration_minutes:ep_data.duration_minutes,
                release_date:ep_data.release_date,
                videos_id:newvideos.id,
                subs_id:newsubs.id
              }
                await model_ep.createep(episode)
              }
        
    }
    next()
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
const findseason = async (id) => {
  const data = await model.getseason(id)
  try {
const seasons =[]
    for(const season_data of data){
              const episodes =[]
        const episodes_data =  await model_ep.findep(id)
        for(const episode_data of episodes_data){
          const episode ={
            id:episode_data.id,
            number : episode_data.episode_number,
            title:episode_data.title,
            description:episode_data.description,
            duration_minutes:episode_data.duration_minutes,
            release_date:episode_data.release_date,
            vid:episode_data.videos_id,
            sid:episode_data.subs_id,
            videos: await model_ep.videos(episode_data.videos_id),
            subs:await model_ep.subs(episode_data.subs_id),
            review:await modelepreview.getreview(episode_data.id)
            
          }
          episodes.push(episode)
        }
            const season = {
              id:season_data.id,
              number: season_data.number,
              name:season_data.name,
              date:season_data.date,
              episodes:episodes
            }
            seasons.push(season)
        }
        seasons.sort((a,b)=> Number(a.id)-Number(b.id))
        return seasons
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
const getseason = async (req, res, next) => {
  const{id,index}=req.params
  try {

        const seasons = await findseason(id)
        const result = seasons[index-1]
        if(!result){
          res.status(404).send('not found')
        }
        res.status(200).json(result)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
const getallseasons =  async (req, res, next) => {
  const{id,index}=req.params
  try {
    const seasons = await findseason(id)
        const result = seasons
        if(!result){
          res.status(404).send('not found')
        }
        res.status(200).json(result)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
const patchseason = async (req, res, next) => {
 const {id,index} = req.params
 const data = req.body
 const seasons = await findseason(id)
 const season = seasons[index-1]
if(!season){
  res.status(404).send('not found')
}
  try {
    const season_data = removeEmptyFields({
                season_number:data.season_number,
                release_date:data.season_date,
                season_name:data.season_name
              })
   await model.updateseason(season.id,season_data)
 next()
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

module.exports ={postseason,getseason,getallseasons,patchseason,findseason}