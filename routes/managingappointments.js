const express= require( 'express');
const  router= express.Router();
const CircularJSON = require('circular-json');
const   asyncHandler= require('express-async-handler');
const  {Appointment,vaildateNewAppointment,vaildateUpdateAppointment} = require('../models/ManagingAppointments');
const {verifyTokenAndSecretaria}=require('../middlewares/verifyToken');
const {Patient}= require('../models/Patient');
const moment = require('moment');
 

/**---------------------------------
 * @desc  Create  a new appointment
 * @router /api/appointment/:patientid
 * @method POST
 * @access private ony for secretaries
 ------------------------------------*/

router.post('/:patientId', verifyTokenAndSecretaria,async (req, res) => {
    try {
        // Check if the patient exists
        console.log()
        let patient= await Patient.findOne({idnumber: req.params.patientId});      
          if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const existingAppointment = await Appointment.findOne({
          patientid: patient._id,
          appointmentDate: req.body.appointmentDate,
          appointmentTime: req.body.appointmentTime
      });

      if (existingAppointment) {
          return res.status(400).json({ message: 'Appointment already exists for this date and time' });
      }

        console.log (patient)
        // let appointmentDate = moment(req.body.appointmentDate).add(1, 'days');

        // Create a new appointment
        const appointment = new Appointment({
            patientid: patient._id,
            idpatientnumber:req.params.patientId, // Reference to the patient
            patientName:req.body.patientName, // Copy patient name for redundancy
            appointmentDay: (req.body.appointmentDay),
            appointmentDate:req.body.appointmentDate,
            // appointmentDate: appointmentDate.toISOString(),
            appointmentTime: req.body.appointmentTime
        });

        
        // Save the appointment to the database
        await appointment.save();

        res.status(201).json(appointment);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**---------------------------------
 * @desc  Get all appintment
 * @router /api/appointment/
 * @method Get
 * @access private ony for secretaries
 ------------------------------------*/

 router.get('/',verifyTokenAndSecretaria ,asyncHandler( async (req,res)=>{
    let appointment= await  Appointment.find();
    res.status(200).json(appointment);
  } ));




/**---------------------------------
 * @desc Update Appointment
 * @router /api/patient/:
 * @method PUT
 * @access private
 ------------------------------------*/

  router.put('/:patientId', verifyTokenAndSecretaria, asyncHandler(async (req, res) => {
    const { error } = vaildateUpdateAppointment(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    try {
        let updatep = await Patient.findOne({ idnumber: req.params.patientId });
        // console.log(updatep._id);
        
        if (!updatep) {
            return res.status(404).json({ message: "Patient not found" });
        }
        
        // Update patient document
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { patientid: updatep._id }, // Use _id instead of idnumber
            { ...req.body },
            { new: true }
        );
  
        // Convert the updatedPatient object to a JSON string using CircularJSON
        const jsonString = CircularJSON.stringify(updatedAppointment);
  
        // Parse the JSON string back to an object
        const responseData = CircularJSON.parse(jsonString);
  
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error" });
    }
  }));
  
  
  




  /**---------------------------------
* @desc Delete Appointment
* @router /api/patient/:patientId
* @method Delete
* @access private
------------------------------------*/

router.delete('/:id',verifyTokenAndSecretaria,asyncHandler (async (req,res)=>{
    // let deleteappointment= await Patient.findOnd({idnumber:req.params.patientId});
       let deleteappointment= await Appointment.findById( req.params.id)
       console.log("jlajflkajl;")
  console.log (deleteappointment)
  console.log("jlajflkajl;")
    if(deleteappointment){
    // await  Patient.deleteOne({idnumber: req.params.id})
    // await Patient.({idnumber: req.params.id})
        //  await Appointment.findByIdAndDelete(deleteappointment._id);
        await Appointment.findByIdAndDelete(deleteappointment._id)
        // Appointment.findByIdAndDelete
        return res.status(200).json({message:" Appointment  Deleted Successfully "});
    }
    else{
        return res.status(404).json({message:" Appointment not found"});
    }
    
  }));
  
  
  
  
  
  
  
  
  
  
  
  

module.exports=router
