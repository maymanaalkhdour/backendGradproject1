const express= require( 'express');
const  router= express.Router();
const   asyncHandler= require('express-async-handler');
const {verifyTokenAndNuresDoctor} = require('../middlewares/verifyToken')
const { vaildateNewIncounter,CreateInCounterSession,vaildateUpdateIncounter}=require("../models/CreateIncounterSession");
const { Patient } = require('../models/Patient');
const multer = require('multer');
const path =require("path");
const CircularJSON = require('circular-json');
const {cloudinaryUploadImage}=require('../Utils/Cloudinary')
const fs=require("fs")

const storage=multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,path.join( __dirname,"../images"));
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({storage});





/**---------------------------------
 * @desc  Create Incounter Session
 * @router /api/createincounter/:patientId 
 * @method POST
 * @access private only  Nursing doctor can create incounter session for a patient
 ------------------------------------*/

 router.post('/:patientId' , upload.single('xrayimage'), verifyTokenAndNuresDoctor,asyncHandler (async (req,res)=>{

    const {error}=vaildateNewIncounter(req.body);
    if(error) return res.status(400).json(error.details[0].message);
    // console.log(req.params.patientId)
    let patient= await Patient.findOne({idnumber: req.params.patientId});  
    console.log(patient)    
    if (!patient) {
      return res.status(404).json({ message: ' Patient not found' });
  }
  
  patient.sessioncount += 1;
  
  const createIncounter = new CreateInCounterSession({
    patientid: patient._id,
   systolic:parseInt (req.body.systolic),
    diastolic:parseInt(req.body.diastolic),
    pulse:parseInt(req.body.pulse),
    temperature :parseInt(req.body.temperature),
    respiration:parseInt(req.body.respiration), 
    o2sat:parseInt(req.body.o2sat),
    height:parseInt(req.body.height),
    weight:parseInt(req.body.weight),
    ...req.body,
    // xrayimage: req.file ? req.file.path : '',
  });
  const imagePath= path.join(__dirname,`../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath)
  console.log(result)
  createIncounter.xrayimage = {
    url:result.secure_url,
    public_id:result.public_id
  };
  await patient.save();
   await createIncounter.save();
   res.status(201).json(createIncounter);
   fs.unlinckSync(imagePath);
  }))




 /**---------------------------------
 * @desc  Get Incounter Session
 * @router /api/createincounter/:patientId 
 * @method Get
 * @access private only  Nursing doctor can create incounter session for a patient
 ------------------------------------*/

 router.get('/:id',verifyTokenAndNuresDoctor,asyncHandler( async (req,res)=>{
    console.log (req.params.idnumber);
      
    //   let patient= await Patient.findOne({idnumber:req.params.patientId});
         let session =await CreateInCounterSession.findById(req.params.id);
      if(session){

        //   let incountor=await CreateInCounterSession.findOne({patientid : patient._id})
          return res.status(200).json(session);
      }
      else{
          return res.status(404).json({message:" Patient not found"});
      }
      
   }));
  









   
/**---------------------------------
* @desc  Get Incounter Session
* @router /api/managingincounter/all/:patientId 
* @method Get
* @access private only  narse and  doctor can Create incounter session for a patient
------------------------------------*/  

   router.get('/all/:patientId', verifyTokenAndNuresDoctor, asyncHandler(async (req, res) => {
    try {
        const patient = await Patient.findOne({ idnumber: req.params.patientId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
          
        // Find all encounter sessions for the patient
        const encounterSessions = await CreateInCounterSession.find({ patientid: patient._id });

        if (encounterSessions.length === 0) {
            return res.status(404).json({ message: 'No encounter sessions found for the patient' });
        }

        return res.status(200).json(encounterSessions);
    } catch (error) {
        console.error('Error retrieving encounter sessions:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
     }));






/**---------------------------------
 * @desc  Update Incounter Session
 * @router /api/createincounter/:id 
 * @method PUT
 * @access private only Nursing doctor can update incounter session for a patient
 ------------------------------------*/



 router.put('/:id', verifyTokenAndNuresDoctor, asyncHandler(async (req, res) => {
    const { error } = vaildateUpdateIncounter(req.body);
    if (error) return res.status(400).json(error.details[0].message);
        try {
            
        
        
        
    let session = await CreateInCounterSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    const updatedPatient = await CreateInCounterSession.findByIdAndUpdate(
      req.params.id,// Use _id instead of idnumbe
        { ...req.body },
        { new: true }
    );
    const jsonString = CircularJSON.stringify(updatedPatient);
    // Parse the JSON string back to an object
    const responseData = CircularJSON.parse(jsonString);
    res.status(200).json(responseData);
    res.status(200).json(updatedPatient);
} catch (error) {
    console.error("Error occurred:", error);
res.status(500).json({ message: "Internal server error" });
}
  }));
  


  // get 






























  router.get('/latest/:patientId', verifyTokenAndNuresDoctor, asyncHandler(async (req, res) => {
    try {
       
       

        // Find the patient
        const patient = await Patient.findOne({ idnumber: req.params.patientId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Find the latest managing incident session
        const latestSession = await CreateInCounterSession.findOne({ patientid: patient._id }).sort({ _id: -1 });

        if (!latestSession) {
            return res.status(404).json({ message: 'No Create incident session found for the patient' });
        }

        // Update the latest session with new data
       
       
       
       
       

        return res.status(200).json(latestSession);
    } catch (error) {
        console.error('Error updating managing incident session:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));







  
  module.exports = router;























