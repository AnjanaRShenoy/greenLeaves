const express=require("express")
const user_route= express()
const session=require("express-session");

const config=require('../Configuration/userConfig')

// user_route.use(session({
//     resave: false, // Set to false to avoid session being saved on every request
//     saveUninitialized: true, // Set to true to save uninitialized sessions
//     // ... other session options
//   }));
  
// user_route.use(session({secret:config.sessionSecret}))


user_route.use(session({
  secret: 'your-secret-key',         
  resave: false,
  saveUninitialized: true
}));
const auth=require('../middleware/auth')


user_route.set('view engine',"ejs")
user_route.set('views','./View/Users')

// const bodyParser=require('body-parser')
// user_route.use(bodyParser.json())
// user_route.use(bodyParser.urlencoded({extended:true}))


const multer=require("multer")

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../Public/Images'))
    },
    filename:function(req,file,cb){
        const name= Date.now()+'-'+file.originalname
        cb(null,name)
    }
})
const upload=multer({storage:storage})

const path = require('path')

const userController=require("../Controller/userController")

user_route.get('/signup',auth.isLogout,userController.loadsignup)

user_route.post('/signup',upload.single('image'),userController.insertUser)

user_route.get('/verify',userController.verifymail)

user_route.get('/',auth.isLogout,userController.login)
user_route.get('/login',auth.isLogout,userController.login)

user_route.post('/login',userController.verifylogin)

user_route.get('/home',auth.isLogin,userController.loadHome)

user_route.get('/logout',auth.isLogin,userController.userlogout)

user_route.get('/logout',auth.isLogin,userController.userlogout)

user_route.get('/forgot',auth.isLogout,userController.forgetload)

user_route.post('/forgot',userController.forgetverify)

user_route.get('/forgot-password',auth.isLogout,userController.forgetpasswordload)

user_route.post('/forgot-password',userController.resetpassword)

user_route.get('/shop',userController.shop)

module.exports=user_route