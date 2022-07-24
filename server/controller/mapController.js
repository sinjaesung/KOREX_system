const mapService = require('../service/mapService');

const init = (app) => {
    app.get('/api/map/cluster', async(req, res, next) => {
        try{
            const row = await mapService.getMapCluster(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err){
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/map/search/:searchType', async(req, res, next) => {
        try{
            const rows = await mapService.getMapSearch(req);
            res.json({ success: true, data: rows, message: 'success' });
        } catch (err){
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/map/polygon', async(req, res, next) => {
        try{
            const rows = await mapService.getMapPolygon(req);
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
