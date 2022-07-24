//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import NewRequestBroker from '../../../component/member/mypage/request/NewRequestBroker';
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

//server request
import serverController from '../../../server/serverController';

export default function Join() {

  ChannelServiceElement.shutdown();

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)
  const [allregistcount, setallregistcount] = useState(0);

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

          console.log('페이지로드시점 관련 tempBrokerRequest신청 건물정보 리덕스 조회:', tempbrokerRequest);

          if (tempbrokerRequest.maemultype == '아파트' || tempbrokerRequest.maemultype == '오피스텔') {
            let body_info = {
              danginame: tempbrokerRequest.dangi,
              complexid: temp_selectcomplexinfo.complexid,
              maemultype: tempbrokerRequest.maemultype
            };
            let company_probrokerlist_apartopi = await serverController.connectFetchController('/api/mypage/probroker_company_apartopi', 'POST', JSON.stringify(body_info));
            console.log('관련 전문중개사리스트:::>>', company_probrokerlist_apartopi);

            if (company_probrokerlist_apartopi.success) {
              let resultss = company_probrokerlist_apartopi.result;

              if (resultss.length == 0) {
                alert('결과가 없습니다.');
                return;
              }

              setProbrokerlist(resultss);
            }

          } else {
            if (tempbrokerRequest.jibunsimple != '') {
              let body_info = {
                id_val: tempbrokerRequest.jibunsimple//지번주소 읍면동값 읍면동레벨값 키워드
              };

              let match_probrokerList = await serverController.connectFetchController('/api/matterial/addrunits_match_probrokerlist', 'POST', JSON.stringify(body_info));
              if (match_probrokerList) {
                console.log('전체전문중개사리스트::', match_probrokerList);
                if (match_probrokerList.success) {

                  if (match_probrokerList.result.length == 0) {
                    alert('결과가 없습니다.');
                    return;
                  }
                  setProbrokerlist(match_probrokerList.result);
                } else {

                }
              }
            } else {
              // alert('적합하지 않은 접근입니다!');
              // history.push('/AddRequest');
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

    let info_req = {

    }
    let all_regist_productinfo = await serverController.connectFetchController('/api/broker/all_regist_productProcess', 'POST', JSON.stringify(info_req));
    if (all_regist_productinfo) {
      if (all_regist_productinfo.success) {
        console.log('all regist productinfo::', all_regist_productinfo);

        setallregistcount(all_regist_productinfo.all_regist_count);
      }
    }

  }, []);

  const tempbrokerRequest = useSelector(data => data.tempBrokerRequest);
  const temp_selectcomplexinfo = useSelector(data => data.temp_selectComplexinfo);
  console.log('===>>전문중개사선임리스트 page콤퍼는트>일단 전체전문중개사리스트 뽑기 deefault::');

  const [probrokerlist, setProbrokerlist] = useState([]);

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
        <SubTitle title={"중개의뢰 추가"} rank={false} cursor={"default"} />
        <NewRequestBroker probrokerlist={probrokerlist} setProbrokerlist={setProbrokerlist} allregistcount={allregistcount} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}