const express=require('express')
const Auth=require('../middlewares/auth')
const User=require('../models/user')
const router =express.Router()

// sign up 
router.post('/user/signup',async(req,res)=>{
const {email}=req.body
    const checkEmail=await  User.findOne({email})
    if(checkEmail){
       return res.send('This email is already exist!!')
    }
    try{
        const user=new User(req.body)
        await user.save()

        const token=await user.createAuthToken()
        res.setHeader('Authorization',`Bearer ${token}`)
        res.status(200).send('Sign up Successfully')    
    }catch(e){
        console.log(e)
        res.send(e) 
    }
})

// log in 
router.post('/user/login',async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(!user){
       return res.send('This email is not existing !!')  
    }
    if(user.password!==password){
       return res.send('the password is not correct!!')
    }
    try{    
        const token=await user.createAuthToken()
        res.setHeader('Authorization',`Bearer ${token}`)
        res.status(200).send('loged in successfull')
    }catch(e){
        console.log(e)
        res.send(e)
    }
    
})
// log out
router.post('/user/logout',Auth,async(req,res)=>{
    try{    
        req.user.tokens=req.user.tokens.filter((token)=>token.token!==req.token)
        await req.user.save()
        res.status(200).send('loged out successfully')
    }catch(e){
        console.log(e)
        res.send(e)
    }
    
})
// check cash

// check transactions -> deposit

// check transaction -> withdraw

// check notification

// send cash












module.exports=router