const { korexConn } = require('../database/connection');
const { defaultFilter, mapFilter } = require('../modules/filter');
const { getCoordinateByAddress } = require('../modules/kakao');
const complexMapper = require('../mapper/complex');

module.exports = {
    async getComplex(req) {
        return await korexConn(async (conn) => {
            const queryData = { fields: [ 'cpx.*', 'bld.dong_cnt', 'bld.household_cnt' ], join: '' };
            const complex = await complexMapper.getComplexByComplexId(conn, queryData, conn.escape(req.params.complexId));
            complex.area_list = await complexMapper.getAreaByComplexId(conn, complex.complex_id);
            
            return complex;
        });
    },
    async getComplexes(req, upConn) {
        const businessLogic = async (conn, req) => {
            let compare;
            const andList = [ 'x is not null', 'is_lease = 0', 'complex_id = main_complex_id' ];
            const filterData = req.query.filter ? JSON.parse(req.query.filter) : {};
            const special = filterData.special || {};
            const order = req.query.order || 'complex_id';
            const orderType = req.query.order_type === 'asc' || req.query.order_type === 'desc' ? req.query.order_type : 'desc';
            const limitInt = Number(req.query.limit);
            const limit = !!limitInt && limitInt <= 50 ? limitInt : 20;
            const offset = !!req.query.page ? (Number(req.query.page) - 1) * limit : 0;
            const isMap = Number(req.query.is_map) === 1 && !!filterData.map;
            const queryData = {
                fields: !isMap ? [ 'cpx.*' ] : ['cpx.complex_id', 'cpx.x', 'cpx.y'],
                queryWhere: '',
                join: '',
                order: !isMap ? `order by ${conn.escapeId(order)} ${orderType}` : '',
                limit: !isMap ? `limit ${conn.escape(limit)}` : '',
                offset: !isMap ? `offset ${conn.escape(offset)}` : ''
            };

            // 검색 자동완성 리스트 요청시 응답 필드 값
            if (Number(req.query.auto_complete) === 1) { queryData.fields = [ 'complex_id', 'complex_name', 'addr_jibun', 'addr_road', 'bld_pk', 'x', 'y' ]; }; 

            if (!!special.search) {
                const keyword = special.search.replace(/(\s*)/g, '');
                andList.push(`(
                    replace(complex_name, ' ', '') like ${conn.escape(`%${keyword}%`)} 
                    or replace(addr_jibun, ' ', '') like ${conn.escape(`%${keyword}%`)} 
                    or replace(addr_road, ' ', '') like ${conn.escape(`%${keyword}%`)}
                )`);
            };

            // 무한스크롤에 사용될 부분
            if (!!req.query.before_complex_id) {
                const orList = [];
                const beforeComplex = await complexMapper.getComplexByComplexId(conn, { fields: [ 'cpx.*' ] }, conn.escape(req.query.before_complex_id));
                const compareValue = conn.escape(beforeComplex[order]);
                queryData.offset = '';

                switch (orderType) {
                    case 'asc': compare = '>'; break;
                    case 'desc': compare = '<'; break;
                    default:
                };
                
                if (order !== 'complex_id') { 
                    orList.push(`(complex_id < ${conn.escape(req.query.before_complex_id)} and ${conn.escapeId(order)} = ${compareValue})`); 
                };

                orList.push(`(${conn.escapeId(order)} ${compare} ${compareValue})`);
                andList.push(`(${orList.join(' or ')})`);
            };
            
            const mapList = await mapFilter(conn, filterData.map, 'x', 'y', andList);
            const containsList = await defaultFilter(conn, filterData.contains, true, mapList);
            const queryWhere = await defaultFilter(conn, filterData.default, false, containsList);
            queryData.queryWhere = queryWhere.length > 0 ? `where ${queryWhere.join(' and ')}` : queryData.queryWhere;

            return await complexMapper.getComplexAll(conn, queryData);
        };

        if (!!upConn) { return await businessLogic(upConn, req); };
        return await korexConn(async (conn) => { return await businessLogic(conn, req); });
    },
    async getBuildingsByComplexId(req) {
        return await korexConn(async (conn) => {
            return await complexMapper.getBuildingAllByComplexId(conn, conn.escape(req.params.complexId));
        });
    },
    async getHo(req) {
        return await korexConn(async (conn) => {
            return await complexMapper.getHoByHoId(conn, conn.escape(req.params.complexId), conn.escape(req.params.bldId), conn.escape(req.params.hoId));
        });
    },
    async getHoList(req) {
        return await korexConn(async (conn) => {
            const limit = `limit ${Number(req.query.limit) || 20}`;
            let queryWhere = `and ho_name like ${conn.escape(`%${req.query.ho_name}%`)}`;

            if (!!req.query.before_ho_id) {
                const beforeHo = await complexMapper.getHoByHoId(conn, conn.escape(req.params.complexId), conn.escape(req.params.bldId), conn.escape(req.query.before_ho_id));
                queryWhere = queryWhere + `and ho_name + 0 > ${beforeHo.ho_name} + 0`;
            };
            
            return await complexMapper.getHoAll(conn, queryWhere, conn.escape(req.params.complexId), conn.escape(req.params.bldId), limit);
        });
    },
    async getFloor(req) {
        return await korexConn(async (conn) => {
            let coordinate = await getCoordinateByAddress(req.query.addr_road);

            if (!coordinate.x) { coordinate = await getCoordinateByAddress(req.query.addr_jibun) };
            if (!coordinate.x) { throw 'NOT_FOUND'; };

            const jibun = req.query.addr_jibun ? req.query.addr_jibun.split(' ') : null;
            const bldNo = req.query.addr_road ? req.query.addr_road.split(' ') : null;
            const jibunArray = jibun ? jibun.reverse()[0].split('-') : [];
            const bldNoArray = bldNo ? bldNo.reverse()[0].split('-') : [];
            const value = {
                sggCode: req.query.sgg_code,
                dongCode: req.query.dong_code ? req.query.dong_code.slice(-5) : null,
                bun: Number(jibunArray[0]) ? Number(jibunArray[0]) : null,
                ji : Number(jibunArray[1]) ? Number(jibunArray[1]) : 0,
                roadCode: req.query.sgg_code && req.query.road_code ? req.query.sgg_code + req.query.road_code : null,
                mainNo: Number(bldNoArray[0]) ? Number(bldNoArray[0]) : null,
                subNo: Number(bldNoArray[1]) ? Number(bldNoArray[1]) : 0
            };
            const floor = await complexMapper.getPyojaebuFloor(conn, value);
            Object.assign(floor, coordinate);

            return floor;
        });     
    }
};
