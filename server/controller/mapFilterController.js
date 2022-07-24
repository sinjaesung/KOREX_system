
const mapFilterService = require('../service/mapFilterService');

const init = (app) =>{

    app.post('/api/mapProduct',async(req,res,next)=> {
        try{
            var rows = await mapFilterService.getProductList(req);
            //console.log('return rowsss:',rows);
            res.json({success:true, data:rows, message:'Success return product data'});
        }catch(err){
            console.log('뭔에런데??',err);
            return res.status(403).json({success:false, message:err});
        }
    });
}




module.exports = {
    initController(app){
        init(app);
    },
}