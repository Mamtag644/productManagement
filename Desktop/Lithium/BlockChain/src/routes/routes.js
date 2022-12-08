
const express=require('express');
const { getCryptoCurrency } = require('../controller/chanincontroller.js');
const router=express.Router();

router.get("/Home",(req,res)=>{
    res.send("This is Home Page of Programming Yatra")
})

router.get("/assets",getCryptoCurrency)

module.exports=router;