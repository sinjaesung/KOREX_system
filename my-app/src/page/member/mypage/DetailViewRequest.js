//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import DetailViewRequest from '../../../component/member/mypage/request/DetailViewRequest';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import ModalCommon from '../../../component/common/modal/ModalCommon';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server request
import serverController from '../../../server/serverController';

export default function Edit({ match }) {
  ChannelServiceElement.shutdown();

  //페이지파라미터.
  console.log('개인기업회원 내중개의뢰>물건상세(조회만) 페이지:', match, match.params);
  var prd_identity_id = match.params.id;

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  const history = useHistory();

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  if (!prd_identity_id) {
    alert('유효하지않은 접근!');
    history.push('/');
  }

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

          //페이지파라미터만 존재한다면 관련 정보 불러오기가능.
          console.log('중개의뢰상세조회페이지 useEfffect비동기형태 도달시점에 prdientitiy파라미터전달값을 기준으로의 조회검색:', prd_identity_id);
          let prd_info = {
            prd_identity_idval: prd_identity_id
          };
          let brokerRequest_product_info = await serverController.connectFetchController('/api/broker/brokerRequest_productview', 'POST', JSON.stringify(prd_info));

          if (brokerRequest_product_info) {
            console.log('brokerReuqest produt info::', brokerRequest_product_info);//resultdata 의 첫데이터는 가자 ㅇ초기의 매물수정히스토리내역(가장 오리진정보), 상태변경내엯수정리스트 가장ㅊ로기의 내역에 최근수정된 매물의 정보가 담겨있고,가장 마지막내역 이후의 초기이후의 내역들은 그냥 상태변경내역의 히스토리연장일뿐이다. 초기row에 항상 기본매물정보(x,y값포함)담겨있게끔 한다.
            if (brokerRequest_product_info.success) {

              if (brokerRequest_product_info.result_data) {
                let maemul_info = brokerRequest_product_info.result_data[0];//매물의 보편적(최근수정포함)정보
                let probrokerinfo = brokerRequest_product_info.probroker_match;//전문중개사(선임)정보.
                let result_data_length = brokerRequest_product_info.result_data.length;//그 특정 매물에 대한 히스토리내역들 reuslt_data담김.
                let now_prd_status = brokerRequest_product_info.result_data[result_data_length - 1].prd_status;

                console.log('중개의뢰매물 update내역 정보:', maemul_info, probrokerinfo, now_prd_status);

                setmaemulinfo(maemul_info);
                setprobrokerinfo(probrokerinfo[0]);
                setnowprdstatus(now_prd_status);
              } else {
                alert('해당 매물에 대한 정보가 없습니다.');
                return;
              }
            }
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
    if (login_user.user_type == '분양대행사' && (!BunyangTeam.bunyangTeam && !bunyangTeam.bunyangTeam.bp_id)) {
      serverController.connectFetchController(`/api/bunyang/team?no=${login_user.memid}`, 'GET', null, function (res) {
        if (res.success == 1) {
          BunyangTeam.updateBunyangTeam({ bunyangTeam: res.data[0] });
        }
      });
    }

  }, []);


  const [maemulinfo, setmaemulinfo] = useState({});
  const [probrokerinfo, setprobrokerinfo] = useState({});
  const [nowprdstatus, setnowprdstatus] = useState('');

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
      {/*개인로 로그인했을때*/}
        <SubTitle title={"중개의뢰 상세"} rank={false} cursor={"default"}/>
        <DetailViewRequest maemulinfo={maemulinfo} probrokerinfo={probrokerinfo} nowprdstatus={nowprdstatus}/>
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}