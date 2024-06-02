const exprss= require('express');
const Http = require('http');
const userpath=require('./routes/auth')
const mongoos = require('mongoose');
const env= require('dotenv').config();
const {NotFound,errorHandler}= require('./middlewares/errors')
const cors = require('cors');
const { required } = require('joi');
 const app = exprss();
 app.use(exprss.json());
 
mongoos.connect(process.env.MONGO_URI )
.then(()=>console.log('connected to db'))
.catch((err)=> console.log("error in connection " + err));

// Enable CORS for all routes
app.use(cors());
//auth  routes
app.use("/api/auth",require( './routes/auth'));
//user routes
app.use('/api/users',require('./routes/user'));
//patient routes
app.use('/api/patient',require('./routes/patient'));
///appointments routes
app.use("/api/appointments",require( './routes/managingappointments'));
/// createincounter routes
app.use("/api/createincounter",require('./routes/createincountersession'))
///mamagingIncounter routes
app.use("/api/managingincounter",require('./routes/managingincountersession'))
// financial routes
app.use("/api/financial",require('./routes/financial'));
//Annotation
app.use("/api/annotations",require('./routes/annotation'));
// Error handler
app.use(NotFound);
app.use(errorHandler);

 const port =  process.env.POOT || 5000;
app.listen(port,()=>console.log(`server is running on`));