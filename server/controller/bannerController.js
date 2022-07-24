
const bannerService = require('../service/bannerService');

const init = (app) =>{

    app.get('/api/banner',async(req,res,next)=> {
        try{
            var rows = await bannerService.getBannerList(req);
            res.json({success:true, data:rows,message:'success return all banner data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    });
}




module.exports = {
    initController(app){
        init(app);
    },
}