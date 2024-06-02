const express= require( 'express');
const  router= express.Router();
const   asyncHandler= require('express-async-handler');
 const { Patient } = require('../models/Patient')
const{CreateInCounterSession} =require('../models/CreateIncounterSession')
const {verifyTokenAndDoctor} = require('../middlewares/verifyToken');
const { ManagingIncident ,vaildateNewMangingIncounter,vaildateUpdateMangingIncounter} = require('../models/ManagingIncounterSession');
const CircularJSON = require('circular-json');











/**---------------------------------
 * @desc  Create Incounter Session
 * @router /api/managingincounter/:patientId 
 * @method POST
 * @access private only  doctor can managing incounter session for a patient
 ---------------------------------------------------**/
// console.log("hi hi hi")
 router.post('/:sessionid' , verifyTokenAndDoctor,asyncHandler (async (req,res)=>{
    const {error}=vaildateNewMangingIncounter(req.body);
    if(error) return res.status(400).json(error.details[0].message);
    // console.log(req.params.patientId)
    let sessionid1= await CreateInCounterSession.findById(req.params.sessionid);  
console.log (sessionid1)
    // console.log(patient)    
    if (!sessionid1) {
      return res.status(404).json({ message: ' Session not found' });
  }
//   let managingincounter=await ManagingIncident.findById({_id:req.params.id});
//   console.log(managingincounter);
  const managingIncounter = new ManagingIncident({
    createsessionid:sessionid1._id,
     ...req.body,
  });
   await managingIncounter.save();
   res.status(201).json(managingIncounter);
  }));

/**---------------------------------
* @desc  Get Incounter Session
* @router /api/managingincounter/:patientId 
* @method Get
* @access private only   doctor can Maiaging incounter session for a patient
------------------------------------*/
// router.get('/:sessionid',verifyTokenAndDoctor,asyncHandler( async (req,res)=>{
    // console.log (req.params.idnumber);
    //   
    //   let sessionmanaging= await CreateInCounterSession.findById(req.params.sessionid);
    //   if(sessionmanaging){
        //   let incountor=await ManagingIncident.findOne({createsessionid : sessionid._id})
        //   return res.status(200).json(incountor);
    //   }
    //   else{
        //   return res.status(404).json({message:" Session not found"});
    //   }
      
//    }/));

router.get('/:id',verifyTokenAndDoctor,asyncHandler( async (req,res)=>{
    console.log (req.params.idnumber);
      
    //   let patient= await Patient.findOne({idnumber:req.params.patientId});
         let session =await CreateInCounterSession.findById(req.params.id);
      if(session){
          let incountor=await ManagingIncident.findOne({createsessionid : req.params.id})
          return res.status(200).json(incountor);
      }
      else{
          return res.status(404).json({message:" Patient not found"});
      }
      
   }));
  



