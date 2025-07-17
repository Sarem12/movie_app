//models
const model = require('../model/series')
const model_review =  require('../model/streamed_review')
const model_season =  require('../model/season')
const model_ep = require('../model/episode')
const modelepreview =  require('../model/episode_review')
const model_streamd = require('../model/streamed');
const {hasRequiredFields, removeEmptyFields} = require('../utils/validate.js')
const { release } = require('os')
const { title } = require('process')


const getserie = async (id) => {
  try {
    const check = model.seriesonly(id)
    if(!check){
        res.status(404).send("series is not found")
    }
    const data = await model.findseries(id)

    const seasons_data=  await model_season.getseason(data[0].series_id)
    const seasons = []
    for(const season_data of seasons_data){
          const episodes =[]
    const episodes_data =  await model_ep.findep(season_data.id)
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
          number: season_data.number,
          name:season_data.name,
          date:season_data.date,
          episodes:episodes
        }
        seasons.push(season)
    }
    const result ={
         id:data[0].series_id,
         title:data[0].title,
         release_date:data[0].release_date,
         description:data[0].description,
         language:data[0].language,
         rating_average:data[0].rating_average,
         cover_image_url:data[0].cover_image_url,
         banner_image_url:data[0].banner_image_url,
         trailer_url:data[0].trailer_url,
         age_rating:data[0].age_rating,
         status:data[0].status,
         country:data[0].country,
         comment:await model_review.commentfromstream(data[0].streamed_id),
         seasons:seasons,
    }
    return result
  } catch (err) {
    console.error(err);
  }
}
//////////////////////////////////////////
const getseries = async (req, res, next) => {
  
  try {
    const {id} = req.params
    const check = await model.seriesonly(id)
    if(!check){
        res.status(404).send("series is not found")
    }
    const result = await getserie(id)
    res.status(200).json(result)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
const getallserieses = async (req, res, next) => {
  try {
    const serieses= await model.serieses()
    const result =[]
    for(const series of serieses){
    const ser = await getserie(series.id)
    result.push(ser)
    }
    res.status(200).json(result)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
const postseries = async (req, res, next) => {
  try {
       const data = req.body
       const seasons_data = data.seasons
       const streamed={
         title: data.title,
        release_date: data.release_date,
        description:data.description,
        original_title:  data.title,
        language: data.language,
        country: data.country,
        rating_average: data.rating_average,
        cover_image_url:data.cover_image_url,
        banner_image_url:data.banner_image_url,
        trailer_url:data.trailer_url,
        age_rating:data.age_rating,
        status:data.status
       }
       const newstreamed = await model_streamd.createStream(streamed)
       const series ={
           streamed_id:newstreamed.id,
           start_year:data.start_year,
           end_year:data.end_year
       }
       const newseries = await model.createseries(series)
       console.log(newseries.streamed_id)
      for(const season_data of seasons_data){
        const ep_datas = season_data.episodes
        const season = {
        series_id:newseries.id,
        season_number:season_data.season_number,
        release_date:season_data.season_date,
        season_name:season_data.season_name
      }
      const newseason = await model_season.createseason(season)
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
      const the_series = await getserie(newseries.id)
      
      res.status(201).json(the_series)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
const patchseries = async (req, res, next) => {
  try {
    const data = req.body
    const {id} = req.params
    const check = await model.seriesonly(id)
    if(!check){
      res.status(404).send('Series is not found!')
    }
    const seriese =removeEmptyFields({
       start_year:data.start_year,
       end_year:data.end_year
    })
    await model.updateseries(id,seriese)
       const streamed_data = removeEmptyFields( {
        title: data.title,
        release_date: data.release_date,
        description:data.description,
        original_title: data.title,
        language: data.language,
        country: data.country,
        rating_average: data.rating_average,
        cover_image_url:data.cover_image_url,
        banner_image_url:data.banner_image_url,
        trailer_url:data.trailer_url,
        age_rating:data.age_rating,
        status:data.status
    })
    await model_streamd.updatestream(check.streamed_id,streamed_data)
    next()
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
module.exports ={getseries,getallserieses,postseries,patchseries}
