const Joi=require('joi');
const mongoos= require('mongoose');
const  jwt = require("jsonwebtoken");
let createIncounterSchema = new mongoos.Schema({
    patientid:{type:mongoos.Schema.Types.ObjectId,ref: 'Patient'},

    systolic: { type: Number, required: true, },
     diastolic: {
          type: Number,
          required: true,}
,       
    pulse:{type:Number,required:true},
    temperature :{type:Number,required:true},
    respiration:{type:Number,required:true}, 
    o2sat:{type:Number,required:true},
    // 

   height:{type:Number,},
   weight:{type:Number,},
    story:{type:String, required:true,trim:true },
  
      chronicdiseases:{type:String,trim:true},
      surgical:{type:String,trim:true},

      allergy:{type:String,trim:true},
   
    xrayimage: { type: Object }


},
{timestamps:true});
// Validation


const vaildateNewIncounter = (obj)=>{
  const schema = Joi.object({
   
   
    systolic: Joi.number().required(),
    diastolic: Joi.number().required(),
  
    pulse:Joi.number().required(),
    temperature:Joi.number().required(),
    respiration:Joi.number().required(),
    o2sat:Joi.number().required(),
 
    height:Joi.number(),
    weight:Joi.number(),
    story:Joi.string().required().trim(),
  
    chronicdiseases:Joi.string().trim(),
    surgical:Joi.string().trim(),
    allergy:Joi.string().trim(),
    xrayimage: Joi.object()
      
      
  })
  return schema.validate(obj);
};
const vaildateUpdateIncounter = (obj)=>{
  const schema = Joi.object({
 
    
    systolic: Joi.number(),
    diastolic: Joi.number(),
    
    pulse:Joi.number(),
    temperature:Joi.number(),
    respiration:Joi.number(),
    o2sat:Joi.number(),

   height:Joi.number(),
   weight:Joi.number(),
    story:Joi.string().trim(),
 
      chronicdiseases:Joi.string().trim(),
      surgical:Joi.string().trim(),
      allergy:Joi.string().trim(),
   
      
      
      
  })
  return schema.validate(obj);
};
const  CreateInCounterSession = mongoos.model('InCounterSession',createIncounterSchema);
module.exports={
  vaildateNewIncounter,
    CreateInCounterSession,
    vaildateUpdateIncounter,

}