//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import serverController from '../../../../server/serverController';

//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col_input, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
// import Switch from '@material-ui/core/Switch';

//img
import ArrowTop from '../../../../img/map/arrow_top.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import Enter from '../../../../img/member/enter.png';
import CheckImg from '../../../../img/map/radio.png';
import CheckedImg from '../../../../img/map/radio_chk.png';
import RadioImg from '../../../../img/map/radi.png';
import RadioChkImg from '../../../../img/map/radi_chk.png';

import { Mobile, PC } from "../../../../MediaQuery"

//component
import ListItemCont_Broker_T1 from '../../../common/broker/listItemCont_Broker_T1';
import CommonContact from '../../../common/contact/commonContact';
import BrokerInfo from './component/BrokerInfo';
import NewRequestTopInfos from './NewRequestTopInfos';

//redux addons saseests.
import { useSelector } from 'react-redux';
import { tempBrokerRequestActions } from '../../../../store/actionCreators';

export default function Request({ setFilter, value, type, successModal, failModal, probrokersingleinfo, txnstatus_structure }) {
  const history = useHistory();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [openMore, setOpenMore] = useState(false);

  //redux 데이터 사전 조회.
  const tempBrokerRequest = useSelector(data => data.tempBrokerRequest);
  const login_user = useSelector(data => data.login_user);
  const temp_SelectComplexinfo = useSelector(data => data.temp_selectComplexinfo);

  console.log(tempBrokerRequestActions, tempBrokerRequest);

  /*모달*/
  const [map, setMap] = useState(false);//주소 눌렀을때 지도 모달

  const [success, setSuccess] = useState(false);//중개의뢰 성공모달
  const [fail, setFail] = useState(false);//중개의뢰 실패 모달

  const rotate = () => {
    if (openMore == true) {
      return "rotate(180deg)"
    } else {
      return "rotate(0deg)"
    }
  }

  //물건관련 정보 state
  const [broker, setBroker] = useState({});
  const [contact, setContact] = useState({});
  const [maemulname, setMaemulname] = useState(temp_SelectComplexinfo ? temp_SelectComplexinfo.complexname : '');
  const [jeonyongdimension, setJeonyongdimension] = useState('');
  const [jeonyongpyeong, setJeonyongpyeong] = useState('');
  const [supplydimension, setSupplydimension] = useState('');
  const [supplypyeong, setSupplypyeong] = useState('');
  const [selltype, setSelltype] = useState('');
  const [usetype, setUsetype] = useState('');
  const [sellprice, setSellprice] = useState('');//가격(월세,전세,매매 거래가)
  const [Managecost, setChangemanagecost] = useState('');//관리비
  const [ibju_isinstant, setIbju_isinstant] = useState(false);//입주즉시여부
  const [ibju_specifydate, setIbju_specifydate] = useState('');//입주예정일
  const [exculsive_periods, setExculsive_periods] = useState('');//전속기간
  const [requestMessage, setRequestMessage] = useState('');//요청메시지
  const [jobType, setJobType] = useState('');//현재업종 오피스텔
  const [deposit, setDeposit] = useState("");
  const [monthly, setMonthly] = useState("");//월세액
  const excRange = [3, 6, 9, 12, 15, 18, 24];//전속기간
  const manageData = ["전기", "수도", "가스", "인터넷", "티비"];//관리비포함
  const [selectMana, setSelectMana] = useState([]);//관리비포함
  const [is_rightprice, set_isrightprice] = useState('');//상가 권리금.
  const [viewInput, setViewInput] = useState(false);//관리비 있음일때 input박스 노출
  const [viewDate, setViewDate] = useState(false);//입주가능일 선택할 경우 date박스
  const [job, setJob] = useState(false);//현재업종 선택할 경우 box show/hide 상가 업종값.어떤업종인지

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

  // 해당 페이지 정보들입니다.
  // 리덕스에 그대로 담아 활요하시면 됩니다.
  // 다음 버튼 눌렀을때 다음 액션이 없습니다.
  const nextStep = async () => {
    if (login_user.company_id == null || login_user.user_type == null || !login_user.company_id || !login_user.user_type) {
      //소속선택되어있지 않은 경우 중개의뢰/물건예약불가하게 처리!
      if (login_user.user_type != '개인') {
        alert('소속이 선택되어있어야 가능한 서비스입니다.');
        return;
      }
    }
    console.log('dong:', tempBrokerRequest.dong);
    console.log('hosil:', tempBrokerRequest.hosil);
    console.log('floor:', tempBrokerRequest.floor);//층id값.
    console.log('dongname:', tempBrokerRequest.dongname);//동이름
    console.log('hosilname:', tempBrokerRequest.hosilname);//호실이름
    console.log('floorname:', tempBrokerRequest.floorname);//층이름
    console.log('dangi:', tempBrokerRequest.dangi);//단지명
    console.log('danijuunaddress:', tempBrokerRequest.dangijibunaddress);//검색된 건물대상체 주소값.
    console.log('danjiroadaddress:', tempBrokerRequest.dangiroadaddress);
    console.log('x', tempBrokerRequest.x);
    console.log('y', tempBrokerRequest.y);
    console.log('name:', tempBrokerRequest.name);//의뢰자이름
    console.log('phone:', tempBrokerRequest.phone);
    console.log('maemultype:', tempBrokerRequest.maemultype);

    //console.log(tempBrokerRequest.maemultype); // 물건종류
    //console.log(tempBrokerRequest.dangijibunaddress); // 주소
    //console.log(tempBrokerRequest.dangiroadaddress);
    //console.log(tempBrokerRequest.dongname); // 동
    //console.log(tempBrokerRequest.floorname); // 층
    //console.log(tempBrokerRequest.hosilname); // 호실

    console.log('전속기간:', exculsive_periods); // 전속 기간 필수*
    console.log('건물명:', maemulname); // 건물명 필수*
    console.log('용도:', usetype); // 용도 (오피한정)
    console.log('job:', job); // 업종유무  상가업종유무
    console.log('jobType:', jobType); // 현재 업종 상가업종형태string
    console.log('jeonyongdimension:', jeonyongdimension); // 전용면적 m²  필수*
    console.log('jeonyongpyeong:', jeonyongpyeong); // 전용면적 평  필수*
    console.log('supplydimension:', supplydimension); // 공급면적 m²  필수*
    console.log('supplypyeong:', supplypyeong); // 공급면적 평  필수*
    console.log('selltype:', selltype); // 거래 유형  필수*
    console.log('sellprice:', sellprice); // 거래 가격(매매,전세)  필수*
    console.log('deposit:', deposit); // 보증금  
    console.log('monthly:', monthly); // 월세
    console.log('viewInput:', viewInput) // 관리비 유무  필수*
    console.log('Managecost:', Managecost); // 관리비  필수*
    console.log('selectMana:', selectMana); // 관리비 포함  필수*
    console.log('viewDate:', viewDate); // 입주 가능일  false->즉시 true->날짜선택  필수*
    console.log('ibju_isinstant:', ibju_isinstant);//즉시 입주가능 여부
    console.log('ibju_specifydate:', ibju_specifydate); // 입주 날짜
    console.log('requestMessage:', requestMessage); // 요청사항
    console.log('isrightsprice::', is_rightprice);

    if (tempBrokerRequest.floor == '' || tempBrokerRequest.floorname == '' || tempBrokerRequest.dangijibunaddress == '' || tempBrokerRequest.dangiroadaddress == '' || tempBrokerRequest.x == '' || tempBrokerRequest.y == '' || tempBrokerRequest.name == '' || tempBrokerRequest.phone == '' || tempBrokerRequest.maemultype == '' || exculsive_periods == '' || maemulname == '' || jeonyongdimension == '' || jeonyongpyeong == '' || supplydimension == '' || supplypyeong == '' || selltype == '' || sellprice == '' || selectMana.length == 0) {
      alert('입력값중 누락된 값이 있습니다.');
      return false;
    }

    if (!tempBrokerRequest.x || !tempBrokerRequest.y) {
      alert('검색건물의 좌표위치(x,y)값이 유효하지 않습니다!');
      return false;
    }

    //요청 전에 단수체크 알고리즘 사전 검사후에 통과시에 중개의뢰요청(물건등록) 처리가 된다.
    //상가,사무실 dangijubunaddress,dangiroadaddress, floor(특정주소에 존재하는 선택한 특정건물의 층선택) 그 추가하려는 매물종류(floor,ho_idhosil이)product,transaciton상에 가능한 상태값을써 존재하고있는지여부검사.   
    if (tempBrokerRequest.maemultype == '상가' || tempBrokerRequest.maemultype == '사무실') {
      let request_possible_sendinfo = {
        dangijibunaddress: tempBrokerRequest.dangijibunaddress,
        dangiroadaddress: tempBrokerRequest.dangiroadaddress,
        floor: tempBrokerRequest.floor,
        req_type: 'storeoffice'
      }
      let request_avail = await serverController.connectFetchController('/api/mypage/brokerRequest_avail_process', 'POST', JSON.stringify(request_possible_sendinfo));
      if (request_avail) {
        console.log('해당 의뢰매물 코렉스 시스템상에서 등록가능한 단수매물인지 여부검사(사무실,상가):', request_avail);

        if (request_avail.success) {
          //alert('등록이 가능합니다!!!');
        } else {
          failModal();
          return;
        }
      }
    } else {
      let request_possible_sendinfo = {
        dangijibunaddress: tempBrokerRequest.dangijibunaddress,
        dangiroadaddress: tempBrokerRequest.dangiroadaddress,
        hosil: tempBrokerRequest.hosil,
        req_type: 'apartofficetel'
      }
      let request_avail = await serverController.connectFetchController('/api/mypage/brokerRequest_avail_process', 'POST', JSON.stringify(request_possible_sendinfo));
      if (request_avail) {
        console.log('해당 의뢰매물 코렉스 시스템상에서 등록가능한 단수매물인지 여부검사(아파트,오피):', request_avail);

        if (request_avail.success) {
          //alert('등록이가능합니다!!!');
        } else {
          failModal();
          return;
        }
      }
    }

    //선택 층값.
    if (tempBrokerRequest.floorname.indexOf('지상') != -1) {
      var floorint = tempBrokerRequest.floorname.replace('지상', '');
      floorint = parseInt(floorint);
    } else {
      var floorint = tempBrokerRequest.floorname.replace('지하', '');
      floorint = 0 - parseInt(floorint);
    }

    let body_info = {
      dong: (tempBrokerRequest.maemultype == '아파트' || tempBrokerRequest.maemultype == '오피스텔') ? tempBrokerRequest.dong : '',//어떤 단지의 건물(동) 택한건지?
      hosil: (tempBrokerRequest.maemultype == '아파트' || tempBrokerRequest.maemultype == '오피스텔') ? tempBrokerRequest.hosil : '',//어떤 단지의 건물의 층의 호실택한지?(아파트,오피스텔한정, 사무실&상가는 flr_id까지만 참조)
      floor: tempBrokerRequest.floor,//어떤 flr_id(오피,아파트,상가,사무실 모두 포괄가능한 층id값) 어떤 단지의 건물의 층을 택한지?
      dangi: (tempBrokerRequest.maemultype == '아파트' || tempBrokerRequest.maemultype == '오피스텔') ? tempBrokerRequest.dangi : '',//단지명.
      dangijibunaddress: tempBrokerRequest.dangijibunaddress,//검색 단지 법정명,도로명 주소.
      dangiroadaddress: tempBrokerRequest.dangiroadaddress,
      dongname: tempBrokerRequest.dongname,//아파트,오피인경우에만 채워져있음.
      floorname: tempBrokerRequest.floorname,//모든 경우에 채워져있음.
      hosilname: tempBrokerRequest.hosilname,//상가사무실인 경우도 경우에 따라 채워져있기도.
      floorint: floorint,
      storeofficebuildingfloor: tempBrokerRequest.storeofficebuildingfloor,
      x: tempBrokerRequest.x,
      y: tempBrokerRequest.y,
      name: tempBrokerRequest.name,//중개인 이름.
      phone: tempBrokerRequest.phone,//요청자 번호(중개의뢰인)
      maemultype: tempBrokerRequest.maemultype,//매물타입

      maemulname: maemulname,
      exculsive_periods: exculsive_periods,//전속기간
      usertype: usetype,//용도
      job: job, //업종유무
      jobtype: jobType,//현재 업종
      jeonyongdimension: jeonyongdimension,//전용면적
      jeonyongpyeong: jeonyongpyeong,//전용면적평
      supplydimension: supplydimension,//공급면적
      supplypyeong: supplypyeong,//공급면적평
      selltype: selltype,//판매타입
      sellprice: sellprice,//가격 매매가,전세가,월세가
      //deposit: deposit,//보증금
      monthly: monthly,//월세가
      ismanagementcost: viewInput,//관리비유무
      managecost: Managecost,//관리비
      manageincludes: selectMana.join(','),//관리비포함
      ibju_isinstant: ibju_isinstant,
      ibju_specifydate: ibju_specifydate,
      requestmessage: requestMessage,
      isrightprice: is_rightprice,

      companyid: tempBrokerRequest.companyid,//수임사업체id
      requestmemid: tempBrokerRequest.requestmemid,//의로인memid 중개의뢰로 추가되는경우 상태변경 요인자는 의뢰자memid이다.
      requestuser_selectsosok: login_user.company_id,//로그인 유저가 선택했던 소속companyid값 어떤 소속선택한 후에 중개의뢰한건지여부. 어떤 소속로부터의 회원이 중개의뢰요청한건지.

      prdstatus_generator: tempBrokerRequest.requestmemid, //매물상태변화
      prdstatus_change_reason: ''
    }
    console.log('server send bod info중개의뢰요청:', body_info);

    let res = await serverController.connectFetchController('/api/broker/user_brokerRequest', 'post', JSON.stringify(body_info));

    if (res.success) {
      alert('중개의뢰 성공!');
      let prd_identity_id_get = res.result;
      //중개의뢰성공시에 신규의뢰접수 알림이 가해지게한다. 발송 to전문중개사에게.

      let noti_info = {
        prd_identity_id: prd_identity_id_get, //관련 transactionid
        company_id: tempBrokerRequest.companyid, //알림발송대상인(notificaiton알림 및 문자알리고알림) companyid전문중개사에게.
        message: '신규의뢰가 접수되었습니다. 요청유저:' + tempBrokerRequest.requestmemid, //알림 메시지 contnet noti_content
        noti_type: 2 // 1:의뢰검토결과(거절,수락)  2:신규의뢰접수발생사건 알림유형(중개의뢰한 전문중개사 companyid소속의 회원들에게 모두 알림)
      }
      let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
      if (noti_res) {
        if (noti_res.success) {
          console.log('noti_resss:', noti_res);
        } else {
          alert('알람 발송 오류');
        }
      }
      history.push('/Mypage');
    } else {
      alert(res.message);
    }
  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">기본정보 입력</p>
        <Sect_R2>
          <Sect_R2_1>
            <ListItemCont_Broker_T1 broker={probrokersingleinfo} />
            <CommonContact  broker={probrokersingleinfo} />
            {/* <BrokerInfo setMap={setMap} map={map} probrokersingleinfo={probrokersingleinfo} txnstatus_structure={txnstatus_structure}/> */}
            {/* 05.21 BrokerInfo.js 는 주소+매매까지 나와있고 BrokerLess파일은 중개사명 / 대표명만 나와있습니다. */}
          </Sect_R2_1>
          {/* 전속정보 */}
          <Sect_R2_1>
            <Title_Sub>전속정보</Title_Sub>
            <Sect_R2_1_1>
              <TopDesc>
                전속기간의 기산일은 전문중개사의 의뢰 수락 후<br />
                의뢰인의 거래 개시 승인일 다음날부터입니다.
              </TopDesc>
              <SelectBox>
                <Label>전속기간<Pilsu>*</Pilsu></Label>
                <Select onChange={e => setExculsive_periods(e.target.value)}>
                  <Option>기간 선택</Option>
                  {
                    excRange.map((item, index) => {
                      return (
                        <Option value={item} key={index}>{item} 개월</Option>
                      )
                    })
                  }
                </Select>
              </SelectBox>
            </Sect_R2_1_1>
          </Sect_R2_1>
          {/*물건정보*/}
          <Sect_R2_1>
            <Title_Sub>물건정보</Title_Sub>
            <Sect_R2_1_1>

              <InputBox>
                <Label>물건종류</Label>
                <InputDisabled type="text" value={tempBrokerRequest.maemultype} disabled />
              </InputBox>
              <InputBox>
                <Label>주소</Label>
                <InputDisabled type="text" value={tempBrokerRequest.dangijibunaddress + '(' + tempBrokerRequest.dangiroadaddress + ')'} disabled />
              </InputBox>
              <InputBox>
                <Label>상세<Pilsu>호수는 공개되지 않습니다.</Pilsu></Label>
                <InputDisabled type="text" value={tempBrokerRequest.dongname + ' ' + tempBrokerRequest.floorname + '층 ' + tempBrokerRequest.hosilname} disabled />
              </InputBox>
              <WrapItemInfo>
                <LongLine />
                <InputBox>
                  <Label>건물명<Pilsu>*</Pilsu></Label>
                  <InputTxt type="text" placeholder="건물명을 입력하여주세요." value={maemulname} onChange={(event) => {
                    console.log('건물명 정보값이 조회된게 있으면 해당 관련 변화이벤트로 수정불가하게한다.', temp_SelectComplexinfo);
                    if (temp_SelectComplexinfo.complexname != '') {
                    } else {
                      setMaemulname(event.target.value)
                    }
                  }
                  } />
                </InputBox>

                {/*!!!!!! 05.21 용도는 오피스텔일때만 노출됩니다. display:none처리!!!!*/}
                {
                  tempBrokerRequest.maemultype == '오피스텔' ?
                    <SelectBox>
                      <Label>용도<Pilsu>*</Pilsu></Label>
                      <SelectMb onChange={e => setUsetype(e.target.value)}>
                        <Option>용도를 선택하여주세요.</Option>
                        <Option value='주거용'>주거용</Option>
                        <Option value='업무용'>업무용</Option>
                      </SelectMb>
                    </SelectBox>
                    :
                    null
                }

                {/*!!!!!!현재 업종은 상가일때만 노출됩니다. display:none처리!!!!*/}
                {
                  tempBrokerRequest.maemultype == '상가' ?
                    <InputBox>
                      <Label>현재업종<Pilsu>*</Pilsu></Label>
                      <SwitchButton>
                        <Switch type="checkbox" id="switch_job" />
                        <SwitchLabel for="switch_job" onClick={() => { setJob(!job) }}>
                          <SwitchSpan />
                          <SwithTxtOff className="no">없음</SwithTxtOff>
                          <SwithTxtOn className="yes">있음</SwithTxtOn>
                        </SwitchLabel>
                      </SwitchButton>
                      {
                        job ?
                          <Flex>
                            <InputTxt type="text" placeholder="현재 업종 입력" onChange={e => setJobType(e.target.value)} />
                          </Flex>
                          :
                          null
                      }
                    </InputBox>
                    :
                    null
                }

                <InputBox>
                  <Label>전용면적<Pilsu>*</Pilsu></Label>
                  <Widthbox>
                    <Inbox>
                      <InputShort type="text" placeholder="m² 선택 or 입력" onChange={e => setJeonyongdimension(e.target.value)} />
                      <Span>m²</Span>
                    </Inbox>
                    <Same>=</Same>
                    <Inbox>
                      <InputShort type="text" placeholder="m² 선택 or 입력" onChange={e => setJeonyongpyeong(e.target.value)} />
                      <Span>평</Span>
                    </Inbox>
                  </Widthbox>
                </InputBox>
                <InputBox>
                  <Label>공급면적<Pilsu>*</Pilsu></Label>
                  <Widthbox>
                    <Inbox>
                      <InputShort type="text" placeholder="m² 선택 or 입력" onChange={e => setSupplydimension(e.target.value)} />
                      <Span>m²</Span>
                    </Inbox>
                    <Same>=</Same>
                    <Inbox>
                      <InputShort type="text" placeholder="m² 선택 or 입력" onChange={e => setSupplypyeong(e.target.value)} />
                      <Span>평</Span>
                    </Inbox>
                  </Widthbox>
                </InputBox>
              </WrapItemInfo>
            </Sect_R2_1_1>
          </Sect_R2_1>
          {/*거래정보*/}
          <Sect_R2_1>
            <Title_Sub>거래정보</Title_Sub>
            <Sect_R2_1_1>
              <SelectBox>
                <Label>거래유형<Pilsu>*</Pilsu></Label>
                <SelectMb onChange={e => setSelltype(e.target.value)}>
                  <Option>거래유형을 선택하여주세요.</Option>
                  <Option>매매</Option>
                  <Option>전세</Option>
                  <Option>월세</Option>
                </SelectMb>
              </SelectBox>
              <InputBox>
                <Label>가격<Pilsu>*</Pilsu></Label>
                {/* 
                  거래유형 > 매매 선택됐을때 하단의 InputMidi placeholder ="매매가 입력" <Example>(e.g 1억 5,000)</Example>
                  거래유형 > 전세 선택됐을때 하단의 InputMidi placeholder ="전세가 입력" <Example>1,000/50</Example>
                  */}
                <Example>{selltype == "매매" ? '(e.g 1억 5,000)' : '1,000/50'}</Example>

                <Flex>
                  <InputMidi type="text" placeholder={`${selltype}가 입력`} onChange={e => setSellprice(e.target.value)} />
                  <Dan>만원</Dan>
                </Flex>
                {/* 거래유형 > 월세 선택됐을때 아래 내용 나와야함 */}
                {
                  selltype == "월세" &&
                  <FlexMt>
                    <InputShortWd type="text" placeholder="보증금 입력" onChange={e => setSellprice(e.target.value)} />
                    <InputShortWd type="text" placeholder="월세" onChange={e => setMonthly(e.target.value)} />
                    <Dan>만원</Dan>
                  </FlexMt>
                }
              </InputBox>

              {
                tempBrokerRequest.maemultype == '상가' ?
                  <Flex>
                    <InputBox>
                      <Label>권리금</Label>
                      <Radiobox>
                        <Radio type='radio' name='is_rightprice' value='1' id='is_rightprice1' />
                        <RadioLabel for='is_rightprice1' onClick={() => { set_isrightprice(1) }}>
                          <RadioSpan />
                          있음
                        </RadioLabel>
                      </Radiobox>
                      <Radiobox>
                        <Radio type="radio" name="is_rightprice" value='0' id="is_rightprice2" />
                        <RadioLabel for="is_rightprice2" onClick={() => { set_isrightprice(0) }}>
                          <RadioSpan />
                          없음
                        </RadioLabel>
                      </Radiobox>
                    </InputBox>
                  </Flex>
                  :
                  null
              }

              {/*더보기*/}
              <WrapMoreView>
                <SubTitle onClick={() => { setOpenMore(!openMore) }} className="cursor-p">
                  <EnterImg src={Enter} />
                  <Title>더보기</Title>
                  <ShortLine />
                  <ArrowTopImg src={ArrowTop} rotate={rotate} />
                </SubTitle>
                {
                  openMore ?
                    <MoreView>
                      {/* 관리비 유무 */}
                      <MoreBox>
                        <Label>관리비<Pilsu>*</Pilsu></Label>
                        <SwitchButton>
                          <Switch type="checkbox" id="switch" />
                          <SwitchLabel for="switch" onClick={() => { setViewInput(!viewInput) }}>
                            <SwitchSpan />
                            <SwithTxtOff className="no">없음</SwithTxtOff>
                            <SwithTxtOn className="yes">있음</SwithTxtOn>
                          </SwitchLabel>
                        </SwitchButton>
                        {
                          viewInput ?
                            <Flex>
                              <InputMidi type="text" placeholder="가격 입력" onChange={e => setChangemanagecost(e.target.value)} />
                              <Dan>만원</Dan>
                            </Flex>
                            :
                            null

                        }

                      </MoreBox>
                      {/*관리비 포함*/}
                      <MoreBox>
                        <Label>관리비 포함<Pilsu>*</Pilsu></Label>
                        <WrapCheck>
                          {
                            manageData.map((item, index) => {
                              return (
                                <Checkbox>
                                  <Check onChange={e => onChangeMana(e)} value={item} type="checkbox" id={`check${index}`} />
                                  <CheckLabel for={`check${index}`}>
                                    <CheckSpan />
                                    {item}
                                  </CheckLabel>
                                </Checkbox>
                              )
                            })
                          }
                        </WrapCheck>
                      </MoreBox>
                      {/*입주가능일*/}
                      <MoreBox>
                        <Label>입주가능일<Pilsu>*</Pilsu></Label>
                        <WrapCheck>
                          <Radiobox>
                            <Radio type="radio" name="possible" id="radi1" value='1' defaultChecked />
                            <RadioLabel for="radi1" onClick={() => { setIbju_isinstant(1); setViewDate(false); }}>
                              <RadioSpan />
                              즉시
                            </RadioLabel>
                          </Radiobox>
                          <Radiobox>
                            <Radio type="radio" name="possible" id="radi2" value='0' />
                            <RadioLabel for="radi2" onClick={() => { setIbju_isinstant(0); setViewDate(true) }}>
                              <RadioSpan />
                              날짜 선택
                            </RadioLabel>
                            {
                              viewDate ?
                                <InputDate type="date" onChange={e => setIbju_specifydate(e.target.value)} />
                                :
                                null
                            }
                          </Radiobox>
                        </WrapCheck>
                      </MoreBox>
                      {/*요청사항 입력*/}
                      <MoreBox>
                        <Label>요청사항 입력</Label>
                        <Textarea type="textarea" placeholder="요청사항을 입력하여주세요." onChange={e => setRequestMessage(e.target.value)} />
                      </MoreBox>
                    </MoreView>
                    :
                    null
                }
              </WrapMoreView>
            </Sect_R2_1_1>
          </Sect_R2_1>

          {/*!!!!다음 버튼 , 조건문 맞춰서 액티브 됐을때 색상 바뀌어야함..!!!! */}
          {/* <NextButton onClick={nextStep}> */}
          {/* <Link className="data_link" onClick={()=>{setSuccess(true)}}/> */}
          {/* <Next type="button">다음</Next>
          </NextButton> */}

          {/* 중개의뢰 실패했을때 버튼 ( 모달이 다름 )
            <NextButton>
              <Link className="data_link" onClick={()=>{failModal();}}/>
              <Next type="button">다음</Next>
            </NextButton>
              */}

          <Sect_EndButton>
            <MUButton_Validation variant="contained" type="button" name="" active={""} onClick={nextStep}>다음</MUButton_Validation>
          </Sect_EndButton>
        </Sect_R2>
      </Wrapper>
    </>
  );
}

