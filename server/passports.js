const local=require('./passport_local');

module.exports= passport=> {
    /*passport.serializeUser((user,done) => {
        console.log('passoirt selirlzieUser함수실행:',user);
        done(null,user.mem_id);

    });

    passport.deserializeUser((mem_id,done)=> {
        console.log('passport deserilaizeUser함수실행:',mem_id,done);
        done(null,mem_id);
    });*/
    local(passport);
};
