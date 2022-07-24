const complexService = require('../service/complexService');

const init = (app) => {
    app.get('/api/complexes/:complexId', async(req, res, next) => {
        try{
            const row = await complexService.getComplex(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err){
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/complexes', async(req, res, next) => {
        try{
            const rows = await complexService.getComplexes(req);
            res.json({ success: true, data: rows, message: 'success' });
        } catch (err){
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/complexes/:complexId/buildings', async(req, res, next) => {
        try{
            const rows = await complexService.getBuildingsByComplexId(req);
            res.json({ success: true, data: rows, message: 'success' });
        } catch (err){
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/complexes/:complexId/buildings/:bldId/ho', async(req, res, next) => {
        try{
            const rows = await complexService.getHoList(req);
            res.json({ success: true, data: rows, message: 'success' });
        } catch (err){
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/complexes/:complexId/buildings/:bldId/ho/:hoId', async(req, res, next) => {
        try{
            const row = await complexService.getHo(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err){
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    // 일단 complex부분에 작성 => 추후에 다른 곳으로 옮길수 도 있음
    app.get('/api/floor', async(req, res, next) => {
        try{
            const rows = await complexService.getFloor(req);
            res.json({ success: true, data: rows, message: 'success' });
        } catch (err){
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });
};

module.exports = {
    initController(app){
        init(app);
    }
};