const MUButton = styled(Button)``

const MUTextField = styled(TextField)`
      &.MuiFormControl-root.MuiTextField-root {
        margin:0.3125rem 0; 
  }
`
const MUTextField_100 = styled(MUTextField)`
      &.MuiFormControl-root.MuiTextField-root {
        width:100%;    
  }
`
const MUFormControl = styled(FormControl)`
     &.MuiFormControl-root {
      margin:0.3125rem 0; 
     }
`

const MUInput = MUstyled(Input)`
&.MuiInputBase-root.MuiInput-root:after {
  border-bottom: 2px solid ${(props) => props.theme.palette.primary.main};
}
`
const ExpandMore = styled(IconButton)`
&.MuiButtonBase-root.MuiIconButton-root{
  /* position: absolute;
  top:50%;right:8px; */
  transform: /*translateY(-50%)*/ ${({ expand }) => !expand ? 'rotate(0deg)' : 'rotate(180deg)'};
  //margin-left: auto;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 3ms;
}
`
//--------------------------------------
const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2`
  ${TtCon_Title}  
`
const Sect_R1 = styled.div`
  /* border-bottom:1px solid ${(props) => props.theme.palette.line.main}; */
`
const Sect_R2 = styled.div`
  ${TtCon_1col_input}
`
const Sect_R2_1 = styled.div`
  margin-bottom: 3rem;
`

