module.exports = {
    async insertProRealtorApply(conn, data) {
            await conn.query(`insert into pro_realtor_apply (${data.column}) values (${data.value});`);

            return;
    },
    async insertProRealtorPermission(conn, companyId) {
        await conn.query(`insert ignore into pro_realtor_permission (company_id) values (${companyId});`)

        return;
},
    async getRealtorByCompayId(conn, companyId) {
        const [[ row ]] = await conn.query(`
            select * from company2
            where company_id = ${companyId} and type = '중개사';
        `);

        return row;
    },
    async getProRealtorByCompanyId(conn, queryData, companyId) {
        const { fields, join } = queryData;
        const [[ row ]] = await conn.query(`
            select ${fields} from (
                select company_id, company_name, ceo_name, ceo_phone, profile_img,
                addr_jibun, addr_road, chat_key, addr_detail, x, y
                from company2
                where is_pro = 1 and type = '중개사' and company_id = ${companyId}
            ) cp inner join (
                select company_id as cp_id, pro_apt_id, pro_oft_id, is_pro_office, is_pro_store
                from pro_realtor_permission
            ) prp on cp.company_id = prp.cp_id
            ${join};
        `);

        return row;
    },
    async getProCategoryByCompanyId(conn, companyId) {
        const [[ row ]] = await conn.query(`
            select prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, 
                replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun,
                replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as oft_jibun
            from (
                select pro_apt_id, pro_oft_id, is_pro_office, is_pro_store
                from pro_realtor_permission
                where company_id = ${companyId}
            ) prp
            left join complex cpx1
            on prp.pro_apt_id = cpx1.complex_id
            left join complex cpx2
            on prp.pro_oft_id = cpx2.complex_id;
        `);

        return row;
    },
    async getProRealtorProductSelTypeCount(conn, statusFilter, companyId) {
        const [[ row ]] = await conn.query(`
            select ifnull(prd_cnt.trade_count, 0) as trade_count,
            ifnull(prd_cnt.deposit_count, 0) as deposit_count,
            ifnull(prd_cnt.monthly_count, 0) as monthly_count
            from (
                select company_id from korex_pref.company2
                where company_id = ${companyId}
            ) cp
            left join (
                select count(case when prd_sel_type = '매매' then prd_sel_type else null end) as trade_count,
                    count(case when prd_sel_type = '전세' then prd_sel_type else null end) as deposit_count,
                    count(case when prd_sel_type = '월세' then prd_sel_type else null end) as monthly_count,
                    company_id
                from product
                where ${statusFilter} and company_id = ${companyId}
                group by company_id
            ) prd_cnt
            on cp.company_id = prd_cnt.company_id;
        `);

        return row;
    },
    async getProRealtorMannerScore(conn, companyId) {
        const [[ row ]] = await conn.query(`
            select cast(round(avg(cs_point)) as unsigned) as manner_score
            from company_score
            where company_id = ${companyId}
            group by company_id;
        `);

        return row.manner_score;
    },
    async getProRealtorProductCountByCompanyId(conn, companyId) {
        const [[ row ]] = await conn.query(`
            select count(*) as count from product
            where (
                prd_status = '거래개시' or prd_status = '거래개시수정반영' or prd_status = '거래완료동의요청' or prd_status = '거래완료동의요청거절'
                or prd_status = '거래완료' or prd_status = '위임취소' or prd_status = '수임취소' or prd_status = '기한만료'
            ) and company_id = ${companyId};
        `)

        return row.count;
    },
    async getProRealtorProductCountByPrdStatus(conn, statusList, companyId) {
        const [[ row ]] = await conn.query(`
            select count(*) as count from product
            where company_id = ${companyId} and prd_status in (${statusList});
        `);

        return row.count;
    },
    async getProRealtorAllProductCount(conn) {
        const [[ row ]] = await conn.query(`
            select count(*) as count from product
            where prd_status = '거래개시' or prd_status = '거래개시수정반영' or prd_status = '거래완료동의요청' or prd_status = '거래완료동의요청거절'
            or prd_status = '거래완료' or prd_status = '위임취소' or prd_status = '수임취소' or prd_status = '기한만료';
        `);

        return row.count;
    },
    async getProRealtorAll(conn, queryData) {
        const { fields, queryWhere, categoryWhere, join, order, limit, offset } = queryData
        const [ rows ] = await conn.query(`
            select * from (
                select ${fields} from (
                    select company_id, company_name, ceo_name, ceo_phone, profile_img,
                    addr_jibun, addr_road, chat_key, addr_detail, x, y
                    from company2
                    where is_pro = 1 and type = '중개사'
                ) cp inner join (
                    select company_id as cp_id, pro_apt_id, pro_oft_id, is_pro_office, is_pro_store
                    from pro_realtor_permission
                    ${categoryWhere}
                ) prp on cp.company_id = prp.cp_id
                ${join}
            ) result
            ${queryWhere}
            ${order}
            ${limit}
            ${offset};
        `);

        return rows;
    }
};
