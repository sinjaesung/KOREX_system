const { korexConn } = require('../database/connection');
const { queryValue } = require('../modules/queryset');
const { register } = require('./awsService');
const userMapper = require('../mapper/user');

module.exports = {
    async existsUser(req) {
        return await korexConn(async (conn) => {
            let queryWhere = '';
            const userType = req.query.user_type;
            
            switch (userType) {
                case '개인': 
                    if (!req.query.email) { throw 'NO_EMAIL_VALUE'; };
                    queryWhere = queryWhere + `where email = ${conn.escape(req.query.email)} and user_type = ${conn.escape(userType)} and is_deleted = 0`;
                    break;
                default:
                    if (userType === '기업' || userType === '중개사' || userType === '분양대행사') {
                        if (!req.query.phone) { throw 'NO_PHONE_VALUE'; };
                        queryWhere = queryWhere + `where phone = ${conn.escape(req.query.phone)} and user_type = ${conn.escape(userType)} and is_deleted = 0`;
                    } else {
                        throw 'NOT_FOUND_USERTYPE';
                    };
            };

            const user = await userMapper.getUser(conn, [ 'mem_id' ], queryWhere);

            return !!user ? true : false;
        });
    },
    async setUser(req) {
        return await korexConn(async (conn) => {
            const createFields = await userMapper.getUserFields('create');
            const queryData = await queryValue(conn, req.body, 'create', createFields);

            return await userMapper.insertUser(conn, queryData);
        });
    },
    async updateUser(req) {
        return await korexConn(async (conn) => {
            if (req.files) {
                const img = await register(req.files);
                req.body.mem_img = img.join(',');
            };

            const exceptionKeys = [ 'folder' ];
            const updateFields = await userMapper.getUserFields('update');
            const setData = await queryValue(conn, req.body, 'update', updateFields, exceptionKeys);

            return await userMapper.updateUser(conn, setData, conn.escape(req.params.memId));
        });
    },
    async getUser(req, upConn) {
        const businessLogic = async (conn, req) => {
            const fields = await userMapper.getUserFields('find');
            const queryWhere = `where mem_id = ${conn.escape(req.params.memId)} and is_deleted = 0`;

            return await userMapper.getUser(conn, fields, queryWhere);
        };
        
        if (!!upConn) { return await businessLogic(upConn, req); };
        return await korexConn(async (conn) => { return await businessLogic(conn, req); });
    },
    async deleteUser(req) {
        return korexConn(async (conn) => {
            const row = userMapper.updateUser(conn, 'is_deleted = 1', conn.escape(req.params.memId));

            if (row.changedRows === 0) { throw "DATA_DOESN'T_EXISTS"; };
            return;
        });
    }
};
