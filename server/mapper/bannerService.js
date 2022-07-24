const bannerMapper = require('../mapper/banner');

module.exports = {
    async getBannerList(req){
        const { banId }=req.query; 
        var queryWhere = "";
        if(banId){
            queryWhere += ` where ban_id = ${banId}`;
        }
        return await bannerMapper.getBannerList(queryWhere);
    },
}