const { korexConn } = require('../database/connection');
const { defaultFilter, rangeFilter, mapFilter } = require('../modules/filter');
const { delObjects } = require('../modules/fileuploadModule');
const { queryValue } = require('../modules/queryset');
const productMapper = require('../mapper/product');

const getEndDate = (startDate, periods) => {
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + periods);

    return endDate;
};

module.exports = {
    async checkExclusiveProduct(req) {
        return await korexConn(async (conn) => {
            let queryWhere = '';

            if (req.query.category === '아파트' || req.query.category === '오피스텔') {
                queryWhere = `and bld_id = ${conn.escape(req.query.bld_id)} and ho_id = ${conn.escape(req.query.ho_id)}`;
            };
            if (req.query.category === '상가' || req.query.category === '사무실') {
                queryWhere = `
                    and addr_jibun = ${conn.escape(req.query.addr_jibun)} 
                    and addr_road = ${conn.escape(req.query.addr_road)}
                    and flr_type = ${conn.escape(req.query.flr_type)}
                    and floorint = ${conn.escape(req.query.floor)}
                `;
            };

            if (!!queryWhere) {
                const row = await productMapper.existsExclusiveProduct(conn, queryWhere);

                return !!row && row.prd_id ? true : false;
            };
            throw 'NOT_FOUND_CATEGORY';
        });
    },
    async getProductLikeList(req){
        return await korexConn(async (conn) => {
            const { sort, live ,mem_id }=req.query; 
            let queryWhere = "";
            
            queryWhere += ` where li.mem_id='${mem_id}' and li.prd_identity_id != 0 `
            
            switch(sort){
                case "1" : queryWhere += ' order by li.modify_date DESC  '; break;
                case "2" : queryWhere += ' order by p.prd_price DESC  '; break;
                case "3" : queryWhere += ' order by p.prd_price ASC  '; break;
                case "4" : queryWhere += ' order by p.supply_pyeong DESC  '; break;
                case "5" : queryWhere += ' order by p.supply_pyeong ASC  '; break;
                case "6" : queryWhere += ' order by p.prd_name DESC'; break;
                default : " order by li.modify_date DESC  ";
            }

            queryWhere += live == 1 ? "" : "";

            return await productMapper.getProductLikeList(conn, queryWhere, mem_id);
        });
    },
    async setProduct(req) {
        return await korexConn(async (conn) => {
            const exceptionKeys = [ 'folder' ];
            const createFields = await productMapper.getProductFields('create');
            const allFields = await productMapper.getProductFields('all');
            const prdImgs = !!req.body.prd_imgs ? req.body.prd_imgs.split(',') : [];
            const queryData = await queryValue(conn, req.body, 'create', createFields, exceptionKeys);

            try {
                await conn.beginTransaction();
                const prdId = await productMapper.insertProduct(conn, queryData);
                await productMapper.insertProductModifyHistoryByPrdId(conn, allFields, conn.escape('매물등록'), prdId);
                await conn.commit();

                return { prd_id: prdId };
            }
            catch (err) {
                if (prdImgs.length > 0) { await delObjects(prdImgs); };
                conn.rollback();
                throw err;
            }
        });
    },
    async updateProduct(req) {
        return await korexConn(async (conn) => {
            const exceptionKeys = [ 'folder' ];
            const updateFields = await productMapper.getProductFields('update');
            const allFields = await productMapper.getProductFields('all');
            const beforeProduct = await productMapper.getProductByPrdId(conn, { fields: [ 'prd.*' ], productFields: allFields, join: '' }, req.params.prdId);
            const beforeImgs = !!beforeProduct.prd_imgs ? beforeProduct.prd_imgs.split(',') : [];
            const prdImgs = !!req.body.prd_imgs ? req.body.prd_imgs.split(',') : [];
            const deleteImgs = [];
            const addImgs = [];
            let historyType = !!req.body.prd_status && req.body.prd_status !== beforeProduct.prd_status ? '상태변경' : '매물수정';

            for (let i = 0; i < beforeImgs.length; i++) { if (prdImgs.length > 0 && prdImgs.indexOf(beforeImgs[i]) === -1) { deleteImgs.push(beforeImgs[i]); }; };
            for (let i = 0; i < prdImgs.length; i++) { if (beforeImgs.indexOf(prdImgs[i]) === -1) { addImgs.push(prdImgs[i]); }; };

            switch (req.body.prd_status) {
                case '수정반영요청':
                    const exclusiveEndDate = await getEndDate(new Date(beforeProduct.exclusive_start_date), req.body.exclusive_periods);
                    req.body.exclusive_end_date = exclusiveEndDate;
                    Object.assign(beforeProduct, req.body)
                    const queryData = await queryValue(conn, beforeProduct, 'update', allFields, exceptionKeys);
                    queryData.column = [ ...queryData.column, 'history_type' ];
                    queryData.value = [ ...queryData.value, conn.escape('매물수정대기')];
                    await productMapper.insertProductModifyHistory(conn, queryData);
                    return;
                case '거래개시수정반영':
                    historyType = '상태변경,매물수정'
                    const queryWhere = `where prd_id = ${conn.escape(req.params.prdId)} and prd_status = '수정반영요청' and modify_date = ${conn.escape(beforeProduct.modify_date)}`;
                    const standbyProduct = await productMapper.getProductHistory(conn, updateFields, queryWhere);
                    standbyProduct.prd_status = req.body.prd_status
                    req.body = standbyProduct;
                    break;
                case '거래개시':
                    const exclusivePeriods = Number(req.body.exclusive_periods);
                    const compareExclusiveStatus = req.body.prd_status === beforeProduct.prd_status;

                    if (!!req.body.exclusive_periods && !exclusivePeriods) { throw 'INVALID_VALUE_TYPE' };

                    if (!compareExclusiveStatus) {
                        req.body.exclusive_status = 1;
                        req.body.exclusive_start_date = new Date();
                        req.body.exclusive_end_date = await getEndDate(req.body.exclusive_start_date, beforeProduct.exclusive_periods);
                    };

                    if (!!compareExclusiveStatus && (exclusivePeriods !== beforeProduct.exclusive_periods)) {
                        req.body.exclusive_end_date = await getEndDate(new Date(beforeProduct.exclusive_start_date), exclusivePeriods);
                    };
                    
                    break;
                default:
            };
            
            const setData = await queryValue(conn, req.body, 'update', updateFields, exceptionKeys);

            try {
                await conn.beginTransaction();
                const update = await productMapper.updateProduct(conn, setData.join(','), req.params.prdId);
            
                if (update.changedRows > 0) {
                    await productMapper.insertProductModifyHistoryByPrdId(conn, allFields, conn.escape(historyType), req.params.prdId);
                };

                await conn.commit();   
            }
            catch (err) {
                if (addImgs.length > 0) { await delObjects(addImgs); };
                conn.rollback();
                throw err;
            }

            if (deleteImgs.length > 0) { await delObjects(deleteImgs); };
    
            return;
        });
    },
    async getProduct(req) {
        return await korexConn(async (conn) => {
            const fieldType = Number(req.query.prd_field_all) === 1 ? 'all' : 'public';
            const queryData = {
                fields: [ 'prd.*' ],
                productFields: await productMapper.getProductFields(fieldType),
                join: ``
            };

            if (req.query.mem_id) {
                queryData.productFields.push(`(
                    select count(*) from likes where prd_identity_id = prd.prd_id
                    and mem_id = ${conn.escape(req.query.mem_id)}
                ) as isLike`);
            };

            if (fieldType === 'public') {
                queryData.fields = [ ...queryData.fields, ...[ 'bld.*', 'cpx.*' ] ];
                queryData.join = queryData.join + `
                    left join buildings bld
                    on prd.bld_id = bld.bld_id
                    left join complex cpx
                    on bld.complex_id = cpx.complex_id
                `;
            };

            const product = await productMapper.getProductByPrdId(conn, queryData, conn.escape(req.params.prdId));

            if (!!product) {
                const queryWhere = `where prd_id = ${conn.escape(req.params.prdId)} and prd_status = '수정반영요청' and modify_date = ${conn.escape(product.modify_date)}`;
                const standbyProduct = await productMapper.getProductHistory(conn, queryData.productFields, queryWhere);

                if (!!standbyProduct) { standbyProduct.current_product = product };

                return standbyProduct || product;
            };
            
            return {};  
        });
    },
    async getProducts(req, upConn) {
        const businessLogic = async (conn, req) => {
            const andList = [];
            const fieldType = req.query.prd_field_all === '1' ? 'all' : 'public';
            const publicPrdStatus = [ '거래개시', '거래개시수정반영', '거래완료동의요청', '거래완료동의요청거절' ]; // 본래는 api 요청시 값을 넘겨 받아야 되는데 맵부분 물건 조회 때는 약간의 실수도 방지하기 위해 필터될 상태변경 값 미리 디폴트로 셋팅 해둠
            const filterData = !!req.query.filter ? JSON.parse(req.query.filter) : {};
            const data = filterData.default || {};
            const order = req.query.order || (fieldType === 'public' ? 'permission_state' : 'prd_id');
            const orderType = req.query.order_type === 'asc' || req.query.order_type === 'desc' ? req.query.order_type : 'desc';
            const limitInt = Number(req.query.limit);
            const limit = !!limitInt && limitInt <= 50 ? limitInt : 20;
            const offset = !!req.query.page ? (Number(req.query.page) - 1) * limit : 0;
            const isMap = Number(req.query.is_map) === 1 && !!filterData.map;
            const queryData = {
                fields: !isMap ? [ '*' ] : [ 'prd_id', 'prd_latitude', 'prd_longitude' ],
                joinFields: [  'prd.*' ],
                productFields: await productMapper.getProductFields(fieldType),
                join: '',
                queryWhere: '',
                order: !isMap ? `order by ${conn.escapeId(order)} ${orderType}, prd_id desc` : '',
                subOrder: '',
                limit: !isMap ? `limit ${conn.escape(limit)}` : '',
                offset: !isMap ? `offset ${conn.escape(offset)}` : ''
            };
            
            // 로그인사용자별 물건 좋아요 활성 여부
            if (req.query.mem_id) {
                queryData.fields.push(`(
                    select count(*) from likes where prd_identity_id = prd_id
                    and mem_id = ${conn.escape(req.query.mem_id)}
                ) as isLike`);
            };

            // 검색 자동완성 리스트 요청시 응답 필드 값
            if (Number(req.query.auto_complete) === 1) { queryData.fields = [ 'prd_id', 'prd_name', 'prd_longitude', 'prd_latitude' ]; };

            // 특별 범위 필터 (예: "물건거래타입 + 거래타입별 가격 범위" 처럼 묶어서 필터링 하는 경우)
            if (!!data.prd_sel_type && filterData.special_range && filterData.special_range.constructor === Object) {
                const specialList = [];
                const selTypeList = [ ...data.prd_sel_type ];
                const { trade, deposit, monthly } = filterData.special_range;
                data.prd_sel_type = null;

                // 물건거래타입 + 거래타입별 가격 범위
                for (let i = 0; i < selTypeList.length; i++) {
                    let specialRangeQuery = '';
                    const selTypeQuery = `prd_sel_type = ${conn.escape(selTypeList[i])}`;

                    switch (selTypeList[i]) {
                        case '매매':
                            if (!!trade) { specialRangeQuery = await rangeFilter(conn, { prd_price: trade }, []); };
                            specialList.push(`(${selTypeQuery} ${specialRangeQuery.length > 0 ? `and ${specialRangeQuery.join(' and ')}` : ''})`);
                            break;
                        case '전세':
                            if (!!deposit) { specialRangeQuery = await rangeFilter(conn, { prd_price: deposit }, []); };
                            specialList.push(`(${selTypeQuery} ${specialRangeQuery.length > 0 ? `and ${specialRangeQuery.join(' and ')}` : ''})`);
                            break;
                        case '월세':
                            if (!!monthly) { specialRangeQuery = await rangeFilter(conn, { prd_price: deposit, prd_month_price: monthly }, []); };
                            specialList.push(`(${selTypeQuery} ${specialRangeQuery.length > 0 ? `and ${specialRangeQuery.join(' and ')}` : ''})`);
                            break;
                        default:
                    };
                };

                andList.push(`(${specialList.join(' or ')})`);
            };

            // 지도부분에서 물건 조회할 경우에는 public, 마이페이지에서 물건 조회할 경우에는 all
            switch (fieldType) {
                case 'public': 
                    data.prd_status = publicPrdStatus;
                    
                    if (!req.query.auto_complete) { queryData.fields.push('null as prd_status'); };

                    if (!isMap) {
                        queryData.fields.push('null as permission_state');
                        queryData.joinFields.push('prp.permission_state');
                        queryData.join = queryData.join + `
                            left join buildings bld on prd.bld_id = bld.bld_id
                            left join complex cpx on bld.complex_id = cpx.complex_id
                            left join (
                                select * from pro_realtor_permission where permission_state = '승인'
                            ) prp on (cpx.complex_id = prp.pro_oft_id and prd.company_id = prp.company_id)
                            or (cpx.complex_id = prp.pro_apt_id and prd.company_id = prp.company_id)
                        `
                    }; 
                    break;
                case 'all':
                    let notiset;
                    let companyQuery = '';

                    if (!req.query.auto_complete) { queryData.fields.push('prd_status2 as prd_status'); };
                    // 회원인증 방식 jwt token으로 변경시 변경될 예정(현재는 임시로 사용) //
                    if (!!data.company_id) { notiset = 'brokerprd'; companyQuery = `and company_id = ${conn.escape(data.company_id)}`; };
                    if (!!data.request_company_id) { notiset = 'prd'; companyQuery = `and company_id = ${conn.escape(data.reqiest_company_id)}`; };
                    if (!!data.request_mem_id) { notiset = 'prd'; };
                    ////////////////////////////////////////////////////////////////////

                    if (!!data.company_id || !!data.request_company_id || !!data.request_mem_id) {
                        // 물건별 알림셋팅 여부
                        queryData.fields.push(`(
                            select count(*) from notificationSetting
                            where mem_id = ${conn.escape(req.query.mem_id)} ${companyQuery} and notiset_${notiset} = 1 
                            and concat(',', notiset_${notiset}_part, ',') like concat('%,', prd_id, ',%')
                        ) as is_notification`);
                    };
                    
                    queryData.joinFields.push('pmh.history_create_date', 'pmh.prd_status as prd_status2');
                    queryData.join = queryData.join + `
                        inner join (
                            select * from (
                                select prd_id, history_create_date, prd_status from product_modify_history
                                where history_type = '매물등록' or history_type like '%상태변경%'
                                order by history_create_date desc
                                limit 18446744073709551615
                            ) pmh1
                            group by prd_id
                        ) pmh on prd.prd_id = pmh.prd_id
                    `;
                    break;
                default:
            };
        
            switch (order) {
                case 'prd_price': queryData.subOrder = `, prd_price - prd_month_price ${orderType}`.replace(/'/g, ''); break;
                default:      
            };

            // 무한스크롤에 사용될 부분
            if (!!req.query.before_prd_id) {
                let compare;
                let subLogic = '', subColumn = ``, subCompare1 = '', subCompare2 = '' , subValue = '';
                const orList = [];
                const beforeProduct = await productMapper.getProductByPrdId(conn, queryData, conn.escape(req.query.before_prd_id));
                const compareValue = conn.escape(beforeProduct[order]);
                queryData.offset = '';

                switch (orderType) {
                    case 'asc': compare = '>'; break;
                    case 'desc': compare = '<'; break;
                    default:
                };    
                
                if (order === 'prd_price') { 
                    subLogic = 'and';
                    subColumn = 'prd_price - prd_month_price';
                    subCompare1 = '=';
                    subCompare2 = compare;
                    subValue = conn.escape(beforeProduct.prd_price - beforeProduct.prd_month_price); 
                };
                if (order !== 'prd_id') { 
                    orList.push(`(
                        prd_id < ${conn.escape(req.query.before_prd_id)} 
                        and ${conn.escapeId(order)} = ${compareValue} ${subLogic} ${subColumn} ${subCompare1} ${subValue}
                    )`); 
                };

                orList.push(`(${conn.escapeId(order)} ${compare} ${compareValue} ${subLogic} ${subColumn} ${subCompare2} ${subValue})`);
                andList.push(`(${orList.join(' or ')})`);
            };
          
            const mapList = await mapFilter(conn, filterData.map, 'prd_longitude', 'prd_latitude', andList); // 지도 필터
            const rangeList = await rangeFilter(conn, filterData.range, mapList); // 범위 필터
            const containsList = await defaultFilter(conn, filterData.contains, true, rangeList); // 기본 필터(contains)
            const queryWhere = await defaultFilter(conn, data, false, containsList); // 기본 필터
            queryData.queryWhere = queryWhere.length > 0 ? `where ${queryWhere.join(' and ')}` : queryData.queryWhere;
            const result = { rows: await productMapper.getProductAll(conn, queryData) };

            if (fieldType === 'all' && req.query.auto_complete !== '1') { 
                result.count = await productMapper.getProductAllCount(conn, queryData); 
            };
            return result;
        };
            
        if (!!upConn) { return await businessLogic(upConn, req); }; // 지도 조회시 db 한번만 연결하기 위해
        return await korexConn(async (conn) => { return await businessLogic(conn, req); });
    },
    async deleteProduct(req) {
        return korexConn(async (conn) => {
            const row = productMapper.deletePorduct(conn.escape(req.params.prdId));

            if (row.affectedRows === 0) { throw "DATA_DOESN'T_EXISTS"; };
            return;
        });
    }
};
