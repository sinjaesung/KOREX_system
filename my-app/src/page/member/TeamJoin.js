//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import serverController from '../../server/serverController';

import styled from "styled-components"

//component
import MainHeader from '../../component/common/MainHeader';
import SubTitle from '../../component/common/SubTitle';

import JoinTab from '../../component/member/login/TeamLoginTab';
import JoinPwd from '../../component/member/join/TeamJoinPwd';
import JoinCheck from '../../component/member/join/TeamJoinCheck';

import MainFooter from '../../component/common/MainFooter';
import TermService from '../../component/common/TermsOfService';
import TermPrivacy from '../../component/common/TermsOfPrivacy';
import TermLocation from '../../component/common/TermsOfLocation';
//import ImgDetail from "../../../component/common/house/ImgDetail";
//import LiveModal from "../../../component/common/house/LiveModal";

import { agreestatuschange } from '../../store/modules/temp_register_userdata';
import { tempRegisterUserdataActions } from '../../store/actionCreators';

import { useSelector } from 'react-redux';
import { tempRegisterdataActions } from '../../store/actionCreators';
//import ModalCalendar from "../../../component/common/house/ModalCalendar";

import ChannelServiceElement from '../../component/common/ChannelServiceElement';

import crypto from 'crypto-js';

import CommonFooter from '../../component/common/commonFooter';

import Bunyang from '../../component/common/bunyang/Bunyang';

