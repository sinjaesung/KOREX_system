const bcrypt = require('bcrypt');
const { korexConn } = require('../database/connection');
const { queryValue } = require('../modules/queryset');
const userService = require('../service/userService');
const companyService = require('../service/companyService');
const authMapper = require('../mapper/auth');
const companyMapper = require('../mapper/company');
const userMapper = require('../mapper/user');
const notificationMapper = require('../mapper/notification');

module.exports = {
    async getBasicFcmAuthentication(req){
        return await authMapper.getBasicFcmAuthentication(req);
    },
    //개인회원가입 전에 고유식별자로부터 서버에 요청하여 얻어낸 개인회원가입인증요청자의 이메일값을 추적하여 얻는부분코드.그 얻는 과정에서 유효하지않은 값여부 판단
    async getMemberRegiEmailIdentify(res,req){
        var result =  await authMapper.getMemberRegiEmailIdentify(req);
        if(result.length>=1){
            var email_get=result[0].identify_email;
            var certify_possible_datetime=result[0].certify_possible_datetime;

            if(new Date().getTime() < certify_possible_datetime.getTime()){
                return res.json({success:true, message:'success',result:email_get});
            }else{
                return res.json({success:false,message:'인증메일의 유효기간시간이 지났습니다!',result:undefined});
            }
        }else{
            return res.status(403).json({success:false, message:'메일인증 식별자값이 유효하지 않습니다.',result:undefined});//해당 식별자값이 유효하지 않아서 결과가 없는경우.
        }       
    },
    async register(req) {
        if (!req.body.user || !req.body.type) { throw 'INVALID_KEY' };
        if ([ '개인', '기업', '중개사', '분양대행사' ].indexOf(req.body.type) === -1) { throw 'NOT_FOUND_TYPE' };

        return await korexConn(async (conn) => {
            let userId;
            req.body.user.password = await bcrypt.hashSync(req.body.user.password, 10);
            req.body.user.user_type = req.body.type;
            const userCreateFields = await userMapper.getUserFields('create');
            const companyCreateFields = await companyMapper.getCompanyFields('create');
            const notificationSet = {};
            const existsUser = await userService.existsUser({ 
                query: { 
                    user_type: req.body.type,
                    email: req.body.user.email,
                    phone: req.body.user.phone
                }
            });

            try {
                await conn.beginTransaction();
                
                if (!existsUser) { 
                    const userData = await queryValue(conn, req.body.user, 'create', userCreateFields);
                    userId = await userMapper.insertUser(conn, userData);
                };

                if (req.body.type === '개인') {
                    if (!!existsUser) { throw 'ALREADY_EXIST_USER'; };

                    notificationSet.notiset_prd = 1;
                    notificationSet.notiset_rsv_prd_reserve = 1;
                };

                if (req.body.type === '중개사' || req.body.type === '기업' || req.body.type === '분양대행사') { 
                    if (!req.body.company) { throw 'INVALID_KEY' };
                    
                    const existsCompany = await companyService.existsCompany({ query: { company_no: req.body.company.company_no } });
                  
                    if (!existsCompany && !!req.body.company.company_no) { 
                        if (!!existsUser) {
                            const queryWhere = `where phone = ${conn.escape(req.body.user.phone)} and user_type = ${conn.escape(req.body.type)}`;
                            const user = await userMapper.getUser(conn, [ 'mem_id' ], queryWhere); 
                            userId = user.mem_id
                        };

                        req.body.company.reg_user_id = userId;
                        const companyData = await queryValue(conn, req.body.company, 'create', companyCreateFields);
                        const companyId = await companyMapper.insertCompany(conn, companyData);
                        const companyMemberSet = { cm_type: 1, mem_id: userId, register_mem_id: userId, company_id: companyId };
                        const companyMemberData = await queryValue(conn, companyMemberSet, 'create');
                        
                        notificationSet.company_id = companyId;

                        switch (req.body.type) {
                            case '기업': 
                                notificationSet.notiset_rsv_prd_reserve = 1
                                notificationSet.notiset_prd = 1; 
                                await companyMapper.insertCompanyMember(conn, companyMemberData);
                                break;
                            case '분양대행사': 
                                notificationSet.notiset_bunyangsupply_live_reserv = 1;
                                notificationSet.notiset_bunyangsupply_visit_reserv = 1;
                                break;
                            case '중개사':
                                notificationSet.notiset_rsv_prd_reserve = 1
                                notificationSet.notiset_bunyangsuyo_project = 1;
                                notificationSet.notiset_bunyangsuyo_newlive = 1;
                                notificationSet.notiset_bunyangsuyo_mylive = 1;
                                notificationSet.notiset_bunyangsuyo_myvisit = 1;
                                await companyMapper.insertCompanyMember(conn, companyMemberData);
                                break;
                            default:
                        };

                        await userMapper.updateUser(conn, `company_id = ${companyId}`, userId);
                    } else {
                        throw 'ALREADY_EXIST_COMPANY_OR_NO_COMPANY_NO_VALUE';
                    };
                };
                
                notificationSet.mem_id = userId;
                notificationSet.notiset_mrk = req.body.notiset_mrk || false;
                const notificationData = await queryValue(conn, notificationSet, 'create');
                await notificationMapper.insertNotificationSetting(conn, notificationData);
                await conn.commit();

                return;
            }
            catch (err) {
                await conn.rollback();
                throw err;
            }
        });
    },
    async getMemberRegister(res,req){
        var result = await authMapper.getMemberRegister(req);
        if(result.success){
            return res.json({success:true, message: result.message});
        }else{
            return res.status(403).json({success:false, message: result.message});
        }
    },

    async registerSocialAppleLogin(res,req,result){
        
        var mapper_result= await authMapper.getRegisterSocialAppleLogin(req,result);//success true이면 가입정보가 이미 있어서 바로 로그인처리. 아니면 가입폼동의페이지로 이동시키기!
        if(mapper_result.success){
            //이미 코렉스에 존재하고있었던 경우에는 바로 로그인처리합니다.

            req.session.user_id=mapper_result['newuserid_val'];
            req.session.islogin= true;

            req.session.save(function(){
                res.statusCode=302;
                res.setHeader('Location','http://korexpro.com/');
                res.redirect('http://korexpro.com/');
                res.end();
            });
            //return res.json({success:true, message: result.message});
        }else{
            //소셜가입동의 등 페이지로 이동합니다.가입요청시에 가입처리됨.애플소셜회원가입처리.
            res.statusCode=302;
            res.setHeader('Location','http://korexpro.com/MemJoinAgreeSocial/'+mapper_result['newuserid_val']);
            res.redirect('http://korexpro.com/MemJoinAgreeSocial/'+mapper_result['newuserid_val']);
            res.end();
            //return res.status(403).json({success:false, message:result.message});
        }
    }
};
