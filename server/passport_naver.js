const auth_naver=require('./auth_naver');

module.exports= (passport) => {
    
    auth_naver(passport);
};
