const { get } = require('node:https')
const model = require('../model/movie')
const model_review =  require('../model/streamed_review')
const model_streamd =  require('../model/streamed')
const { send, title } = require('node:process')
const { describe } = require('node:test')
const { create } = require('node:domain')
const {hasRequiredFields, removeEmptyFields} = require('../utils/validate.js')
const requiredFields = [
  'title', 'release_date', 'description',
  'language', 'country', 'rating_average', 'cover_image_url',
  'banner_image_url', 'trailer_url', 'age_rating', 'status'
];


const getmovie = async (req,res)=>{
    try {
    const {id} = req.params
    const check =  await model.moviesonly(id)
    const data = await model.findmovie(id)
    if(!check){
        return await res.status(404).send('movie doesnt exist')
    }
    const videos_a = []
    const subs_a = []
   
     const videoSet = new Set();
    const subSet = new Set();

    for(const row of data){
    const videoskey = `${row.quality}-${row.file_url}`
    if(!videoSet.has(videoskey)){
        videoSet.add(videoskey)
        videos_a.push({
            quality: row.quality,
            url:row.file_url
        })}
        // for(const row of data){
    const subkey = `${row.sub_lanuage}-${row.sub_url}`
        if(!subSet.has(subkey)){
            subSet.add(subkey)
            subs_a.push({
                language:row.sub_language,
                url:row.sub_url
            })
        }
      }

    
    
    const result = {
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
 videos:videos_a,
 subs:subs_a,
 comment: await model_review.commentfromstream(data[0].streamed_id)
    }
res.json(result)
}catch(err){
    console.log(err)
    res.status(500).send(err)
}}




