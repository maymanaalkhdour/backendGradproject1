const express= require( 'express');
const  router= express.Router();

const   asyncHandler= require('express-async-handler');
const {Patient,vaildateNewPatient,vaildateUpdatePatient }= require('../models/Patient');
const {verifyTokenAndSecretaria ,verifyToken}=require('../middlewares/verifyToken')
const CircularJSON = require('circular-json');

/**---------------------------------
 * @desc  Create  a new patient account
 * @router /api/patient/create
 * @method POST
 * @access private ony for secretaries
 ------------------------------------*/
///,verifyTokenAndSecretaria
 router.post('/create',asyncHandler( async (req,res)=>{
    const {error}=vaildateNewPatient(req.body);
    if(error) return res.status(400).json(error.details[0].message );
    let patient= await Patient.findOne({idnumber: req.body.idnumber});
      if(patient){
           return res.status(400).json({message:'This Patient  is already   exist!'});
              }
          patient= await Patient({
            ...req.body,
          });
          const result= await patient.save() ;
          const{ ...outhor}= result._doc;
        res.status(201).json({...outhor})
        
 }));
 






 // Assuming you have a route handler for retrieving sessioncount for a patient
router.get('/sessioncount/:patientid', verifyToken,async (req, res) => {
  try {
    let patient= await Patient.findOne({idnumber:req.params.patientid});
 
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ sessioncount: patient.sessioncount });
  } catch (error) {
    console.error('Error retrieving sessioncount:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/**---------------------------------
 * @desc Update patient
 * @router /api/patient/:id
 * @method PUT
 * @access private
 ------------------------------------*/
//  router.put( '/:id',verifyTokenAndSecretaria ,asyncHandler( async (req, res) =>{
// const {error}= vaildateUpdatePatient(req.body);
// if(error) return res.status(400).send(error.details[0].message);
// let updatep= await Patient.findOne({idnumber:req.params.id});
// console.log(updatep._id);
// if(updatep){
  // const updatepatient= Patient.findOneAndUpdate( updatep._id ,{...req.body},{new:true})

  // const jsonString = CircularJSON.stringify(updatepatient);

        // Parse the JSON string back to an object
        // const responseData = CircularJSON.parse(jsonString);
  // res.status(200).json(responseData);
// }else{
  // return res.status(404).json({message:"  Patient not found"});

// }
// const  updatepatient= await Patient.findByIdAndUpdate(req.params.id ,{...req.body},{new:true});



// }));




router.put('/:id', verifyTokenAndSecretaria, asyncHandler(async (req, res) => {
  const { error } = vaildateUpdatePatient(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  try {
      let updatep = await Patient.findOne({ idnumber: req.params.id });
      console.log(updatep._id);
      
      if (!updatep) {
          return res.status(404).json({ message: "Patient not found" });
      }
      
      // Update patient document
      const updatedPatient = await Patient.findOneAndUpdate(
          { _id: updatep._id }, // Use _id instead of idnumber
          { ...req.body },
          { new: true }
      );

      // Convert the updatedPatient object to a JSON string using CircularJSON
      const jsonString = CircularJSON.stringify(updatedPatient);

      // Parse the JSON string back to an object
      const responseData = CircularJSON.parse(jsonString);

      res.status(200).json(responseData);
  } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ message: "Internal server error" });
  }
}));













/**---------------------------------
 * @desc  Get Patients 
 * @router /api/patient/
 * @method Get
 * @access private
 ------------------------------------*/

 router.get('/',verifyTokenAndSecretaria ,asyncHandler( async (req,res)=>{
  let patients= await Patient.find();
  res.status(200).json(patients);
}));


/**---------------------------------
* @desc Get patient
* @router /api/patient/:id
* @method Get
* @access private ony for Secretaria 
------------------------------------*/
router.get('/:id',verifyTokenAndSecretaria,asyncHandler( async (req,res)=>{
  console.log (req.params.idnumber);
    
    let patient= await Patient.findOne({idnumber:req.params.id});
    if(patient)
        return res.status(200).json(patient);
    else{
        return res.status(404).json({message:" Patient not found"});
    }
    
 }));


/**---------------------------------
* @desc Delete patient
* @router /api/patient/:id
* @method Delete
* @access private
------------------------------------*/
router.delete('/:id',verifyTokenAndSecretaria,asyncHandler (async (req,res)=>{
  let deletepatient= await Patient.findOne({idnumber:req.params.id});


  if(deletepatient){
  // await  Patient.deleteOne({idnumber: req.params.id})
  // await Patient.({idnumber: req.params.id})
       await Patient.findByIdAndDelete(deletepatient._id);
      return res.status(200).json({message:" Patient  Deleted Successfully "});
  }
  else{
      return res.status(404).json({message:"  Patient not found"});
  }
  
}));













 module.exports=router
