
const termService = require('../service/termService');

const init = (app) => {
    app.get('/api/terms', async (req, res, next) => {
        try{
            const row = await termService.getTermTitleList(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err) {
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/term', async(req, res, next) => {
        try{
            const row = await termService.getTerm(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err){
            return res.status(403).json({ success: false, message: err });
        }
    });
};

module.exports = {
    initController(app){
        init(app);
    }
};
