const User=require("../Model/userModel")

const bcrypt=require("bcrypt");
const admin_route = require("../Routes/adminRoute");


// to load the admin login page
const loadLogin=async(req,res)=>{
    try{
        res.render('login')
    }
    catch(error){
        console.log(error.message);
    }
}


// to verify the login
const verifylogin=async(req,res)=>{
    try{
        
        const email=req.body.email
        const password=req.body.password
        const userData=await User.findOne({email:email})
        
        if(userData){
            
            const passwordMatch= await bcrypt.compare(password,userData.password)

            if(passwordMatch){
               
                if(userData.is_admin ===0){
                    res.render('login',{message:"Email and password is incorrect"})
                }
                else{
                    req.session.user_id=userData._id
                    res.redirect('/admin/home')
                }
            }
            else{
                res.render('login',{message:"Password incorrect"})
            }
        }
        else{
            res.render('login',{message:"Email and password is incorrect"})
        }
    }catch(error){
        console.log(error.message);
    }
}


const loadDashboard=async(req,res)=>{
    try{
        // const userData=await
        res.render('home')
    }catch(error){
        console.log(error.message);
    }
}


// for admit to logout
const logout=async(req,res)=>{
    try{

        req.session.destroy()
        res.redirect('/admin')

    }catch(error){
        console.log(error.message);
    }
}









module.exports={
    loadLogin,
    verifylogin,
    loadDashboard,
    logout,
}