export default function JoinAgree({ match }) {

  ChannelServiceElement.shutdown();

  console.log('teamjoin js실행======================', match, match.params);

  const encrypt = (data, key) => {
    return crypto.AES.encrypt(data, key).toString();
  };

  const decrypt = (text, key) => {
    try {
      const bytes = crypto.AES.decrypt(text, key);
      // return JSON.parse(bytes.toString(crypto.enc.Utf8));
      return bytes.toString(crypto.enc.Utf8);
    } catch (err) {
      console.log('errorsss:', err);
    }
    return;
  }


  var authinfo = match.params.authinfo;
  console.log('authinfossss:', authinfo, typeof authinfo);

  let authinfo_querystring_array = authinfo && authinfo.split(' ');
  let make_original_encrypt = '';

  let make_transfer_querystring = '';
  for (let ss = 0; ss < authinfo_querystring_array.length; ss++) {
    let items = authinfo_querystring_array[ss];
    if (ss == authinfo_querystring_array.length - 1) {
      make_original_encrypt += items;
      make_transfer_querystring += items;
    } else {
      make_original_encrypt += (items + '/');
      make_transfer_querystring += (items + ' ');
    }
  }
  console.log('복구한 원본 문자열:', make_original_encrypt, decrypt(make_original_encrypt, "infoquerystring"));

  var authinfo_final = decrypt(make_original_encrypt, "infoquerystring");

  var invite_memid = authinfo_final.split(',')[0];//초대자memid
  invite_memid = invite_memid.split(":")[1];
  var invite_companyid = authinfo_final.split(',')[1];//초대자 companyid소속id
  invite_companyid = invite_companyid.split(":")[1];
  var invite_mem_phone = authinfo_final.split(',')[2];//초대자으 ㅣ폰번호
  invite_mem_phone = invite_mem_phone.split(":")[1];
  var invite_mem_usertype = authinfo_final.split(',')[3];//초대자 유저타입(어떤 초대수락하는 사람의 유저타입: 중개사에서인지,기업,분양사에서인지여부)
  invite_mem_usertype = invite_mem_usertype.split(":")[1];
  var receiver_phone = authinfo_final.split(',')[4];//피초대자휴대폰 번호 가입하려는 폰번호
  receiver_phone = receiver_phone.split(":")[1];

  console.log('invite_mem_usertype::', invite_mem_usertype);

  const history = useHistory();
  const tempregisteruserdata = useSelector(data => data.temp_register_userdata);

  console.log('data.temp_register_userdata refer info:', tempregisteruserdata, tempRegisterUserdataActions);

  //이용약관
  const [termservice, setTermService] = useState(false);
  const openTermService = (onOff) => { setTermService(onOff); }

  //개인정보처리방침
  const [termprivacy, setTermPrivacy] = useState(false);
  const openTermPrivacy = (onOff) => { setTermPrivacy(onOff); }

  //위치기반서비스 이용약관
  const [termlocation, setTermLocation] = useState(false);
  const openTermLocation = (onOff) => { setTermLocation(onOff); }

  //분양 모달
  const [bunyang, setBunyang] = useState(false);
  const openBunyang = (onOff) => { setBunyang(onOff); }
  //라이브 시청 모달
  const [live, setLive] = useState(false);
  //분양 상세이미지 모달
  const [detailimg, setDetailImg] = useState(false);
  const [cal, setCal] = useState(false);

  /*비밀번호 규정 show, hide*/
  const [pwdShow, setPwdShow] = useState(false);
  /*비밀번호 validate*/
  const [pwd, setPwd] = useState("");/*기본값*/
  const [pwdConfirm, setPwdConfirm] = useState("");/*기본값*/
  const [active, setActive] = useState(false);

  //동의 상태 문자열 조정
  const [agreestatus, setAgreeStatus] = useState('');//agree_esstiaonl1,2,3,4,agree_optional 여부 필수1~4 모두 포함하고 있어야 통과
  const [agreePossible, setAgreePossible] = useState(false);//기본값 false 

  const checkVaildate = () => {
    return pwd.length > 7
      && pwdConfirm.length > 7
      && pwd == pwdConfirm && (agreePossible == true)
  }

  useEffect(() => {
    console.log('TeamJoinagree>useEFFECT>> =====관련 컴포넌트들으 ㅣ프로퍼티state값 상태변화감지:', pwd, pwdConfirm, agreestatus, agreePossible, active);

    if (checkVaildate())
      setActive(true);
    else
      setActive(false);

    tempRegisterUserdataActions.usertypechange({ usertypes: invite_mem_usertype });
    tempRegisterUserdataActions.passwordchange({ passwords: pwd });
    tempRegisterUserdataActions.agreestatuschange({ agreeStatuss: agreestatus });
  })

  //팀원 가입 액션    
  const team_regist_submit_function = async (e) => {
    console.log('team_regist_submit_function개인 companyjoinagree에서 만들어진것을 하위로 보냄, 팀원 회원가입submit발생');

    console.log('submit버튼 누른 시점 당시의 모든 프로퍼티값들 pwd,pwddconfir,active,agreestatus,agreepoissible,username,phone,사업자번호등 값 조회');
    console.log('data.temp_register_userdata refer info:', tempregisteruserdata, tempRegisterUserdataActions);

    if (active == true) {
      let body_info = {
        //email: '',
        agree_status: tempregisteruserdata.agree_status,
        //name:tempregisteruserdata.name,
        password: tempregisteruserdata.password, //초대받은 사람(링크로들어온)입력암호
        phone: receiver_phone,//수신받은사람 휴대폰번호로 가입.
        company_id: invite_companyid,//초대한 사람의 companyid값.
        invite_memid_val: invite_memid,//초대한 사람의 memid값.
        usertype: tempregisteruserdata.usertype, //초대한 사람의 유저타입(사업체타입)
        //팀원가입 처리>>받은 수신받은 휴대폰번호, usertype, 암호암호확인,동의상태값.
      };
      console.log('JSON>STRINGIFY(BODY_INFO):', JSON.stringify(body_info));
      let res = await serverController.connectFetchController("/api/auth/team/register", "POST", JSON.stringify(body_info));
      console.log('res_result:', res);
      //alert(res);
      //팀원 가입완료후 페이지 이동 등 액션

      if (res.success) {
        alert('팀원 가입요청 처리되었습니다.');
        //history.push(`/`);
        console.log(res.result);
        let get_teamuser_memid = res.result;
        //초대장 화면 참여 페이지로 spa이동시킴. 이 페이지에서 참여 누르면
        history.push('/TeamInvitefinal/' + get_teamuser_memid + '  ' + make_transfer_querystring);//가입성공한 memid를 보낸다. 참여누르는경우에 누르는경우에 한해서 특정 팀원으로써의 소속추가됨.
        //history.push('/');
      } else {
        //alert(res.message);

        history.push('/TeamLogin/' + make_transfer_querystring);//이미 있는 회원이라고하면 로그인페이지이동한다.
      }

    }
  }
  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} />
        <MainHeader openBunyang={openBunyang} />
        <SubTitle title={"회원가입"} />
        <JoinTab usertype={invite_mem_usertype} />
        <JoinPwd
          pwd={pwd}
          pwdShow={pwdShow}
          setPwdShow={setPwdShow}
          setPwd={setPwd}
          pwdConfirm={pwdConfirm}
          setPwdConfirm={setPwdConfirm}
          authinfo={authinfo_final}
        />
        <JoinCheck
          active={active}
          setActive={setActive}
          agreeStatus={agreestatus}
          setAgreeStatus={setAgreeStatus}
          agreePossible={agreePossible}
          setAgreePossible={setAgreePossible}
          team_regist_submit_function={team_regist_submit_function}
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