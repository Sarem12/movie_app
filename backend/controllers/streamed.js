const { log } = require('console')
const model =  require('../model/streamed')
const { hasRequiredFields } = require('../utils/validate')
const requiredFields = [
  'title', 'release_date', 'description', 'original_title',
  'language', 'country', 'rating_average', 'cover_image_url',
  'banner_image_url', 'trailer_url', 'age_rating', 'status'
];
const getallstreamed = async(req,res)=>{
    try{
        const streamed = await model.Streamedes()
        res.status(200).json(streamed)
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}
const poststreamed =  async(req,res) =>{
    const data = req.body
    try{
        const stream = await model.createStream(data)
        res.json(stream)
    } catch(err){
            log(err)
            res.send(err)
        }
}
const getstreamed = async(req,res)=>{
    const {id} = req.params
    const stream = await model.findstream(id)
    try{
        if(!stream){
            return res.status(404).send(`there is no movie/series with an id ${id}`)
        }
      
      res.status(200).json(stream)
    }catch(err){
        log(err)
        res.status(500).send(err)
    }
}
const putstreamed = async (req,res) =>{
     const {id} = req.params
     const data = req.body
     let stream = await model.findstream(id)
    try{
        if(!stream){
            return res.status(404).send(`there is no movie/series with an id ${id}`)
        }
        if(!hasRequiredFields(data,requiredFields)){
            return res.status(400).send(`there is unfiled data please fill it it up to put or use patch`)
        }
        await model.updatestream(id,data)
        stream = await model.findstream(id)
        res.status(200).json(stream)
        }
    catch(err){
        log(err)
        res.status(500).send(err)
    }
}
const patchstreamed = async (req,res) =>{
     const {id} = req.params
     const data = req.body
     let stream = await model.findstream(id)
    try{
        if(!stream){
            return res.status(404).send(`there is no movie/series with an id ${id}`)
        }
        await model.updatestream
        stream = await model.findstream(id)
        res.status(200).json(stream)
        }
    catch(err){
        log(err)
        res.status(500).send(err)
    }
}
const deletestreamed =  async(req,res)=>{
    const {id} = req.params 
    try{
        const stream = await model.findstream(id)
        if(!stream){
            return res.status(404).send(`there is no movie/series with an id ${id}`)
        }
        await model.removstremd(id)
        const strems = await model.Streamedes()
        res.status(200).json(strems)
    }catch(err){
        log(err)
        res.status(500).send(err)
    }
}
module.exports = {getallstreamed,poststreamed,getstreamed,deletestreamed,putstreamed,patchstreamed}