
const mysqls=require('mysql2/promise');
const pool= mysqls.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref',
    dateStrings: 'date'
});



module.exports = {
    async getBunyang(bp_id,userId,today){
        const connection = await pool.getConnection(async conn => conn);
        
        let [rows] =  await connection.query(`
            select distinct bp.* , 
            (select count(*) from tour tr where tr.bp_id=bp.bp_id and is_active = 1 and tour_type = 4 LIMIT 1) as liveChecked , 
            (
                select CONCAT(tr1.tour_start_date , ' ' , td.td_starttime)
                from tour tr1
                Left join tourdetail td on tr1.tour_id=td.tour_id
                where tr1.bp_id=bp.bp_id and is_active = 1 
                and concat(tr1.tour_start_date, ' ', td.td_starttime) > '${today}'
                order by tr1.tour_start_date ASC ,td.td_starttime ASC LIMIT 1 
            ) as liveDate, 
            (select count(*) from likes li where li.bp_id=bp.bp_id and mem_id='${userId}') as isLike  
            from bunyang_projects bp 
         where bp.bp_id=${bp_id}`);
        connection.release();
        return rows;
    },
    async getBunyangList(queryWhere,userId,today){
        const connection = await pool.getConnection(async conn => conn);
        let [rows] =  await connection.query(`
            select distinct bp.* , 
            (select count(*) from tour tr where tr.bp_id=bp.bp_id and is_active = 1 and tour_type = 4 LIMIT 1) as liveChecked , 
            (
                select CONCAT(tr1.tour_start_date , ' ' , td.td_starttime)
                from tour tr1
                Left join tourdetail td on tr1.tour_id=td.tour_id
                where tr1.bp_id=bp.bp_id and tour_type = 4 and is_active = 1
                and concat(tr1.tour_start_date, ' ', td.td_starttime) > '${today}'
                order by tr1.tour_start_date ASC ,td.td_starttime ASC LIMIT 1
            ) as liveDate, 
            (select count(*) from likes li where li.bp_id=bp.bp_id and mem_id='${userId}') as isLike  
            from bunyang_projects bp 
        ` + queryWhere);
        connection.release();
        return rows;
    },
    async getBunyangLikeList(queryWhere,userId){
        const connection = await pool.getConnection(async conn => conn);
        
        let [rows] =  await connection.query(`
            select distinct li.* , bp.*
            from likes li  
            join bunyang_projects bp on li.bp_id=bp.bp_id 
        ` + queryWhere);
        connection.release();
        return rows;
    },
    async getBunyangTeamList(no, today){
        const connection = await pool.getConnection(async conn => conn);
        let [rows] =  await connection.query(`
            SELECT bp.*,cm.*, (
                select count(*) from tour tr where tr.bp_id=bp.bp_id and is_active = 1 and tour_type = 4 LIMIT 1
            ) as liveChecked , 
            (
                select CONCAT(tr1.tour_start_date , ' ' , td.td_starttime)
                from tour tr1
                Left join tourdetail td on tr1.tour_id=td.tour_id
                where tr1.bp_id=bp.bp_id and tour_type = 4 and is_active = 1
                and concat(tr1.tour_start_date, ' ', td.td_starttime) > '${today}'
                order by tr1.tour_start_date ASC ,td.td_starttime ASC LIMIT 1
            ) as liveDate FROM bunyang_projects bp 
            join company_member cm on cm.bp_id=bp.bp_id
            join user u on u.mem_id = cm.mem_id 
            where u.mem_id=${no}`
        );
        connection.release();
        return rows;
    },
    async getReservationSetting(req, queryWhere){
        const connection = await pool.getConnection(async conn => conn);
        const { bp_id,tour_type }=req.query; 
        let [rows] =  await connection.query(`
            select date_format(t.tour_start_date,'%Y-%m-%d') as tour_start_date_simple, t.*, td.*, (select count(*) from tourReservation tr where tr.tour_id=t.tour_id) as reservation_count 
            from tour t 
            left join tourdetail td on td.tour_id=t.tour_id 
            where t.bp_id=${bp_id} and t.tour_type=${tour_type} and is_active=1 ${queryWhere}
            order by t.tour_start_date DESC , td.td_starttime DESC 
        `);
        connection.release();
        return rows;
    },
  
    async insertReservationSetting(req){
        const connection = await pool.getConnection(async conn => conn);
        const { tour_group_id,tour_type,company_id, mem_id,  tour_start_date,  tour_end_date, tour_start_time, tour_end_time,tour_set_days, time_distance ,bp_id,is_tour_holiday_except} = req.body; 
        
        let result = await connection.query(`
            INSERT INTO tour (tour_group_id,tour_type,company_id,mem_id,tour_start_date,tour_end_date,is_active,tour_set_days,time_distance,bp_id,is_tour_holiday_except)
            VALUES ('${tour_group_id}','${tour_type}','${company_id}','${mem_id}','${tour_start_date}','${tour_end_date}',1,'${tour_set_days}','${time_distance}','${bp_id}',${is_tour_holiday_except})
        `);
        //tour_group_id,tour_type,companyid,memid,tourstartdate,tourenddate,isactive,toursetadays,timedistinace,bpid,istourholidexcept
    
        if(result[0].affectedRows == 0){
            connection.release();
            throw null;
        }

        let [rows] = await connection.query(`select * from tour where tour_group_id=${tour_group_id}`);

        let detailResult =  await connection.query(`
            INSERT INTO tourdetail (tour_id,td_starttime,td_endtime,create_date,modify_date,td_text)
            VALUES ('${rows[0].tour_id}','${tour_start_time}','${tour_end_time}',now(),now(),'')
        `);

        if(detailResult[0].affectedRows == 0){
            connection.release();
            throw null;
        }

        connection.release();
        return rows;
    },
    async updateReservationSetting(req){
        const connection = await pool.getConnection(async conn => conn);
        const { tour_id, tour_start_date, isActive, tour_end_date, tour_start_time, tour_end_time,tour_set_days, time_distance ,is_tour_holiday_except} = req.body; 
        
        let result = await connection.query(`
        UPDATE tour set 
            ${tour_start_date ? `tour_start_date='${tour_start_date}' , ` : ""}
            ${tour_end_date ? `tour_end_date='${tour_end_date}' , ` : ""}
            ${tour_set_days ? `tour_set_days='${tour_set_days}' , ` : ""}
            ${time_distance ? `time_distance='${time_distance}' , ` : ""}
            ${is_tour_holiday_except ? `is_tour_holiday_except='${is_tour_holiday_except}' , ` : `is_tour_holiday_except='${is_tour_holiday_except}' , `}
            is_active=${isActive} ,
            modify_date=NOW() 
            where tour_id='${tour_id}'
        `);
        if(result[0].affectedRows == 0){
            connection.release();
            throw null;
        }


        let detailResult =  await connection.query(`
            UPDATE tourdetail set 
                ${tour_start_time ? `td_starttime='${tour_start_time}' , ` : ""}
                ${tour_end_time ? `td_endtime='${tour_end_time}' , ` : ""}
                modify_date=NOW() 
            where tour_id='${tour_id}'
        `);
        if(detailResult[0].affectedRows == 0){
            connection.release();
            throw null;
        }

        connection.release();
        return "success";
    },

    
    async insertReservation(param){
        const connection = await pool.getConnection(async conn => conn);
        let result = await connection.query(`
            INSERT INTO tourReservation (
                td_id,tour_id,mem_id,request_user_selectsosokid,tr_name,tr_email,tr_phone,tr_type,tr_status,
                tr_user_reservtime,reserv_start_time,reserv_end_time,create_date,modify_date ,bp_id,tr_group_id
                )
            VALUES (
                '${param.td_id}','${param.tour_id}','${param.mem_id}','${param.company_id}','${param.tr_name}','${param.tr_email}','${param.tr_phone}','${param.tr_type}',0,
                '${param.reserv_start_time}','${param.reserv_target_time}','${param.reserv_target_time}',NOW(),NOW(),'${param.bp_id}','${param.tr_group_id}'
                )
        `);
        
        if(result[0].affectedRows == 0){
            connection.release();
            throw null;
        }

        let [rows] = await connection.query(`SELECT MAX(tr_id) as tr_id FROM tourReservation where tr_group_id='${param.tr_group_id}'`);
        
        connection.release();
        return rows[0];
    },
    async insertReservationMember(param){
        const connection = await pool.getConnection(async conn => conn);
        let result = await connection.query(`
            INSERT INTO tourMembers (tr_id,td_id,tour_id,tm_name,tm_phone,create_date,modify_date)
            VALUES ('${param.tr_id}','${param.td_id}','${param.tour_id}','${param.tm_name}','${param.tm_phone}',NOW(),NOW())
        `);
        if(result[0].affectedRows == 0){
            connection.release();
            throw null;
        }
        connection.release();
        return true;
    },
    
    //내방문예약 취소(예약취소액션)
    async updateReservationLink(param){
        const connection = await pool.getConnection(async conn => conn);
        //TOURrSEVATION셋팅 수정일,TRSTATUS상태값초대링크보내기(신청온것들에대해서),어떤TRID에대한신청 특정TRID신청내역에 대해서 수정일,TRSTATUS,초대테스트,초대URL등을 UPDATE한다.
        let result = await connection.query(`
            UPDATE tourReservation set 
            tr_status=${param.tr_status},
            modify_date=NOW(),
            invite_text='${param.content}',
            tr_liveurl='${param.url}'
            where tr_id='${param.tr_id}'
        `);
        if(result[0].affectedRows == 0){
            connection.release();
            throw null;
        }
        connection.release();
        return true;
    },

    async updateReservationLink_my(param){
        const connection = await pool.getConnection(async conn => conn);
        let result = await connection.query(`
            UPDATE tourReservation set 
            tr_status=${param.tr_status},
            modify_date=NOW(),
            tr_modify_reason='${param.content}'
            ${
                param.reserv_start_time ? 
                `, reserv_start_time='${param.reserv_start_time}'`
                :
                ''
            }
            ${
                param.reserv_start_time ? 
                `, reserv_end_time='${param.reserv_start_time}'`
                :
                ''
            }
            where tr_id='${param.tr_id}'
        `);

        connection.release();
        return true;
    },

    async getMyReservationList(queryWhere,userId){
        const connection = await pool.getConnection(async conn => conn);
        let [rows] = await connection.query(`
            SELECT 
            bp.* , 
            tr.*, 
            (select count(*) from tourMembers tm where tm.tr_id=tr.tr_id) as visitor, 
            (select count(*) from likes li where li.bp_id=bp.bp_id and mem_id='${userId}') as isLike  
            FROM bunyang_projects bp 
            join tourReservation tr on tr.bp_id=bp.bp_id 
            ${queryWhere}
        `);
        connection.release();
        return rows;
    },
    
    async getReservationCount(param){
        const connection = await pool.getConnection(async conn => conn);
        let [rows] = await connection.query(`
            SELECT count(*) as count FROM bunyang_projects bp 
            join tourReservation tr on tr.bp_id=bp.bp_id 
            where tr.tr_type=${param.tr_type} and bp.bp_id=${param.bp_id} 
            and Date(tr.tr_user_reservtime) > curDate() 
            group by tr.tr_user_reservtime
            order by tr.tr_user_reservtime ASC LIMIT 1 
        `);
        connection.release();
        return rows;
    },
    
    async getReservationList(queryWhere){
        //console.log('baunyang getReservationListss:',queryWhere);
        const connection = await pool.getConnection(async conn => conn);
        console.log('connection querysss:',`
        SELECT 
        bp.* , 
        tr.*, 
        (select count(*) from tourMembers tm where tm.tr_id=tr.tr_id) as visitor 
        FROM bunyang_projects bp 
        join tourReservation tr on tr.bp_id=bp.bp_id 
        ${queryWhere}
        `);
        let [rows] = await connection.query(`
            SELECT 
            bp.* , 
            tr.*, 
            (select count(*) from tourMembers tm where tm.tr_id=tr.tr_id) as visitor 
            FROM bunyang_projects bp 
            join tourReservation tr on tr.bp_id=bp.bp_id 
            ${queryWhere}
        `);
        connection.release();
        return rows;
    },
    async getReservationMembers(param){
        const connection = await pool.getConnection(async conn => conn);
        let [rows] = await connection.query(` SELECT * from tourMembers where tr_id=${param.tr_id} `);
        console.log(` SELECT * from tourMembers where tr_id=${param.tr_id} `);
        connection.release();
        return rows;
    },
    async deleteReservation(tr_id){
        const connection = await pool.getConnection(async conn => conn);
        
        console.log(`
        UPDATE tourReservation set 
                tr_status=1,
                modify_date=NOW() 
            where tr_id='${tr_id}'
        `);
        let detailResult =  await connection.query(`
            UPDATE tourReservation set 
                tr_status=1,
                modify_date=NOW() 
            where tr_id='${tr_id}'
        `);

        if(detailResult[0].affectedRows == 0){
            connection.release();
            throw null;
        }

        connection.release();
        return "success";
    },
    async deleteReservation_real(tr_id,mem_id,tour_id){
        console.log('delte reservation reslass:',tr_id,mem_id,tour_id);
        const connection = await pool.getConnection(async conn=> conn);

        console.log(`delete from tourReservation where tr_id='${tr_id}'`);
        let deleteResult=await connection.query(`delete from tourReservation where tr_id='${tr_id}'`);//해당 trid대상 삭제한다.관렪산 tourReservation내역을 삭제한다.

        if(deleteResult[0].affectedRows==0){
            connection.release();
            throw null;
        }

        //삭제할 tr_id에 관련된 tour_id tourid관련된 txn_id관련된 방문일 삼일전,방문일 당일 관련 예약알림들 모두삭제>>신청자체를 삭제했기에 지운다.
        let [delete_noti_targets]=await connection.query(`select * from notification where mem_id='${mem_id}' and txn_id='${tour_id}' and (noti_type='bunyang_visit_startday_reservealram' or noti_type='bunyang_visit_startday_reservealram_3days')`);
        console.log('삭제 대상 타깃들[[notificaitons_list]]:::',delete_noti_targets);
        for(let j=0; j<delete_noti_targets.length; j++){
            let noti_id=delete_noti_targets[j].noti_id;
            console.log('delete target notiid',noti_id);
            let result=await connection.query("delete from notification where noti_id=?",[noti_id]);//대상noti_id요소 삭제한다.
           
        }
        connection.release();
        return "success";
    },
    
    async updateLiveLinkSetting(param){
        const connection = await pool.getConnection(async conn => conn);
        console.log('updateLIVFELINKSettingss:',`
        UPDATE tourReservation set 
        tr_status=${param.tr_status},
        modify_date=NOW(),
        tr_modify_reason='${param.content}'
        ${
            param.reserv_start_time ? 
            `, reserv_start_time='${param.reserv_start_time}'`
            :
            ''
        }
        ${
            param.reserv_start_time ? 
            `, reserv_end_time='${param.reserv_start_time}'`
            :
            ''
        }
        where td_id='${param.td_id}'
    `);
        let result = await connection.query(`
            UPDATE tourReservation set 
            tr_status=${param.tr_status},
            modify_date=NOW(),
            tr_modify_reason='${param.content}'
            ${
                param.reserv_start_time ? 
                `, reserv_start_time='${param.reserv_start_time}'`
                :
                ''
            }
            ${
                param.reserv_start_time ? 
                `, reserv_end_time='${param.reserv_start_time}'`
                :
                ''
            }
            where td_id='${param.td_id}'
        `);

        connection.release();
        return true;
    },

    
    async updateAlarmSetting(param){
        const connection = await pool.getConnection(async conn => conn);
        let result = await connection.query(` UPDATE tourReservation set tr_alarm=${param.tr_alarm},  modify_date=NOW()  where tr_id='${param.tr_id}' `);
        connection.release();
        return true;
    },

    
    async deleteReservationMember(param){
        const connection = await pool.getConnection(async conn => conn);
        let result = await connection.query(`delete from tourMembers where tr_id=${param.tr_id}`);

        connection.release();
        return true;
    },

    

}