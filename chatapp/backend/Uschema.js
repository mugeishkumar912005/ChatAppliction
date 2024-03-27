const M=require('mongoose');
const Mod=new M.Schema({
    Username:String,
    Phone_no:Number,
    Email:String,
    Password:String

})
module.exports={Mod};