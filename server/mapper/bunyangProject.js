module.exports = {
    async getBunyangProjectAll(conn, queryData, today) {
        const { fields, queryWhere, join, order, limit, offset } = queryData
        const [ rows ] = await conn.query(`
            select ${fields} from bunyang_projects bp 
            left join (
                select concat(t.tour_start_date , ' ' , td.td_starttime) as live_date,
                count(*) as live_checked, t.bp_id as t_bp_id
                from (
                    select * from tour where tour_type = 4 and is_active = 1
                ) t left join tourdetail td 
                on t.tour_id = td.tour_id
                where concat(t.tour_start_date, ' ', td.td_starttime) > '${today}'
                order by t.tour_start_date asc, td.td_starttime asc 
                LIMIT 1 
            ) lv on bp.bp_id = lv.t_bp_id
            ${join}
            ${queryWhere}
            ${order}
            ${limit}
            ${offset};
        `);
        
        return rows;
    },
    async getBunyangProjectByBpId(conn, today, join, bpId) {
        const [[ row ]] = await conn.query(`
            select bp.*, lv.live_checked, lv.live_date, null as reg_mng_id, null as mod_mng_id from (
                select * from bunyang_projects where bp_id = ${bpId} and state = 1
            ) bp left join (
                select concat(t.tour_start_date , ' ' , td.td_starttime) as live_date,
                count(*) as live_checked, t.bp_id as t_bp_id
                from (
                    select * from tour where tour_type = 4 and is_active = 1 and bp_id = ${bpId}
                ) t left join tourdetail td 
                on t.tour_id = td.tour_id
                where concat(t.tour_start_date, ' ', td.td_starttime) > '${today}'
                order by t.tour_start_date asc, td.td_starttime asc 
                LIMIT 1 
            ) lv on bp.bp_id = lv.t_bp_id
            ${join};
        `);
        
        return row;
    }
};
