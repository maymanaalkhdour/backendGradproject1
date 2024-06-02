const Joi=require('joi');
const mongoos= require('mongoose');
const  jwt = require("jsonwebtoken");



const userSchema= new  mongoos.Schema({
    username: {type : String, required: true ,trim:true, minLength:3},
    email:{ type :String ,required :true,unique:true,trim:true },
    password:{type :String, required: true,minLength:6,trim:true},
    usertype:{type : String ,required: true,trim:true, enum :["Doctor" ,"Nurse","Secretaria"] },
    isSecretary: {
      type: Boolean,
      default: function() {
        return this.usertype === 'Secretaria';
      }},
      isDoctor: {
        type: Boolean,
        default: function() {
          return this.usertype === 'Doctor';
        }},
        isNurse: {
          type: Boolean,
          default: function() {
            return this.usertype === 'Nurse';
          }},
    },{timestamps:true}
);


//Generate token
userSchema.methods.generateToken = function(){
    return jwt.sign({id:this._id,isSecretary:this.isSecretary,isNurse:this.isNurse,isDoctor:this.isDoctor,username:this.username},process.env.JWT_SECRET_KEY);
}
 const validatNewUser  = (obj) =>{

 const schema= Joi.object({
   username:Joi.string().trim().required().max(100),
   email:Joi.string().trim().required().min(10),
   password:Joi.string().trim().required().min(8),
   usertype:Joi.string().valid("Doctor" ,"Nurse","Secretaria").required(),

                             })
 return  schema.validate(obj);
 }

 const vaildateLoginUser = (obj) =>{
    const schema= Joi.object({
      email:Joi.string().trim().required().min(10),
      password:Joi.string().trim().required().min(8),
                                })
    return  schema.validate(obj);
    }
    

    const vaildateUpdateUser  = (obj) =>{
        const schema= Joi.object({
         username:Joi.string().trim().min(3).max(100),
          email:Joi.string().trim().min(10),
          password:Joi.string().trim().min(8),
                                    })
        return  schema.validate(obj);
        }
  const User = mongoos.model("User",userSchema,"User");
  module.exports={
    User,
  vaildateLoginUser,
  vaildateUpdateUser,
  validatNewUser,
  
  
  }