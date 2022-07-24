const awsS3 = require('../modules/fileuploadModule');
const { delObjects } = require('../modules/fileuploadModule');
const { register_ } = require('../modules/uploadfile_register_');
const realtorService = require('../service/realtorService');

const init = (app) => {
    app.post('/api/realtors/:companyId/pro/apply', awsS3.upload.fields([{ name:'companyregfile' }, { name: 'realtorfile' }]), async (req, res, next) => {
        try{
            await realtorService.setProRealtorApply(req);
            res.json({ success: true, message: 'CREATED' });
        } catch (err) {
            await delObjects(await register_(req.files, req.body));
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/realtors/:companyId/pro/:type', async(req, res, next) => {
        try{
            const row = await realtorService.getProRealtor(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err){
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/realtors/pro', async(req, res, next) => {
        try{
            const rows = await realtorService.getProRealtors(req);
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
