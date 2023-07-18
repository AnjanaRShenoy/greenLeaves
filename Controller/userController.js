const User = require("../Model/userModel");
const bcrypt=require("bcrypt")
const nodemailer=require("nodemailer")
const config=require("../Configuration/userConfig")
const { default: mongoose } = require("mongoose");
const user_route = require("../Routes/userRoute");
const randormString=require("randomstring")





// hashing password  
const securepassword=async(password)=>{
    try{
        const passwordhash=await bcrypt.hash(password,10)
        return passwordhash
    }
    catch (error)
    {
        console.error(error.message);
    }           
}

// to send mail
const sendverifyMail=async(name, email, user_id)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            post: 587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailpassword
            }
        })
      
        const mailoptions={
            from:config.emailUser,
            to: email,
            subject:"For verification mail",
            html:"<p>Hello"+name+',please click here to <a href= "http://127.0.0.1:3000/verify?id='+user_id+'">Verify</a>your mail.</p>',
        }
        console.log(name);
        console.log(email);
        
        transporter.sendMail(mailoptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent-",info.response);
            }
        })
    }catch(error){
        console.log(error.message);
    }}

// to reset password send mail
const sendresetpasswordmail=async(name, email, token)=>{
  try{
      const transporter=nodemailer.createTransport({
          host:'smtp.gmail.com',
          post: 587,
          secure:false,
          requireTLS:true,
          auth:{
              user:config.emailUser,
              pass:config.emailpassword
          }
      })
    
      const mailoptions={
          from:config.emailUser,
          to: email,
          subject:"To reset password",
          html:"<p>Hello"+name+',please click here to <a href= "http://127.0.0.1:3000/forgot-password?token='+token+'">Reset</a>your password.</p>',
      }
      console.log(name);
      console.log(email)
      
      transporter.sendMail(mailoptions,function(error,info){
          if(error){
              console.log(error);
          }
          else{
              console.log("Email has been sent-",info.response);
          }
      })
  }catch(error){
      console.log(error.message);
  }}


// to verify mail
const verifymail=async(req,res)=>{
    try{
        const updatedInfo=await User.updateOne(
            {_id:req.query.id},
            {$set:{is_verified:1}}
            )
        console.log(updatedInfo);
        res.render("login")
    }
    catch(error){
        console.log(error.message);
    }
}

// to load signup page
const loadsignup = async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log(error.message);
  }
};

// to add users
const insertUser = async (req, res) => {
  console.log(req.body);
  try {
    const spassword=await securepassword(req.body.password)
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      password: spassword,
    //   image: req.file.filename,
      is_admin: 0,
    }); 

    const userData = await user.save();

    if (userData) {
        sendverifyMail(req.body.name,req.body.email,userData._id)
      res.render("signup", { message: "Your signup has been successful.Please verify your mail" });
    } else {
      res.render("signup", { message: "Your signup has been failed" });
    }
  } catch (error) {
    res.send(error.message);
    console.trace(error);
  }
};

// login user
const login=async(req,res)=>{
  try{
    res.render('login')
    
}catch(error){
  console.log(error.message);
}}

// verify login
const verifylogin=async(req,res)=>{
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email,password);

    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_verified == 1) {
           {
            req.session.user_id = userData._id;
            console.log("session = ", req.session.user_id);
            res.redirect("/home");
          } 
        } else {
          res.render("login", { message: "please verify your mail" });
        }
      } else {
        res.render("login", { message: "password is wrong" });
      }
    } else {
      res.render("login", { message: "incorrect login credentials!" });
    }
  } catch (error) {
    console.log(error.message);
    res.render("404");
  }
};


  // const { email, password } = req.body
  //   let data = { email: email, password: password };

	// 	if (!email || !password) {
	// 		return res.status(400).json({ success: false, message: 'Email and Password required' })
	// 	}

	// 	try {
	// 		const user = await User.findOne({ email }).select('+password')
	// 		if (!user) {
	// 			return res.status(401).json({ success: false, message: 'Invalid Email or Password' })
	// 		}
  //     const status=await bcrypt.compare(data.password,user.password)
			
	// 		if (!status) {
	// 			return res.status(401).json({ success: false, message: 'Invalid Email or Password' })
	// 		}

	// 		// if (!user.isActive) {
	// 		// 	return res.status(401).json({ success: false, message: 'Account Blocked' })
	// 		// }

	// 		req.session.user = user
	// 		res.redirect("/homepage");
	// 	} catch (e) {
	// 		console.error(e)
	// 		return res.status(500).json({ success: false, message: 'Something went wrong' })
	// 	}
	// }



