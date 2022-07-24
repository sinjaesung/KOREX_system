const { korexConn } = require('../database/connection');
const { queryValue } = require('../modules/queryset');
const { register } = require('./awsService');
const companyMapper = require('../mapper/company');

module.exports = {
    async existsCompany(req) {
        return await korexConn(async (conn) => {
            const queryWhere = `where company_no = ${conn.escape(req.query.company_no)}`;
            const company = await companyMapper.getCompany(conn, [ 'company_id' ], queryWhere);
    
            return !!company ? true : false;
        });
    },
    async setCompany(req) {
        return await korexConn(async (conn) => {
            const createFields = await companyMapper.getCompanyFields('create');
            const queryData = await queryValue(conn, req.body, 'create', createFields);

            return await companyMapper.insertCompany(conn, queryData);
        });
    },
    async updateCompany(req) {
        return await korexConn(async (conn) => {
            if (req.files) {
                const img = await register(req.files);
                req.body.profile_img = img.join(',');
            };

            const exceptionKeys = [ 'folder' ];
            const updateFields = await companyMapper.getCompanyFields('update');
            const setData = await queryValue(conn, req.body, 'update', updateFields, exceptionKeys);

            return await companyMapper.updateCompany(conn, setData, conn.escape(req.params.companyId));
        });
    },
    async getCompany(req) {
        return await korexConn(async (conn) => {
            const fields = await companyMapper.getCompanyFields('find');
            const queryWhere = `where company_id = ${conn.escape(req.params.companyId)}`;

            return await companyMapper.getCompany(conn, fields, queryWhere);
        });
    },
    async getCompaniesByMemId(req) {
        return await korexConn(async (conn) => {
            const fields = [ 'company_id', 'company_name', 'profile_img' ];
            return await companyMapper.getCompanyAllByMemId(conn, fields, conn.escape(req.params.memId));
        });
    },
    async setCompanyMember(req) {
        return await korexConn(async (conn) => {
            req.body.company_id = req.params.companyId;
            const createFields = await companyMapper.getCompanyMemberFields('create');
            const queryData = await queryValue(conn, req.body, 'create', createFields);

            return await companyMapper.insertCompanyMember(conn, queryData);
        });
    },
    async updateCompanyMember(req) {
        return await korexConn(async (conn) => {
            const updateFields = await companyMapper.getCompanyMemberFields('update');
            const setData = await queryValue(conn, req.body, 'update', updateFields);

            return await companyMapper.updateCompanyMember(conn, setData, conn.escape(req.params.companyId), conn.escape(req.params.cmId));
        });
    },
    async getCompanyMembers(req) {
        return await korexConn(async (conn) => {
            let queryWhere = `where company_id = ${conn.escape(req.params.companyId)}`;
    
            if (req.query.bp_id) {
              queryWhere = queryWhere + ` and bp_id = ${conn.escape(req.query.bp_id)}`;
            };

            return await companyMapper.getCompanyAllMember(conn, queryWhere);
        });
    },
    async deleteCompanyMember(req) {
        return korexConn(async (conn) => {
            const row = companyMapper.deleteCompanyMember(conn.escape(req.params.memId));

            if (row.affectedRows === 0) { throw "DATA_DOESN'T_EXISTS"; };
            return;
        });
    }
};
