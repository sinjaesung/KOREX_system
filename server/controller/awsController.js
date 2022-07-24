const awsS3 = require('../modules/fileuploadModule');
const { delObjects } = require('../modules/fileuploadModule');
const { register } = require('../service/awsService');

const init = (app) => {
    app.post('/api/images', awsS3.upload.array('images'), async (req, res, next) => {
        try{
            const rows = await register(req.files);
            res.json({ success: true, data: rows, message: 'success' });
        } catch (err) {
            await delObjects(await register(req.files));
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
