const awsS3 = require('../modules/fileuploadModule');
const { delObjects } = require('../modules/fileuploadModule');
const { register } = require('../service/awsService');
const userService = require('../service/userService');

const init = (app) =>{
    app.get('/api/users/exists', async (req, res, next) => {
        try{
            const row = await userService.existsUser(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.patch('/api/users/:memId', awsS3.upload.fields([{ name:'mem_img' }]), async (req, res, next) => {
        try{
            await userService.updateUser(req);
            res.json({ success: true, message: 'UPDATED' });
        } catch (err) {
            if (!!req.files) { await delObjects(register(req.files)) };
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/users/:memId', async (req, res, next) => {
        try{
            const row = await userService.getUser(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.delete('/api/users/:memId', async (req, res, next) => {
        try{
            await userService.deleteUser(req);
            res.json({ success: true, message: 'DELETE' });
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
