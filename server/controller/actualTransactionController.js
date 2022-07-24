const actualTransactionService = require('../service/actualTransactionService');

const init = (app) => {
    app.get('/api/atcomplexes/:atcId/actual-transaction', async(req, res, next) => {
        try{
            const rows = await actualTransactionService.getActualTransactions(req);
            res.json({ success: true, data: rows, message: 'success' });
        } catch (err){
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/atcomplexes', async(req, res, next) => {
      try{
          const rows = await actualTransactionService.getActualTransactionComplexes(req);
          res.json({ success: true, data: rows, message: 'success' });
      } catch (err){
          console.log(err);
          return res.status(403).json({ success: false, message: err });
      }
    });

    app.get('/api/atcomplexes/:atcId', async(req, res, next) => {
        try{
            const row = await actualTransactionService.getActualTransactionComplex(req);
            res.json({ success: true, data: row, message: 'success' });
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
