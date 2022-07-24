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

//component
import { Mobile, PC } from "../../../../MediaQuery"

//img
import Picture from '../../../../img/member/picture.png';


import { useSelector } from 'react-redux';
import tempBrokerRequest from '../../../../store/modules/tempBrokerRequest';

export default function InputForm_ItemSpec_Add({ updateModal, serveruploadimgs_server, changeaddedimgs_server, mode }) {
  
  const brokerRequest_product_data = useSelector(data => data.brokerRequest_product); //물건 수정 시 보여주는 값
  console.log('추가 정보확인 하기1:', brokerRequest_product_data);
  const temp_brokerRequest = useSelector(data => data.tempBrokerRequest);  // 기본정보 입력된 데이터 리덕스
  console.log('추가 정보확인 하기2:', temp_brokerRequest);
  const temp_selectComplexinfo = useSelector(data => data.temp_selectComplexinfo);
  console.log('추가 정보확인 하기3:', temp_selectComplexinfo);   // 추가정보 저장하는 리덕스 같은데 확인하기 .....
  //console.log('>>>>유지된 정보들 기본입력정보들(inserted임시 입력정보들):',temp_brokerRequest);
  //console.log('>>>>마이페이지 로그인 중개사회원 companyid(어떤중개사의회원):',login_user);
  const login_user = useSelector(data => data.login_user);//리덕스 로그인회원정보 데이터 접근(memid,companyid,유저이다이,폰,이메일,유저이름,usertype,registertype,memadmin,islogin,isexculsive전문중개사여부)

  const [EditData, setEditData] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1);
  const [openMore, setOpenMore] = useState(false);
  const [openMore_2, setOpenMore_2] = useState(false);
  const [openMore_3, setOpenMore_3] = useState(false);
  const [park, setPark] = useState(false);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  const [active, setactive] = useState(false);
  const history = useHistory();
  const [Optiondir, setOptiondir] = useState('선택');
  const [Optionent, setOptionent] = useState('선택');
  const [Optionmethod, setOptionmethod] = useState('선택');
  const [Optionfuel, setOptionfuel] = useState('선택');
  const [Optionroom, setOptionroom] = useState('방구조선택');

  useEffect(async () => {
    if (mode == '수정'){
      let res = await serverController.connectFetchController(`/api/products/${brokerRequest_product_data.prdidentityid}?prd_field_all=1 `, 'get');
      setEditData(res.data)
      console.log('한가지 물건 정보 가져오기', mode);
      console.log('한가지 물건 정보 가져오기', res.data);
      console.log('한가지 물건 정보 가져오기', res.data.is_parking);
      console.log(res.data.is_duplex_floor);
      setLoanprice(res.data.loanprice)// 융자금
      setIsparking(res.data.is_parking)//주차 여부
      setIselevator(res.data.is_elevator)//엘베 유무
      setGuaranteeprice(res.data.existed_deposit)// 기보증금
      setGuaranteemonthprice(res.data.existed_month_price)//기보증금 월세
      setMaemul_description(res.data.prd_description)//요약설명
      setMaemul_descriptiondetail(res.data.prd_description_detail)//상세설명
      setIscontractrenewal(res.data.is_contract_renewal)//계약갱신권 행사여부
      setDirection(res.data.direction)//방향
      setOptionmethod(res.data.heat_method_type)//난방방식
      setOptionfuel(res.data.heat_fuel_type)//연로
      setRoomcount(res.data.room_count)//방수
      setBathroomcount(res.data.bathroom_count)//욕실수
      setParkingoptions(res.data.parking_option)
      setPark(res.data.is_parking == 0 ? false : true)

      if (res.data.prd_type == '오피스텔'){
        setOptionroom(res.data.room_structure)
        setIsduplexfloor(res.data.is_duplex_floor)
        setIswithpet(res.data.iswithpet)
        setOptionent(res.data.entrance)
        // setOfficeteloption(res.data.officeteloption.split(',')) // 관리비 포함 항목
        console.log('내부 물건 확인',res.data.officeteloption);
      }

    }else{
    }
  }, [])



  const rotate = () => {
    if (openMore == true) {
      return "rotate(180deg)"
    } else {
      return "rotate(0deg)"
    }
  }
  //오피스텔일때 옵션
  const officeteloption_array = [
    { oi_id: 0, label: "침대", default: false },
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



  //추가정보 입력페이지 입력정보들 state형태로 저장한다.
  const [roomcount, setRoomcount] = useState('');
  const [bathroomcount, setBathroomcount] = useState('');
  const [isduplexfloor, setIsduplexfloor] = useState('');  //복층여부
  const [isparking, setIsparking] = useState('');
  const [parkingoptions, setParkingoptions] = useState('');
  const [iselevator, setIselevator] = useState('');
  const [iswithpet, setIswithpet] = useState('');
  const [istoilet, setIsToilet] = useState('');
  const [isinteriror, setIsInteriror] = useState('');
  const [recommend_jobstore, setRecommendjobstore] = useState('');
  const [ofi_roomstructure, set_Ofi_roomstructure] = useState('');

  const [direction, setDirection] = useState('');
  const [entrance, setEntrance] = useState(''); //현관구조 - 복도방식
  const [heatmethod, setHeatmethod] = useState('');
  const [heatfuel, setHeatfuel] = useState('');

  const [standardspaceoption, setStandardspaceoption] = useState([]);// (아파트,상가,사무실) - 공간 
  const [officetelspaceoption, setOfficetelspaceoption] = useState([]);//(오피스텔) - 공간
  const [officeteloption, setOfficeteloption] = useState([]);//(오피스텔) - (내부)
  const [storeofficeoption, setStoreofficeoption] = useState([]);//상가,사무실옵션 - (내부)
  const [securityoption, setSecurityoption] = useState([]);//보안옵셥

  const [iscontractrenewal, setIscontractrenewal] = useState(0);//계약갱신권청구
  const [loanprice, setLoanprice] = useState('');//융자금
  const [guaranteeprice, setGuaranteeprice] = useState('');//기보증금
  const [guaranteemonthprice, setGuaranteemonthprice] = useState('');//기보증금 월세

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
    console.log('생성123', e.target.value);
  }
  const change_isparking = (e) => {
    console.log('주차' ,e.target.value == '불가' ? '0' : '1');

    setIsparking(e.target.value == '불가' ? '0' : '1');
    // setIsparking(e.target.value);
  }
  const change_parkingoptions = (e) => {
    setParkingoptions(e.target.value);
  }
  const change_iselevator = (e) => {
    console.log('엘리', e.target.value == '없음' ? "0" : "1");
    setIselevator(e.target.value == '없음' ? "0" : "1");
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
    console.log('인테리어',e.target.value);
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
  const change_Guaranteemonthprice = (e) => {
    setGuaranteemonthprice(e.target.value);
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



  useEffect(() => {
    if (!roomcount || !bathroomcount || !iscontractrenewal) {
      setactive(false)
      console.log('비활성')
    } else {
      console.log('활성')
      setactive(true)
    }
  }, [roomcount, bathroomcount, iscontractrenewal])

  //다음버튼 누릀때 서버로 지금껏 정보 모두 보낸다.(외부수임물건전달방식 전닭. 다른 처리로 외부수임처리이기에.)
  const nextStep = async () => {
    //지금껏까지의 모든 저장정보 mereeged하여 서버에 요청제출필요ㅕ하다.
    // console.log('>>>유지된 정보들 기본입력정보들:', temp_brokerRequest);
    // console.log('>>>추가입력정보들 state정보값들:', roomcount, bathroomcount, isduplexfloor, isparking, parkingoptions, iswithpet, istoilet, isinteriror, recommend_jobstore, ofi_roomstructure, direction, entrance, heatmethod, heatfuel, standardspaceoption, officetelspaceoption, securityoption, officeteloption, storeofficeoption, iscontractrenewal, loanprice, guaranteeprice, maemul_description, maemul_descriptiondetail);
    // console.log('roomcount:', roomcount);
    // console.log('bathroomcount:', bathroomcount);
    // console.log('isduplexfloor:', isduplexfloor);
    // console.log('ispakring:', isparking);
    // console.log('parkingoptionmss:', parkingoptions);
    // console.log('iswithpet::', iswithpet);
    // console.log('istoilet:', istoilet);
    // console.log('isinteriror:', isinteriror);
    // console.log('recommend_jobstore:', recommend_jobstore);
    // console.log('ofi_roomstructure:', ofi_roomstructure);
    // console.log('direction:', direction);
    // console.log('entrance:', entrance);
    // console.log('heatmeathod', heatmethod);
    // console.log('heatfuel:', heatfuel);
    // console.log('stadnardspaceoption:', standardspaceoption);
    // console.log('officetelspaceoption:', officetelspaceoption);
    // console.log('securittyoption:', securityoption);
    // console.log('officeteloption:', officeteloption);
    // console.log('storeofficeoption:', storeofficeoption);
    // console.log('iscontractrenewal:', iscontractrenewal);
    // console.log('loanprice;', loanprice);
    // console.log('guranteeprice:', guaranteeprice);
    // console.log('maemul_description:', maemul_description);
    // console.log('maemul_desciptiondeatil:', maemul_descriptiondetail);
    // console.log('isrightprice::', tempBrokerRequest.isrightprice);
    // console.log('업로드한 사진들!::', serveruploadimgs_server);

    // //istoilet,isinteriror,recojkmmend_jobstore,ofi_roomstructure, standardspaceoption,officetelspaceoption,officeteloptioin,storeofficeoption

    // if (((temp_brokerRequest.maemultype == '아파트' || temp_brokerRequest.maemultype == '오피스텔') && (!roomcount || !bathroomcount))) {
    //   alert('방수/욕실수 입력해주세요!');
    //   return false;
    // }
    // if ((temp_brokerRequest.maemultype == '오피스텔' && (!ofi_roomstructure || !isduplexfloor))) {
    //   alert('방구조 , 복층여부 입력해주세요!');
    //   return false;
    // }
    // if ((temp_brokerRequest.maemultype != '아파트' && (!isparking || !iselevator))) {
    //   alert('주차여부,엘레베이터여부 입력해주세요!');
    //   return false;
    // }
    // if (((temp_brokerRequest.maemultype == '상가' || temp_brokerRequest.maemultype == '사무실') && (!istoilet))) {
    //   alert('전용화장실 여부 입력해주세요!');
    //   return false;
    // }
    // if ((temp_brokerRequest.maeultype == '오피스텔' && !iswithpet)) {
    //   alert('반려동물 여부 입력해주세요!');
    //   return false;
    // }
    // if (!iscontractrenewal) {
    //   alert('계약갱신권 행사여부 입력해주세요!');
    //   return false;
    // }
    // if (!temp_brokerRequest.x || !temp_brokerRequest.y) {
    //   alert('건물의 데이터베이스(x,y)위치정보가 유효하지 않습니다.건물을 다시 선택해주세요.');
    //   return false;
    // }
    // if (serveruploadimgs_server.length < 3) {
    //   alert('사진은 최소 3장이상 등록해주세요!');
    //   return false;
    // }

    // //요청전에 단수체크 알고리즘 사젅 검사후에 통과시에 물건외부수임 등록 처리를 합니다. 
    // //상가사무실 dangijubnaddress,dangoradoaddrss,floor특정주소에 존재하는 선태갛ㄴ 특정건물의 층 선택, 그 추가하려는 매물종류(floor,ho_idhosil)이 proudct,transction상에 가능한 상태값으로써 존재하고있는지 여부 검사
    // if (temp_brokerRequest.maemultype == '상가' || temp_brokerRequest.maemultype == '사무실') {
    //   let request_possible_sendinfo = {
    //     dangijibunaddress: temp_brokerRequest.dangijibunaddress,
    //     dangiroadaddress: temp_brokerRequest.dangiroadaddress,
    //     floor: temp_brokerRequest.floor,
    //     req_type: 'storeoffice'
    //   }
    //   let request_avail = await serverController.connectFetchController('/api/mypage/brokerRequest_avail_process', 'POST', JSON.stringify(request_possible_sendinfo));//외부수임하여 등록하려는 물건이 그냥 코렉스시스템상에 단수 적용가능한지 여부 검사한다.
    //   if (request_avail) {
    //     console.log('해당 의뢰매물or외부수임 매물 코렉스 시스템상에서 등록가능한 단수매물인지 여부 검사(사무실,상가):', request_avail);

    //     if (request_avail.success) {
    //       //등록이 가능하다.
    //     } else {
    //       console.log('등록불가');
    //       failModal();
    //       return;
    //     }
    //   }
    // } else {
    //   let request_possible_sendinfo = {
    //     dangijibunaddress: temp_brokerRequest.dangijibunaddress,
    //     dangiroadaddress: temp_brokerRequest.dangiroadaddress,
    //     hosil: temp_brokerRequest.hosil,
    //     req_type: 'apartofficetel'
    //   }
      // let request_avail = await serverController.connectFetchController('/api/mypage/brokerRequest_avail_process', 'POST', JSON.stringify(request_possible_sendinfo));//외부수임하여 등록하려는 물건이 그냥 코렉스시스템상에 단수적용가능한지 여부 검사한다.
      
    //   if (request_avail) {
    //     console.log('해당 의뢰매물or외부수임 매물 코렉스시스템상에서 등로각능한지 여부 단수매물인지 여부검사(아파트,오피):', request_avail);

    //     if (request_avail.success) {

    //     } else {
    //       console.log('등록불가');
    //       failModal();
    //       return;
    //     }
    //   }
    // }

    // if (temp_brokerRequest.floorname.indexOf('지하') != -1) {
    //   var floorint = temp_brokerRequest.floorname.replace('지하', '');
    //   console.log('floorint>>>>>:', floorint);
    //   floorint = 0 - parseInt(floorint);
    // } else {
    //   var floorint = temp_brokerRequest.floorname.replace('지상', '');
    //   console.log('floorint>>>>:', floorint);
    //   floorint = parseInt(floorint);
    // }

    // let body_info = {
    //   dangi: (temp_brokerRequest.maemultype == '아파트' || temp_brokerRequest.maemultype == '오피스텔') ? temp_selectComplexinfo.complexname : '',//아파트,오피스텔 단지명.
    //   dangijibunaddress: temp_brokerRequest.dangijibunaddress,//단지주소지번
    //   dangiroadaddress: temp_brokerRequest.dangiroadaddress,//단지주소로드
    //   companyid: login_user.company_id,//어떤 로그인 중개사회원 중개사아이디인지.
    //   exculsivedimension: temp_brokerRequest.jeonyongdimension,//전용면적
    //   exculsivepyeong: temp_brokerRequest.jeonyongpyeong,//전용평
    //   ibju_isinstant: temp_brokerRequest.ibju_isinstant,
    //   ibju_specifydate: temp_brokerRequest.ibju_specifydate,
    //   maemulname: temp_brokerRequest.maemulname,
    //   maemultype: temp_brokerRequest.maemultype,
    //   managecost: temp_brokerRequest.managecost,
    //   ismanagementcost: temp_brokerRequest.ismanagementcost,//관리비유무
    //   requestmanname: temp_brokerRequest.name,//여기선 외부수임요청자 정보(이름,휴대폰)
    //   requestmemphone: temp_brokerRequest.phone,
    //   sellprice: temp_brokerRequest.sellprice,//매매가,전세가,월세가 (보증금,거래액)
    //   monthsellprice: temp_brokerRequest.monthsellprice,//월세액
    //   selltype: temp_brokerRequest.selltype, //판매타입
    //   supplydimension: temp_brokerRequest.supplydimension,//공급면적
    //   supplypyeong: temp_brokerRequest.supplypyeong,//공급면적평
    //   x: temp_brokerRequest.x,//좌표값.매물의 위치경도위도좌표값.
    //   y: temp_brokerRequest.y,
    //   storejob: temp_brokerRequest.storejob,//상가업종
    //   isstorejob: temp_brokerRequest.isstorejob,//상가 업종여부.
    //   usetype: temp_brokerRequest.officetelusetype,//오피스텔 이용형태
    //   isrightprice: temp_brokerRequest.isrightprice,//상가 권리금유무

    //   dong: (temp_brokerRequest.maemultype == '아파트' || temp_brokerRequest.maemultype == '오피스텔') ? temp_brokerRequest.dong : '',//아파트나 오피인경우에만 
    //   hosil: (temp_brokerRequest.maemultype == '아파트' || temp_brokerRequest.maemultype == '오피스텔') ? temp_brokerRequest.hosil : '',
    //   floor: temp_brokerRequest.floor,//층id값
    //   dongname: temp_brokerRequest.dongname,//동이름 n동
    //   hosilname: temp_brokerRequest.hosilname,//호실이름 n호
    //   floorname: temp_brokerRequest.floorname,//층이름 n층
    //   floorint: floorint,//층수 int형태값.
    //   //dangi: temp_brokerRequest.dangi,
    //   exculsive_periods: temp_brokerRequest.exculsive_periods,//전속기간
    //   // managecostincludes: temp_brokerRequest.managecostincludes.join(','),//관리비포함항목들. 
    //   storeofficebuildingfloor: temp_brokerRequest.storeofficebuildingfloor,

    //   roomcount_val: roomcount ? roomcount : '',//아파트,오피스텔
    //   bathroomcount_val: bathroomcount ? bathroomcount : '',//아파트오피
    //   isduplexfloor_val: isduplexfloor ? isduplexfloor : '',//복층여부 오피
    //   isparking_val: isparking ? isparking : '',//주차여부
    //   parkingoptions_val: parkingoptions ? parkingoptions : '',
    //   iselevator_val: iselevator ? iselevator : '',//엘베여부
    //   iswithpet_val: iswithpet ? iswithpet : '',//펫여부
    //   direction_val: direction ? direction : '',//방향
    //   istoilet_val: istoilet ? istoilet : '',//전용화장실여부
    //   isinteriror_val: isinteriror ? isinteriror : '',//인테리어여부
    //   recommend_jobstore_val: recommend_jobstore ? recommend_jobstore : '',//추천업종
    //   ofi_roomstructure_val: ofi_roomstructure ? ofi_roomstructure : '',//오피스텔 방구조

    //   entrance_val: entrance ? entrance : '',//현관구조
    //   heatmethod_val: heatmethod ? heatmethod : '',
    //   heatfuel_val: heatfuel ? heatfuel : '',

    //   standardspaceoption_val: standardspaceoption ? standardspaceoption.join(',') : '',//표준공간옵션
    //   officetelspaceoption_val: officetelspaceoption ? officetelspaceoption.join(',') : '',//오피스텔공간옵션

    //   securityoption_val: securityoption ? securityoption.join(',') : '',//보안옵션

    //   officeteloption_val: officeteloption ? officeteloption.join(',') : '',//오피스텔옵션
    //   storeofficeoption_val: storeofficeoption ? storeofficeoption.join(',') : '',//상가사무실옵션

    //   iscontractrenewal_val: iscontractrenewal,//계약갱신청구권행사여부
    //   loanprice_val: loanprice,//융자금
    //   guaranteeprice_val: guaranteeprice,//기보증금월세액
    //   maemul_description_val: maemul_description,
    //   maemul_descriptiondetail_val: maemul_descriptiondetail,

    //   prdstatus_generator: login_user.memid, //외부수임물건 등록 거래준비 상태변경 요인자는 외부수임인아라긴 보단 수임받아 등록하는 중개사회원memid일것임.
    //   prdstatus_change_reason: ''
    // }

    // console.log('>>>JSON SUBMIT DATA:', body_info);


//----------------------------------------------------------------------------
//수정사항 새로운 body 및 api
    let body = {
      company_id: login_user.company_id, //사업자식별자
      // prd_name: temp_selectComplexinfo.complexname, // 물건명
      prd_name: temp_brokerRequest.maemultype == '상가' || '사무실' ? temp_brokerRequest.maemulname : temp_selectComplexinfo.complexname, // 물건명
      prd_type: temp_brokerRequest.maemultype, 	//물건타입(아파트, 오피스텔 등)
      prd_sel_type: temp_brokerRequest.selltype,	//거래타입(매매, 전세, 월세)
      prd_price: temp_brokerRequest.sellprice,//	매매금, 전세금
      prd_month_price: temp_brokerRequest.monthsellprice,	//월세
      prd_latitude: temp_brokerRequest.y,	//위도
      prd_longitude: temp_brokerRequest.x,//경도
      addr_detail: '',//상세주소
      supply_area: temp_brokerRequest.supplydimension, //공급면적
      supply_pyeong: temp_brokerRequest.supplypyeong,	//공급 평
      exclusive_area: temp_brokerRequest.jeonyongdimension, 	//전용면적
      exclusive_pyeong: temp_brokerRequest.jeonyongpyeong,	//전용 평
      managecost: temp_brokerRequest.managecost,	//관리비
      is_immediate_ibju: temp_brokerRequest.is_immediate_ibju,	//즉시입주여부
      ibju_specifydate: temp_brokerRequest.ibju_specifydate,	//입주예정일
      exclusive_periods: temp_brokerRequest.exclusive_periods,	//전속기간(개월)
      prd_imgs: '',	//물건이미지
      room_structure: Optionroom,	//방구조
      include_managecost: temp_brokerRequest.include_managecost.join(','),//관리비포함항목
      addr_jibun: temp_brokerRequest.dangijibunaddress,//물건지번주소
      addr_road: temp_brokerRequest.dangiroadaddress,//물건도로명주소
      dong_name: temp_brokerRequest.dong_name,//	동명
      floorint: temp_brokerRequest.floor,//층수
      flr_type: temp_brokerRequest.floorname,//층구분
      is_managecost: '',	//관리비여부


      //추가 정보입력사항

      //상가 , 사무실
      storeoffice_building_totalfloor: '',	//상가, 사무실 건물 최고층  
      is_current_biz_job: '',	//현재업종여부 - 상가,사무실
      current_biz_job: '',	//현재업종 - 상가,사무실
      is_rightprice: '',	//권리금여부
      
      //중개의뢰
      request_message: '',	//요청메시지-중개의뢰에만 있다
     
      //오피스텔
      // prd_usage: temp_brokerRequest.officetelusetype,// 사용타입(업무용, 주거용 등) -오피스텔
      prd_usage: temp_brokerRequest.maemultype == '오피스텔' ? temp_brokerRequest.officetelusetype: '', // 물건명
      
      //상가
      // is_parking: isparking,	//주차장여부
      // parking_option: parkingoptions,	//주차옵션
      is_parking: temp_brokerRequest.maemultype == '상가' ? isparking : '', // 물건명
      parking_option: temp_brokerRequest.maemultype == '상가' ? parkingoptions : '', // 물건명
      recommend_biz_job: recommend_jobstore,	//추천업종 - 상가,사무실

      is_elevator: iselevator,	//승강기여부 - 상가,사무실


      bathroom_count: bathroomcount,//욕실 수
      direction: direction,//방향
      entrance: Optionent,	//복도방식
      heat_fuel_type: heatfuel,	//난방연료타입
      heat_method_type: heatmethod, //난방방식
      is_contract_renewal: '',//계약갱신권청구여부
      is_duplex_floor: isduplexfloor,	//복층여부 - 오피스텔
      is_pet: setIswithpet,	//반려동물여부
      loanprice: loanprice,//	융자금
      prd_description: maemul_description,	//물건간단설명
      prd_description_detail: maemul_descriptiondetail,	//물건상세설명
      room_count: roomcount,	//방 수 - 아파트 오피스텔
      // security_option: securityoption.join(','),	//보안옵션
      security_option: temp_brokerRequest.maemultype !== '아파트' ? securityoption.join(',') : '',	//보안옵션
      is_toilet: '',//화장실여부
      is_interior: isinteriror,	//인테리어여부
      space_option: temp_brokerRequest.maemultype !== '오피스텔' ? standardspaceoption.join(',') : officetelspaceoption.join(','),	//공간옵션
      prd_option: temp_brokerRequest.maemultype !== '오피스텔' ? storeofficeoption.join(',') : officeteloption.join(','),	//물건옵션 , 오피스텔-내부
      bld_id: temp_brokerRequest.dong,//건물식별자
      ho_id: temp_brokerRequest.ho_name, 	//호식별자,ho_name 삭제하고 리덕스 새로 만들기
      ho_name: temp_brokerRequest.hosil,//	호명
      request_mem_name: temp_brokerRequest.name,	//의뢰인명
      request_mem_phone: temp_brokerRequest.phone,	//의뢰인 핸드폰
      prd_create_origin: temp_brokerRequest.request_type, 	//의뢰타입(중개의뢰, 외부수임)
      request_mem_id: '', 	//의뢰인식별자 - 외부 수임일 경우 안들어간다.
      request_company_id: '',	//의뢰인소속식별자 - 외부 수임일 경우 안들어간다.
      existed_deposit: guaranteeprice,
      existed_month_price: guaranteemonthprice,
      prd_status: '거래준비',	//물건상태(거래준비, 거래개시 등)
    }

    

    let request_avail = await serverController.connectFetchController('/api/products', 'POST', JSON.stringify(body));//외부수임하여 등록하려는 물건이 그냥 코렉스시스템상에 단수적용가능한지 여부 검사한다.

    console.log('전속매물추가 확인 :',request_avail);
    console.log('전속매물추가 확인 :',body);
    // console.log('전속매물추가 확인 :', officeteloption);
    // console.log('전속매물추가 확인 :', temp_brokerRequest.exculsive_periods);
//----------------------------------------------------------------------------------------------------

    // console.log('>>>JSON SUBMIT DATA:', body_info, JSON.stringify(body_info));

    // let res = await serverController.connectFetchController('/api/broker/user_brokerOuterRequest', 'POST', JSON.stringify(body_info));
    // console.log('->>>>>res resultsss:', res);

    // if (res.success) {
    //   alert('외부수임 매물 등록 완료!');

    //   //매물이 등록된 후에 얻은 그 inserted된 prd_idenittiyid or prd_id매물에 대해서 update쿼리로써 별도로 매물 외부수임등록 사진등록 쿼리진행.사진을 등록하지 않은 경우라면 이 관련된 코드는 실행되지않음.
      // console.log('업로드한 사진들!::', serveruploadimgs_server);

      // let formData = new FormData();
      // formData.append('folder', 'productImgs');
      // formData.append('prd_identity_id', res.insert_result);

    //   for (let f = 0; f < serveruploadimgs_server.length; f++) {
    //     let file_item = serveruploadimgs_server[f];
    //     formData.append('productimgs', file_item);

    //   }
    //   let res2 = await serverController2.connectFetchController('/api/broker/brokerProduct_prdimgs_process', 'POST', formData);
    //   if (res2) {
    //     if (res2.success) {
    //       console.log('resa22 resultssss:', res2);

    //       let update_result = res2.update_result;

    //       let prd_imgs = update_result['prd_imgs'];

    //     }
    //   }
    //   history.push('/MyPage');
    // } else {
    //   alert('처리에 문제가 있습니다.');
    // }
  };

  //추가사항 수정 버튼
  const editBtn = async () => {
    // EditData
    let body={
      //기본 정보 - 수정 예정
      company_id : 	'',//사업자식별자(전문중개사)
      prd_name: EditData.prd_name,	//물건명
      prd_type: EditData.prd_type,	//물건타입(아파트, 오피스텔 등)
      prd_sel_type: EditData.prd_sel_type,	//거래타입(매매, 전세, 월세)
      prd_price: EditData.prd_price,//매매금, 전세금
      prd_month_price: EditData.prd_month_price,//	월세
      prd_latitude: EditData.prd_latitude,	//위도
      prd_longitude: EditData.prd_longitude,	//경도
      supply_area: EditData.supply_area,//공급면적
      exclusive_area: EditData.exclusive_area,//	전용면적
      supply_pyeong: EditData.supply_pyeong,//공급 평
      exclusive_pyeong: EditData.exclusive_pyeong,//	전용 평
      managecost: EditData.managecost,//	관리비
      is_immediate_ibju: EditData.is_immediate_ibju,//즉시입주여부
      ibju_specifydate: EditData.ibju_specifydate,//	입주예정일
      exclusive_periods: EditData.exclusive_periods,//전속기간(개월)
      bathroom_count: EditData.bathroom_count,//	욕실 수
      room_count: EditData.room_count,//	방 수
      prd_status: EditData.prd_status,//물건상태(거래준비, 거래개시 등)
      prd_imgs	:'',//물건이미지
room_structure:'',//	방구조
include_managecost:'',//	관리비포함항목
	//추가사항-수정
storeoffice_building_totalfloor:'',//	상가, 사무실 건물 최고층
request_message:'',//	요청메시지
is_current_biz_job:'',//	현재업종여부
current_biz_job:'',//	현재업종
prd_usage:'',//	물건 사용타입(업무용, 주거용 등)
is_managecost	:'',//관리비여부
is_rightprice	:'',//권리금여부
      direction: direction,//방향
entrance:'',//	복도방식
recommend_biz_job	:'',//추천업종
month_base_guaranteeprice	:'',//월기보증금
      heat_fuel_type: Optionfuel,//	난방연료타입
      heat_method_type: Optionmethod,//난방방식
is_contract_renewal:'',//	계약갱신권청구여부
is_duplex_floor:'',//	복층여부
      is_elevator: iselevator,//	승강기여부
      is_parking: isparking,//주차장여부
is_pet	:'',//반려동물여부
      loanprice: loanprice,//융자금
      prd_description: maemul_description,//물건간단설명
      prd_description_detail: maemul_descriptiondetail,//	물건상세설명
      parking_option: parkingoptions,//	주차옵션
security_option:'',//	보안옵션
is_toilet:'',//	화장실여부
is_interior	:'',//인테리어여부
      space_option: EditData.prd_type !== '오피스텔' ? standardspaceoption.join(',') : officetelspaceoption.join(','),//공간옵션
prd_option:'',//	물건옵션
modify_mem_id:'',	//수정인
      existed_deposit: guaranteeprice,	//기보증금
      existed_month_price: guaranteemonthprice,	//기월세
    }

    console.log('body확인', body);
    
    let patchdata = await serverController.connectFetchController(`/api/products/${brokerRequest_product_data.prdidentityid}`, 'PATCH', JSON.stringify(body));
    console.log('body확인', patchdata);
  }
  
 


  return (
    <>

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
                    defaultValue={isduplexfloor}
                    name="radio-buttons-group"
                    onChange={change_isduplexfloor}
                  >
                    <FormControlLabel value='0' control={<Radio type="radio" name="is_duplex_floor" id="floor1" value='0' />} label="단층" />
                    <FormControlLabel value='1' control={<Radio type="radio" name="is_duplex_floor" id="floor2" value='1' />} label="복층" />
                  </RadioGroup>
                </FormControl>
              </div>
              :
              null
          }
          {
            temp_brokerRequest.maemultype != '아파트' ?
              <>
                {console.log('주차', isparking)}
                <div className="par-spacing">
                  <FormControl component="fieldset">
                    <FormLabel component="legend" required>주차</FormLabel>
                    <RadioGroup
                      row
                      aria-label=""
                      defaultValue={isparking == "0" ? '불가' : '가능'}
                      // defaultValue='가능'
                      // defaultValue='1'
                      name="radio-buttons-group"
                    >
                      {/* <FormControlLabel value='불가' onClick={() => { setPark(false) }} control={<Radio type="radio" name="parking" id="park1" value={0} onChange={change_isparking} />} label="불가" />
                      <FormControlLabel value='가능' onClick={() => { setPark(true) }} control={<Radio type="radio" name="parking" id="park2" value={1} onChange={change_isparking} />} label="가능" /> */}
                      <FormControlLabel value='불가' onClick={() => { setPark(false) }} control={<Radio onChange={change_isparking} />} label="불가" />
                      <FormControlLabel value='가능' onClick={() => { setPark(true) }} control={<Radio onChange={change_isparking}  />} label="가능" />
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
                      defaultValue={iselevator == "0" ? '없음' : '있음'}
                      name="radio-buttons-group"
                    >
                      <FormControlLabel value="없음" control={<Radio  onChange={change_iselevator} />} label="없음" />
                      <FormControlLabel value="있음" control={<Radio  onChange={change_iselevator} />} label="있음" />
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
                    defaultValue={iswithpet}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="0" control={<Radio type="radio" name="pet" id="pet1" value='0' onChange={change_iswithpet} />} label="불가" />
                    <FormControlLabel value="1" control={<Radio type="radio" name="pet" id="pet2" value='1' onChange={change_iswithpet} />} label="가능" />
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
                      // value={Optiondir}
                      value={direction}
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
                                      <FormControlLabel control={<Checkbox id="standard_spaceoption1" value='발코니' className='standard_spaceoption' onChange={e => changeCheckBox(e, standardspaceoption, setStandardspaceoption)}  />} label="발코니" />
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
                                        officeteloption_array.map((value , index) => {
                                          return (
                                            // < FormControlLabel control = {< Checkbox id = { "officteloption" + value.oi_id } className = 'officteloption' onChange = { e => changeCheckBox(e, officeteloption, setOfficeteloption)} value={value.label}  checked = {officeteloption.filter(checkitem => checkitem.label == value.label) == '' ? true : false} />} label={value.label} />
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
                defaultValue="0"
                name="radio-buttons-group"
              >
                <FormControlLabel value="0" control={<Radio type="radio" onChange={change_iscontractrenewal} value='0' name="is_contractrenewal" id="radi1" />} label="미확인" />
                <FormControlLabel value="1" control={<Radio type="radio" onChange={change_iscontractrenewal} value='1' name="is_contractrenewal" id="radi2" />} label="확인" />

              </RadioGroup>
            </FormControl>
          </div>
          <div className="par-spacing">
            <MUTextField_100 id="standard-basic" label="융자금" variant="standard" placeholder="가격 입력" helperText="(e.g 1억 5,000)" value={loanprice} onChange={change_loanprice} />
          </div>
          <div className="par-spacing">
            <MUTextField_100 id="standard-basic" label="기보증금" variant="standard" placeholder="가격 입력" helperText="(e.g 1억 5,000)" value={guaranteeprice} onChange={change_guaranteeprice} />

            <MUTextField_100 placeholder="가격 입력" label="월세" variant="standard" onChange={change_Guaranteemonthprice} helperText="(e.g 1억 5,000)"
              value={guaranteemonthprice}
              InputProps={{
                endAdornment: (<InputAdornment position="end">만원</InputAdornment>),
              }} />
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
      <div>

        <div className="par-spacing">
          {mode == '수정' ?
            <MUButton_Validation variant="contained" type="button" name="" active={active} onClick={editBtn}>수정하기</MUButton_Validation>
            :
            <MUButton_Validation variant="contained" type="button" name="" active={active} onClick={nextStep}>다음</MUButton_Validation>
          }
        </div>
      </div>
    </>

  );
}

const MUButton_Validation = MUstyled(Button)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`

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
const Title_Sub = styled.h3``

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
const MoreView = styled.div`
        transition:all 0.3s;
      
        `
const InputPark = styled(InputTxt)`
        width:183px;
        @media ${(props) => props.theme.mobile} {
          width:calc(100vw*(145/428));
  }
        `
const UploadedMaemulimgs = styled.div`
        width:100%;height:auto;
        display:flex;flex-flow:row wrap;
        `;
const UploadImg = styled.img`
        width:100px;height:100px;
        `;
