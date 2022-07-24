var express=require('express');
var app=express();
var router=express.Router();
var path=require('path');

router.get('/',(req,res)=>{
    console.log('잘나와');
    res.sendFile(path.resolve(__dirname,'../../public/index.html'));
});

module.exports=router;
