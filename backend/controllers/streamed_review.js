const model =  require('../model/streamed_review')
const user_model = require('../model/user')
const streamed_model =  require('../model/streamed')
const { json } = require('stream/consumers')
const { write } = require('fs')
const getuserr =async (req,res)=>{

    try{
   const {id} = req.params
   const user = await user_model.finduser(id)
   if(!user){
    return res.status(200).json({message:`there is no  user by id ${id}`})
   }
   const reviews = await model.findbyuser(id)
   if(!reviews){
    return res.status(404).send(`There is no comment for the user by the id ${id}`)
   }
   res.status(200).json(reviews)}
   
   catch(err){
    res.status(500).send(err)
   }
}
const getstreamedr =  async (req,res)=>{
    const {id} =  req.params
   const stream = await streamed_model.findstream(id)
   if(!stream){
    return res.status(404).json({message:`there is no  streame by id ${id}`})
   }
   const reviews =  await model.findbystream(id)
   if(!reviews){
    return res.status(404).send(`There is no comment for the movie/sirease by the id ${id}`)
   }
   res.status(200).json(reviews)
}
const postreviews=async (req,res)=>{
    try{
const {id} =  req.params
const data = req.body
const stream = await streamed_model.findstream(id)
if(!stream){
    return res.status(404).json({message:`there is no  streame by id ${id}`})
}
if(data.streamed_id){
    return res.status(401).send('user is not allowed to enter the streamed id directly')
}
  const review = await model.CreatReview(id,data)
  return res.status(201).json(review)
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }

}
const postuserreviews = async (req,res)=>{
    try{
const {id} =  req.params
const data = req.body
const user = await user_model.finduser(id)
if(!user){
    return res.status(404).json({message:`there is no  user by id ${id}`})
}
if(data.user_id){
    return res.status(401).send('user is not allowed to enter the streamed id directly')
}
  const review = await model.CreatuserReview(id,data)
  return res.status(201).json(review)
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}
const deletreviewbystream =async (req,res)=>{
    try{
   const {id}=req.params
   await model.deletestreamedreviews(id)
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }}
const givedeleteforreview = async (req,res)=>{
   const {id}= req.params 
   try{
const user = user_model.finduser(id)
if(!user){
  res.status(404).send('nothing')
    }
    await model.deleteuserreviews()
}catch(err){
    res.status(500).send(err)
}
}
module.exports ={getuserr,getstreamedr,postreviews,postuserreviews,deletreviewbystream,givedeleteforreview}
