
const likesService = require('../service/likesService');

const init = (app) =>{
    app.post('/api/likes/item',async(req,res,next)=> {
        console.log('api likes itemss:',req.body);
        try{
            var rows = await likesService.toggleLikes(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
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