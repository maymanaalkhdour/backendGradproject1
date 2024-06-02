// annotationModel.js

const { ref, required } = require('joi');
const mongoose = require('mongoose');
const Joi=require('joi');

const annotationSchema = new mongoose.Schema({
    sessionmanagingid:{type:mongoose.Schema.Types.ObjectId,ref:'ManagingIncident',required:true},
  imageUrl:{ type:Object,required:true} ,
  points: [{
    x:{type:Number,required:true}  ,
    y: {type:Number,required:true} ,
    text: { type:String,required:true}
  }]
});
 




const validateNewAnnotation = (obj) => {
    const pointSchema = Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required(),
      text: Joi.string().allow('').required()
    });
  
    const schema = Joi.object({
    //   sessionmanagingid: Joi.string().required(),
      imageUrl: Joi.object().required(),
      points: Joi.array().items(pointSchema).required()
    });
  
    return schema.validate(obj);
  };


    
      
   
   


const Annotation = mongoose.model('Annotation', annotationSchema);

module.exports ={
    Annotation,
    validateNewAnnotation,

} 
