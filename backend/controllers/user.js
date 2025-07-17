/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const { send } = require('process')
const model = require('../model/user')
const express = require('express')
const getallusers = async (req,res)=>{
try{
    const users = await model.users()
    res.status(200).json(users)
}catch(err)
{
console.log(err)
res.status(500).json({error:err})
}
}

const getuser =  async (req,res) =>{
    const { id }= req.params
    try{
          
          const user = await model.finduser(id)
          if(!user){
          return res.status(200).json({message:`there is no user by id ${id}`})}
          res.status(200).json(user)
    }catch(err){
       res.status(500).send(err)
    }
}
const postuser =  async (req,res) =>{
    const data = req.body 
    
    try{
   
    if(!data.username||!data.email||!data.password_hash||!data.first_name||!data.second_name){
        return res.status(400).send('There are unfiled info')
     }
    const newuser = await model.createuser(data)
    res.status(201).json(newuser)

}catch(err){
        console.log(err)
        res.send(err)
    }}
const putuser =  async (req,res) =>{
    try{
    const {id} =  req.params
    const data = req.body
     let user = await model.finduser(id)
     if(!user){
        return res.status(404).send(`the is no user by an id ${id}`)
     }
     if(!data.username||!data.email||!data.password_hash||!data.first_name||!data.second_name||!data.profile_url){
        return res.status(400).send('There are unfiled info')
     }
     await model.updateuser(id,data)
     user = await model.finduser(id)
     res.status(201).json(user)
    
    }catch(err){
        console.log(err)
        res.send(err)
    }

}
const patchuser =  async (req,res)=>{
    try{
    const {id} =  req.params
    const data = req.body
     let user = await model.finduser(id)
     if(!user){
        return res.status(404).send(`the is no user by an id ${id}`)
     }
     await model.updateuser(id,data)
     user = await model.finduser(id)
     res.status(201).json(user)
    
    }catch(err){
        console.log(err)
        res.send(err)
    }
}
const deletuser =  async (req,res)=>{
    try{
        const {id} =  req.params
        const user = await model.finduser(id)
          if(!user){
        return res.status(404).send(`the is no user by an id ${id}`)}
        await model.removeuser(id)
        const users = await model.users()
        res.status(200).json(users)
     }catch(err){
        console.log(err)
        res.send(err)
     }
     
    }

module.exports = {getallusers,getuser,postuser,putuser,deletuser,patchuser}