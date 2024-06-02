const Joi=require('joi');
const mongoos= require('mongoose');
const  jwt = require("jsonwebtoken");
let managingAppointmentSchema = new mongoos.Schema({
    patientid:{type:mongoos.Schema.Types.ObjectId,ref: 'Patient' ,},
   idpatientnumber:{type:Number,required:true},
    patientName: {type: String,required: true,trim:true,},
  appointmentDay: {
    type: String,
    enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
},{timestamps:true});

// new Appointment
const vaildateNewAppointment = (obj)=>{
    const schema = Joi.object({
        
        patientName: Joi.string().required().trim(),
        appointmentDay:Joi.string().required().valid('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
        appointmentDate:Joi.string().required(),
        appointmentTime: Joi.string().required(),
    })
    return schema.validate(obj);
};

//  Update Appointment

const vaildateUpdateAppointment = (obj)=>{
    const schema = Joi.object({
        
        patientName: Joi.string().trim(),
        appointmentDay:Joi.string().valid('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
        appointmentDate:Joi.string(),
        appointmentTime: Joi.string(),
    })
    return schema.validate(obj);
};

 const  Appointment = mongoos.model('Appointments',managingAppointmentSchema);
 module.exports={
    Appointment,
    vaildateNewAppointment,
    vaildateUpdateAppointment,
    
 }