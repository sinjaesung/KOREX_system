const http=require('http');
const express=require('express');
const app=express();
const router=express.Router();

const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.set('views',__dirname +'/views');
app.set('view engine','ejs');

let favorite;
app.get('/',function(req,res){
    console.log('join ksjs / get request:',req);
    res.json('테스트테스트트');
});
app.post('/',async(req,res,next) => {
    favorite=req.body.favorite;
    res.cookie('favorite',favorite, { 
        maxAge : 30000 //30초간 유지된다.
    });
    res.redirect('/');
});

http.createServer(app).listen(6000,function(){
    console.log('server running at 127.0.0.1:6000');
});