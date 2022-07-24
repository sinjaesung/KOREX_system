const likesMapper = require('../mapper/likes');
module.exports = {
    async toggleLikes(req){
        // const { bp_id , tr_type , search, order, sort ,tour_id, mem_id}=req.query; 

        return await likesMapper.toggleLikes(req.body);

    },

}