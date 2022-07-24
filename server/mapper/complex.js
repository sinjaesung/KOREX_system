module.exports = {
    async getComplexByComplexId(conn, queryData, complexId) {
        const { fields } = queryData;
        const [[ row ]] = await conn.query(`
            select ${fields} from (
                select * from complex
                where complex_id = ${complexId} and complex_id = main_complex_id 
                and is_lease = 0 and x is not null
            ) cpx inner join (
                select complex_id, count(*) as dong_cnt, sum(ho_cnt) as household_cnt
                from buildings
                group by complex_id
            ) bld
            on cpx.complex_id = bld.complex_id;
        `);

        return row;
    },
    async getComplexAll(conn, queryData) {
        const { fields, queryWhere, join, order, limit, offset } = queryData

        const [ rows ] = await conn.query(`
            select ${fields} from (
                select * from complex
                ${queryWhere}
            ) cpx
            ${join}
            ${order}
            ${limit}
            ${offset};
        `);

        return rows;
    },
    async getBuildingAllByComplexId(conn, complexId) {
        const [ rows ] = await conn.query(`
            select * from buildings
            where complex_id = ${complexId}
            order by dong_name;
        `);

        return rows;
    },
    async getHoAll(conn, queryWhere, complexId, bldId, limit) {
            const [ rows ] = await conn.query(`
                select * from ho_info
                where complex_id = ${complexId} and bld_id = ${bldId}
                ${queryWhere}
                order by ho_name + 0
                ${limit};
            `);

            return rows;
    },
    async getHoByHoId(conn, complexId, bldId, hoId) {
        const [[ row ]] = await conn.query(`
            select * from ho_info
            where complex_id = ${complexId} and bld_id = ${bldId} and ho_id = ${hoId};
        `);

        return row;
    },
    async getAreaByComplexId(conn, complexId) {
        const [ rows ] = await conn.query(`
            select exclusive_area, supply_area from ho_info
            where complex_id = ${complexId}
            group by complex_id, exclusive_area;
        `);

        return rows;
    },
    async getPyojaebuFloor(conn, value) {
        const { sggCode, dongCode, bun, ji, roadCode, mainNo, subNo } = value;
        const [[ row ]] = await conn.query(`
            select grndFlrCnt as grd_floor, ugrndFlrCnt as udgrd_floor, bldNm as bld_name
            from clc_korex.clc_pyo
            where (
                sigunguCd = ${conn.escape(sggCode)} and bjdongCd = ${conn.escape(dongCode)}
                and ltrim(bun) = ${conn.escape(bun)} and ltrim(ji) = ${conn.escape(ji)}
            ) or (naRoadCd = ${conn.escape(roadCode)} and naMainBun = ${conn.escape(mainNo)} and naSubBun = ${conn.escape(subNo)});
        `);

        return row;
    }
};
