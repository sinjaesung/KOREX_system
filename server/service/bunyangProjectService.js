const { korexConn } = require('../database/connection');
const { defaultFilter, mapFilter } = require('../modules/filter');
const bunyangProjectMapper = require('../mapper/bunyangProject');

const getDateTime = (datetime) => {
  const year = datetime.getFullYear();
  const month = ('0' + (datetime.getMonth() + 1)).slice(-2);
  const day = ('0' + datetime.getDate()).slice(-2);
  const hours = ('0' + datetime.getHours()).slice(-2); 
  const minutes = ('0' + datetime.getMinutes()).slice(-2);
  const seconds = ('0' + datetime.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = {
    async getBunyangProjects(req, upConn) {
        const businessLogic = async (conn, req) => {
            let compare;
            const today = await getDateTime(new Date());
            const andList = [ 'state = 1' ];
            const filterData = req.query.filter ? JSON.parse(req.query.filter) : {};
            const special = filterData.special || {};
            const order = req.query.order || 'bp_id';
            const orderType = req.query.order_type === 'asc' || req.query.order_type === 'desc' ? req.query.order_type : 'desc';
            const limitInt = Number(req.query.limit);
            const limit = !!limitInt && limitInt <= 50 ? limitInt : 20;
            const offset = !!req.query.page ? (Number(req.query.page) - 1) * limit : 0;
            const isMap = Number(req.query.is_map) === 1 && !!filterData.map;
            const queryData = {
                fields: !isMap ? [ 'bp.*', 'lv.live_checked', 'lv.live_date', 'null as reg_mng_id', 'null as mod_mng_id' ] : [ 'bp.bp_id', 'bp.x', 'bp.y' ],
                queryWhere: '',
                join: '',
                order: !isMap ? `order by ${conn.escapeId(order)} ${orderType}` : '',
                limit: !isMap ? `limit ${conn.escape(limit)}` : '',
                offset: !isMap ? `offset ${conn.escape(offset)}` : ''
            };

            if (!!special.search) {
                const keyword = special.search.replace(/(\s*)/g, '');
                andList.push(`(
                    replace(bp_name, ' ', '') like ${conn.escape(`%${keyword}%`)} 
                    or replace(bp_addr_jibun, ' ', '') like ${conn.escape(`%${keyword}%`)} 
                    or replace(bp_addr_road, ' ', '') like ${conn.escape(`%${keyword}%`)}
                )`);
            };

            if (Number(req.query.is_team) === 1) {
                queryData.join = queryData.join + `
                    inner join company_member cm on cm.bp_id = bp.bp_id
                    inner join (
                        select * from user where mem_id = ${req.session.user_id}
                    ) u on u.mem_id = cm.mem_id
                `;
            };

            // 무한스크롤에 사용될 부분
            if (!!req.query.before_bp_id) {
                const orList = [];
                const beforeBunyang = await bunyangProjectMapper.getBunyangProjectByBpId(conn, today, '', conn.escape(req.query.before_bp_id));
                const compareValue = conn.escape(beforeBunyang[order]);
                queryData.offset = '';

                switch (orderType) {
                    case 'asc': compare = '>'; break;
                    case 'desc': compare = '<'; break;
                    default:
                };
                
                if (order !== 'bp_id') { 
                    orList.push(`(bp_id < ${conn.escape(req.query.before_bp_id)} and ${conn.escapeId(order)} = ${compareValue})`); 
                };

                orList.push(`(${conn.escapeId(order)} ${compare} ${compareValue})`);
                andList.push(`(${orList.join(' or ')})`);
            };
            
            const mapList = await mapFilter(conn, filterData.map, 'bp_x', 'bp_y', andList);
            const containsList = await defaultFilter(conn, filterData.contains, true, mapList);
            const queryWhere = await defaultFilter(conn, filterData.default, false, containsList);
            queryData.queryWhere = queryWhere.length > 0 ? `where ${queryWhere.join(' and ')}` : queryData.queryWhere;

            return await bunyangProjectMapper.getBunyangProjectAll(conn, queryData, today);
        };

        if (!!upConn) { return await businessLogic(upConn, req); };
        return await korexConn(async (conn) => { return await businessLogic(conn, req); });
    },
    async getBunyangProject(req) {
        return korexConn(async (conn) => {
            const today = await getDateTime(new Date());
            const bpId = conn.escape(req.params.bpId);
            let join = `
                left join (
                    select bp_id,
                    count(case when tr_type = 1 then tr_type else null end) as resv_visit_count,
                    count(case when tr_type = 2 then tr_type else null end) as resv_live_count
                    from tourReservation
                    where (tr_type = 1 or tr_type = 2) and bp_id = ${bpId}
                ) resv on bp.bp_id = resv.bp_id
                left join (
                    select bp_id, count(*) as is_like from likes 
                    where bp_id = ${bpId} and mem_id = ${conn.escape(req.session.user_id)}
                ) lk on bp.bp_id = lk.bp_id
            `;

            return await bunyangProjectMapper.getBunyangProjectByBpId(conn, today, join, bpId);
        });
    }
};