const Sect_R2_1_1 = styled.div`
  width:90%;
  margin-left: auto;
`
//-------------------------------------------

const Title_Sub = styled.div`
  display:flex;align-items:center;
  /* @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(40/428));
    } */
`


const Container = styled.div`
    width:680px;
    margin:0 auto;
    padding:24px 0 250px;
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(380/428));
      padding:calc(100vw*(30/428)) 0 calc(100vw*(150/428));
      }
`
const WrapRequest = styled.div`
  width:100%;
`
const WrapBrokerInfo = styled.div`
  width:465px;margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    }
`
const TopTitle = styled.h2`
  font-size:20px;color:#707070;
  text-align:left;padding-left:30px;
  font-weight:800;transform:skew(-0.1deg);
  margin-bottom:40px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding-left:calc(100vw*(16/428));
    }
`
const WrapBox = styled.div`
  width:408px;margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(380/428));
    }
`
const Box = styled.div`
  width:100%;
  margin-bottom:55px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(40/428));
    }
`
const SubTitle = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:40px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(40/428));
    }
`
// const Title = styled.h2`
//   font-size:15px;color:#4e4e4e;
//   font-weight:800;transform:skew(-0.1deg);
//   margin-right:7px;
//   @media ${(props) => props.theme.mobile} {
//     font-size:calc(100vw*(15/428));
//     margin-right:calc(100vw*(7/428));
//     }
// `
const Line = styled.div`
  width:340px;height:1px;
  background:#cecece;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(300/428));
    }
`
const TopDesc = styled.div`
    padding:0 0 35px;
    font-size:15px;color:#4a4a4a;
    font-weight:600;transform:skew(-0.1deg);
    line-height:1.33;text-align:center;
    @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(13/428));
      padding:0 0 calc(100vw*(35/428));
    }
`
const SelectBox = styled.div`
  width:100%;
`
const Label = styled.label`
  display:block;
  font-size:12px;font-weight:600;
  transform:skew(-0.1deg);color:#4a4a4a;
  margin-bottom:10px;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(12/428));
      margin-bottom:calc(100vw*(10/428));
    }
`
const Pilsu = styled.span`
  display:inline-block;
  font-size:12px;font-weight:600;
  transform:skew(-0.1deg);color:#fe7a01;
  vertical-align:middle;
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(12/428));
      margin-left:calc(100vw*(5/428));
    }
`
const Select = styled.select`
  width:100%;height:43px;
  font-weight:600;transform:skew(-0.1deg);
  text-align-last:center;
  border: solid 1px #e4e4e4;
  border-radius:4px;
  appearance:none;color:#707070;
  font-size:15px;transform:Skew(-0.1deg);
  background:url(${ArrowDown}) no-repeat 92% center;background-size:11px;
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(15/428));
      background-size:calc(100vw*(11/428));
    }
`
const SelectMb = styled(Select)`
  margin-bottom:30px;
  @media ${(props) => props.theme.mobile} {
      margin-bottom:calc(100vw*(25/428));
    }
`
const Option = styled.option`
`
const WrapInputBox = styled.div`
  width:100%;
`
const InputBox = styled.div`
  /* position:relative;
  margin-bottom:14px;
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.mobile} {
     margin-bottom:calc(100vw*(14/428));
    } */
`
const InputDisabled = styled.input`
  width:100%;height:43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #fbfbfb;
  color:#979797;
  font-size:15px;font-weight:500;
  text-align:center;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(15/428));
    }
`
const InputTxt = styled.input`
  width:100%;
  height:43px;
  text-align:center;
  background:transparent;
  font-size:15px;color:#4a4a4a;
  transform:skew(-0.1deg);
  border-radius: 4px;font-weight:600;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(15/428));
    }
`
const WrapItemInfo = styled.div`
`

