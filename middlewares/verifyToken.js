
const jwt=require("jsonwebtoken");
//verifyToken
function verifyToken (req,res,next){
    const token= req.headers.token;
    if(token){
        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.user=decoded;
            next();
            
        } catch (error) {
            res.status(403).json({message:"invalid token"});
        }
    }
    else {
        res.status(403).json({message:"no token provide"});
    }

}
//Verify Token and Authentication
function verifyTokenAndAuthentication(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isSecretary==="1"){
           next();
        }
        else {
            return res.status(403).json({message:"You can only updated your profile"}); 
        }
    })
     
}



//Verify Token and Secretaria
function verifyTokenAndSecretaria(req,res,next){
    verifyToken(req,res,()=>{
        console.log(req.user.isSecretary);
        if(req.user.isSecretary){
           next();
        }
        else {
            return res.status(403).json({message:"You are not allowed only Secretaria  allowed"}); 
        }
    })
     
}
 
//verify Token Nures and Doctor

function verifyTokenAndNuresDoctor(req,res,next){
    verifyToken(req,res,()=>{
        console.log(req.user.isDoctor);
        if(req.user.isNurse || req.user.isDoctor){
           next();
        }
        else {
            return res.status(403).json({message:"You are not allowed only Doctor or Nurse  allowed"});
        }
    })
     
}


// Verify Token and Doctor

function verifyTokenAndDoctor(req,res,next){
    verifyToken(req,res,()=>{
        console.log(req.user.isDoctor);
        if( req.user.isDoctor){
           next();
        }
        else {
            return res.status(403).json({message:"You are not allowed only Doctor   allowed"});
        }
    })
     
}




module.exports={
    verifyToken,
    verifyTokenAndAuthentication,
    verifyTokenAndSecretaria,
    verifyTokenAndDoctor,
    verifyTokenAndNuresDoctor

}