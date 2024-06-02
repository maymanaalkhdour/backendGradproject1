const Joi=require('joi');
const mongoos= require('mongoose');
let FinancialSchema = new mongoos.Schema({
managingincounterid:{type: mongoos.Schema.Types.ObjectId ,ref:'ManagingIncident',required:true ,unique:true},
price:{type:Number,default:120},
totalprice:{type:Number},
discount:{type:Number,default:0},

});


FinancialSchema.pre('save', function (next) {
    // Calculate the total price based on price and discount
    this.totalprice = this.price * (1 - this.discount / 100);
    next();
});



const vaildateNewFinancial =(obj)=>{
    const schema= Joi.object({
       price:Joi.number(),
    //    totalprice:Joi.number().greater(Joi.ref("price")).required(),
       totalprice:Joi.number(),
       discount:Joi.number(),

    })
    return schema.validate(obj);
}
const  Financial=mongoos.model("Financial",FinancialSchema);
module.exports={
    Financial,
    vaildateNewFinancial
}