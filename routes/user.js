const express= require( 'express');
const router= express.Router();
const jwt= require('jsonwebtoken');
const { User,vaildateUpdateUser}= require('../models/User')
const bcrypt=require("bcrypt");
const asyncHandler = require('express-async-handler');
const {verifyTokenAndAuthentication} = require('../middlewares/verifyToken')


/**---------------------------------
 * @desc Update User
 * @router /api/users/:id
 * @method PUT
 * @access private
 ------------------------------------*/
router.put( '/:id',verifyTokenAndAuthentication ,asyncHandler( async (req, res) => {
const {error}= vaildateUpdateUser(req.body);
if(error) return res.status(400).send(error.details[0].message);
if(req.body.password){
    const salt=await bcrypt.genSalt(10);
    req.body.password=await  bcrypt.hash(req.body.password ,salt );
                }

const  updateuser= await User.findByIdAndUpdate(req.params.id ,{...req.body},{new:true}).select("-password");
res.status(201).json(updateuser);



}));

/**---------------------------------
 * @desc Get Users
 * @router /api/users/
 * @method Get
 * @access public
 ------------------------------------*/
router.get('/',asyncHandler( async (req,res)=>{
    let users= await User.find().select("-password");
    res.status(200).json(users);
 }));

 /**---------------------------------
 * @desc Get User
 * @router /api/users/:id
 * @method Get
 * @access private
 ------------------------------------*/

 router.get('/:id',verifyTokenAndAuthentication,asyncHandler( async (req,res)=>{
     let users= await User.findById(req.params.id).select("-password");
     if(users)
         return res.status(200).json(users);
     else{
         return res.status(404).json({message:" User not found"});
     }
     
  }));
/**---------------------------------
* @desc Delete User
* @router /api/users/:id
* @method Get
* @access private
------------------------------------*/
  router.delete('/:id',verifyTokenAndAuthentication,asyncHandler (async (req,res)=>{
    let deletesers= await User.findById(req.params.id);
    if(deletesers){
         await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:" User  Deleted Successfully "});
    }
    else{
        return res.status(404).json({message:"  User not found"});
    }
    
 }));

module.exports=router;



