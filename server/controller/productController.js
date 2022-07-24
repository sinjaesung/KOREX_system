const productService = require('../service/productService');

const init = (app) =>{
    app.get('/api/products/check/exclusive', async (req, res, next) => {
        try{
            const row = await productService.checkExclusiveProduct(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/product/like',async(req,res,next)=> {
        try{
            var rows = await productService.getProductLikeList(req);
            console.log('likes produc tlikes rowsss:',rows);
            res.json({success:true, data:rows,message:'success return all banner data list'});
        }catch(err){
            console.log(err);
            return res.status(403).json({success:false, message:err});
        }
    });

    app.post('/api/products', async (req, res, next) => {
        try{
            const row = await productService.setProduct(req);
            res.json({ success: true, data: row, message: 'CREATE' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.patch('/api/products/:prdId', async (req, res, next) => {
        try{
            await productService.updateProduct(req);
            res.json({ success: true, message: 'UPDATE' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/products/:prdId', async (req, res, next) => {
        try{
            const row = await productService.getProduct(req);
            res.json({ success: true, data: row, message: 'success' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.get('/api/products', async (req, res, next) => {
        try{
            const { rows, count } = await productService.getProducts(req);
            res.json({ success: true, count: count, data: rows,  message: 'success' });
        } catch (err) {
            console.log(err);
            return res.status(403).json({ success: false, message: err });
        }
    });

    app.delete('/api/products/:prdId', async (req, res, next) => {
        try{
            await productService.deleteProduct(req);
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
