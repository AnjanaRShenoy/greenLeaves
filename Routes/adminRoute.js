const express=require("express")
const admin_route=express()

const session=require("express-session")
const config=require("../Configuration/userConfig")
admin_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  }));

const bodyParser=require('body-parser')
admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({extended:true}))

admin_route.set('view engine',"ejs")
admin_route.set('views','./View/Admin')

const auth=require('../middleware/adminauth')

const adminController=require("../Controller/adminController")

admin_route.get('/',auth.isLogout,adminController.loadLogin)
admin_route.post('/',adminController.verifylogin)

admin_route.get('/home',auth.isLogin,adminController.loadDashboard)

admin_route.get('/logout',auth.isLogin,adminController.logout)


module.exports=admin_route