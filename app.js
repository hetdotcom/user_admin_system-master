const express=require('express')


const connectDB=require('./database/dbConnect')
require('dotenv').config()
connectDB()
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/blogs',require('./routes/blogRoutes'))
app.use('/api/users',require('./routes/userRoutes'))
app.use('/api/admin',require('./routes/adminRoutes'))/* New */
app.listen(process.env.PORT ||4848,()=>{console.log('Server started on port '+ process.env.PORT)})