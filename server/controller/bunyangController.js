
const bunyangService = require('../service/bunyangService');

const init = (app) =>{
    app.get('/api/bunyang/detail',async(req,res,next)=> {
        try{
            var rows = await bunyangService.getBunyang(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    });
    app.get('/api/bunyang',async(req,res,next)=> {
        try{
            var rows = await bunyangService.getBunyangList(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    });
    app.get('/api/bunyang/like',async(req,res,next)=> {
        try{
            var rows = await bunyangService.getBunyangLikeList(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    });

    
    
    app.get('/api/bunyang/team',async(req,res,next)=> {
        try{
            var rows = await bunyangService.getBunyangTeamList(req);
            console.log('==>>>rowsss:',rows);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    });
    app.get('/api/bunyang/reservation/team/count',async(req,res,next)=> {
        try{
            var rows = await bunyangService.getReservationCount(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })
    app.get('/api/bunyang/reservation',async(req,res,next)=> {
        try{
            var rows = await bunyangService.getReservationList(req);
            //console.log('bunyang resvation유저 신청접수리스트::',rows);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })

    
    app.get('/api/bunyang/reservation/members',async(req,res,next)=> {
        try{
            var rows = await bunyangService.getReservationMembers(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })

    app.get('/api/bunyang/reservation/setting',async(req,res,next)=> {
        try{
            var rows = await bunyangService.getReservationSetting(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })
    app.post('/api/bunyang/reservation/setting',async(req,res,next)=> {
        try{
            var rows = await bunyangService.insertReservationSetting(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })
    app.put('/api/bunyang/reservation/setting',async(req,res,next)=> {
        try{
            var rows = await bunyangService.updateReservationSetting(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })
    app.post('/api/bunyang/reservation',async(req,res,next)=> {
        try{
            var rows = await bunyangService.insertReservation(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })
    app.put('/api/bunyang/reservation',async(req,res,next)=> {
        try{
            var rows = await bunyangService.updateVisitReservationSetting(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })
    app.put('/api/bunyang/reservation/live/edit',async(req,res,next)=> {
        try{
            var rows = await bunyangService.updateLiveLinkSetting(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })
    app.put('/api/bunyang/reservation/link',async(req,res,next)=> {
        try{
            var rows = await bunyangService.updateReservationLink(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })
    app.delete('/api/bunyang/reservation',async(req,res,next)=> {
        try{
            var rows = await bunyangService.deleteReservation(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })
    app.delete('/api/bunyang/reservation_del',async(req,res,next)=>{
        console.log('관련요청:',req.body);
        try{
            var rows=await bunyangService.deleteReservation_real(req);
            res.json({success:true, data:rows, message:'success return all bunyang data listss'});
        }catch(err){
            return res.status(403).json({success:false,message:err});
        }
    })

    app.get('/api/bunyang/my/reservation',async(req,res,next)=> {
        try{
            var rows = await bunyangService.getMyReservationList(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })

    app.put('/api/bunyang/reservation/alarm',async(req,res,next)=> {
        try{
            var rows = await bunyangService.updateAlarmSetting(req);
            res.json({success:true, data:rows,message:'success return all bunyang data list'});
        }catch(err){
            return res.status(403).json({success:false, message:err});
        }
    })
    

}



module.exports = {
    initController(app){
        init(app);
    },
}