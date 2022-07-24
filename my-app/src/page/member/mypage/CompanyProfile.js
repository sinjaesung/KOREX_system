//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import SubTitle from '../../../component/common/SubTitle';
import CompanyProfile from '../../../component/member/mypage/CompanyProfile';

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

  const history = useHistory();

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  useEffect(async () => {
    console.log('mypage도달>>> 로그인세션여부검사 및 관련 조회::');
    let res = await serverController.connectFetchController('/api/auth/islogin', 'get');
    //마이페이지 도달시에도 정보 저장 마이펭지 표면 노출되는 유저이름,프로필url등 state바로저장. 
    console.log('로그인세션 여부 상태값 여부:', res);
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

          console.log('내부 컴포넌트의 미시적 변화때마다 실행하지는 않고, 아무런 컴포넌트 미감지하겠다, 최초 실행시점때만 실행', user_info);

          let body_info = {
            //임의 관리자가 선택한(들어온) 소속기업(companyid)에 해당하는 것에 대한 조회 및 수정처리한다.
            company_id: user_info.user_data.company_id
          }
          let view_info = await serverController.connectFetchController('/api/mypage/companyprofileView', 'POST', JSON.stringify(body_info));
          console.log(view_info);

          var company_info_data = view_info.result_data[0];
          var origin_userinfo_data = view_info.result_data[1];
          console.log('====>>companyinfodata,originuserinfodata::', company_info_data, origin_userinfo_data);
          try {

            //data_store['address2']= company_info_data[0].address.split('  ')[0];
            //data_store['address3']= company_info_data[0].address.split('  ')[1];
            setphone(company_info_data[0].ceo_phone);
            setCeoname(company_info_data[0].ceo_name);
            setCeophone(company_info_data[0].ceo_phone);
            setcompanyname(company_info_data[0].company_name);
            setAddressroad(company_info_data[0].addr_road);
            setAddressjibun(company_info_data[0].addr_jibun);
            setAddressdetail(company_info_data[0].addr_detail);
            setCompanyImg(company_info_data[0].profile_img);

            Login_userActions.companynamechange({ company_name: company_info_data[0].company_name });

            let data_store2 = {};
            data_store2['company_no'] = company_info_data[0].company_no;
            data_store2['originusername'] = origin_userinfo_data[0].user_name;
            data_store2['originuserphone'] = origin_userinfo_data[0].phone;

            setoriginuserinfo(data_store2);

          } catch (e) {
            console.log('error message:', e);
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


  const [companyname, setcompanyname] = useState('');
  const [companyImg, setCompanyImg] = useState(null);
  //const [addressdetail,setAddressdetail] = useState('');
  const [addr_road, setAddressroad] = useState('');
  const [addr_jibun, setAddressjibun] = useState('');
  const [addressdetail, setAddressdetail] = useState('');
  const [phone, setphone] = useState('');
  const [ceoname, setCeoname] = useState('');
  const [ceophone, setCeophone] = useState('');
  const [search_address, setSearch_address] = useState('');

  const [active, setActive] = useState('');

  //최초가입자 정보 조회
  const [originuserinfo, setoriginuserinfo] = useState({});

  const checkVaildate = () => {
    return companyname != ''
      && addr_road != '' && addr_jibun != '' && phone != ''
      && ceoname != '' && ceophone != ''
  }

  const store_submit = async () => {
    console.log('회사프로필설정 submit발생=>>>>>>>>>>>>>', phone, ceoname, ceophone, companyname, addr_road, addr_jibun, active, companyImg);
    //바로 serverController fetch api진행. 회사프로필지정진행 어디소속(companyid:관리자 추가한 소속기업<>팀원계정)에 대해서 수정을 가하는지 
    //각팀원게정들은 자신의 부모 생성자가 누구인지 참조필요?? 생성시점때 생성하는 root기업 mem_id or companyid지정필요 (mother_memid, mother_companyid) 부모 memid관리자생성자, companyid부모생성기업.관리자가 자신자체를 수정하는경우도? 자신자체는 곧 최초 회원가입시 입력한 회사정보등(사업자번호)등 기반으로 한 root기업 수정.
      let body_info = {
        company_id: login_user.company_id,//해당 companyid 회사정보 수정한다...
        companyname: companyname,
        //companyImg: companyImg ? URL.createObjectURL(companyImg) : null, // 프로필 사진
        address_road: addr_road,
        address_jibun: addr_jibun,
        addr_detail: addressdetail,
        phone: phone,
        ceoname: ceoname,
        ceophone: ceophone,
      }
      console.log('edit store company profileinfo json post sender:', JSON.stringify(body_info));

      let res = await serverController.connectFetchController('/api/mypage/companyprofileEdit', 'POST', JSON.stringify(body_info));
      console.log(res);

      if (res.success) {

        alert('수정되었습니다.');

        history.push('/Mypage');
      }
  };
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
              <SubTitle title={bunyangTeam.bunyangTeam && bunyangTeam.bunyangTeam.bp_name ? bunyangTeam.bunyangTeam.bp_name : "소속명"} path={"/BunyangTeam"}/>
              :
              <SubTitle title={login_user.company_name} path={"/Team"}/>
            :
            <SubTitle title={login_user.company_name} path={"/Team"}/>
        }
        <CompanyProfile
          companyname={companyname}
          companyImg={companyImg}
          addr_road={addr_road}
          addr_jibun={addr_jibun}
          addressdetail={addressdetail}
          phone={phone}
          ceoname={ceoname}
          ceophone={ceophone}
          setcompanyname={setcompanyname}
          setCompanyImg={setCompanyImg}
          setAddressroad={setAddressroad} setAddressjibun={setAddressjibun} setAddressdetail={setAddressdetail} setphone={setphone} setCeoname={setCeoname} setCeophone={setCeophone} originuserinfo={originuserinfo} store_submit={store_submit} search_address={search_address} setSearch_address={setSearch_address} active={active} setActive={setActive} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}