const Widthbox = styled.div`
  width:100%;display:flex;justify-content:space-between;
  align-items:center;
`
const Inbox = styled.div`
  display:flex;justify-content:center;
  align-items:center;
  width: 177px;
  height: 43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(170/428));
      height:calc(100vw*(43/428));
    }
`
const InputShort = styled.input`
  width:70%;
  height:100%;
  text-align:center;
  background:transparent;font-weight:600;
  font-size:15px;color:#4a4a4a;
  transform:skew(-0.1deg);
  &::placeholder{color:#979797}
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }
`

const InputShortWd = styled(InputShort)`
  width:40%;
  border:solid 1px #e4e4e4;
  border-radius:4px;
  height:43px;
  &:last-child{margin-right:0;}
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(43/428));
  }
`
const Span = styled.span`
  vertical-align:middle;
  font-size:15px;font-weight:600;
  color:#4a4a4a;transform:skew(-0.1deg);
  margin-left:10px;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
      margin-left:calc(100vw*(10/428));
    }
`

const Same = styled.span`
  font-size:15px;font-weight:600;
  color:#4a4a4a;transform:skew(-0.1deg);
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }
`
const LongLine = styled.div`
  width:100%;height:1px;
  background:#cecece;
  margin:26px 0 40px;
  @media ${(props) => props.theme.mobile} {
      margin:calc(100vw*(26/428)) 0 calc(100vw*(40/428));
    }
`
const Example = styled.p`
  position:absolute;right:0;
  top:0;
  font-size:12px;transform:skew(-0.1deg);
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(12/428));
    }
`
const Flex = styled.div`
  display:flex;justify-content:space-between;align-items:center;
`
const FlexMt = styled(Flex)`
  margin-top:10px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(10/428));
  }
`
const InputMidi = styled.input`
  width: 353px;
  height: 43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  font-size:15px;color:#4a4a4a;
  font-weight:600;
  transform:skew(-0.1deg);text-align:center;
  &::placeholder{color:#979797}
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(315/428));
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(15/428));
    }
`
const Dan = styled.p`
  font-size:15px;color:#4a4a4a;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }
`
const WrapMoreView = styled.div`
  width:100%;
  margin-top:50px;
  @media ${(props) => props.theme.mobile} {
      margin-top:calc(100vw*(50/428));
    }
`
const EnterImg = styled.img`
  display:inline-block;
  width:19px;
  margin-right:27px;
  margin-top:-13px;
  @media ${(props) => props.theme.mobile} {
      margin-right:calc(100vw*(27/428));
      margin-top:calc(100vw*(-13/428));
      width:calc(100vw*(19/428));
    }
`
const ShortLine = styled(Line)`
  width:250px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(223/428));
    }
`
const ArrowTopImg = styled.img`
  display:inline-block;
  width:26px;
  cursor:pointer;
  transition:all 0.3s;
  transform:${({ rotate }) => rotate};
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(26/428));
    }
`
const MoreView = styled.div`
  transition:all 0.3s;
`
const MoreBox = styled.div`
  margin-top:30px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(30/428));
    }
`

