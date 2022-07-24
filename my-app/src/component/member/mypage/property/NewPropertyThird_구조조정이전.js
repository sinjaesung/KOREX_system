//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//server process
import serverController from '../../../../server/serverController';
import serverController2 from '../../../../server/serverController2';

//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_1col_input, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import Switch from '@material-ui/core/Switch';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
//img

import ArrowTop from '../../../../img/map/arrow_top.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import Enter from '../../../../img/member/enter.png';
import CheckImg from '../../../../img/map/radio.png';
import CheckedImg from '../../../../img/map/radio_chk.png';
import RadioImg from '../../../../img/map/radi.png';
import RadioChkImg from '../../../../img/map/radi_chk.png';
import Picture from '../../../../img/member/picture.png';

import { Mobile, PC } from "../../../../MediaQuery"

//component
import SearchApartOfficetel from "./SearchApartOfficetel";
import SearchStoreOffice from "./SearchStoreOffice";
import SearchApartOfficetelSelectInfo from "./SearchApartOfficetelSelectInfo";
import ModalCommon from '../../../common/modal/ModalCommon';

import { useSelector } from 'react-redux';
import tempBrokerRequest from '../../../../store/modules/tempBrokerRequest';

export default function Request({ updateModal, serveruploadimgs_server, changeaddedimgs_server }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [openMore, setOpenMore] = useState(false);
  const [openMore_2, setOpenMore_2] = useState(false);
  const [openMore_3, setOpenMore_3] = useState(false);
  const [park, setPark] = useState(false);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  const history = useHistory();

  const rotate = () => {
    if (openMore == true) {
      return "rotate(180deg)"
    } else {
      return "rotate(0deg)"
    }
  }
  //오피스텔일때 옵션
  const officeteloption_array = [
    { oi_id: 0, label: "침대", default: true },
    { oi_id: 1, label: "붙박이장", default: false },
    { oi_id: 2, label: "옷장", default: false },
    { oi_id: 3, label: "신발장", default: false },
    { oi_id: 4, label: "싱크대", default: false },
    { oi_id: 5, label: "가스레인지", default: false },
    { oi_id: 6, label: "인덕션", default: false },
    { oi_id: 7, label: "냉장고", default: false },
    { oi_id: 8, label: "세탁기", default: false },
    { oi_id: 9, label: "샤워부스", default: false },
    { oi_id: 10, label: "비데", default: false },
    { oi_id: 11, label: "벽걸이에어컨", default: false },
    { oi_id: 12, label: "스탠드에어컨", default: false },
    { oi_id: 13, label: "천장에어컨", default: false }
  ]
  const storeofficeoption_array = [
    { oi_id: 0, label: "벽걸이에어컨", default: false },
    { oi_id: 1, label: "스탠드에어컨", default: false },
    { oi_id: 2, label: "천장에어컨", default: false }
  ]
  const OptionProtect = [
    { op_id: 0, label: "CCTV", default: true },
    { op_id: 1, label: "경비원", default: false },
    { op_id: 2, label: "사설경비", default: false },
    { op_id: 3, label: "현관보안", default: false },
    { op_id: 4, label: "방범창", default: false },
    { op_id: 5, label: "비디오폰", default: false },
    { op_id: 6, label: "인터폰", default: false },
    { op_id: 7, label: "카드키", default: false },
    { op_id: 8, label: "화재경보기", default: false },
    { op_id: 9, label: "무인택배함", default: false }
  ]

  const temp_brokerRequest = useSelector(data => data.tempBrokerRequest);
  const login_user = useSelector(data => data.login_user);//리덕스 로그인회원정보 데이터 접근(memid,companyid,유저이다이,폰,이메일,유저이름,usertype,registertype,memadmin,islogin,isexculsive전문중개사여부)
  const temp_selectComplexinfo = useSelector(data => data.temp_selectComplexinfo);

  //console.log('>>>>유지된 정보들 기본입력정보들(inserted임시 입력정보들):',temp_brokerRequest);
  //console.log('>>>>마이페이지 로그인 중개사회원 companyid(어떤중개사의회원):',login_user);

  //추가정보 입력페이지 입력정보들 state형태로 저장한다.
  const [roomcount, setRoomcount] = useState('');
  const [bathroomcount, setBathroomcount] = useState('');
  const [isduplexfloor, setIsduplexfloor] = useState('');
  const [isparking, setIsparking] = useState('');
  const [parkingoptions, setParkingoptions] = useState('');
  const [iselevator, setIselevator] = useState('');
  const [iswithpet, setIswithpet] = useState('');
  const [istoilet, setIsToilet] = useState('');
  const [isinteriror, setIsInteriror] = useState('');
  const [recommend_jobstore, setRecommendjobstore] = useState('');
  const [ofi_roomstructure, set_Ofi_roomstructure] = useState('');

  const [direction, setDirection] = useState('');
  const [entrance, setEntrance] = useState('');
  const [heatmethod, setHeatmethod] = useState('');
  const [heatfuel, setHeatfuel] = useState('');

  const [standardspaceoption, setStandardspaceoption] = useState(["발코니"]);//표준 공간옵션
  const [officetelspaceoption, setOfficetelspaceoption] = useState(["침대"]);//오피스텔 공간옵션
  const [officeteloption, setOfficeteloption] = useState([]);//오피스텔옵션
  const [storeofficeoption, setStoreofficeoption] = useState([]);//상가사무실옵션
  const [securityoption, setSecurityoption] = useState(["CCTV"]);//보안옵셥

  const [iscontractrenewal, setIscontractrenewal] = useState(0);//계약갱신권청구
  const [loanprice, setLoanprice] = useState('');//융자금
  const [guaranteeprice, setGuaranteeprice] = useState('');//월세 기보증금
  const [maemul_description, setMaemul_description] = useState('');//매물요약
  const [maemul_descriptiondetail, setMaemul_descriptiondetail] = useState('');//매물상세설명

  const ofi_roomstructure_change = (e) => {
    setOptionroom(e.target.value)
    set_Ofi_roomstructure(e.target.value);
  }
  const change_roomcount = (e) => {
    setRoomcount(e.target.value);
  }
  const change_bathroomcount = (e) => {
    setBathroomcount(e.target.value);
  }
  const change_isduplexfloor = (e) => {
    setIsduplexfloor(e.target.value);
  }
  const change_isparking = (e) => {
    setIsparking(e.target.value);
  }
  const change_parkingoptions = (e) => {
    setParkingoptions(e.target.value);
  }
  const change_iselevator = (e) => {
    setIselevator(e.target.value);
  }
  const change_iswithpet = (e) => {
    setIswithpet(e.target.value);
  }
  const change_istoilet = (e) => {
    setIsToilet(e.target.value);
  }
  const change_direction = (e) => {
    setOptiondir(e.target.value)
    setDirection(e.target.value);
  }
  const change_entrance = (e) => {
    setOptionent(e.target.value)
    setEntrance(e.target.value);
  }
  const change_heatmethod = (e) => {
    setOptionmethod(e.target.value)
    setHeatmethod(e.target.value);
  }
  const change_recommend_jobstore = (e) => {
    setRecommendjobstore(e.target.value);
  }
  const change_isinterior = (e) => {
    setIsInteriror(e.target.value);
  }
  const change_heatfuel = (e) => {
    setOptionfuel(e.target.value)
    setHeatfuel(e.target.value);
  }

  const changeCheckBox = (e, state, setState) => {
    let newArr = state;
    if (e.target.checked) {
      newArr.push(e.target.value);
    } else {
      newArr = newArr.filter(item => item !== e.target.value);
    }
    setState([...newArr]);
  }
  const change_iscontractrenewal = (e) => {
    setIscontractrenewal(e.target.value);
  }
  const change_loanprice = (e) => {
    setLoanprice(e.target.value);
  }
  const change_guaranteeprice = (e) => {
    setGuaranteeprice(e.target.value);
  }
  const change_maemul_description = (e) => {
    setMaemul_description(e.target.value);
  }
  const change_maemul_descriptiondetail = (e) => {
    setMaemul_descriptiondetail(e.target.value);
  }

  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  const failModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "물건 등록",
      content: { type: "text", text: `해당물건은 전속매물이 아닙니다.\n이미 다른 중개사에게 의뢰되었거나\n거래중인 물건은 시스템에 등록할 수 없습니다.\n상기 사유에 해당하지 않는 경우,\n고객센터로 문의해주세요.`, component: "" },
      submit: { show: false, title: "확인", event: () => { offModal(); } },
      cancle: { show: false, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", event: () => { offModal(); } }
    });
  }

  //다음버튼 누릀때 서버로 지금껏 정보 모두 보낸다.(외부수임물건전달방식 전닭. 다른 처리로 외부수임처리이기에.)
  const nextStep = async () => {
    //지금껏까지의 모든 저장정보 mereeged하여 서버에 요청제출필요ㅕ하다.
    console.log('>>>유지된 정보들 기본입력정보들:', temp_brokerRequest);
    console.log('>>>추가입력정보들 state정보값들:', roomcount, bathroomcount, isduplexfloor, isparking, parkingoptions, iswithpet, istoilet, isinteriror, recommend_jobstore, ofi_roomstructure, direction, entrance, heatmethod, heatfuel, standardspaceoption, officetelspaceoption, securityoption, officeteloption, storeofficeoption, iscontractrenewal, loanprice, guaranteeprice, maemul_description, maemul_descriptiondetail);
    console.log('roomcount:', roomcount);
    console.log('bathroomcount:', bathroomcount);
    console.log('isduplexfloor:', isduplexfloor);
    console.log('ispakring:', isparking);
    console.log('parkingoptionmss:', parkingoptions);
    console.log('iswithpet::', iswithpet);
    console.log('istoilet:', istoilet);
    console.log('isinteriror:', isinteriror);
    console.log('recommend_jobstore:', recommend_jobstore);
    console.log('ofi_roomstructure:', ofi_roomstructure);
    console.log('direction:', direction);
    console.log('entrance:', entrance);
    console.log('heatmeathod', heatmethod);
    console.log('heatfuel:', heatfuel);
    console.log('stadnardspaceoption:', standardspaceoption);
    console.log('officetelspaceoption:', officetelspaceoption);
    console.log('securittyoption:', securityoption);
    console.log('officeteloption:', officeteloption);
    console.log('storeofficeoption:', storeofficeoption);
    console.log('iscontractrenewal:', iscontractrenewal);
    console.log('loanprice;', loanprice);
    console.log('guranteeprice:', guaranteeprice);
    console.log('maemul_description:', maemul_description);
    console.log('maemul_desciptiondeatil:', maemul_descriptiondetail);
    console.log('isrightprice::', tempBrokerRequest.isrightprice);
    console.log('업로드한 사진들!::', serveruploadimgs_server);

    //istoilet,isinteriror,recojkmmend_jobstore,ofi_roomstructure, standardspaceoption,officetelspaceoption,officeteloptioin,storeofficeoption
    if (((temp_brokerRequest.maemultype == '아파트' || temp_brokerRequest.maemultype == '오피스텔') && (!roomcount || !bathroomcount))) {
      alert('방수/욕실수 입력해주세요!');
      return false;
    }
    if ((temp_brokerRequest.maemultype == '오피스텔' && (!ofi_roomstructure || !isduplexfloor))) {
      alert('방구조 , 복층여부 입력해주세요!');
      return false;
    }
    if ((temp_brokerRequest.maemultype != '아파트' && (!isparking || !iselevator))) {
      alert('주차여부,엘레베이터여부 입력해주세요!');
      return false;
    }
    if (((temp_brokerRequest.maemultype == '상가' || temp_brokerRequest.maemultype == '사무실') && (!istoilet))) {
      alert('전용화장실 여부 입력해주세요!');
      return false;
    }
    if ((temp_brokerRequest.maeultype == '오피스텔' && !iswithpet)) {
      alert('반려동물 여부 입력해주세요!');
      return false;
    }
    if (!iscontractrenewal) {
      alert('계약갱신권 행사여부 입력해주세요!');
      return false;
    }
    if (!temp_brokerRequest.x || !temp_brokerRequest.y) {
      alert('건물의 데이터베이스(x,y)위치정보가 유효하지 않습니다.건물을 다시 선택해주세요.');
      return false;
    }
    if (serveruploadimgs_server.length < 3) {
      alert('사진은 최소 3장이상 등록해주세요!');
      return false;
    }

    //요청전에 단수체크 알고리즘 사젅 검사후에 통과시에 물건외부수임 등록 처리를 합니다. 
    //상가사무실 dangijubnaddress,dangoradoaddrss,floor특정주소에 존재하는 선태갛ㄴ 특정건물의 층 선택, 그 추가하려는 매물종류(floor,ho_idhosil)이 proudct,transction상에 가능한 상태값으로써 존재하고있는지 여부 검사
    if (temp_brokerRequest.maemultype == '상가' || temp_brokerRequest.maemultype == '사무실') {
      let request_possible_sendinfo = {
        dangijibunaddress: temp_brokerRequest.dangijibunaddress,
        dangiroadaddress: temp_brokerRequest.dangiroadaddress,
        floor: temp_brokerRequest.floor,
        req_type: 'storeoffice'
      }
      let request_avail = await serverController.connectFetchController('/api/mypage/brokerRequest_avail_process', 'POST', JSON.stringify(request_possible_sendinfo));//외부수임하여 등록하려는 물건이 그냥 코렉스시스템상에 단수 적용가능한지 여부 검사한다.
      if (request_avail) {
        console.log('해당 의뢰매물or외부수임 매물 코렉스 시스템상에서 등록가능한 단수매물인지 여부 검사(사무실,상가):', request_avail);

        if (request_avail.success) {
          //등록이 가능하다.
        } else {
          console.log('등록불가');
          failModal();
          return;
        }
      }
    } else {
      let request_possible_sendinfo = {
        dangijibunaddress: temp_brokerRequest.dangijibunaddress,
        dangiroadaddress: temp_brokerRequest.dangiroadaddress,
        hosil: temp_brokerRequest.hosil,
        req_type: 'apartofficetel'
      }
      let request_avail = await serverController.connectFetchController('/api/mypage/brokerRequest_avail_process', 'POST', JSON.stringify(request_possible_sendinfo));//외부수임하여 등록하려는 물건이 그냥 코렉스시스템상에 단수적용가능한지 여부 검사한다.
      if (request_avail) {
        console.log('해당 의뢰매물or외부수임 매물 코렉스시스템상에서 등로각능한지 여부 단수매물인지 여부검사(아파트,오피):', request_avail);

        if (request_avail.success) {

        } else {
          console.log('등록불가');
          failModal();
          return;
        }
      }
    }

    if (temp_brokerRequest.floorname.indexOf('지하') != -1) {
      var floorint = temp_brokerRequest.floorname.replace('지하', '');
      console.log('floorint>>>>>:', floorint);
      floorint = 0 - parseInt(floorint);
    } else {
      var floorint = temp_brokerRequest.floorname.replace('지상', '');
      console.log('floorint>>>>:', floorint);
      floorint = parseInt(floorint);
    }

    let body_info = {
      dangi: (temp_brokerRequest.maemultype == '아파트' || temp_brokerRequest.maemultype == '오피스텔') ? temp_selectComplexinfo.complexname : '',//아파트,오피스텔 단지명.
      dangijibunaddress: temp_brokerRequest.dangijibunaddress,//단지주소지번
      dangiroadaddress: temp_brokerRequest.dangiroadaddress,//단지주소로드
      companyid: login_user.company_id,//어떤 로그인 중개사회원 중개사아이디인지.
      exculsivedimension: temp_brokerRequest.jeonyongdimension,//전용면적
      exculsivepyeong: temp_brokerRequest.jeonyongpyeong,//전용평
      ibju_isinstant: temp_brokerRequest.ibju_isinstant,
      ibju_specifydate: temp_brokerRequest.ibju_specifydate,
      maemulname: temp_brokerRequest.maemulname,
      maemultype: temp_brokerRequest.maemultype,
      managecost: temp_brokerRequest.managecost,
      ismanagementcost: temp_brokerRequest.ismanagementcost,//관리비유무
      requestmanname: temp_brokerRequest.name,//여기선 외부수임요청자 정보(이름,휴대폰)
      requestmemphone: temp_brokerRequest.phone,
      sellprice: temp_brokerRequest.sellprice,//매매가,전세가,월세가 (보증금,거래액)
      monthsellprice: temp_brokerRequest.monthsellprice,//월세액
      selltype: temp_brokerRequest.selltype, //판매타입
      supplydimension: temp_brokerRequest.supplydimension,//공급면적
      supplypyeong: temp_brokerRequest.supplypyeong,//공급면적평
      x: temp_brokerRequest.x,//좌표값.매물의 위치경도위도좌표값.
      y: temp_brokerRequest.y,
      storejob: temp_brokerRequest.storejob,//상가업종
      isstorejob: temp_brokerRequest.isstorejob,//상가 업종여부.
      usetype: temp_brokerRequest.officetelusetype,//오피스텔 이용형태
      isrightprice: temp_brokerRequest.isrightprice,//상가 권리금유무

      dong: (temp_brokerRequest.maemultype == '아파트' || temp_brokerRequest.maemultype == '오피스텔') ? temp_brokerRequest.dong : '',//아파트나 오피인경우에만 
      hosil: (temp_brokerRequest.maemultype == '아파트' || temp_brokerRequest.maemultype == '오피스텔') ? temp_brokerRequest.hosil : '',
      floor: temp_brokerRequest.floor,//층id값
      dongname: temp_brokerRequest.dongname,//동이름 n동
      hosilname: temp_brokerRequest.hosilname,//호실이름 n호
      floorname: temp_brokerRequest.floorname,//층이름 n층
      floorint: floorint,//층수 int형태값.
      //dangi: temp_brokerRequest.dangi,
      exculsive_periods: temp_brokerRequest.exculsive_periods,//전속기간
      managecostincludes: temp_brokerRequest.managecostincludes.join(','),//관리비포함항목들.
      storeofficebuildingfloor: temp_brokerRequest.storeofficebuildingfloor,

      roomcount_val: roomcount ? roomcount : '',//아파트,오피스텔
      bathroomcount_val: bathroomcount ? bathroomcount : '',//아파트오피
      isduplexfloor_val: isduplexfloor ? isduplexfloor : '',//복층여부 오피
      isparking_val: isparking ? isparking : '',//주차여부
      parkingoptions_val: parkingoptions ? parkingoptions : '',
      iselevator_val: iselevator ? iselevator : '',//엘베여부
      iswithpet_val: iswithpet ? iswithpet : '',//펫여부
      direction_val: direction ? direction : '',//방향
      istoilet_val: istoilet ? istoilet : '',//전용화장실여부
      isinteriror_val: isinteriror ? isinteriror : '',//인테리어여부
      recommend_jobstore_val: recommend_jobstore ? recommend_jobstore : '',//추천업종
      ofi_roomstructure_val: ofi_roomstructure ? ofi_roomstructure : '',//오피스텔 방구조

      entrance_val: entrance ? entrance : '',//현관구조
      heatmethod_val: heatmethod ? heatmethod : '',
      heatfuel_val: heatfuel ? heatfuel : '',

      standardspaceoption_val: standardspaceoption ? standardspaceoption.join(',') : '',//표준공간옵션
      officetelspaceoption_val: officetelspaceoption ? officetelspaceoption.join(',') : '',//오피스텔공간옵션

      securityoption_val: securityoption ? securityoption.join(',') : '',//보안옵션

      officeteloption_val: officeteloption ? officeteloption.join(',') : '',//오피스텔옵션
      storeofficeoption_val: storeofficeoption ? storeofficeoption.join(',') : '',//상가사무실옵션

      iscontractrenewal_val: iscontractrenewal,//계약갱신청구권행사여부
      loanprice_val: loanprice,//융자금
      guaranteeprice_val: guaranteeprice,//기보증금월세액
      maemul_description_val: maemul_description,
      maemul_descriptiondetail_val: maemul_descriptiondetail,

      prdstatus_generator: login_user.memid, //외부수임물건 등록 거래준비 상태변경 요인자는 외부수임인아라긴 보단 수임받아 등록하는 중개사회원memid일것임.
      prdstatus_change_reason: ''
    }

    console.log('>>>JSON SUBMIT DATA:', body_info, JSON.stringify(body_info));

    let res = await serverController.connectFetchController('/api/broker/user_brokerOuterRequest', 'POST', JSON.stringify(body_info));
    console.log('->>>>>res resultsss:', res);

    if (res.success) {
      alert('외부수임 매물 등록 완료!');

      //매물이 등록된 후에 얻은 그 inserted된 prd_idenittiyid or prd_id매물에 대해서 update쿼리로써 별도로 매물 외부수임등록 사진등록 쿼리진행.사진을 등록하지 않은 경우라면 이 관련된 코드는 실행되지않음.
      console.log('업로드한 사진들!::', serveruploadimgs_server);

      let formData = new FormData();
      formData.append('folder', 'productImgs');
      formData.append('prd_identity_id', res.insert_result);

      for (let f = 0; f < serveruploadimgs_server.length; f++) {
        let file_item = serveruploadimgs_server[f];
        formData.append('productimgs', file_item);

      }
      let res2 = await serverController2.connectFetchController('/api/broker/brokerProduct_prdimgs_process', 'POST', formData);
      if (res2) {
        if (res2.success) {
          console.log('resa22 resultssss:', res2);

          let update_result = res2.update_result;

          let prd_imgs = update_result['prd_imgs'];

        }
      }
      history.push('/MyPage');
    } else {
      alert('처리에 문제가 있습니다.');
    }
  };

  const [Optiondir, setOptiondir] = useState('선택');
  const [Optionent, setOptionent] = useState('선택');
  const [Optionmethod, setOptionmethod] = useState('선택');
  const [Optionfuel, setOptionfuel] = useState('선택');
  const [Optionroom, setOptionroom] = useState('방구조선택');


  return (
    <>
      <Wrapper>
        <Title>추가정보 입력/수정</Title>
        <Sect_R1></Sect_R1>
        <Sect_R2>
          <div className="m-1x0x3">
            <Title_Sub>물건정보</Title_Sub>
            <div className="par-indent-left">
              {
                temp_brokerRequest.maemultype == '아파트' || temp_brokerRequest.maemultype == '오피스텔' ?
                  <div className="par-spacing">
                    <div className="flex-center-center">
                      <MUTextField_option required id="standard-basic" label="방수" variant="standard" type="number" value={roomcount} onChange={change_roomcount}
                        InputProps={{ endAdornment: (<InputAdornment position="end">개</InputAdornment>) }}
                        InputLabelProps={{ shrink: true, }}
                      />
                      <Divider sx={{ height: 28, mx: 2 }} orientation="vertical" />
                      <MUTextField_option required id="standard-basic" label="욕실수" variant="standard" type="number" value={bathroomcount} onChange={change_bathroomcount}
                        InputProps={{ endAdornment: (<InputAdornment position="end">개</InputAdornment>) }}
                        InputLabelProps={{ shrink: true, }}
                      />
                      {/* <InboxRoom>
                        <InputRoom type="text" placeholder="욕실수 입력" value={bathroomcount} onChange={change_bathroomcount}/>
                      </InboxRoom> */}


                      {/* <InboxRoom>
                        <InputRoom type="text" placeholder="방수 입력" value={roomcount} onChange={change_roomcount} />
                      </InboxRoom>
                      <SpanRoom>개</SpanRoom>
                      <InboxRoom>
                        <InputRoom type="text" placeholder="욕실수 입력" value={bathroomcount} onChange={change_bathroomcount} />
                      </InboxRoom>
                      <SpanRoom>개</SpanRoom> */}


                    </div>
                  </div>
                  :
                  null
              }
              {
                temp_brokerRequest.maemultype == '오피스텔' ?
                  <div className="par-spacing">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label" required>방구조</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={Optionroom}
                        label="방구조"
                        onChange={ofi_roomstructure_change}
                      >
                        <MenuItem value='방구조선택'>방구조 선택</MenuItem>
                        <MenuItem value='오픈형원룸'>오픈형원룸</MenuItem>
                        <MenuItem value='분리형원룸'>분리형원룸</MenuItem>
                        <MenuItem value='거실보유형'>거실보유형</MenuItem>
                      </Select>
                    </FormControl>


                    {/* <Label>방구조<Pilsu>*</Pilsu></Label>
                    <SelectMb onChange={ofi_roomstructure_change}>
                      <Option value='방구조선택'>방구조 선택</Option>
                      <Option value='오픈형원룸'>오픈형원룸</Option>
                      <Option value='분리형원룸'>분리형원룸</Option>
                      <Option value='거실보유형'>거실보유형</Option>
                    </SelectMb> */}
                  </div>
                  :
                  null
              }
              {/*오피스텔일때 복층여부~반려동물 추가*/}
              {
                temp_brokerRequest.maemultype == '오피스텔' ?
                  <div className="par-spacing">
                    <FormControl component="fieldset">
                      <FormLabel component="legend" required>복층 여부</FormLabel>
                      <RadioGroup
                        row
                        aria-label="gender"
                        defaultValue="단층"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel value="단층" control={<Radio type="radio" name="is_duplex_floor" id="floor1" defaultChecked value='0' onChange={change_isduplexfloor} />} label="단층" />
                        <FormControlLabel value="복층" control={<Radio type="radio" name="is_duplex_floor" id="floor2" value='1' onChange={change_isduplexfloor} />} label="복층" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  :
                  null
              }
              {
                temp_brokerRequest.maemultype != '아파트' ?
                  <>
                    <div className="par-spacing">
                      <FormControl component="fieldset">
                        <FormLabel component="legend" required>주차</FormLabel>
                        <RadioGroup
                          row
                          aria-label=""
                          defaultValue="불가"
                          name="radio-buttons-group"
                        >
                          <FormControlLabel value="불가" onClick={() => { setPark(false) }} control={<Radio type="radio" name="parking" id="park1" value='0' onChange={change_isparking} />} label="불가" />
                          <FormControlLabel value="가능" onClick={() => { setPark(true) }} control={<Radio type="radio" name="parking" id="park2" value='1' onChange={change_isparking} />} label="가능" />
                          {
                            park ?
                              <InputPark type="text" placeholder="(e.g 1대 가능)" value={parkingoptions} onChange={e => setParkingoptions(e.target.value)} />
                              :
                              null
                          }
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div className="par-spacing">
                      <FormControl component="fieldset">
                        <FormLabel component="legend" required>엘리베이터</FormLabel>
                        <RadioGroup
                          row
                          aria-label=""
                          defaultValue="없음"
                          name="radio-buttons-group"
                        >
                          <FormControlLabel value="없음" control={<Radio type="radio" name="elevate" id="elevate1" value='0' onChange={change_iselevator} />} label="없음" />
                          <FormControlLabel value="있음" control={<Radio type="radio" name="parking" id="elevate2" value='1' onChange={change_iselevator} />} label="있음" />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </>
                  :
                  null
              }

              {
                temp_brokerRequest.maemultype == '오피스텔' ?
                  <div className="par-spacing">
                    <FormControl component="fieldset">
                      <FormLabel component="legend" required>반려동물</FormLabel>
                      <RadioGroup
                        row
                        aria-label="gender"
                        defaultValue="불가"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel value="불가" control={<Radio type="radio" name="pet" id="pet1" defaultChecked value='0' onChange={change_iswithpet} />} label="불가" />
                        <FormControlLabel value="가능" control={<Radio type="radio" name="pet" id="pet2" value='1' onChange={change_iswithpet} />} label="가능" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  :
                  null
              }
              {
                temp_brokerRequest.maemultype == '상가' || temp_brokerRequest.maemultype == '사무실' ?
                  <div className="par-spacing">
                    <FormControl component="fieldset">
                      <FormLabel component="legend" required>화장실</FormLabel>
                      <RadioGroup
                        row
                        defaultValue="공용"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel value="공용" control={<Radio type="radio" name="is_toilet" id="is_toilet1" defaultChecked value='0' onChange={change_istoilet} />} label="공용" />
                        <FormControlLabel value="전용" control={<Radio type="radio" name="is_toilet" id="is_toilet2" value='1' onChange={change_istoilet} />} label="전용" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  :
                  null
              }

              {/* <InputBox>
                <Label>사진<Pilsu>*</Pilsu></Label>
                <div className="flex-center-center">
                  <InputFileLabel for="picture" onClick={() => { updateModal() }}>사진 추가</InputFileLabel>
                </div>
                <UploadedMaemulimgs>
                  {
                    changeaddedimgs_server.map((value, index) => {
                      return (
                        <UploadImg src={value} />
                      )
                    })
                  }
                </UploadedMaemulimgs>
              </InputBox> */}
              <div className="par-spacing">
                <FormControl fullWidth>
                  <FormLabel required>사진</FormLabel>
                  <div className="flex-center-center">
                    <InputFileLabel for="picture" onClick={() => { updateModal() }}>사진 추가</InputFileLabel>
                  </div>
                  <UploadedMaemulimgs>
                    {
                      changeaddedimgs_server.map((value, index) => {
                        return (
                          <UploadImg src={value} />
                        )
                      })
                    }
                  </UploadedMaemulimgs>
                </FormControl>
              </div>
            </div>
            {/*더보기*/}
            <div className="par-spacing">
              <div className="flex-left-center">
                <SubdirectoryArrowRightIcon />
                <h4>더보기</h4>
                <ExpandMore
                  expand={openMore}
                  onClick={() => { setOpenMore(!openMore) }}
                  aria-expanded={openMore}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </div>
            </div>

            <div className="par-indent-left">

              {
                openMore ?
                  <MoreView>
                    <div className="par-spacing">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">방향</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={Optiondir}
                          label="방향"
                          onChange={change_direction}
                        >
                          <MenuItem value='선택'>방향 선택</MenuItem>
                          <MenuItem value='남향'>남향</MenuItem>
                          <MenuItem value='남동향'>남동향</MenuItem>
                          <MenuItem value='동향'>동향</MenuItem>
                          <MenuItem value='서향'>서향</MenuItem>
                          <MenuItem value='남서향'>남서향</MenuItem>
                          <MenuItem value='남향'>남향</MenuItem>
                          <MenuItem value='북동향'>북동향</MenuItem>
                          <MenuItem value='북향'>북향</MenuItem>
                          <MenuItem value='북서향'>북서향</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    {/*현관구조*/}
                    {
                      temp_brokerRequest.maemultype == '아파트' || temp_brokerRequest.maemultype == '오피스텔' ?
                        <div className="par-spacing">
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">현관구조</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={Optionent}
                              label="현관구조"
                              onChange={change_entrance}
                            >
                              <MenuItem value='선택'>현관구조 선택</MenuItem>
                              <MenuItem value='복도식'>복도식</MenuItem>
                              <MenuItem value='계단식'>계단식</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        :
                        null
                    }

                    <div className="par-spacing">
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">난방</FormLabel>
                        <div className="par-spacing">
                          <div className="flex-spabetween-center">
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">방식</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={Optionmethod}
                                label="방식 "
                                onChange={change_heatmethod}
                              >
                                <MenuItem value='선택'>방식 선택</MenuItem>
                                <MenuItem value='개별난방'>개별난방</MenuItem>
                                <MenuItem value='중앙난방'>중앙난방</MenuItem>
                                <MenuItem value='지역난방'>지역난방</MenuItem>
                              </Select>
                            </FormControl>
                            <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">연료</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={Optionfuel}
                                label="연료 "
                                onChange={change_heatfuel}
                              >
                                <MenuItem value='선택'>연료 선택</MenuItem>
                                <MenuItem value='도시가스'>도시가스</MenuItem>
                                <MenuItem value='LPG'>LPG</MenuItem>
                                <MenuItem value='기름'>기름</MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                      </FormControl>
                    </div>

                    {
                      temp_brokerRequest.maemultype == '상가' ?
                        <>
                          <div className="par-spacing">
                            <FormControl component="fieldset">
                              <FormLabel component="legend">인테리어</FormLabel>
                              <RadioGroup
                                row
                                defaultValue="없음"
                                name="radio-buttons-group"
                              >
                                <FormControlLabel value="없음" control={<Radio type="radio" name="is_interior" id="is_interior1" defaultChecked value='0' onChange={change_isinterior} />} label="없음" />
                                <FormControlLabel value="있음" control={<Radio type="radio" name="is_interior" id="is_interior2" value='1' onChange={change_isinterior} />} label="있음" />
                              </RadioGroup>
                            </FormControl>
                          </div>
                          <div className="par-spacing">
                            <MUTextField_100 label="추천업종" variant="standard" placeholder="추천업종" value={recommend_jobstore} onChange={change_recommend_jobstore} />
                          </div>
                        </>
                        :
                        null
                    }


                    <div className="par-spacing">
                      <FormControl component="fieldset" fullWidth>
                        <div className="flex-left-center">
                          <FormLabel component="legend">옵션</FormLabel>
                          <ExpandMore
                            expand={openMore_2}
                            onClick={() => { setOpenMore_2(!openMore_2) }}
                            aria-expanded={openMore_2}
                            aria-label="show more"
                          >
                            <ExpandMoreIcon />
                          </ExpandMore>
                        </div>
                        {
                          openMore_2 ?
                            <MoreView>
                              {/*오피스텔제외공간. 표준공간옵션*/}
                              {
                                temp_brokerRequest.maemultype != '오피스텔' ?
                                  <div className="par-spacing">
                                    <FormControl component="fieldset">
                                      <div className="flex-left-center">
                                        <SubdirectoryArrowRightIcon />
                                        <FormLabel component="legend">공간</FormLabel>
                                      </div>
                                      <div className="par-indent-left">
                                        <FormGroup row>
                                          <FormControlLabel control={<Checkbox id="standard_spaceoption1" value='발코니' className='standard_spaceoption' onChange={e => changeCheckBox(e, standardspaceoption, setStandardspaceoption)} defaultChecked />} label="발코니" />
                                          <FormControlLabel control={<Checkbox id="standard_spaceoption2" value='베란다' className='standard_spaceoption' onChange={e => changeCheckBox(e, standardspaceoption, setStandardspaceoption)} />} label="베란다" />
                                          <FormControlLabel control={<Checkbox id="standard_spaceoption3" value='테라스' className='standard_spaceoption' onChange={e => changeCheckBox(e, standardspaceoption, setStandardspaceoption)} />} label="테라스" />
                                        </FormGroup>
                                      </div>
                                    </FormControl>
                                  </div>
                                  :
                                  null
                              }
                              {/*오피스텔공간옵션*/}
                              {
                                temp_brokerRequest.maemultype == '오피스텔' ?
                                  <div className="par-spacing">
                                    <FormControl component="fieldset">
                                      <div className="flex-left-center">
                                        <SubdirectoryArrowRightIcon />
                                        <FormLabel component="legend">공간</FormLabel>
                                      </div>
                                      <div className="par-indent-left">
                                        <FormGroup row>
                                          <FormControlLabel control={<Checkbox id="officetel_spaceoption1" value='베란다' className='officetel_spaceoption' onChange={e => changeCheckBox(e, officetelspaceoption, setOfficetelspaceoption)} />} label="베란다" />

                                          <FormControlLabel control={<Checkbox id="officetel_spaceoption2" value='테라스' className='officetel_spaceoption' onChange={e => changeCheckBox(e, officetelspaceoption, setOfficetelspaceoption)} />} label="테라스" />
                                        </FormGroup>
                                      </div>
                                    </FormControl>
                                  </div>
                                  :
                                  null
                              }

                              {/*오피스텔 옵션*/}
                              {
                                temp_brokerRequest.maemultype == '오피스텔' ?
                                  <div className="par-spacing">
                                    <FormControl component="fieldset">
                                      <div className="flex-left-center">
                                        <SubdirectoryArrowRightIcon />
                                        <FormLabel component="legend">내부</FormLabel>
                                      </div>
                                      <div className="par-indent-left">
                                        <FormGroup row>
                                          {
                                            officeteloption_array.map((value) => {
                                              return (
                                                <FormControlLabel control={<Checkbox id={"officteloption" + value.oi_id} className='officteloption' onChange={e => changeCheckBox(e, officeteloption, setOfficeteloption)} value={value.label} defaultChecked={value.default ? true : false} />} label={value.label} />
                                                // <Checkbox>
                                                //   <Check type="checkbox" id={"officteloption" + value.oi_id} className='officteloption' onChange={e => changeCheckBox(e, officeteloption, setOfficeteloption)} value={value.label} defaultChecked={value.default ? true : false} />
                                                //   <CheckLabel for={"officteloption" + value.oi_id}>
                                                //     <CheckSpan />
                                                //     {value.label}
                                                //   </CheckLabel>
                                                // </Checkbox>
                                              )
                                            }
                                            )}
                                        </FormGroup>
                                      </div>
                                    </FormControl>
                                  </div>
                                  :
                                  null
                              }
                              {/*상가사무실옵션*/}
                              {
                                temp_brokerRequest.maemultype == '상가' || temp_brokerRequest.maemultype == '사무실' ?
                                  <div className="par-spacing">
                                    <FormControl component="fieldset">
                                      <div className="flex-left-center">
                                        <SubdirectoryArrowRightIcon />
                                        <FormLabel component="legend">내부</FormLabel>
                                      </div>
                                      <div className="par-indent-left">
                                        <FormGroup row>
                                          {
                                            storeofficeoption_array.map((value) => {
                                              return (
                                                <FormControlLabel control={<Checkbox id={"storeofficeoption" + value.oi_id} className='storeofficeoption' onChange={e => changeCheckBox(e, storeofficeoption, setStoreofficeoption)} value={value.label} defaultChecked={value.default ? true : false} />} label={value.label} />
                                                // <Checkbox>
                                                //   <Check type="checkbox" id={"storeofficeoption" + value.oi_id} className='storeofficeoption' onChange={e => changeCheckBox(e, storeofficeoption, setStoreofficeoption)} value={value.label} defaultChecked={value.default ? true : false} />
                                                //   <CheckLabel for={"storeofficeoption" + value.oi_id}>
                                                //     <CheckSpan />
                                                //     {value.label}
                                                //   </CheckLabel>
                                                // </Checkbox>
                                              )
                                            }
                                            )}
                                        </FormGroup>
                                      </div>
                                    </FormControl>
                                  </div>
                                  :
                                  null
                              }
                              {
                                temp_brokerRequest.maemultype != '아파트' ?
                                  <div className="par-spacing">
                                    <FormControl component="fieldset">
                                      <div className="flex-left-center">
                                        <SubdirectoryArrowRightIcon />
                                        <FormLabel component="legend">보안</FormLabel>
                                      </div>
                                      <div className="par-indent-left">
                                        <FormGroup row>
                                          {
                                            OptionProtect.map((value) => {
                                              return (
                                                <FormControlLabel control={<Checkbox id={"securityoption" + value.op_id} className='securityoptions' onChange={e => changeCheckBox(e, securityoption, setSecurityoption)} value={value.label} defaultChecked={value.default ? true : false} />} label={value.label} />
                                              )
                                            }
                                            )}
                                        </FormGroup>
                                      </div>
                                    </FormControl>
                                  </div>
                                  :
                                  null
                              }
                            </MoreView>
                            :
                            null

                        }
                      </FormControl>
                    </div>

                  </MoreView>
                  :
                  null

              }
            </div>
          </div>
          <div className="m-1x0x3">
            <Title_Sub>거래정보</Title_Sub>
            <div className="par-indent-left">
              <div className="par-spacing">
                <FormControl>
                  <FormLabel required>계약갱신권 행사여부</FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    defaultValue="미확인"
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="미확인" control={<Radio type="radio" onChange={change_iscontractrenewal} value='0' name="is_contractrenewal" id="radi1" />} label="미확인" />
                    <FormControlLabel value="확인" control={<Radio type="radio" onChange={change_iscontractrenewal} value='1' name="is_contractrenewal" id="radi2" />} label="확인" />

                  </RadioGroup>
                </FormControl>
              </div>
              <div className="par-spacing">
                <MUTextField_100 id="standard-basic" label="융자금" variant="standard" placeholder="가격 입력" helperText="(e.g 1억 5,000)" value={loanprice} onChange={change_loanprice} />
              </div>
              <div className="par-spacing">
                <MUTextField_100 id="standard-basic" label="기보증금 / 월세" variant="standard" placeholder="가격 입력" helperText="(e.g 1억 5,000)" value={guaranteeprice} onChange={change_guaranteeprice} />
              </div>
              <div className="par-spacing">
                <FormControl component="fieldset" fullWidth >
                  <div className="flex-left-center">
                    <FormLabel component="legend">설명</FormLabel>
                    <ExpandMore
                      expand={openMore_3}
                      onClick={() => { setOpenMore_3(!openMore_3) }}
                      aria-expanded={openMore_3}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </div>
                  {
                    openMore_3 ?
                      <MoreView>
                        <div className="par-spacing">
                          <MUTextField_100 id="standard-basic" variant="standard" placeholder="매물 요약 입력" value={maemul_description} onChange={change_maemul_description} />
                        </div>
                        <div className="par-spacing">
                          <MUTextField_100 placeholder="매물 설명 입력" multiline rows={4} value={maemul_descriptiondetail} onChange={change_maemul_descriptiondetail} />
                        </div>
                      </MoreView>
                      :
                      null

                  }
                </FormControl>
              </div>
            </div>
          </div>
          {/*!!!!다음 버튼 , 조건문 맞춰서 액티브 됐을때 색상 바뀌어야함..!!!! */}
          <div className="par-spacing">
            <MUButton_Validation variant="contained" type="button" name="" active={""} onClick={nextStep}>다음</MUButton_Validation>
          </div>
        </Sect_R2>
      </Wrapper>
      <ModalCommon modalOption={modalOption} />
    </>

  );
}