router.get('/:sessionid', verifyTokenAndDoctor, asyncHandler(async (req, res) => {
    try {
        let sessionmanaging = await CreateInCounterSession.findById(req.params.sessionid);
        console.log(sessionmanaging)
        if (sessionmanaging) {
            let incountor = await ManagingIncident.findOne({ createsessionid: sessionmanaging._id });
            return res.status(200).json(incountor);
        } else {
            return res.status(404).json({ message: "Session not found" });
        }
    } catch (error) {
        console.error('Error retrieving managing incident session:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));



/**---------------------------------
* @desc  Get Incounter Session
* @router /api/managingincounter/all/:patientId 
* @method Get
* @access private only   doctor can Maiaging incounter session for a patient
------------------------------------*/


//    router.get('/all/:pat', verifyTokenAndDoctor, asyncHandler(async (req, res) => {
    // try {
        //  const patient = await Patient.findOne({ idnumber: req.params.patientId });
        // if (!patient) {
            // return res.status(404).json({ message: 'Patient not found' });
        // }
        // Find all encounter sessions for the patient
        // const encounterSessions = await ManagingIncident.find({ idpatientnumber: patient.idnumber });
        // if (encounterSessions.length === 0) {
            // return res.status(404).json({ message: 'No Incounter sessions found for the patient' });
        // }
        // return res.status(200).json(encounterSessions);
    // } catch (error) {
        // console.error('Error retrieving Incounter sessions:', error);
        // return res.status(500).json({ message: 'Internal server error' });
    // }
    //  }));






    
    
    
    
    
    router.get('/all/:patientId', verifyTokenAndDoctor, asyncHandler(async (req, res) => {
        try {
            // البحث عن المريض باستخدام رقمه
            const patient = await Patient.findOne({ idnumber: req.params.patientId });
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            
            // البحث عن جميع جلسات إدارة المريض ذات الصلة
            const createSessions = await CreateInCounterSession.find({ patientid: patient._id });

         console.log (createSessions.length)
         let arryasession=[];
         for( let i=0; i<createSessions.length ;i++){
            console.log(createSessions[i].patientid)
            const managingSessions = await ManagingIncident.findOne({createsessionid: createSessions[i]._id });
        arryasession.push(managingSessions);
        }
        console.log(arryasession)
// console.log(managingSessions)
            // التحقق مما إذا كانت هناك جلسات إدارة متاحة للمريض
             if (arryasession.length === 0) {
                 return res.status(404).json({ message: 'No managing sessions found for the patient' });
             }
            // 
            // إرجاع الجلسات المجدولة
             return res.status(200).json(arryasession);
        } catch (error) {
            console.error('Error retrieving managing sessions:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }));
    
    
    
    
    
    
    
    
    
    
    
    




/**---------------------------------
 * @desc Update ManaingIncounter
 * @router /api/managingincounter/:patientId
 * @method PUT
 * @access private
 ------------------------------------*/

    //  router.put('/:patientId' , verifyTokenAndDoctor,asyncHandler (async (req,res)=>{
        // const {error}=vaildateUpdateMangingIncounter(req.body);
        // if(error) return res.status(400).json(error.details[0].message);
        // console.log(req.params.patientId)
        // let patient= await Patient.findOne({idnumber: req.params.patientId});  
        // console.log(patient)    
        // if (!patient) {
        //   return res.status(404).json({ message: ' Patient not found' });
    //   }
      
    //   const updatedSession = await ManagingIncident.findOneAndUpdate(
        // { patientid: patient._id }, // Use _id instead of idnumber
        // { ...req.body },
        // { new: true }
    // );
    // Convert the updatedPatient object to a JSON string using 
    // const jsonString = CircularJSON.stringify(updatedSession);
    // Parse the JSON string back to an object
    // const responseData = CircularJSON.parse(jsonString);
    // res.status(200).json(responseData);      
      
      
      
    //   }));



    
    
    
    
    
    
    
    
    
    
    
    
    
            
    
    











    // router.put('/:patientId', verifyTokenAndDoctor, asyncHandler(async (req, res) => {
        // const { error } = vaildateUpdateMangingIncounter(req.body);
        // if (error) return res.status(400).json(error.details[0].message);
    
        // try {
            // const patient = await Patient.findOne({ idnumber: req.params.patientId });
            // if (!patient) {
                // return res.status(404).json({ message: 'Patient not found' });
            // }
            // 
            // const updatedSession = await ManagingIncident.findOneAndUpdate(
                // { patientid: patient._id },
                // { ...req.body },
                // { new: true }
            // );
    
            // if (!updatedSession) {
                // return res.status(404).json({ message: 'Session not found' });
            // }
    
            // Convert the updated session object to a JSON string using CircularJSON
            // const jsonString = CircularJSON.stringify(updatedSession);
            // Parse the JSON string bac?k to an object
            // const responseData = CircularJSON.parse(jsonString);
            // res.status(200).json(responseData);
        // } catch (error) {
            // console.error('Error updating ManagingIncounter:', error);
            // return res.status(500).json({ message: 'Internal server error' });
        // }
    // }));
    router.put('/:patientId', verifyTokenAndDoctor, asyncHandler(async (req, res) => {
        try {
            const { error } = vaildateUpdateMangingIncounter(req.body);
            if (error) return res.status(400).json(error.details[0].message);
    
            // Find the patient
            const patient = await Patient.findOne({ idnumber: req.params.patientId });
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
    
            // Find the latest managing incident session
            const latestSession = await ManagingIncident.findOne({ patientid: patient._id }).sort({ _id: -1 });
    
            if (!latestSession) {
                return res.status(404).json({ message: 'No managing incident session found for the patient' });
            }
    
            // Update the latest session with new data
            const updatedSession = await ManagingIncident.findByIdAndUpdate(
                latestSession._id,
                { $set: req.body },
                { new: true }
            );
    
            return res.status(200).json(updatedSession);
        } catch (error) {
            console.error('Error updating managing incident session:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }));
    
    



     module.exports=router;
  
