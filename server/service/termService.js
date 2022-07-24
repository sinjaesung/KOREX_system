const { korexConn } = require('../database/connection');
const termMapper = require('../mapper/term');

module.exports = {
    async getTermTitleList(req) {
        return  await korexConn(async (conn) => { return await termMapper.getTermTitleList(conn,req.query); })
    },
    async getTerm(req) {
        return  await korexConn(async (conn) => { return await termMapper.getTerm(conn,req.query); })
    },
};
