const Joi=require('joi');
const mongoos= require('mongoose');
const  jwt = require("jsonwebtoken");
let patientSchema = new mongoos.Schema({
    idnumber:{type:Number,required:true,unique:true,
        
        
        validate: {
            validator: function(v) {
              // يجب أن يكون الرقم يحتوي على 5 خانات
              return v.toString().length === 9;
            },
            message: props => `${props.value}` + " is not a valid ID number",
          },
      },
    patientname: { type: String, required:true,trim:true,minlength :3 },
    age:{type:Number,required:true},
    gender: { type: String , required: true,trim:true,enum: ['Male', 'Female'],} ,
    address:{type:String,required:true,trim:true},
    phone: { type: String, minlength:10, maxlength:10,required:true, validate: {
       validator: function(v) {
                       return /^\d+$/.test(v);
                   },
        message: props => `${props.value} is not a valid phone number!`,
      },
     
     
     
     
     
   } ,
    
    sessioncount:{
        type:Number,
        default:0,
    }

},{timestamps:true});
// Generate token
// patientSchema.methods.generatePatientToken = function(){
    // return jwt.sign({id:this._id,is:this.isAdmin},process.env.JWT_SECRET_KEY);
// }

const vaildateNewPatient =(obj)=>{
    const schema= Joi.object({
        idnumber:Joi.number().required().min(9),
        patientname:Joi.string().trim().required().min(3),
        age:Joi.number().required(),
        gender:Joi.string().trim().valid('Male', 'Female').required(),
        address:Joi.string().trim().required(),
        phone:Joi.string().required().min(10),
       
    
    })
    return schema.validate(obj);
};
  
//UpdatePatient
const vaildateUpdatePatient =(obj)=>{
    const schema= Joi.object({
        
        idnumber:Joi.number().min(9),
        patientname:Joi.string().trim().min(3),
        age:Joi.number(),
        address:Joi.string().trim(),
        phone:Joi.string().min(10),
       
       
    })
    return schema.validate(obj);
};


// patientSchema.set('primaryKey', 'idnumber');
const  Patient = mongoos.model('Patient',patientSchema);
module.exports={
    Patient,
    vaildateNewPatient,
    vaildateUpdatePatient,
}