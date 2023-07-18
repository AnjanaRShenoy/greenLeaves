const express= require("express")
const app=express()
const path=require("path")

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const publicPath = path.join(__dirname, 'Public');
app.use(express.static(publicPath));

const config=require('./Configuration/userConfig')

// for user route
const userRoute=require("./Routes/userRoute")
app.use('/',userRoute)

// for admin route
const adminRoute=require("./Routes/adminRoute")
app.use('/admin',adminRoute)

config.serverStart()

app.use('/',userRoute)


app.listen(3000,()=>{
    console.log("running");
})