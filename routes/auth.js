const express= require( 'express');
const  route= express.Router();
const bcrypt = require('bcrypt');
const   asyncHandler= require('express-async-handler');
const jwt = require('jsonwebtoken')
const {User,vaildateLoginUser,validatNewUser} =require('../models/User')
const {verifyTokenAndSecretaria} =require('../middlewares/verifyToken');



/**---------------------------------
 * @desc Register New User  
 * @router /api/auth/register
 * @method POST
 * @access private only secretaria
 ------------------------------------*/
 route.post('/register',verifyTokenAndSecretaria,asyncHandler( async (req,res)=>{
    const {error}=validatNewUser(req.body);
    if(error) return res.status(400).json(error.details[0].message);
    let user= await User.findOne({email: req.body.email});
      if(user){
           return res.status(400).json({message:'This Email  is already used!'});
              }
        
         const salt=await bcrypt.genSalt(10);
         req.body.password=await  bcrypt.hash(req.body.password ,salt );
          user= await User({
            ...req.body,
          });
          const result= await user.save() ;
          const token=user.generateToken();
          const{ password, ...outhor}= result._doc;
        res.status(201).json({...outhor, token})
        
}));


/**---------------------------------
 * @desc Login New User 
 * @router /api/auth/login
 * @method POST
 * @access public
 ------------------------------------*/


 route.post("/login",async (req,res)=>{ 

    const {error} = vaildateLoginUser(req.body);
    if(error) return res.status(400).json(error.details[0].message);
    let user= await User.findOne({email: req.body.email });
    if(!user) return res.status(400).json('Email or password are wrong');
    const validPassword= await bcrypt.compare(req.body.password,user.password );
    if(!validPassword ) return res.status(400).send('Email or password are wrong');

    const token=user.generateToken();   
     const{ password, ...outhor}= user._doc;
     res.status(201).json({...outhor, token})
      });
   







module.exports=route;