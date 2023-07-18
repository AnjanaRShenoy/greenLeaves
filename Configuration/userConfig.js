const sessionSecret="mysitesessionsecret"

const emailUser="shenoyanjana96@gmail.com"
const emailpassword="vwcnfsdhejswffoo"


const serverStart=()=>{
    const mongoose=require('mongoose')
    mongoose.connect("mongodb://127.0.0.1:27017/GardentoTable")
}

module.exports={
    serverStart,
    sessionSecret,
    emailUser,
    emailpassword
}