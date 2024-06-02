const express= require( 'express');
const  router= express.Router();
const   asyncHandler= require('express-async-handler');
const {verifyTokenAndSecretaria} = require('../middlewares/verifyToken');
const CircularJSON = require('circular-json');
const {Financial,vaildateNewFinancial}=require('../models/Financial');
const { ManagingIncident } = require('../models/ManagingIncounterSession');
/**---------------------------------
 * @desc  Create Financial
 * @router /api/financial/:Id 
 * @method POST
 * @access private only  doctor can managing incounter session for a patient
 ---------------------------------------------------**/

 
router.post('/:sessionId' , verifyTokenAndSecretaria,asyncHandler (async (req,res)=>{
    const {error}=vaildateNewFinancial(req.body);
    if(error) return res.status(400).json(error.details[0].message);
    let managingincount= await  ManagingIncident.findById({_id : req.params.sessionId});
if(!managingincount){
    return res.status(400).json({ message:"There is no such incident in the database"});
}




const  financial=new Financial ({
    managingincounterid:managingincount._id,
    
    ...req.body,
})
await financial.save();
res.status(201).json(financial);
}));




/**---------------------------------
* @desc  Get  Financial by patient
* @router /api/financial/:id
* @method Get
* @access private only secretaries
------------------------------------*/
router.get('/:sessionId',verifyTokenAndSecretaria,asyncHandler( async (req,res)=>{
    let managingincount= await  ManagingIncident.findById({_id : req.params.sessionId});
// console.log('managingincount',managingincount);
    if(managingincount){
        let  financial = await Financial.findOne({managingincounterid : managingincount._id});
        console.log(financial);
        return res.status(200).json(financial);
    }
    else{

        return res.status(404).json({message:"Incounter Session Id not Found!"});
    }
}))
 
router.get('/',verifyTokenAndSecretaria,)
// fetch code linke 
// fetch('http://localhost:YOUR_API_PORT/api/endpoint')
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));

    router.get('/',verifyTokenAndSecretaria,asyncHandler( async (req,res)=>{
        
    const costsession=120;
    return res.status(200).json(costsession);
    // const cost=costsession*req.body.count;
     
        
    }))

module.exports=router;