const bunyangProjectService = require('../service/bunyangProjectService');

const init = (app) =>{
    app.get('/api/bunyangs', async (req, res, next) => {
        try {
            const rows = await bunyangProjectService.getBunyangProjects(req);
            res.json({ success: true, data: rows, message: 'success' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/bunyangs/:bpId', async (req, res, next) => {
        try {
            const row = await bunyangProjectService.getBunyangProject(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err) {
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