//   try{
//     const email=req.body.email
//     const password=req.body.password

//     const userData =await User.findOne({email:email})
//     if(userData){
//       const passwordMatch = await bcrypt.compare(password,userData.password)
//       if (passwordMatch) {
//         if (userData.is_verified ===0) {
//             res.render('login',{message:"Please verify your email"})
//         } else {
//           res.redirect('/home')
//         }
//       } else {
//         res.render("login", { message: "password is wrong" });
//       }
//     } else {
//       res.render("login", { message: "incorrect login credentials!" });
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.render("404");
//   }
// };


// loading Home page after login
const loadHome=async(req,res)=>{
  try{
    // const userData= await User.findById({ _id:req.session.user_id})
    res.render('home')
  }
  catch(error){
    console.log(error.message);
  }
}


// user logout
const userlogout=async(req,res)=>{
  try{
    req.session.destroy()
    res.redirect('/')
  }catch(error){
    console.log(error.message);
  }
}


// to load forgot password
const forgetload=async(req,res)=>
{
  try{
    res.render('forgotpassword')
  }catch(error){
    console.log(error.message);
  }
}


// verify to forgot password and reset
const forgetverify=async(req,res)=>{
  
  try{
    const email=req.body.email
    req.session.email=email
    const userData= await User.findOne({email:email})
    console.log('hai');
    if(userData){
      // const randomString=randomString.generate()

      if(userData.is_verified===0){
        // const updatedData= await User.updateOne({email:email},{$set:{token:randomString}})
        // sendresetpasswordmail(userData.name,userData.email,randomString)
        res.render('forgot',{message:"please verify your mail"})
      }

      else{
        const randomString=randormString.generate()
        const updatedData= await User.updateOne({email:email},{$set:{token:randomString}})
        sendresetpasswordmail(userData.name,userData.email,randomString)
        res.render('forgotpassword',{message:"Please check your mail."})
      }
    }
    else{
      res.render('forgotpassword',{message:"User email is incorrect."})
    }
  }catch(error){
    console.log(error.message);

  }
}

// forgot password load
const forgetpasswordload=async(req,res)=>{
  try{
    const token=req.query.token
    console.log('token',token);
    const tokenData=await User.find({token:token})
    console.log('tokenData',tokenData);
console.log('hhhh');
    if(tokenData){
      res.render('resetforgotpassword',{user_id:tokenData._id})
    }
    else{
      res.render('404',{message:"Page not found"})
    }
  }catch(error){
    console.log(error.message);
  }
}

// to reset the password
const resetpassword=async(req,res)=>{
  console.log("entered pass1");
  
  try 
  {
    const newPassword = req.body.newpassword;
    const rePassword = req.body.repassword;
    const email=req.session.email
    console.log(email);
    
    if (newPassword === rePassword) 
    {
      
      const userData = await User.find({ email: email });
      if(userData)
        {const spassword = await securepassword(newPassword);
          
        const updatePass = await User.updateOne(
          { email: email },
          // {_id:user_id},
          { $set: { password: spassword} }
        )
        
        if (updatePass) {
          res.redirect("/login");
        }    
    }}
    else 
    {
      res.render("resetforgotpassword", { message: "password is not matching" });
    }
  } catch (error) {
    console.log(error.message);
    res.render("404")
    console.log("hi");
  }
}

//   try{

//     const newpassword=req.body.password
//     const rePassword=req.body.rePassword
//     if(rePassword===newpassword)
//     {
//       const user_id=req.body.user_id

//       const secure_password=await securepassword(password)
      
//       const updatedData=await User.findByIdAndUpdate({_id:user_id},{ $set:{password:secure_password,token:" "}})
//       console.log(updatedData);
//       res.redirect("/")
//     }
//     else{

//     }
//   }
//   catch(error)
//   {
//     console.log(error.message);
//   }
// }


// to shop from home page
const shop=async(req,res)=>{
  try{
    res.render('shop')
  }catch(error){
    console.log(error.message);
  }
}

module.exports = {
  loadsignup,
  insertUser,
  verifymail,
  sendverifyMail,
  securepassword,
  login,
  verifylogin,
  loadHome,
  userlogout,
  forgetload,
  forgetverify,
  sendresetpasswordmail,
  forgetpasswordload,
  resetpassword,
  shop,
};
