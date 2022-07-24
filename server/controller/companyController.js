const awsS3 = require('../modules/fileuploadModule');
const { delObjects } = require('../modules/fileuploadModule');
const { register } = require('../service/awsService');
const companyService = require('../service/companyService');

const init = (app) =>{
    app.get('/api/companies/exists', async (req, res, next) => {
        try{
            const row = await companyService.existsCompany(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.patch('/api/companies/:companyId', awsS3.upload.fields([{ name:'profile_img' }]), async (req, res, next) => {
        try{
            await companyService.updateCompany(req);
            res.json({ success: true, message: 'UPDATED' });
        } catch (err) {
            if (!!req.files) { await delObjects(register(req.files)) };
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/companies/:companyId', async (req, res, next) => {
        try{
            const row = await companyService.getCompany(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/user/:memId/companies', async (req, res, next) => {
        try{
            const rows = await companyService.getCompaniesByMemId(req);
            res.json({ success: true, data: rows, message: 'success' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.post('/api/companies/:companyId/member', async (req, res, next) => {
      try{
          await companyService.setCompanyMember(req);
          res.json({ success: true, message: 'CREATED' });
      } catch (err) {
          console.log(err);
          return res.status(403).json({ success: false, message: err });
      }
    });

    app.patch('/api/companies/:companyId/members/:cmId', async (req, res, next) => {
        try{
            await companyService.updateCompanyMember(req);
            res.json({ success: true, message: 'UPDATED' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/companies/:companyId/members', async (req, res, next) => {
        try{
            const rows = await companyService.getCompanyMembers(req);
            res.json({ success: true, data: rows, message: 'success' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
  });

  app.delete('/api/companies/:companyId/members/:cmId', async (req, res, next) => {
    try{
        await companyService.deleteCompanyMember(req);
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
