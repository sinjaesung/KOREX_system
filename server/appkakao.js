const express=require('express');
const morgan=require('morgan');
const cookieparser=require('cookie-parser');
const passport=require('passport');
const session=require('express-session');

const bodyparser=require('body-parser');

const stand_router=require('./routes/kakao_router');//router
const passportconfig=require('./passport_kakao');
const passportconfig2=require('./passport_naver');
const passportconfig3=require('./passport_facebook');//facebook돼나.

const port=8999;
const app=express();
passportconfig(passport);
passportconfig2(passport);
passportconfig3(passport);

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(
    session({
        resave:false,
        saveUninitialized:false,
        secret:'sgnjij#njskgnsdigna*&)',
        cookie:{
            httpOnly:true,
            secure:false
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',stand_router);

app.use((req,res,next)=>{
    res.status(404).send('not found');
});

app.listen(port,function(){
    console.log('Server is listeingn on '+port);
});
