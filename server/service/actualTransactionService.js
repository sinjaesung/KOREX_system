const { korexConn } = require('../database/connection');
const { defaultFilter, mapFilter } = require('../modules/filter');
const actualTransactionMapper = require('../mapper/actualTransaction');

module.exports = {
    async getActualTransactions(req) {
        return await korexConn(async (conn) => {
            const andList = [];
            const filterData = req.query.filter ? JSON.parse(req.query.filter) : {};

            if (!!filterData.default && !!filterData.default.exclusive_area) {
                const limitInt = Number(req.query.limit);
                const limit = !!limitInt && limitInt <= 50 ? limitInt : 20;
                const offset = !!req.query.page ? (Number(req.query.page) - 1) * limit : 0;
                const queryData = {
                    queryData: '',
                    atcId: conn.escape(req.params.atcId),
                    limit: `limit ${conn.escape(limit)}`,
                    offset: `offset ${conn.escape(offset)}`
                };

                // 무한스크롤에 사용될 부분
                if (!!req.query.before_atp_id) {
                    const order = 'contract_date';
                    const orList = [];
                    const beforeAtcomplex = await actualTransactionMapper.getActualTransactionByAtpId(conn, conn.escape(req.query.before_atp_id));
                    const compareValue = conn.escape(beforeAtcomplex[order]);
                    queryData.offset = '';
                    orList.push(`(atp_id < ${conn.escape(req.query.before_atp_id)} and ${conn.escapeId(order)} = ${compareValue})`); 
                    orList.push(`(${conn.escapeId(order)} < ${compareValue})`);
                    andList.push(`(${orList.join(' or ')})`);
                };

                const queryWhere = await defaultFilter(conn, filterData.default, false, andList);
                queryData.queryWhere = queryWhere.length > 0 ? `and ${queryWhere.join(' and ')}` : queryData.queryWhere;

                return await actualTransactionMapper.getActualTransactionAllByAtcId(conn, queryData);
            };
            throw 'LACK_OF_PARAMETER';
        });
    },
    async getActualTransactionComplexes(req, upConn) {
        const businessLogic = async (conn, req) => {
            const andList = [ 'x is not null' ];
            const filterData = req.query.filter ? JSON.parse(req.query.filter) : {};
            const special = filterData.special || {};
            const map = filterData.map || {};
            const order = req.query.order || 'atc_id';
            const orderType = req.query.order_type === 'asc' || req.query.order_type === 'desc' ? req.query.order_type : 'desc';
            const limitInt = Number(req.query.limit);
            const limit = !!limitInt && limitInt <= 50 ? limitInt : 20;
            const offset = !!req.query.page ? (Number(req.query.page) - 1) * limit : 0;
            const isMap = Number(req.query.is_map) === 1 && !!filterData.map;
            const queryData = {
                fields: !isMap ? [ 'atc.*' ] : ['atc.atc_id', 'atc.x', 'atc.y'],
                queryWhere: '',
                join: '',
                order: !isMap ? `order by ${conn.escapeId(order)} ${orderType}` : '',
                limit: !isMap ? `limit ${conn.escape(limit)}` : '',
                offset: !isMap ? `offset ${conn.escape(offset)}` : ''
            };

            if (!!isMap && map.map_level <= 3) {
                queryData.fields.push('transaction_type, contract_date, price, month_price, floor, transaction_count');
                queryData.join = queryData.join + `
                    inner join (
                        select *, count(*) as transaction_count from korex_pref.recently_actual_transaction2
                        group by atc_id
                    ) rat on atc.atc_id = rat.atc_id
                    inner join (
                        select * from korex_pref.actual_transaction
                        where atc_id is not null
                    ) atp
                    on rat.atp_id = atp.atp_id
                `;
            };

            if (!!special.search) {
                andList.push(`(
                    complex_name like ${conn.escape(`%${special.search}%`)} 
                    or addr_jibun like ${conn.escape(`%${special.search}%`)} 
                    or addr_road like ${conn.escape(`%${special.search}%`)}
                )`);
            };

            // 무한스크롤에 사용될 부분
            if (!!req.query.before_atc_id) {
                let compare;
                const orList = [];
                const beforeAtcomplex = await actualTransactionMapper.getActualTransactionComplexByAtcId(conn, conn.escape(req.query.before_atc_id));
                const compareValue = conn.escape(beforeAtcomplex[order]);
                queryData.offset = '';

                switch (orderType) {
                    case 'asc': compare = '>'; break;
                    case 'desc': compare = '<'; break;
                    default:
                };
                
                if (order !== 'atc_id') { 
                    orList.push(`(atc_id < ${conn.escape(req.query.before_atc_id)} and ${conn.escapeId(order)} = ${compareValue})`); 
                };

                orList.push(`(${conn.escapeId(order)} ${compare} ${compareValue})`);
                andList.push(`(${orList.join(' or ')})`);
            };
            
            const mapList = await mapFilter(conn, filterData.map, 'x', 'y', andList);
            const containsList = await defaultFilter(conn, filterData.contains, true, mapList);
            const queryWhere = await defaultFilter(conn, filterData.default, false, containsList);
            queryData.queryWhere = queryWhere.length > 0 ? `where ${queryWhere.join(' and ')}` : queryData.queryWhere;

            return await actualTransactionMapper.getActualTransactionComplexAll(conn, queryData);
        };

        if (!!upConn) { return await businessLogic(upConn, req); };
        return await korexConn(async (conn) => { return await businessLogic(conn, req); });
    },
    async getActualTransactionComplex(req) {
        return await korexConn(async (conn) => {
            const atcomplex = await actualTransactionMapper.getActualTransactionComplexByAtcId(conn, conn.escape(req.params.atcId));
            atcomplex.area_list = await actualTransactionMapper.getAreaByAtcId(conn, atcomplex.atc_id);
            
            return atcomplex;
        });
    }
};