const MUButton = styled(Button)``

const MUTextField = styled(TextField)``

const MUTextField_100 = styled(MUTextField)`
      &.MuiFormControl-root.MuiTextField-root {
        width:100%;    
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
const MUTextField_option = MUstyled(TextField)`
  width : 92%;
`

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Title_Sub = styled.h3``

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



const SelectBox = styled.div`
        width:100%;
        display:flex;justify-content:space-between;align-items:center;
        flex-wrap:wrap;
        `
const Label = styled.label`
        display:inline-block;
        font-size:12px;font-weight:600;
        transform:skew(-0.1deg);color:#4a4a4a;
        margin-bottom:10px;
        @media ${(props) => props.theme.mobile} {
          font-size:calc(100vw*(12/428));
        margin-bottom:calc(100vw*(10/428));
    }
        `
const Labelblock = styled(Label)`
        display:block;width:100%;
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
const SelectMb = styled(Select)`
        margin-bottom:30px;
        @media ${(props) => props.theme.mobile} {
          margin-bottom:calc(100vw*(30/428));
    }
        `
const SelectMbShort = styled(Select)`
        width:190px;margin-bottom:30px;
        @media ${(props) => props.theme.mobile} {
          width:calc(100vw*(170/428));
        margin-botom:calc(100vw*(30/428));
    }
        `
