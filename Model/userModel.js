const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phonenumber:{
        type:String,
        required:true
    },
    // image:{
    //     type:String,
    //     required:true
    // },
    password:{
        type:String,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    is_admin:{
        type:Number,
        required:true
    },
    token:{
        type:String,
        default:''
    }
})

module.exports= mongoose.model('User',userSchema)