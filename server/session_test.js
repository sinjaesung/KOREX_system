const express=require('express');
const session=require('express-session');

const FileStore= require('session-file-store');

const app=express();

const bodyParser=require('body-parser');

app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.use(bodyParser.urlencoded({extended : false}));

app.use(session({
    secret: 'keyboard catss',
    resave:false,
    saveUninitialized:true,
    //store : new FileStore()
}));

let user={
    user_id : 'kim',
    user_pwd: '1111'
};

app.get('/',(req,res,next) => {
    if(req.session.logined){
        res.render('logout',{id:req.session.user_id});
    }else{
        res.render('logon');
    }
});
app.post('/',(req,res) => {
    if(req.body.id == user.user_id && req.body.pwd == user.user_pwd){
        req.session.logined=true;
        req.session.user_id = req.body.id;
        res.render('logout', { id : req.session.user_id});
    }else{
        res.send(`
        <h1>Who are you?</h1>
        <a href="/">Back </a>
      `);
    }
});
app.post('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});
app.listen(7000, () => {
    console.log('listengin 7000 ports');
});
app.get('/session_list',(req,res) => {
    res.json(req.session);
});