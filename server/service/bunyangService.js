const { deleteReservation_real } = require('../mapper/bunyang');
const bunyangMapper = require('../mapper/bunyang');

const getDateAndTime = (datetime) => {
    const year = datetime.getFullYear();
    const month = ('0' + (datetime.getMonth() + 1)).slice(-2);
    const day = ('0' + datetime.getDate()).slice(-2);
    const hours = ('0' + datetime.getHours()).slice(-2); 
    const minutes = ('0' + datetime.getMinutes()).slice(-2);
    const seconds = ('0' + datetime.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = {

    

    async getBunyang(req){
        const today = getDateAndTime(new Date());
        const { bp_id,mem_id }=req.query; 
        return await bunyangMapper.getBunyang(bp_id,mem_id,today);
    },

    async getBunyangList(req){
        const today = getDateAndTime(new Date());
        const { sort, live, search,mem_id }=req.query; 
        
        let queryWhere = "";
        
        if(search){
            queryWhere += `where bp_name LIKE '%${search}%' or bp_addr_jibun LIKE '%${search}%' or bp_addr_road LIKE '%${search}%'`;
        }

        
        if(!sort || sort < 2)
            queryWhere += 'order by mod_dttm ' + (sort == 1 ? "ASC " : "DESC ");
        else
            queryWhere += 'order by bp_name DESC ';
 
        queryWhere += live == 1 ? "" : "";

        return await bunyangMapper.getBunyangList(queryWhere,mem_id,today);
    },

    async getBunyangLikeList(req){
        
        const { sort, live ,mem_id }=req.query; 
        
        let queryWhere = "";
        
        queryWhere += ` where li.mem_id='${mem_id}' `
        
        switch(sort){
            case "1" : queryWhere += ' order by li.modify_date DESC  '; break;
            case "2" : queryWhere += ' order by bp.max_price DESC  '; break;
            case "3" : queryWhere += ' order by bp.max_price ASC  '; break;
            case "4" : queryWhere += ' order by bp.max_supply_area DESC  '; break;
            case "5" : queryWhere += ' order by bp.max_supply_area ASC  '; break;
            case "6" : queryWhere += ' order by bp.bp_name DESC'; break;
            default : " order by li.modify_date DESC  ";
        }

        queryWhere += live == 1 ? "" : "";

        return await bunyangMapper.getBunyangLikeList(queryWhere,mem_id);
    },

    async getBunyangTeamList(req){
        const today = getDateAndTime(new Date());
        const { no }=req.query; 
        return await bunyangMapper.getBunyangTeamList(no, today);
    },

    
    async getMyReservationList(req){
        const { bp_id , tr_type , search, order, sort ,tour_id, mem_id,company_id}=req.query; 

        let queryWhere = "";

        switch(sort){
            case "TODAY" : queryWhere += 'where DATE(tr.reserv_start_time) = CURDATE() '; break;
            case "WEEKEND" : queryWhere += 'where YEARWEEK(tr.reserv_start_time) = YEARWEEK(NOW()) ' ; break;
            case "CANCEL" : queryWhere += 'where tr.tr_status=1 ' ; break;
            case "DELETE" : queryWhere += 'where tr.tr_status=2 ' ; break;
            case "OVER" : queryWhere += 'where (tr.tr_status=3 or DATE(tr.reserv_start_time) < CURDATE()) ' ; break;
            default : "";
        }

              
        if(search){
            queryWhere += `${queryWhere.length > 0 ? " and " : "where "} 
            (tr.tr_name LIKE '%${search}%' or tr.tr_email LIKE '%${search}%' or tr.tr_phone LIKE '%${search}%') 
             `;
        }

        queryWhere += `${queryWhere.length > 0 ? " and " : "where "} tr.tr_type=${tr_type} `

        if(tour_id)
            queryWhere += `${queryWhere.length > 0 ? " and " : "where "} tr.tour_id=${tour_id} `

        queryWhere += ` and ${mem_id}=mem_id and request_user_selectsosokid=${company_id} `;
            
        
        switch(order){
            case "DESC" : queryWhere += 'order by tr.modify_date DESC'; break;
            case "ASC" : queryWhere += 'order by tr.modify_date ASC'; break;
            case "KR" : queryWhere += 'order by tr.tr_name DESC'; break;
            default : "";
        }

        return await bunyangMapper.getMyReservationList(queryWhere,mem_id);

    },

    async getReservationList(req){
        const { bp_id , tr_type , search, order, sort ,tour_id}=req.query; 
        //분양프로젝트id,tr_type=1,검색어,정렬순서,요소집합,tour_id????
        let queryWhere = "";
        let queryPlus = "";

        switch(sort){
            case "TODAY" : queryWhere += 'where DATE(tr.reserv_start_time) = CURDATE() '; break;//where DATE(tr.tr_user_reservtime) = CURDATE() 
            case "WEEKEND" : queryWhere += 'where YEARWEEK(tr.reserv_start_time) = YEARWEEK(NOW()) ' ; break;//YEARWEEK(tr.tr_user_resasvtime) = YEARWEEK(now())
            case "CANCEL" : queryWhere += 'where tr.tr_status=1 ' ; break;//tr.tr_status=1 취소
            case "DELETE" : queryWhere += 'where tr.tr_status=2 ' ; break;//tr.tr_status=2 삭제?
            case "OVER" : queryWhere += 'where (tr.tr_status=3 or DATE(tr.reserv_start_time) < CURDATE()) ' ; break;//오늘이전에 신청한 내역들.(접수신청한 날짜기준)
            default : "";
        }

                
        if(search){
            queryWhere += `${queryWhere.length > 0 ? " and " : "where "} 
            (tr.tr_name LIKE '%${search}%' or tr.tr_email LIKE '%${search}%' or tr.tr_phone LIKE '%${search}%') 
             `;
        }

        queryWhere += `${queryWhere.length > 0 ? " and " : "where "} tr.tr_type=${tr_type} and bp.bp_id=${bp_id} `

        
        if(tour_id)
            queryWhere += ` and tr.tour_id=${tour_id} `

        if(order == 'N'){
            queryPlus = queryWhere;
            queryPlus += 'and DATE(tr.reserv_start_time) >= CURDATE()'; 
            queryWhere += 'and DATE(tr.reserv_start_time) < CURDATE()'; 
        }

        let orderQuery = "";
        switch(order){
            case "DESC" :  orderQuery += 'order by tr.modify_date DESC'; break;
            case "ASC" : orderQuery += 'order by tr.modify_date ASC'; break;
            case "KR" : orderQuery += 'order by tr.tr_name DESC'; break;
            default : orderQuery += 'order by tr.reserv_start_time ASC'; break;
        }
        queryPlus += orderQuery
        queryWhere += orderQuery

        if(order == 'N'){
            let queryPlusResult = (await bunyangMapper.getReservationList(queryPlus));
            return queryPlusResult.concat(await bunyangMapper.getReservationList(queryWhere));
        }
        else
            return await bunyangMapper.getReservationList(queryWhere)

    },
    async getReservationMembers(req){
        const {tr_id }=req.query; 
        let query = {tr_id : tr_id};
        return await bunyangMapper.getReservationMembers(query);

    },
    async getReservationCount(req){
        const { bp_id }=req.query; 
        let query = {bp_id : bp_id , tr_type : 1};
        let visitCount = await bunyangMapper.getReservationCount(query);
        query.tr_type = 2;
        let liveCount = await bunyangMapper.getReservationCount(query);
        return {visitCount:visitCount, liveCount :liveCount};
    },
    
    async getReservationSetting(req){
        const isActive = req.query.is_active;
        const queryWhere = isActive === 1 || isActive === 0 ? `and is_active = ${isActive}` : '';
        return await bunyangMapper.getReservationSetting(req, queryWhere);
    },
    async insertReservationSetting(req){
        return await bunyangMapper.insertReservationSetting(req);
    },
    async updateReservationSetting(req){
        return await bunyangMapper.updateReservationSetting(req);
    },
    async insertReservation(req){
        const {  td_id, userList, tour_id,tr_name,tr_phone,tr_email,mem_id,tr_type, company_id } = req.body; 
        
        console.log(req.body);
        let res = await bunyangMapper.insertReservation(req.body);
        console.log(res);
        await userList.map(async (value)=>{
            let bodyMap = {
                td_id : td_id,
                tour_id : tour_id,
                userList : userList,
                tr_name : tr_name,
                tr_phone : tr_phone,
                tr_email : tr_email,
                tr_type : tr_type,
                mem_id : mem_id,
                company_id : company_id,
                tr_id : res.tr_id,
                tm_name : value.name,
                tm_phone : value.phone,
            }
            await bunyangMapper.insertReservationMember(bodyMap);
        })

        return  true;
    },
    async updateReservationLink(req){
        const { url,content, userList} = req.body; 

        await userList.map(async (value)=>{
            let bodyMap = {
                tr_id : value.tr_id,
                tr_status : value.tr_status,
                url : url,
                content : content
            }
            await bunyangMapper.updateReservationLink(bodyMap);
        })
      
        return  true;
    },
    async deleteReservation(req){
        const {tr_id }=req.query; 
        return await bunyangMapper.deleteReservation(tr_id);
    },
    async deleteReservation_real(req){
        const {tr_id,mem_id,tour_id} = req.body;
        return await bunyangMapper.deleteReservation_real(tr_id,mem_id,tour_id);
    },

    async updateLiveLinkSetting(req){
        return await bunyangMapper.updateLiveLinkSetting(req.body);
    },
    
    async updateAlarmSetting(req){
        return await bunyangMapper.updateAlarmSetting(req.body);
    },
    
    async updateVisitReservationSetting(req){
        const { tr_id, td_id, userList, tour_id} = req.body; 
        await bunyangMapper.deleteReservationMember(req.body);
        await userList.map(async (value)=>{

            let bodyMap = {
                td_id : td_id,
                tour_id : tour_id,
                tr_id : tr_id,
                tm_name : value.name,
                tm_phone : value.phone,
            }
            await bunyangMapper.insertReservationMember(bodyMap);
        })

        //return await bunyangMapper.updateLiveLinkSetting(req.body);
        return await bunyangMapper.updateReservationLink_my(req.body);
    },
        
}