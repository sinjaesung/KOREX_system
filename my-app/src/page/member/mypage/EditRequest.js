//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import EditRequest from '../../../component/member/mypage/request/EditRequest';
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

//server request
import serverController from '../../../server/serverController';

//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

export default function Edit({ match }) {
  ChannelServiceElement.shutdown();

  console.log('editRequest페이지도달::', match, match.params);
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
    alert('유효하지 않은 접근입니다!');
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

          //페이지파라미터 데이터만 있다면 문제없이 처리된다.
          console.log('EditRequset페이지 로드 시점 실행 특정 요청 중개의뢰매물에 대한 수정페이지 정보조회:', prd_identity_id);

          let body_infoss = {
            prd_identity_idval: prd_identity_id
          };
          let brokerRequest_product_info = await serverController.connectFetchController('/api/broker/brokerRequest_productview', 'POST', JSON.stringify(body_infoss));

          if (brokerRequest_product_info) {
            console.log('brokerReuqest produt info::', brokerRequest_product_info);//resultdata 의 첫데이터는 가자 ㅇ초기의 매물수정히스토리내역(가장 오리진정보), 상태변경내엯수정리스트 가장ㅊ로기의 내역에 최근수정된 매물의 정보가 담겨있고,가장 마지막내역 이후의 초기이후의 내역들은 그냥 상태변경내역의 히스토리연장일뿐이다. 초기row에 항상 기본매물정보(x,y값포함)담겨있게끔 한다.
            if (brokerRequest_product_info.success) {

              if (brokerRequest_product_info.result_data) {
                let maemul_info = brokerRequest_product_info.result_data[0];//매물의 보편적(최근수정포함)정보
                let probrokerinfo = brokerRequest_product_info.probroker_match;//전문중개사(선임)정보.가장 최근 승인된정보포함 전문중개사정보.
                let result_data_length = brokerRequest_product_info.result_data.length;//그 특정 매물에 대한 히스토리내역들 reuslt_data담김.
                let now_prd_status = brokerRequest_product_info.result_data[result_data_length - 1].prd_status;

                console.log('중개의뢰매물 update내역 정보:', maemul_info, probrokerinfo, now_prd_status);

                setprobrokerinfo(probrokerinfo[0]);

                setAddress_detail(maemul_info.addr_detail);
                setAddressjiubn(maemul_info.addr_jibun);
                setAddressroad(maemul_info.addr_road);
                setPrdtype(maemul_info.prd_type);
                setPrdstatus(now_prd_status);//최근 들여다본 의뢰한 중개매물의 상태값조회.

                setMaemulname(maemul_info.prd_name);//매물이름
                setJeonyongdimension(maemul_info.exclusive_area);//전용면적
                setJeonyongpyeong(maemul_info.exclusive_pyeong);//전용면적평
                setSupplydimension(maemul_info.supply_area);//공급면적
                setSupplypyeong(maemul_info.supply_pyeong);//공급면적평
                setSelltype(maemul_info.prd_sel_type);//판매타입
                setUsetype(maemul_info.prd_usage);
                setSellprice(maemul_info.prd_price);//판매가격
                setChangemanagecost(maemul_info.managecost);//관리비
                setIbju_isinstant(maemul_info.is_immediate_ibju);//입주즉시여부
                setJob(maemul_info.is_current_biz_job);
                setJobType(maemul_info.current_biz_job);//상가업종.

                /*let ibju_specifydate_year=new Date([maemul_info.ibju_specifydate]).getFullYear();
                let ibju_specifydate_month=new Date([maemul_info.ibju_specifydate]).getMonth()+1;
                let ibju_specifydate_date=new Date([maemul_info.ibju_specifydate]).getDate();
            
                if(ibju_specifydate_month < 10){
                  ibju_specifydate_month = '0'+ibju_specifydate_month;
                }
            
                if(ibju_specifydate_date < 10){
                  ibju_specifydate_date = '0'+ibju_specifydate_date;
                }
                console.log('ijbu speiffydate dateformat:',ibju_specifydate_year,ibju_specifydate_month,ibju_specifydate_date);*/

                setIbju_specifydate(maemul_info.ibju_specifydate);

                setExculsive_periods(maemul_info.exclusive_periods);
                setRequestMessage(maemul_info.request_message);
                //setJob();
                //setJobType();
                setDeposit(maemul_info.month_base_guaranteeprice);
                setMonthly(maemul_info.prd_month_price);
                console.log('propdudtitme mangaocostincluess:', maemul_info.include_managecost);
                setSelectMana(maemul_info.include_managecost.split(','));
                setIsrightprice(maemul_info.is_rightprice);

                if (maemul_info.is_managecost) {
                  setViewInput(1);
                } else {
                  setViewInput(0);
                }

                if (maemul_info.is_immediate_ibju) {
                  setViewDate(false)
                } else {
                  setViewDate(true);
                }
              } else {
                alert('해당 매물에 대한 정보가 없습니다.');
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

  //페이지 수정조회 의존성데이터, state저장데이터셋팅.
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, confirmgreennone: {}, content: {} });
  //전문중개사

  const [probrokerinfo, setprobrokerinfo] = useState({});

  //매물관련 조회 수정 데이터
  const [viewInput, setViewInput] = useState(false);//관리비 있음일때 input박스 노출
  const [viewDate, setViewDate] = useState(false);//입주가능일 선택할 경우 date박스

  //물건관련 정보 state
  const [addr_detail, setAddress_detail] = useState('');
  const [addr_jibun, setAddressjiubn] = useState('');
  const [addr_road, setAddressroad] = useState('');
  const [prdtype, setPrdtype] = useState('');
  const [prdstatus, setPrdstatus] = useState('');

  const [maemulname, setMaemulname] = useState('');
  const [jeonyongdimension, setJeonyongdimension] = useState('');
  const [jeonyongpyeong, setJeonyongpyeong] = useState('');
  const [supplydimension, setSupplydimension] = useState('');
  const [supplypyeong, setSupplypyeong] = useState('');
  const [selltype, setSelltype] = useState('');
  const [usetype, setUsetype] = useState('');
  const [sellprice, setSellprice] = useState('');
  const [Managecost, setChangemanagecost] = useState('');
  const [is_immediate_ibju, setIbju_isinstant] = useState('');
  const [ibju_specifydate, setIbju_specifydate] = useState('');
  const [exclusive_periods, setExculsive_periods] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [job, setJob] = useState('');//상가 업종여부
  const [jobType, setJobType] = useState('');//상가업종
  const [deposit, setDeposit] = useState('');
  const [monthly, setMonthly] = useState('');
  const [isrightprice, setIsrightprice] = useState('');
  const [selectMana, setSelectMana] = useState([]);

  // 관리비 포함 체크박스
  const onChangeMana = (e) => {
    let newArr = selectMana;
    if (e.target.checked) {
      newArr.push(e.target.value);
    } else {
      newArr = newArr.filter(item => item !== e.target.value);
    }
    setSelectMana([...newArr]);
  }

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const confirmModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "중개의뢰 수정",
      content: { type: "text", text: `정상적으로 수정되었습니다.`, component: "" },
      submit: { show: false, title: "적용", event: () => { offModal(); } },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", link: "/Request", event: () => { offModal(); } }
    });
  }

  useEffect(() => {
    console.log('페이지 상태값 변경::', addr_detail, addr_jibun, maemulname, is_immediate_ibju, requestMessage, deposit);
  })

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
        <SubTitle title={"중개의뢰 수정"} rank={false} cursor={"default"} />
        {<EditRequest confirmModal={confirmModal} prd_identity_id={prd_identity_id} viewDate={viewDate} viewInput={viewInput} addr_detail={addr_detail} addr_jibun={addr_jibun} addr_road={addr_road} prdtype={prdtype} prdstatus={prdstatus} maemulname={maemulname} jeonyongdimension={jeonyongdimension} jeonyongpyeong={jeonyongpyeong} supplydimension={supplydimension} supplypyeong={supplypyeong} selltype={selltype} usetype={usetype} sellprice={sellprice} Managecost={Managecost} is_immediate_ibju={is_immediate_ibju} ibju_specifydate={ibju_specifydate} exclusive_periods={exclusive_periods} requestMessage={requestMessage} job={job} jobType={jobType} deposit={deposit} monthly={monthly} selectMana={selectMana} isrightprice={isrightprice} setAddress_detail={setAddress_detail} setAddressjiubn={setAddressjiubn} setAddressroad={setAddressroad} setPrdtype={setPrdtype} setPrdstatus={setPrdstatus} setMaemulname={setMaemulname} setJeonyongdimension={setJeonyongdimension} setJeonyongpyeong={setJeonyongpyeong} setSupplydimension={setSupplydimension} setSupplypyeong={setSupplypyeong} setSelltype={setSelltype} setChangemanagecost={setChangemanagecost} setIbju_isinstant={setIbju_isinstant} setIbju_specifydate={setIbju_specifydate} setExculsive_periods={setExculsive_periods} setRequestMessage={setRequestMessage} setSellprice={setSellprice} setJob={setJob} setUsetype={setUsetype} setJobType={setJobType} setDeposit={setDeposit} setMonthly={setMonthly} setSelectMana={setSelectMana} setIsrightprice={setIsrightprice} probrokerinfo={probrokerinfo} onChangeMana={onChangeMana} setViewDate={setViewDate} setViewInput={setViewInput} />}
        <ModalCommon modalOption={modalOption} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}