const getallmovies = async (req,res)=>{
const movies = await model.movies()
const result = []
for(const movie of movies){
   const data = await model.findmovie(movie.id)
   const videos_a = []
    const subs_a = []
   
     const videoSet = new Set();
    const subSet = new Set();

    for(const row of data){
    const videoskey = `${row.quality}-${row.file_url}`
    if(!videoSet.has(videoskey)){
        videoSet.add(videoskey)
        videos_a.push({
            quality: row.quality,
            url:row.file_url
        })}
        // for(const row of data){
    const subkey = `${row.sub_lanuage}-${row.sub_url}`
        if(!subSet.has(subkey)){
            subSet.add(subkey)
            subs_a.push({
                language:row.sub_language,
                url:row.sub_url
            })
        }
      }
        const movi = {
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
 videos:videos_a,
 subs:subs_a,
 comment: await model_review.commentfromstream(data[0].streamed_id)
    }
result.push(movi)
}
res.json(result)
}
const postmovie = async (req,res)=>{
    const data = req.body 
   
    const streamed =  {
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
    
    const subs = data.subs
    const videos = data.videos
    const newsubs =  await model.creatmsubs()
    const newvideos = await model.creatvideos()
    for(const sub of subs){
        const subt = {
             language : sub.language,
             file_url : sub.file_url,
             subs_id : newsubs.id
        }
        await model.creatsub(subt)
    }
    for(const video of videos){
         const videot = {
           quality : video.quality,
           file_url: video.file_url,
           videos_id:newvideos.id
         }
         await model.creatvideo(videot)
    }
    const movie = {
        release_date:data.release_date,
        streamed_id:newstreamed.id,
        videos_id:newvideos.id,
        subs_id:newsubs.id,
        }
    const newmovie = await model.creatmovie(movie)
    const moviee = await model.findmovie(newmovie.id)
    
    
    
    const videos_a = []
    const subs_a = []
   
     const videoSet = new Set();
    const subSet = new Set();

    for(const row of moviee){
    const videoskey = `${row.quality}-${row.file_url}`
    if(!videoSet.has(videoskey)){
        videoSet.add(videoskey)
        videos_a.push({
            quality: row.quality,
            url:row.file_url
        })}
        // for(const row of moviee){
    const subkey = `${row.sub_lanuage}-${row.sub_url}`
        if(!subSet.has(subkey)){
            subSet.add(subkey)
            subs_a.push({
                language:row.sub_language,
                url:row.sub_url
            })
        }
      }

    
    
    const result = {
 title:moviee[0].title,
 release_date:moviee[0].release_date,
 description:moviee[0].description,
 language:moviee[0].language,
 rating_average:moviee[0].rating_average,
 cover_image_url:moviee[0].cover_image_url,
 banner_image_url:moviee[0].banner_image_url,
 trailer_url:moviee[0].trailer_url,
 age_rating:moviee[0].age_rating,
 status:moviee[0].status,
 country:moviee[0].country,
 videos:videos_a,
 subs:subs_a,
 comment: await model_review.commentfromstream(moviee[0].streamed_id)
    }
    res.status(201).json(result)
}


const patchmovies = async(req,res,next)=>{
const {id} = req.params
const data = req.body
try{
    const check = await model.moviesonly(id)
    if(!check){
      return  res.status(404).send('Movie is not found')
    } 
    const movie_data = removeEmptyFields({
         release_date:data.release_date
    })
       const streamed_data = removeEmptyFields( {
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
    })
    await model.updatemovies(id,movie_data)
    await model_streamd.updatestream(check.streamed_id,streamed_data)
    next()
}catch(err){
    console.log(err)
    res.status(500).send(err)
}
}
const deletemovie =  async (req,res,next)=>{
    const {id} = req.params
    const movie = await model.moviesonly(id)
    if(!movie){
        res.status(404).send("Movie is not found")
    }
    const streamed_id = movie.streamed_id
    const subs_id = movie.sub
    const videos_id = movie.videos_id
    await model.removemovie(id)
    await model_streamd.removstremd(streamed_id)
    await model.removesubs(subs_id)
    await model.removevidoes(videos_id);next()
}

const putmovie = async(req,res,next)=>{
const {id} = req.params
const data = req.body
try{
    const check = await model.moviesonly(id)
    if(!check){
      return  res.status(404).send('Movie is not found')
    } 
    if(!hasRequiredFields(data,requiredFields)){
        return res.status(400).send("all infos are no send")
    }
    const movie_data = removeEmptyFields({
         release_date:data.release_date
    })
       const streamed_data = removeEmptyFields( {
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
    })
    await model.updatemovies(id,movie_data)
    await model_streamd.updatestream(check.streamed_id,streamed_data)
    next()
}catch(err){
    console.log(err)
    res.status(500).send(err)
}
}
const addvideo=async(req,res,next)=>{
    try{
    const{id} = req.params
    const datas =  req.body
    const movie = await model.moviesonly(id);
    if(!movie){
    return res.status(404).send('movie doesnt exist')
}
    for(const data of datas){


const newvideo = {
           quality : data.quality,
           file_url: data.url,
           videos_id:movie.videos_id
}
await model.creatvideo(newvideo)
    }
    next()
    }catch(err){console.log(err);res.send(err)}
}
const getallvideos = async(req,res,next)=>{
    try{
    const{id} = req.params
    const movie =  await model.moviesonly(id)
    if(!movie){
        return res.status(404).send('Not found')
    }
   const result = await model.videos(movie.videos_id)
   result.sort()
   res.status(200).json(result)
    }catch(err){console.log(err);res.status(500).send(err)}

}
const getvideo = async(req,res)=>{
        try{
    const{id} = req.params
    const{index} = req.params
    const movie =  await model.moviesonly(id)
    if(!movie){
        return res.status(404).send('Not found')
    }
   const result = await model.videos(movie.videos_id)
   if(!result[index-1]){
    res.status(404).send('video is not found')
   }
   res.status(200).json(result[index-1])
    }catch(err){console.log(err);res.status(500).send(err)}
}
const deletevideo = async(req,res,next)=>{
     try{
    const{id} = req.params
    const{index} = req.params
    const movie =  await model.moviesonly(id)
    if(!movie){
        return res.status(404).send('Not found')
    }
   const result = await model.videos(movie.videos_id)
   if(!result[index-1]){
    res.status(404).send('video is not found')
   }
    await model.removevideo(result[index-1].id)
    next()
    }catch(err){console.log(err);res.status(500).send(err)}
}
const addsubs = async (req,res,next)=>{
    try{
   const {id} = req.params
   const datas =  req.body
   const movie = await model.moviesonly(id)
   if(!movie){
    return res.status(404).send('movie doesnt exist')
   }
   for(const data of datas){
    const newsub ={
        language : data.language,
        file_url:data.url,
        subs_id:movie.subs_id
    }
    await model.creatsub(newsub)
   }
   next()
}catch(err){console.log(err);res.status(500).send(err)}

}
const getallsubs =  async(req,res,next)=>{
    try{
        const{id} = req.params
        const movie =  await model.moviesonly(id)
        if(!movie){
            return res.status(404).send('Movie is not found')
        }
        const result =  await model.subs(movie.subs_id)
        res.status(200).json(result)
    }catch(err){console.log(err);res.status(500).send(err)}
}
const getsub =  async(req,res,next)=>{
   try{
        const{id} = req.params
        const{index}= req.params
        const movie =  await model.moviesonly(id)
        if(!movie){
            return res.status(404).send('Movie is not found')
        }
        const result =  await model.subs(movie.subs_id)
        if(!result[index-1]){
            res.status(404).send('sub is not found')
        }
        res.status(200).json(result[index-1])
    }catch(err){console.log(err);res.status(500).send(err)}
}
const deletesub = async (req,res,next)=>{
try{
        const{id} = req.params
        const{index}= req.params
        const movie =  await model.moviesonly(id)
        if(!movie){
            return res.status(404).send('Movie is not found')
        }
        const result =  await model.subs(movie.subs_id)
        if(!result[index-1]){
            res.status(404).send('sub is not found')
        }
        await model.removesub(result[index-1].id)
        next()
    }catch(err){console.log(err);res.status(500).send(err)}
}
const patchsub = async (req,res,next)=>{
try{
        const{id} = req.params
        const{index}= req.params
        const data = req.body
        const movie =  await model.moviesonly(id)
        if(!movie){
            return res.status(404).send('Movie is not found')
        }
        const result =  await model.subs(movie.subs_id)
        if(!result[index-1]){
            res.status(404).send('sub is not found')
        }
        await model.updatesub(result[index-1].id,data)
        next()
    }catch(err){console.log(err);res.status(500).send(err)}
}
const patchvideo = async(req,res,next)=>{
     try{
    const{id} = req.params
    const{index} = req.params
    const data = req.body
    const movie =  await model.moviesonly(id)
    if(!movie){
        return res.status(404).send('Not found')
    }
   const result = await model.videos(movie.videos_id)
   if(!result[index-1]){
    res.status(404).send('video is not found')
   }
    await model.updatevideo(result[index-1].id,data)
    next()
    }catch(err){console.log(err);res.status(500).send(err)}
}
module.exports = {getmovie,getallmovies,postmovie,deletemovie,
    patchmovies,putmovie,addvideo,getallvideos,getvideo,deletevideo,addsubs
,getallsubs,getsub,deletesub,patchsub,patchvideo
}