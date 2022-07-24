const authMapper = require('../mapper/auth');

module.exports = {

    async sendEmail(email,subject){

        ejs.renderFile(appdir+'/template/authMail3.ejs',{authCode:random_newpassword,useremail:encodeURIComponent(email)},function(err,data){
            if(err){console.log(err);}
            emailTemplate=data;
        });

        let transporter=nodemailer.createTransport({
            service:'gmail',
            host:'smtp.gmail.com',
            port:57,
            tls:{
                rejectUnauthorized:false
            },
            secure:false,
            auth:{
                user:'biz@korex.or.kr',
                pass:'takrcdtdzmenxqxm'
            }
        });
        let mailOptions={
            from:'biz@korex.or.kr',
            to : email,
            subject : subject,
            html : emailTemplate
        };
        transporter.sendMail(mailOptions,async function(error,info){
            if(error){
                console.log('email errorss:',error);
                return res.status(403).json({success:false,message:'email send failed',result:undefined})
            }
            transporter.close();
        });

    }, 
}