const Option = styled.option`
        transform:skew(-0.1deg);
        font-family:'nbg',sans-serif;
        `
const InputBox = styled.div`
        position:relative;
        /* margin-bottom:25px; */
        &:last-child{margin-bottom:0;}
        /* @media ${(props) => props.theme.mobile} {
          margin-bottom:calc(100vw*(15/428));
    } */
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
const Textarea = styled.textarea`
        width:100%;height:220px;
        resize:none;border:1px solid #e4e4e4;
        border-radius:4px;padding:15px;
        font-size:15px; transform:skeW(-0.1deg);
        color:#4a4a4a;margin-top:10px;
        @media ${(props) => props.theme.mobile} {
          height:calc(100vw*(220/428));
        font-size:calc(100vw*(15/428));
        margin-top:calc(100vw*(10/428));
    }
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
          width:calc(100vw*(167/428));
        height:calc(100vw*(43/428));
    }
        `
const InboxRoom = styled(Inbox)`
        width:150px;
        @media ${(props) => props.theme.mobile} {
          width:calc(100vw*(150/428));
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
const InputRoom = styled(InputShort)`
        width:100%;
        `
const InputFileLabel = styled.label`
        width:100%;height:43px;border-radius:4px;
        border:1px solid #e4e4e4;cursor:pointer;
        text-align:center;vertical-align:middle;line-height:43px;
        font-size:15px;color:#707070;transform:skew(-0.1deg);
        background:url(${Picture}) no-repeat 95% center; background-size:21px;
        @media ${(props) => props.theme.mobile} {
          height:calc(100vw*(43/428));
        font-size:calc(100vw*(15/428));
        background-size:calc(100vw*(21/428));
        line-height:calc(100vw*(43/428));
    }
        `
const Span = styled.span`
        vertical-align:middle;
        font-size:15px;font-weight:600;
        color:#4a4a4a;transform:skew(-0.1deg);
        margin-left:10px;
        @media ${(props) => props.theme.mobile} {
          font-size:calc(100vw*(15/428));
        margin-eleft:calc(100vw*(10/428));
    }
        `
const SpanRoom = styled(Span)`
        color:#707070;
        margin-left:0;
        `
const Example = styled.p`
        display:inline-block;
        font-size:12px;transform:skew(-0.1deg);
        color:#4a4a4a;margin-left:5px;
        @media ${(props) => props.theme.mobile} {
          font-size:calc(100vw*(12/428));
        margin-left:calc(100vw*(5/428));
    }
        `
const Flex = styled.div`
        display:flex;justify-content:space-between;align-items:center;
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
        /* width:100%; */
        margin:0.3125rem 0; 
        /* @media ${(props) => props.theme.mobile} {
          margin - top:calc(100vw*(50/428));
    } */
        `
const MoreView = styled.div`
        transition:all 0.3s;      
      `
const MoreBox = styled.div`
        `
const WrapCheck = styled.div`
        display:flex;justify-content:felx-start;align-items:center;
        flex-wrap:wrap;margin-top:10px;
        margin-bottom:30px;
        @media ${(props) => props.theme.mobile} {
          margin-top:calc(100vw*(20/428));
        margin-bottom:calc(100vw*(30/428));
  }
        `
const Check = styled.input`
        display:none;
        &:checked+label span{background:url(${CheckedImg}) no-repeat; background-size:100% 100%;}
        `
const CheckLabel = styled.label`
        font-size:15px;font-family:'nbg',sans-serif;
        transform:skew(-0.1deg);color:#4a4a4a;
        @media ${(props) => props.theme.mobile} {
          font-size:calc(100vw*(15/428));
  }
        `
const CheckSpan = styled.span`
        display:inline-block;width:20px;height:20px;
        background:url(${CheckImg}) no-repeat; background-size:100% 100%;
        margin-right:8px;vertical-align:middle;
        @media ${(props) => props.theme.mobile} {
          width:calc(100vw*(20/428));
        height:calc(100vw*(20/428));margin-right:calc(100vw*(8/428));
  }
        `
const Radiobox = styled.div`
        margin-right:30px;
        &:last-child{margin-right:0;}
        @media ${(props) => props.theme.mobile} {
          margin-right:calc(100vw*(30/428));
  }
        `
const RadioLabel = styled.label`
        font-size:15px;font-family:'nbg',sans-serif;
        transform:skew(-0.1deg);color:#4a4a4a;
        @media ${(props) => props.theme.mobile} {
          font-size:calc(100vw*(15/428));
  }
        `
const RadioSpan = styled.span`
        display:inline-block;width:20px;height:20px;
        background:url(${RadioImg}) no-repeat; background-size:100% 100%;
        margin-right:8px;vertical-align:middle;
        @media ${(props) => props.theme.mobile} {
          width:calc(100vw*(20/428));
        height:calc(100vw*(20/428));margin-right:calc(100vw*(8/428));
  }
        `
const InputPark = styled(InputTxt)`
        width:183px;
        @media ${(props) => props.theme.mobile} {
          width:calc(100vw*(145/428));
  }
        `
const TopOptionTxt = styled.div`
        font-size:15px;color:#4a4a4a;transform:skew(-0.1deg);
        margin-bottom:30px;
        @media ${(props) => props.theme.mobile} {
          margin-bottom:calc(100vw*(54/428));
        font-size:calc(100vw*(15/428));
  }
        `
const UploadedMaemulimgs = styled.div`
        width:100%;height:auto;
        display:flex;flex-flow:row wrap;
        `;
const UploadImg = styled.img`
        width:100px;height:100px;
        `;


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