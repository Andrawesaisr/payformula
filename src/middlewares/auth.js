const jwt=require('jsonwebtoken')
const User=require('../models/user')

const Auth=async (req,res,next)=>{
    try{
    const token=req.header('Authorization').replace('Bearer ','')
    const decode=jwt.verify(token,process.env.SECRET_KEY)
    const user=await User.findOne({_id:decode._id,'tokens.token':token})
    if(!user){
      return  res.send('this user is not Authorized')
    }
    req.user=user
    req.token=token
    next()
    }catch(e){
        console.log(e)
        res.send(e)
    }
}


module.exports=Auth