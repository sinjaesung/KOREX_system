const { korexConn } = require('../database/connection');
const { defaultFilter, mapFilter } = require('../modules/filter');
const { queryValue } = require('../modules/queryset');
const { register } = require('./awsService');
const realtorMapper = require('../mapper/realtor');

const calculateProScore = async (allCount, countByCompany, transactionCompleteCountByCompany) => {
    const registWeight = allCount > 100 ? 0.5 : 0.3;
    const completeWeight = countByCompany >10 ? 0.5 : 0.3;
    const registRate = (countByCompany / allCount) * registWeight;
    const completeRate = (transactionCompleteCountByCompany / countByCompany) * completeWeight;
    const proFigure = registRate + completeRate;
    
    if (0 < proFigure <= 0.1) { return 1 };
    if (0.1 < proFigure <= 0.4) { return 2 };
    if (0.4 < proFigure <= 0.6) { return 3 };
    if (0.6 < proFigure <= 0.9) { return 4 };
    if (0.9 < proFigure <= 1) { return 5 };
};

module.exports = {
    async setProRealtorApply(req) {
        return await korexConn(async (conn) => {
            try {
                if (req.files && req.body){
                    const createFields = [ 
                        'is_apply_office', 'is_apply_store', 'apply_apt_addr', 'apt_name', 'apply_oft_addr',
                        'oft_name', 'company_reg_path', 'realtor_reg_path','user_id', 'company_id' 
                    ];
                    const realtor = await realtorMapper.getRealtorByCompayId(conn.escape(req.params.companyId));
        
                    if (!!realtor) {
                        const [ company_reg_path, realtor_reg_path ] = await register(req.files);
                        req.body.company_reg_path = company_reg_path;
                        req.body.realtor_reg_path = realtor_reg_path;
                        const queryData = await queryValue(conn, req.body, 'create', createFields);
                        
                        conn.beginTransaction();
                        await realtorMapper.insertProRealtorApply(conn, queryData);
                        await realtorMapper.insertProRealtorPermission(conn, conn.escape(req.params.companyId));
                        conn.commit();

                        return;
                    };
                    throw 'NOT_FOUND_REALTOR'; 
                };
                throw 'NO_DATA';
            }
            catch (err) {
                conn.rollback();
                console.log(err);
                throw err;
            }
        });
    },
    async getProRealtor(req) {
        return await korexConn(async (conn) => {
            const companyId = conn.escape(req.params.companyId);
            const statusFilter1 = "prd_status = '거래완료'";
            const statusFilter2 = `(
                prd_status = '검토대기' or prd_status = '검토중'
            ) and prd_create_origin = '중개의뢰'`;
            const statusFilter3 = `(
                prd_status = '거래개시' or prd_status = '거래개시수정반영' or prd_status = '거래완료동의요청' 
                or prd_status = '거래완료동의요청거절' or prd_status = '거래완료' or prd_status = '위임취소' 
                or prd_status = '수임취소' or prd_status = '기한만료'
            )`;
            const statusFilter4 = `prd_create_origin = '중개의뢰'`
            const queryData = { fields: [ 'cp.*' ], join: '' };

            switch (req.params.type) {
                case 'company':
                    return await realtorMapper.getProRealtorByCompanyId(conn, queryData, companyId);
                case 'category':
                    return await realtorMapper.getProCategoryByCompanyId(conn, companyId);
                case 'product-count':
                    const completeCount = await realtorMapper.getProRealtorProductSelTypeCount(conn, statusFilter1, companyId);
                    const requestCount = await realtorMapper.getProRealtorProductSelTypeCount(conn, statusFilter2, companyId);
                    const allCount = await realtorMapper.getProRealtorProductSelTypeCount(conn, statusFilter3, companyId);
                    const requestAllCount = await realtorMapper.getProRealtorProductSelTypeCount(conn, statusFilter4, companyId);

                    return { 
                        complete_count: completeCount,
                        request_count: requestCount,
                        all_count: allCount,
                        request_all_count: requestAllCount
                    };
                case 'score':
                    return {
                        manner_score: await realtorMapper.getProRealtorMannerScore(conn, companyId),
                        pro_score: await calculateProScore(
                            await realtorMapper.getProRealtorAllProductCount(conn),
                            await realtorMapper.getProRealtorProductCountByCompanyId(conn, companyId),
                            await realtorMapper.getProRealtorProductCountByPrdStatus(conn, conn.escape(['거래완료']), companyId)
                        )
                    };
                case 'info':
                    const productCompleteCount = await realtorMapper.getProRealtorProductSelTypeCount(conn, statusFilter1, companyId);
                    const productStartCount = await realtorMapper.getProRealtorProductSelTypeCount(conn, statusFilter2, companyId);
                    const productAllCount = await realtorMapper.getProRealtorProductSelTypeCount(conn, statusFilter3, companyId);
                    const proCategory = await realtorMapper.getProCategoryByCompanyId(conn, companyId);
                    const proRealtor = await realtorMapper.getProRealtorByCompanyId(conn, queryData, companyId);
                    const result = {};

                    if (!!proRealtor) {
                        result.company = proRealtor;
                        result.pro_category = proCategory;
                        result.product_count = {
                            complete_count: productCompleteCount,
                            start_count: productStartCount,
                            all_count: productAllCount
                        };
                        result.score = {
                            manner_score: await realtorMapper.getProRealtorMannerScore(conn, companyId),
                            pro_score: await calculateProScore(
                                await realtorMapper.getProRealtorAllProductCount(conn),
                                await realtorMapper.getProRealtorProductCountByCompanyId(conn, companyId),
                                await realtorMapper.getProRealtorProductCountByPrdStatus(conn, conn.escape(['거래완료']), companyId)
                            )
                        };
                    };
                    
                    return result;
                default:
                    throw 'NOT_FOUND';
            };
        });
    },
    async getProRealtors(req, upConn) {
        const businessLogic = async (conn, req) =>{
            const andList = [];
            const filterData = req.query.filter ? JSON.parse(req.query.filter) : {};
            const pro = filterData.pro || {};
            const order = req.query.order || (!!filterData.map ? 'company_id' : 'manner_score');
            const orderType = req.query.order_type === 'asc' || req.query.order_type === 'desc' ? req.query.order_type : 'desc';
            const limitInt = Number(req.query.limit);
            const limit = !!limitInt && limitInt <= 50 ? limitInt : 20;
            const offset = !!req.query.page ? (Number(req.query.page) - 1) * limit : 0;
            const isMap = Number(req.query.is_map) === 1 && !!filterData.map;
            const queryData = {
                fields: [ 'cp.*' ],
                queryWhere: '',
                categoryWhere: '',
                join: '',
                order: !isMap ? `order by ${conn.escapeId(order)} ${orderType}, company_id desc` : '',
                limit: !isMap ? `limit ${conn.escape(limit)}` : '',
                offset: !isMap ? `offset ${conn.escape(offset)}` : ''
            };
    
            switch (pro.category) {
                case '아파트':
                    const aptQuery = pro.complex_id ? `and pro_apt_id = ${conn.escape(pro.complex_id)}` : '';
                    queryData.categoryWhere = `where pro_apt_id is not null ${aptQuery}`;
                    break;
                case '오피스텔':
                    const oftQuery = pro.complex_id ? `and pro_oft_id = ${conn.escape(pro.complex_id)}` : '';
                    queryData.categoryWhere = `where pro_oft_id is not null ${oftQuery}`;
                    break;
                case '상가': queryData.categoryWhere = 'where is_pro_store = 1'; break;
                case '사무실': queryData.categoryWhere = 'where is_pro_office = 1'; break;
                default:
            };

            if (!isMap) {
                queryData.fields.push(`
                    prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, 
                    replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun,
                    replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as oft_jibun,
                    ifnull(prd_complete_cnt.trade_complete_count, 0) as trade_complete_count,
                    ifnull(prd_complete_cnt.deposit_complete_count, 0) as deposit_complete_count,
                    ifnull(prd_complete_cnt.monthly_complete_count, 0) as monthly_complete_count,
                    ifnull(prd_all_cnt.trade_all_count, 0) as trade_all_count,
                    ifnull(prd_all_cnt.deposit_all_count, 0) as deposit_all_count,
                    ifnull(prd_all_cnt.monthly_all_count, 0) as monthly_all_count,
                    cast(cs.manner_score as unsigned) as manner_score
                `);
                queryData.join = `
                    inner join (
                        select cs_id, company_id, round(avg(cs_point)) as manner_score
                        from company_score
                        group by company_id
                    ) cs on cp.company_id = cs.company_id
                    left join complex cpx1
                    on prp.pro_apt_id = cpx1.complex_id
                    left join complex cpx2
                    on prp.pro_oft_id = cpx2.complex_id
                    left join (
                        select count(case when prd_sel_type = '매매' then prd_sel_type else null end) as trade_complete_count,
                        count(case when prd_sel_type = '전세' then prd_sel_type else null end) as deposit_complete_count,
                        count(case when prd_sel_type = '월세' then prd_sel_type else null end) as monthly_complete_count,
                        company_id from product
                        where prd_status = '거래완료'
                        group by company_id
                    ) prd_complete_cnt
                    on cp.company_id = prd_complete_cnt.company_id
                    left join (
                        select count(case when prd_sel_type = '매매' then prd_sel_type else null end) as trade_all_count,
                        count(case when prd_sel_type = '전세' then prd_sel_type else null end) as deposit_all_count,
                        count(case when prd_sel_type = '월세' then prd_sel_type else null end) as monthly_all_count,
                        company_id from product
                        where prd_status = '거래개시' or prd_status = '거래개시수정반영' or prd_status = '거래완료동의요청' or prd_status = '거래완료동의요청거절'
                        or prd_status = '거래완료' or prd_status = '위임취소' or prd_status = '수임취소' or prd_status = '기한만료'
                        group by company_id
                    ) prd_all_cnt
                    on cp.company_id = prd_all_cnt.company_id
                `;
            };

            // 무한스크롤에 사용될 부분
            if (!!req.query.before_company_id) {
                let compare;
                const orList = [];
                const beforeProRealtor = await realtorMapper.getProRealtorByCompanyId(conn, queryData, conn.escape(req.query.before_company_id));
                const compareValue = conn.escape(beforeProRealtor[order]);
                queryData.offset = '';

                switch (orderType) {
                    case 'asc': compare = '>'; break;
                    case 'desc': compare = '<'; break;
                    default:
                };
                
                if (order !== 'company_id') { 
                    orList.push(`(company_id < ${conn.escape(req.query.before_company_id)} and ${conn.escapeId(order)} = ${compareValue})`); 
                };

                orList.push(`(${conn.escapeId(order)} ${compare} ${compareValue})`);
                andList.push(`(${orList.join(' or ')})`);
            };
            
            const mapList = await mapFilter(conn, filterData.map, 'x', 'y', andList);
            const containsList = await defaultFilter(conn, filterData.contains, true, mapList);
            const queryWhere = await defaultFilter(conn, filterData.data, false, containsList);
            queryData.queryWhere = queryWhere.length > 0 ? `where ${queryWhere.join(' and ')}` : queryData.queryWhere;
            const proRealtors = await realtorMapper.getProRealtorAll(conn, queryData);
            const prdAllCount = await realtorMapper.getProRealtorAllProductCount(conn);
            const result = [];
        
            for (let i = 0; i < proRealtors.length; i++) {
                const proRealtor = proRealtors[i];
                
                if (!isMap) {
                    const prdAllCountByCompany = proRealtor.trade_all_count + proRealtor.deposit_all_count + proRealtor.monthly_all_count;
                    const prdCompleteCountByCompany = proRealtor.trade_complete_count + proRealtor.deposit_complete_count + proRealtor.monthly_complete_count;

                    result.push({
                        company: {
                            company_id: proRealtor.company_id,
                            company_name: proRealtor.company_name,
                            ceo_name: proRealtor.ceo_name,
                            ceo_phone: proRealtor.ceo_phone,
                            profile_img: proRealtor.profile_img,
                            addr_jibun: proRealtor.addr_jibun,
                            addr_road: proRealtor.addr_road,
                            addr_detail: proRealtor.addr_detail,
                            chat_key: proRealtor.chat_key,
                            x: proRealtor.x,
                            y: proRealtor.y
                        },
                        pro_category: {
                            pro_apt_id: proRealtor.pro_apt_id,
                            apt_name: proRealtor.apt_name,
                            apt_jibun: proRealtor.apt_jibun,
                            pro_oft_id: proRealtor.pro_oft_id,
                            oft_name: proRealtor.oft_name,
                            oft_jibun: proRealtor.oft_jibun,
                            is_pro_store: proRealtor.is_pro_store,
                            is_pro_office: proRealtor.is_pro_office
                        },
                        product_count: {
                            all_count: {
                                trade_count: proRealtor.trade_all_count,
                                deposit_count: proRealtor.deposit_all_count,
                                monthly_count: proRealtor.monthly_all_count
                            },
                            complete_count: {
                                trade_count: proRealtor.trade_complete_count,
                                deposit_count: proRealtor.deposit_complete_count,
                                monthly_count: proRealtor.monthly_complete_count
                            }
                        },
                        score: { 
                            manner_score: proRealtor.manner_score,
                            pro_score: await calculateProScore(prdAllCount, prdAllCountByCompany, prdCompleteCountByCompany)
                        }
                    });
                }
                else {
                    result.push({
                        company_id: proRealtor.company_id,
                        x: proRealtor.x,
                        y: proRealtor.y
                    })
                };
                
            };
    
            return result;
        };

        if (!!upConn) { return await businessLogic(upConn, req); };
        return await korexConn(async (conn) => { return await businessLogic(conn, req); });
    }
};
