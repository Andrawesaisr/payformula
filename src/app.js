const express=require('express')
const mongoose=require('mongoose')
const userRouter=require('./routers/user')
const app=express()

app.use(express.json()) 
app.use(userRouter)
const port=process.env.PORT


mongoose.connect('mongodb+srv://andrew:password111@cluster0.k1lrhbw.mongodb.net/payformula',{
    useUnifiedTopology:true,
    useNewUrlParser: true
})


app.listen(port,()=>{
    console.log(`the app is running on port ${port}`)
})