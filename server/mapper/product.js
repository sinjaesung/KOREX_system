module.exports = {
    async getProductFields(type) { // all: 전체, create: 물건 등록에 필요한 컬럼, update: 물건 수정에 필요한 컬럼, public: 민감정보를 뺀 나머지
        const defaultFields = [
            'prd_name', 'prd_sel_type', 'prd_imgs', 'prd_price', 'prd_month_price', 'supply_area', 'exclusive_area', 
            'supply_pyeong', 'exclusive_pyeong', 'room_structure', 'bathroom_count', 'room_count', 'direction', 'entrance', 'heat_fuel_type', 
            'heat_method_type', 'managecost', 'include_managecost', 'ibju_specifydate', 'request_message', 'prd_description', 'prd_description_detail', 
            'prd_usage', 'is_immediate_ibju', 'is_managecost', 'is_elevator', 'is_parking', 'is_pet', 'is_duplex_floor', 'is_toilet', 'is_interior', 
            'is_rightprice', 'storeoffice_building_totalfloor', 'is_contract_renewal', 'is_current_biz_job', 'current_biz_job', 'recommend_biz_job', 
            'existed_deposit', 'existed_month_price', 'loanprice', 'parking_option', 'security_option', 'space_option', 'prd_option', 'prd_status', 'exclusive_periods'
        ];

        switch (type) {
            case 'all':
                return [ 
                    'prd_id', 'prd_type', 'company_id', ...defaultFields, 'exclusive_start_date', 'exclusive_end_date', 'exclusive_status',
                    'request_mem_name', 'request_mem_phone', 'request_mem_id', 'request_company_id', 'prd_create_origin',
                    'create_date', 'modify_date', 'modify_mem_id', 'addr_jibun', 'addr_road', 'addr_detail', 'bld_id', 
                    'dong_name', 'flr_type', 'floorint', 'ho_id', 'ho_name', 'prd_latitude', 'prd_longitude'
                ];
            case 'create':
                return [ 
                    'company_id', 'prd_type', ...defaultFields, 'request_mem_name', 'request_mem_phone', 'prd_create_origin', 'request_mem_id', 'request_company_id', 
                    'addr_jibun', 'addr_road', 'addr_detail', 'bld_id', 'dong_name', 'flr_type', 'floorint', 'ho_id', 'ho_name',
                    'prd_latitude', 'prd_longitude'
                ];
            case 'update':
                return [ ...defaultFields, 'exclusive_start_date', 'exclusive_end_date', 'exclusive_status', 'modify_mem_id' ];
            case 'public':
                return [ 
                    'prd_id', 'company_id', 'prd_type', ...defaultFields, 'exclusive_start_date', 'exclusive_end_date', 'exclusive_status', 'create_date', 'modify_date',
                    'addr_jibun', 'addr_road', 'addr_detail', 'bld_id', 'dong_name', 'flr_type', 'floorint', 'prd_latitude', 'prd_longitude'
                ];
            default:
                return defaultFields;
        };       
    },
    async existsExclusiveProduct(conn, queryWhere) {
        const [[ row ]] = await conn.query(`
            select prd_id from product
            where (
                prd_status = '거래개시' or prd_status = '거래개시수정반영' or prd_status = '거래완료동의요청' or prd_status = '거래완료동의요청거절'
                or prd_status = '검토중' or prd_status = '검토대기' or prd_status = '거래준비' or prd_status = '거래개시동의요청거절' or prd_status = '거래개시동의요청'
            )
            ${queryWhere};
        `);

        return row;
    },
    async getProductLikeList(conn, queryWhere,userId) {
        let [ rows ] = await conn.query(`
            select 
            distinct li.*,p.*, (select count(*) from likes li where p.prd_identity_id=li.prd_identity_id and li.mem_id=${userId}) as isLike
            from likes li  
            JOIN (select * from product ps group by ps.prd_identity_id order by ps.modify_date DESC) p on li.prd_identity_id = p.prd_identity_id 
        ` + queryWhere);
        console.log(`
        select 
        distinct li.*,p.*, (select count(*) from likes li where p.prd_identity_id=li.prd_identity_id and li.mem_id=${userId}) as isLike
        from likes li  
        JOIN (select * from product ps group by ps.prd_identity_id order by ps.modify_date DESC) p on li.prd_identity_id = p.prd_identity_id 
    ` + queryWhere);

        return rows;
    },
    async insertProduct(conn, data) {
        const [ row ] = await conn.query(`
            insert into product (${data.column}) values (${data.value});
        `);

        return row.insertId;
    },
    async insertProductModifyHistory(conn, data) {
        return await conn.query(`
            insert into product_modify_history (${data.column}) values (${data.value});
        `);
    },
    async insertProductModifyHistoryByPrdId(conn, fields, historyType, prdId) {
        return await conn.query(`
            insert into product_modify_history (${fields}, history_type)
            select ${fields}, ${historyType} from product
            where prd_id = ${prdId};
        `);
    },
    async updateProduct(conn, setData, prdId) {
        const [ row ] = await conn.query(`
            update product
            set ${setData}
            where prd_id = ${prdId};
        `);

        return row;
    },
    async getProductHistory(conn, fields, queryWhere) {
        const [[ row ]] = await conn.query(`
            select ${fields} from product_modify_history
            ${queryWhere};
        `);

        return row;
    },
    async getProductByPrdId(conn, queryData, prdId) {
        const { fields, productFields, join } = queryData;
        const [[ row ]] = await conn.query(`
            select ${fields} from (
                select ${productFields} from product
                where prd_id = ${prdId}
            ) prd
            ${join};
        `);

        return row;
    },
    async getProductAll(conn, queryData) {
        const { fields, joinFields, productFields, join, queryWhere, order, subOrder, limit, offset } = queryData;
        const [ rows ] = await conn.query(`
            select ${fields} from (
                select ${joinFields}
                from (
                    select ${productFields} from product
                ) prd 
                ${join}
            ) result
            ${queryWhere}
            ${order} ${subOrder}
            ${limit}
            ${offset};
        `);

        return rows;
    },
    async getProductAllCount(conn, queryData) {
        const { joinFields, productFields, join, queryWhere } = queryData;
        const [[ row ]] = await conn.query(`
            select count(*) as count from (
                select ${joinFields}
                from (
                    select ${productFields} from product
                ) prd 
                ${join}
            ) result
            ${queryWhere};
        `);

        return row.count;
    },
    async deletePorduct(conn, prdId) {
        const [ row ] = await conn.query(`
            delete from product
            where prd_id = ${prdId};
        `);

        return row;
    }
};
