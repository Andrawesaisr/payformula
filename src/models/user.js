const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const {Schema} =mongoose

const userSchema=new Schema({
    first_name:{
        type:String,
        required:true
    },
    second_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('the email is not valid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if((value.includes('$'||'#'||'*'))&&(/[0-9]/.test(value))&&(/[a-z]/.test(value))){
                throw new Error('the password must include chars and numbers!!')
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    notification:[
        {
            date:{
                type:String,
                required:true   
            },
            from:{
                type:String,
                required:false
            },
            amount:{
                type:Number,
                required:true
            },
            transaction:{
                type:String,
                required:true
            }
        }
    ]
})



userSchema.methods.createAuthToken=async function(){
const user=this
const token=jwt.sign({_id:user._id.toString()},process.env.SECRET_KEY, {expiresIn:'30m'})
user.tokens=user.tokens.concat({token})
await user.save()
return token
}


const User=mongoose.model('User',userSchema)

module.exports=User