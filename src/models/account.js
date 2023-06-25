const mongoose=require('mongoose')

const {Schema} =mongoose

const accountSchema=new Schema({
    withdraw:[
        {
            date:{
                type:String,
                required:true
            },
            amount:{
                type:Number,
                required:true
            }
        }
    ],
    deposit:[
        {
            date:{
                type:String,
                required:true
            },
            amount:{
                type:Number,
                required:true
            } 
        }
    ],
    totalCash:{
        type:Number,
        required:true
    },
    owner:{
        type:String,
        requierd:true
    }
})


const Account=mongoose.model('Account',accountSchema)   


module.exports=Account