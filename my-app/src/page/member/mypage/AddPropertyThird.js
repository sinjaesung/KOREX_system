//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import NewPropertyThird from '../../../component/member/mypage/property/NewPropertyThird';
import ModalPicture from '../../../component/member/mypage/property/modal/ModalPicture';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import ModalCommon from "../../../component/common/modal/ModalCommon";
import ModalCommonWithoutcancel from "../../../component/common/modal/ModalCommonWithoutcancel";

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server request
import serverController from '../../../server/serverController';

export default function Join({ prd_id }) {

  console.log('파람스', prd_id );

  const [prdID, setprdID] = useState(prd_id)



  ChannelServiceElement.shutdown();

  const temp_brokerRequest = useSelector(data => data.tempBrokerRequest);//세번째 페이지 도달시에 유효한지 정보가 이전페이지에서 입력한 정보들 또한 리덕스정보가 없는상태인지?새로고침으로 비정상적 유입한경우에는.

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

          console.log('==>>>페이지 유입시에 리덕스 정보 유효성 및 페이지 적절한 상태로 유입여부 판단::', temp_brokerRequest);
          if (!temp_brokerRequest.floor || !temp_brokerRequest.dangijibunaddress || !temp_brokerRequest.dangiroadaddress || !temp_brokerRequest.x || !temp_brokerRequest.y || !temp_brokerRequest.name || !temp_brokerRequest.phone || !temp_brokerRequest.maemultype || !temp_brokerRequest.maemulname || !temp_brokerRequest.jeonyongdimension || !temp_brokerRequest.jeonyongpyeong || !temp_brokerRequest.supplydimension || !temp_brokerRequest.supplypyeong || !temp_brokerRequest.selltype || !temp_brokerRequest.sellprice) {
            //건물에 대한 기본적인 선택정보조차 없다는것은 문제가있다는것이고, 그상태로 유입한것에 대해서 막을수있다.새로고침으로 리덕스 정보유지없이 그냥 넘어온 불법접속 막음.

            //alert('유효하지 않은 접근인것같습니다. 또는 건물입력정보가 유효하지않습니다.(ex: 건물 위치정보(x,y) 유효하지않음 )');
            //history.push('/AddProperty');

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

  const [serveruploadimgs_server, setServeruploadimgs_server] = useState([]);//서버에 반영할 최종적 이미지업로드 리스트.(inserted만 진행.)
  const [changeaddedimgs_server, setChangeaddedimgs_server] = useState([]);

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: '', title: '', submitnone: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });
  const [sort, setSort] = useState(0);
  const [condi, setCondi] = useState(0);

  const [imgfiles, setimgfiles] = useState([])

  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  const updateModal = (sss) => {
    console.log('나오긴하냐?', sss );
    setModalOption({
      show: true,
      setShow: offModal,
      title: '사진업로드',
      content: {
        type: "components", text: "TESESDGSDGSDG",
        component: <ModalPicture setServeruploadimgs_server={setServeruploadimgs_server} setChangeaddedimgs_server={setChangeaddedimgs_server} serveruploadimgs_server={serveruploadimgs_server} changeaddedimgs_server={changeaddedimgs_server} imgfiles={imgfiles} setimgfiles={setimgfiles} prd_id={prd_id} offModal={offModal}/>
      },
      submit: {
        show: true, title: '취소', event: () => {
          console.log('serveruploadimgs_server:', serveruploadimgs_server);

          offModal();
          //모달창 새로 열때마다 state는 초기화되는 개념이라고 보면되고, state는 유지된다. 유지된 state값으로 전달되어져서 넘긴다.
          console.log('사진업로드 적용 시점때 리덕스 저장해버리기', serveruploadimgs_server);

        }
      },
      cancle: { show: false, title: '초기화' ,event: ()=>{
        console.log('데이터는 없다');

      } },
      confirm: { show: false, title: "확인" }
    });
  }

  useEffect(() => {
    console.log('serveruprlaodinmsg server변경 state변경::', serveruploadimgs_server);

    /*if(serveruploadimgs_server.length <3){
      alert('사진은 최소 3장 등록해주세요.');
      return;
    }*/

  }, [serveruploadimgs_server]);
  //사진모달창에서 처리된 스태이트 업로드이미지들/뷰형태의 이미지들 관련된 처리를 리스트를 받는 별도 state객체. newProoerptyhird compeontn로 보내어서 최종적으로 물건 등록(외부수임등록)시에:추가정보 등록시에 반영되게끔 한다.
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
        <SubTitle title={"물건 등록"} rank={false} cursor={"default"} />
        <NewPropertyThird updateModal={updateModal} serveruploadimgs_server={serveruploadimgs_server} changeaddedimgs_server={changeaddedimgs_server} setimgfiles={setimgfiles} imgfiles={imgfiles} prdID={prdID} />
        {/* <ModalCommon modalOption={modalOption} /> */}
        <ModalCommonWithoutcancel modalOption={modalOption} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}