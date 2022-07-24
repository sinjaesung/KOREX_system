module.exports = {

    async getTermTitleList(conn,queryData) {
        const { terms_type } = queryData
        let res = await conn.query(`select * from terms where terms_type=${terms_type}`);
        return res[0];
    },
    async getTerm(conn,queryData) {
        const { terms_id,terms_type } = queryData
        let res = await conn.query(`select * from terms where terms_type=${terms_type} and terms_id=${terms_id}`);
        return res[0];
    }
};
