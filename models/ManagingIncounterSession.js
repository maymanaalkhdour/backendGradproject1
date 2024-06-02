const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let managingIncounterSchema = new mongoose.Schema({
    createsessionid: { type: mongoose.Schema.Types.ObjectId, ref: 'CreateInCounterSession' },
    // patientid: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    // idpatientnumber: {
        // type: Number,
        // required: true,
        //  Ensuring idpatientnumber is unique
        // validate: {
            // validator: function (v) {
                // return v.toString().length === 9; // ID number should have 9 digits
            // },
            // message: props => `${props.value} is not a valid ID number`,
        // },
    // },

    preliminarydiagnosis: { type: String, required: true, trim: true },
    finaldiagnosis: { type: String, required: true, trim: true },
    diagnosticprocedures: {
    
            type: String,
            trim: true,
            default: null
 
    },
    treetmentplan: {
        type: String,
        required: true,
        trim: true
    }
},{timestamps:true});

const vaildateNewMangingIncounter = (obj) => {
    const schema = Joi.object({
        preliminarydiagnosis: Joi.string().trim().required(),
        finaldiagnosis: Joi.string().trim().required(),
        
        diagnosticprocedures: Joi.string().allow(null).default(null).trim(),
          
       
        treetmentplan: Joi.string().trim().required(),
    });
    return schema.validate(obj);
};

const vaildateUpdateMangingIncounter = (obj) => {
    const schema = Joi.object({
        // idpatientnumber: Joi.number().required().min(100000000).max(999999999), // Ensuring it has 9 digits
        preliminarydiagnosis: Joi.string().trim(),
        finaldiagnosis: Joi.string().trim(),
        
        diagnosticprocedures: Joi.string().allow(null).default(null).trim(),
          
     
        treetmentplan: Joi.string().trim(),
    });
    return schema.validate(obj);
};


const ManagingIncident = mongoose.model('ManagingIncident', managingIncounterSchema);
module.exports = {
    ManagingIncident,
    vaildateNewMangingIncounter,
    vaildateUpdateMangingIncounter
};
