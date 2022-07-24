const auth_kakao=require('./auth_kakao');

module.exports= (passport)=> {
    
    auth_kakao(passport);
};
