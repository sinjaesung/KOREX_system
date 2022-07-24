//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import MyAlarm from '../../../component/member/mypage/alarm/MyAlarm';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//redux 
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server process
import serverController from '../../../server/serverController';

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


  const [exculsive_supply_privacycompany_notilist, setexculsive_supply_privacycompany_notilist] = useState([]);
  const [exculsive_supply_probroker_notilist, setexculsive_supply_probroker_notilist] = useState([]);
  const [exculsive_demand_notilist, setexculsive_demand_notilist] = useState([]);
  const [bunyangsuyo_notilist, setbunyangsuyo_notilist] = useState([]);
  const [bunyangsupply_notilist, setbunyangsupply_notilist] = useState([]);

  const [exculsive_supply_privacycompany_notilist_notseencnt, setexculsive_supply_privacycompany_notilist_notseencnt] = useState(0);
  const [exculsive_supply_probroker_notilist_notseencnt, setexculsive_supply_probroker_notilist_notseencnt] = useState(0);
  const [exculsive_demand_notilist_notseencnt, setexculsive_demand_notilist_notseencnt] = useState(0);
  const [bunyangsuyo_notilist_notseencnt, setbunyangsuyo_notilist_notseencnt] = useState(0);
  const [bunyangsupply_notilist_notseencnt, setbunyangsupply_notilist_notseencnt] = useState(0);

  const [rank, setRank] = useState(false);

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

          let noti_info = {
            mem_id: user_info.user_data.mem_id//해당 memid에게 가해진 모든 알림 조회.
          }
          let noti_list_request = await serverController.connectFetchController('/api/alram/myalram_list_process', 'POST', JSON.stringify(noti_info));
          console.log('==>>>noti_list_requestss:', noti_list_request);

          if (noti_list_request.success) {
            let exculsive_supply_privacycompany_notilist_res = noti_list_request.result[0];
            let exculsive_supply_probroker_notilist_res = noti_list_request.result[1];
            let exculsive_demand_notilist_res = noti_list_request.result[2];//전속매물수요 관련 데이터 페이지첫 로드시점때만 (새로고침,첫 유입시에만확인, 이후에 데이터 변동시(데이터개수의 변경)때는 명시적 항목 state변수의 갱신을 통한 페이지 요소 재랜더링(서버통신x),숨김처리시엔 실제 서버통신해서 항목 재랜더링(페이지자체 재로드개념x) 각 탭별(전속매물공급중개사,전속매물공급개인기업,전속매물수요) 탭별 페이지네이션 로컬데이터필요함.페이지내이션 데이터또한 서버통신은하지않음.
            let bunyangsuyo_notilist_res = noti_list_request.result[3];
            let bunyangsupply_notilist_res = noti_list_request.result[4];

            let exculsive_supply_privacycompany_notilist_notseen = noti_list_request.count_result[0];
            let exculsive_supply_probroker_notilist_notseen = noti_list_request.count_result[1];//각 카운트수.
            let exculsive_demain_notilist_notseen = noti_list_request.count_result[2];
            let bunyangsuyo_notilist_notseen = noti_list_request.count_result[3];
            let bunyangsupply_notilist_notseen = noti_list_request.count_result[4];

            setexculsive_supply_privacycompany_notilist(exculsive_supply_privacycompany_notilist_res);
            setexculsive_supply_probroker_notilist(exculsive_supply_probroker_notilist_res);
            setexculsive_demand_notilist(exculsive_demand_notilist_res);
            setbunyangsuyo_notilist(bunyangsuyo_notilist_res);
            setbunyangsupply_notilist(bunyangsupply_notilist_res);


            setexculsive_supply_privacycompany_notilist_notseencnt(exculsive_supply_privacycompany_notilist_notseen);//전속매물공급(개인기업)읽지않은
            setexculsive_supply_probroker_notilist_notseencnt(exculsive_supply_probroker_notilist_notseen);//전속매물공급(전문중개사)읽지않은
            setexculsive_demand_notilist_notseencnt(exculsive_demain_notilist_notseen);//전속매물수요 읽지않은 카운트.
            setbunyangsuyo_notilist_notseencnt(bunyangsuyo_notilist_notseen);
            setbunyangsupply_notilist_notseencnt(bunyangsupply_notilist_notseen);
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

  useEffect(() => {
    console.log('myalram관련 요소들 state변경시에 실행!!!:', exculsive_supply_privacycompany_notilist, exculsive_supply_probroker_notilist, exculsive_demand_notilist, exculsive_supply_privacycompany_notilist_notseencnt, exculsive_supply_probroker_notilist_notseencnt, exculsive_demand_notilist_notseencnt);
  }, [exculsive_supply_privacycompany_notilist, exculsive_supply_probroker_notilist, exculsive_demand_notilist, exculsive_supply_privacycompany_notilist_notseencnt, exculsive_supply_probroker_notilist_notseencnt, exculsive_demand_notilist_notseencnt]);

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
        {/*기업,중개사,분양대항사으로 로그인했을때*/}
        {/* <SubTitle title={"소속명"} arrow={"　▼"} rank={true} path={"/Team"} cursor={"pointer"}/> */}
        {/*개인로 로그인했을때*/}
        {/*기업으로 로그인했을때*/}
        {
          login_user.user_type !== '개인' ?
            login_user.user_type == '분양대행사' ?
              <SubTitle title={bunyangTeam.bunyangTeam && bunyangTeam.bunyangTeam.bp_name ? bunyangTeam.bunyangTeam.bp_name : "소속명"} path={"/BunyangTeam"} rank={true} />
              :
              <SubTitle title={login_user.company_name} path={"/Team"} rank={true} />
            :
            <SubTitle rank={true}/>
        }

        <MyAlarm exculsive_supply_privacycompany_notilist={exculsive_supply_privacycompany_notilist} exculsive_supply_probroker_notilist={exculsive_supply_probroker_notilist} exculsive_demand_notilist={exculsive_demand_notilist} exculsive_supply_privacycompany_notilist_notseencnt={exculsive_supply_privacycompany_notilist_notseencnt} exculsive_supply_probroker_notilist_notseencnt={exculsive_supply_probroker_notilist_notseencnt} exculsive_demand_notilist_notseencnt={exculsive_demand_notilist_notseencnt} setexculsive_supply_privacycompany_notilist={setexculsive_supply_privacycompany_notilist} setexculsive_supply_probroker_notilist={setexculsive_supply_probroker_notilist} setexculsive_demand_notilist={setexculsive_demand_notilist} setexculsive_supply_privacycompany_notilist_notseencnt={setexculsive_supply_privacycompany_notilist_notseencnt} setexculsive_supply_probroker_notilist_notseencnt={setexculsive_supply_probroker_notilist_notseencnt} setexculsive_demand_notilist_notseencnt={setexculsive_demand_notilist_notseencnt}

          bunyangsuyo_notilist={bunyangsuyo_notilist} setbunyangsuyo_notilist={setbunyangsuyo_notilist}
          bunyangsupply_notilist={bunyangsupply_notilist} setbunyangsupply_notilist={setbunyangsupply_notilist}
          bunyangsuyo_notilist_notseencnt={bunyangsuyo_notilist_notseencnt} setbunyangsuyo_notilist_notseencnt={setbunyangsuyo_notilist_notseencnt}
          bunyangsupply_notilist_notseencnt={bunyangsupply_notilist_notseencnt} setbunyangsupply_notilist_notseencnt={setbunyangsupply_notilist_notseencnt}

        />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}