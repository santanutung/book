const express=require('express');
const userDb=require('../db/user');
const router=express.Router()

router.get('/',(req,res)=>{
    res.send('This is an user Application');
})

router.get('/all', async(req,res)=>{
    try{
        let result=await userDb.all();
        res.json(result);
    }catch(e){
        console.log(e);
    }
})

router.post('/save', async(req,res)=>{
    data=req.body
    try{
        let result=await userDb.save(data);
        res.json(result);
    }catch(e){
        console.log(e);
    }
})

module.exports=router;