const SwitchButton = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin-top:20px;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
    margin-top:calc(100vw*(20/428));
  }
`
const Switch = styled.input`
  display:none;
  &:checked+label{background:#009053}
  &:checked+label span{left:22px;}
  &:checked+label .no{opacity:0;}
  &:checked+label .yes{opacity:1;}
  @media ${(props) => props.theme.mobile} {
    &:checked+label span{left:calc(100vw*(24/428));}
  }
`
const SwitchLabel = styled.label`
  position:relative;display:inline-block;
  width:41px;
  height:15px;background:#e4e4e4;
  border-radius: 18px;
  border: solid 1px #d6d6d6;
  transition:all 0.3s;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(41/428));
    height:calc(100vw*(15/428));
  }
`
const SwithTxtOff = styled.p`
  position:absolute;
  width:100px;
  display:inline-block;
  left:50px;top:-3px;
  font-size: 15px;
  font-weight: normal;
  letter-spacing: normal;
  text-align: left;
  color: #4a4a4a;
  opacity:1;
  transition:all 0.3s;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    left:calc(100vw*(50/428));
    top:calc(100vw*(-2/428));
  }
`
const SwithTxtOn = styled(SwithTxtOff)`
  opacity:0;
`
const SwitchSpan = styled.span`
  position:absolute;left:-1px;top:50%;transform:translateY(-50%);
  width:18px;height:18px;border-radius:100%;
  border: solid 1px #888888;
  background-color: #ffffff;
  transition:all 0.3s;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
    height:calc(100vw*(18/428));
  }
