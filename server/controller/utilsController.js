const utilsService = require('../service/utilsService');

const init = (app) =>{

    app.get('/api/holiday',async(req,res,next)=> {
        try{
            var rows = await utilsService.getHoliday(req);
            console.log('holidays resultsss:',rows);
            res.json({success:true, data:rows,message:'success return all banner data list'});
        }catch(err){
            console.log('errrors:',err);
            return res.status(403).json({success:false, message:err});
        }
    });
}

module.exports = {
    initController(app){
        init(app);
    },
}