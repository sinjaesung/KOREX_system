//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import SubTitle from '../../../component/common/SubTitle';
import Member from '../../../component/member/mypage/mymember/Member';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//redux
import { useSelector } from 'react-redux';

//server process
import serverController from '../../../server/serverController';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

export default function Join() {

  ChannelServiceElement.shutdown();

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  const history = useHistory();

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  useEffect(async () => {
    console.log('mypage도달>>> 로그인세션여부검사 및 관련 조회::');
    let res = await serverController.connectFetchController('/api/auth/islogin', 'get');
    //마이페이지 도달시에도 정보 저장 마이펭지 표면 노출되는 유저이름,프로필url등 state바로저장. 
    if (res) {
      if (res.login_session == null) {
        //alert('비로그인 상태입니다.'); 유효하지않은 정보인경우or비로그인
        Login_userActions.isloginchange({ islogins: 0 });
        history.push(`/MemberLogin`);
        //비로그인상태라면 로그인페이지 이동처리!
        return;
      } else {
        var get_memid = res.login_session.user_id;//mem_id 얻기
        let body_info = {
          mem_id: get_memid
        };
        console.log(JSON.stringify(body_info));
        let user_info = await serverController.connectFetchController('/api/auth/userinfo_request', 'POST', JSON.stringify(body_info));
        console.log('userinfo_request >>> res_result:', user_info, user_info.user_data);

        if (user_info.success) {
          //회원정보 조회가 성공한경우에만!

          setUsername(user_info.user_name);
          setUserprofile(user_info.mem_img);

          if (user_info.user_data.user_type != '개인') {
            //개인은 userType바뀔일이없다.
            if (user_info.user_data.user_type == '' || !user_info.user_data.user_type || user_info.user_data.company_id == '' || !user_info.user_data.company_id) {
              //하나라도 비어있던경우에 선택된 소속이랑 user_type정보가 없던 경우 유효치 않은 값이 하나라도 있는경우라면 마이페이지 보여주지 않는다!
              history.push('/Team');
              return;
            }
          }

          //해당 로그인 관리자계정(mem_admin==root) 이 소속된 comapnyid에 소속업체에 소속된 관련 팀원들(팀원레벨,register_type:not korex team)인 내역들만 조회 로드시점.해당 페이지 로딩시점.(다른페이지에서 접근시에 실행, 새로고침시에 실행.)
          let body_infoss = {
            company_id: user_info.user_data.company_id
            //기업회원이라면 소속되어있는 companyid값이 있고 그 기준으로 소속팀원들이 나와야한다. 소속되어있는 companyid기준으로 나와야한다.
          }
          let sosok_teamonelist_result = await serverController.connectFetchController("/api/mypage/sosok_teamonelist_request", 'POST', JSON.stringify(body_infoss));

          if (sosok_teamonelist_result) {
            console.log('sosok_teamonelist_resultss:', sosok_teamonelist_result);

            var teamonelist_result;
            if (sosok_teamonelist_result.success) {
              teamonelist_result = sosok_teamonelist_result.result;
            } else {
              teamonelist_result = [];
            }
            console.log('get teamonelist resultsss:', teamonelist_result);
            setTeamonelistresult(teamonelist_result);
          }

          Login_userActions.memidchange({ memids: user_info.user_data.mem_id });
          Login_userActions.companyidchange({ companyids: user_info.user_data.company_id });
          Login_userActions.user_usernamechange({ user_usernames: user_info.user_data.user_username });
          Login_userActions.phonechange({ phones: user_info.user_data.phone });
          Login_userActions.emailchange({ emails: user_info.user_data.email });
          Login_userActions.usernamechange({ usernames: user_info.user_data.user_name });
          Login_userActions.memimgchange({ memimgs: user_info.user_data.mem_img });
          Login_userActions.usertypechange({ usertypes: user_info.user_data.user_type });
          Login_userActions.registertypechange({ registertypes: user_info.user_data.register_type });
          Login_userActions.memadminchange({ memadmins: user_info.user_data.mem_admin });
          Login_userActions.memnotificationchange({ mem_notification: user_info.user_data.mem_notification });
          Login_userActions.isloginchange({ islogins: 1 });
          Login_userActions.companynamechange({ company_name: user_info.user_data.company_name });
          Login_userActions.isprochange({ ispros: user_info.user_data.ispro });
          Login_userActions.memprofilechange({ memprofile: globe_aws_url != '' ? (globe_aws_url + user_info.user_data.mem_img) : ('https://korexdata.s3.ap-northeast-2.amazonaws.com/' + user_info.user_data.mem_img) });
        }
      }
    }
    console.log(BunyangTeam.bunyangTeam)
    if (login_user.user_type == '분양대행사' && (!BunyangTeam.bunyangTeam && (bunyangTeam.bunyangTeam && !bunyangTeam.bunyangTeam.bp_id))) {
      serverController.connectFetchController(`/api/bunyang/team?no=${login_user.memid}`, 'GET', null, function (res) {
        if (res.success == 1) {
          BunyangTeam.updateBunyangTeam({ bunyangTeam: res.data[0] });
        }
      });
    }

  }, []);

  const [teamonelistresult, setTeamonelistresult] = useState([]);

  useEffect(() => {
    console.log('===>>>teamonelistresult state상태배열 변경에 따른 액션 수행', teamonelistresult);
  }, [teamonelistresult]);

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />

        {
          login_user.user_type !== '개인' ?
            login_user.user_type == '분양대행사' ?
              <SubTitle title={bunyangTeam.bunyangTeam && bunyangTeam.bunyangTeam.bp_name ? bunyangTeam.bunyangTeam.bp_name : "소속명"} arrow={"　▼"} path={"/BunyangTeam"}/>
              :
              <SubTitle title={login_user.company_name} arrow={"　▼"} path={"/Team"}/>
            :
            <SubTitle title={login_user.company_name} arrow={"　▼"} path={"/Team"} />
        }
        <Member teamonelistresult={teamonelistresult} setTeamonelistresult={setTeamonelistresult} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}