`
const Sub = styled.span`
  display:inline-block;font-size:15px;
  font-weight:normal;transform:skew(-0.1deg);color:#4a4a4a;
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-left:calc(100vw*(10/428));
  }
`
const WrapCheck = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  flex-wrap:wrap;margin-top:20px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(20/428));
  }
`
const Checkbox = styled.div`
  width:33%;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
  }
`
const Check = styled.input`
  display:none;
  &:checked+label span{background:url(${CheckedImg}) no-repeat; background-size:100% 100%;}
`
const CheckLabel = styled.label`
  font-size:15px;
  transform:skew(-0.1deg);color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const CheckSpan = styled.span`
  display:inline-block;width:20px;height:20px;
  background:url(${CheckImg}) no-repeat; background-size:100% 100%;
  margin-right:8px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));height:calc(100vw*(20/428));
    margin-right:calc(100vw*(8/428));
  }
`
const Radiobox = styled.div`
  width:100%;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
  }
`

const Radio = styled.input`
  display:none;
  &:checked+label span{background:url(${RadioChkImg}) no-repeat; background-size:100% 100%;}
`
const RadioLabel = styled.label`
  font-size:15px;
  transform:skew(-0.1deg);color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const RadioSpan = styled.span`
  display:inline-block;width:20px;height:20px;
  background:url(${RadioImg}) no-repeat; background-size:100% 100%;
  margin-right:8px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));height:calc(100vw*(20/428));
    margin-right:calc(100vw*(8/428));
  }
`
const InputDate = styled(InputTxt)`
  margin-top:20px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(20/428));
  }
`

const NextButton = styled.div`
position:relative; 
  width:100%;text-align:center;
  margin-top:70px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(70/428));
  }
`
const Next = styled.button`
  display:inline-block;
  width:408px;
  height: 66px;
  line-height: 60px;
  font-size:20px;font-weight:800;color:#fff;
  transform:skew(-0.1deg);text-align:center;
  border-radius: 11px;
  border: solid 3px #e4e4e4;
  background-color: #979797;
  /* 액티브 됐을때
  border: solid 3px #04966d;
  background-color: #01684b; */
  @media ${(props) => props.theme.mobile} {
    width:100%;
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
  }
`

const Textarea = styled.textarea`
  width:100%;
  height:140px;
  font-size:15px;color:#4a4a4a;font-weight:600;
  padding:15px 20px;
  border-radius: 4px;transform:skew(-0.1deg);
  border: solid 1px #e4e4e4;
  &::placeholder{color:#979797;font-weight:500;}
  @media ${(props) => props.theme.mobile} {
    width:100%;
    height:calc(100vw*(140/428));
    padding:calc(100vw*(15/428));
    font-size:calc(100vw*(15/428));
  }
`

const Sect_EndButton = styled.div`
  margin: 1.25rem 0 2.5rem;
`
const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`