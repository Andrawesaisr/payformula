const express=require('express')
const Auth=require('../middlewares/auth')
const User=require('../models/user')
const Account=require('../models/account')
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
        const account=new Account({owner:user._id,totalCash:0})
        await account.save()
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
router.get('/user/account',Auth,async (req,res)=>{
    try{
        res.status(200).send(`your total cash is equal to ${req.account.totalCash} \n\n`+
        `All your deposit operations ${req.account.deposit} \n\n`+
        `All your withdraw operations ${req.account.withdraw}\n\n`
        )
    }catch(e){
        console.log(e)
        res.send(e)
    }
})
// check transactions -> deposit
router.post('/user/deposit/:cash',Auth,async(req,res)=>{
    try{    
        const cash = parseInt(req.params.cash)

        req.account.totalCash=req.account.totalCash+cash
        req.account.deposit=req.account.deposit.concat({
            amount:cash,
            date: new Date().toLocaleDateString('en-us', {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true
              }) 
        })
        
        req.user.notification=req.user.notification.concat({
            amount:cash,
            date: new Date().toLocaleDateString('en-us', {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true
              }) ,
            transaction:'deposit'
        })
        await req.user.save()
        await req.account.save()

        res.status(200).send(`${cash} has been added to your account \n\n`+`you have now totaly ${req.account.totalCash}`)
    }catch(e){
        console.log(e)
        res.send(e)
    }
})

// check transaction -> withdraw

router.post('/user/withdraw/:cash',Auth,async(req,res)=>{
    try{    
        const cash = parseInt(req.params.cash)
        if(cash >req.account.totalCash){
            return res.send(`sorry but ${cash} is more than your total cash !!`)
        }
        req.account.totalCash=req.account.totalCash-cash
        req.account.withdraw=req.account.withdraw.concat({
            amount:cash,
            date: new Date().toLocaleDateString('en-us', {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true
              }) 
        })
        
        req.user.notification=req.user.notification.concat({
            amount:cash,
            date: new Date().toLocaleDateString('en-us', {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true
              }) ,
            transaction:'withdraw'
        })
        await req.user.save()
        await req.account.save()

        res.status(200).send(`${cash} has been taken from your account \n\n`+`you have now totaly ${req.account.totalCash}`)
    }catch(e){
        console.log(e)
        res.send(e)
    }
})
// check notification

// send cash












module.exports=router