import mongoose from "mongoose"



const user = new mongoose.Schema({
    name:String,
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    password:String,
    isSignedIn:{type:Boolean,default:false}
})




const userModel = mongoose.model("user",user);


export default userModel

