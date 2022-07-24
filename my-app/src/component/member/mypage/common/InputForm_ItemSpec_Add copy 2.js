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

// import localStringData from '../../../const/localStringData';
import localStringData from '../../../../const/localStringData';

//component
import { Mobile, PC } from "../../../../MediaQuery"

//img
import Picture from '../../../../img/member/picture.png';

// import ModalCommonWithoutcancel from '../../../'

import { useSelector } from 'react-redux';
import tempBrokerRequest from '../../../../store/modules/tempBrokerRequest';

export default function InputForm_ItemSpec_Add({ updateModal, serveruploadimgs_server, changeaddedimgs_server, mode, setimgfiles, imgfiles, setModalOption, modalOption, prdID}) {
  
  console.log('파람스33', prdID);

  const [basicinfo, setbasicinfo] = useState([])
  
  const brokerRequest_product_data = useSelector(data => data.brokerRequest_product); //물건 수정 시 보여주는 값
  console.log('추가 정보확인 하기1:', brokerRequest_product_data);
  const temp_brokerRequest = useSelector(data => data.tempBrokerRequest);  // 기본정보 입력된 데이터 리덕스
  console.log('추가 정보확인 하기2:', temp_brokerRequest);
  const temp_selectComplexinfo = useSelector(data => data.temp_selectComplexinfo);
  console.log('추가 정보확인 하기3:', temp_selectComplexinfo);   // 추가정보 저장하는 리덕스 같은데 확인하기 .....
  //console.log('>>>>유지된 정보들 기본입력정보들(inserted임시 입력정보들):',temp_brokerRequest);
  //console.log('>>>>마이페이지 로그인 중개사회원 companyid(어떤중개사의회원):',login_user);
  const login_user = useSelector(data => data.login_user);//리덕스 로그인회원정보 데이터 접근(memid,companyid,유저이다이,폰,이메일,유저이름,usertype,registertype,memadmin,islogin,isexculsive전문중개사여부)
  console.log('추가 정보확인 하기1:', login_user);

  const [EditData, setEditData] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1);
  const [openMore, setOpenMore] = useState(false);
  const [openMore_2, setOpenMore_2] = useState(false);
  const [openMore_3, setOpenMore_3] = useState(false);
  const [park, setPark] = useState(false);
  const [Optionent, setOptionent] = useState('선택');
  
  const [active, setactive] = useState(false);
  const history = useHistory();
  const [Optiondir, setOptiondir] = useState('선택');
  const [Optionmethod, setOptionmethod] = useState('선택');
  const [Optionfuel, setOptionfuel] = useState('선택');
  const [Optionroom, setOptionroom] = useState('방구조선택');
  
  const [imgsfiles, setimgsfiles] = useState([])  //이미지 개수
  
  //추가정보 입력페이지 입력정보들 state형태로 저장한다.
  const [roomcount, setRoomcount] = useState('');
  const [bathroomcount, setBathroomcount] = useState('');
  const [isduplexfloor, setIsduplexfloor] = useState('');  //복층여부
  const [isparking, setIsparking] = useState('');
  const [parkingoptions, setParkingoptions] = useState('');
  const [iselevator, setIselevator] = useState(''); //엘리베이터 여부
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

  const [iscontractrenewal, setIscontractrenewal] = useState('');//계약갱신권청구
  const [loanprice, setLoanprice] = useState('');//융자금
  const [guaranteeprice, setGuaranteeprice] = useState('');//기보증금
  const [guaranteemonthprice, setGuaranteemonthprice] = useState('');//기보증금 월세

  const [maemul_description, setMaemul_description] = useState('');//매물요약
  const [maemul_descriptiondetail, setMaemul_descriptiondetail] = useState('');//매물상세설명

  // const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

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
 
  useEffect(async () => {
    let res = await serverController.connectFetchController(`/api/products/${prdID}?prd_field_all=1 `, 'get');
    console.log('추가정보입력', res.data);
    console.log('추가정보입력', !!res.data.prd_imgs);

    setbasicinfo(res.data)
    setimgsfiles(!!res.data.prd_imgs ? res.data.prd_imgs.split(',').length : '') // 사진 갯수
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
    setRecommendjobstore(res.data.recommend_biz_job)
    setStandardspaceoption(res.data.space_option == null ? [] : res.data.space_option.split(','))//공간
    // setStandardspaceoption('')//공간
    // setOfficetelspaceoption()
    setOptionent(res.data.entrance)

    if (res.data.prd_type == '오피스텔') {
      setOptionroom(res.data.room_structure)
      setIsduplexfloor(res.data.is_duplex_floor)
      setIswithpet(res.data.iswithpet)
      setOfficeteloption(res.data.prd_option == null ? [] : res.data.prd_option.split(',')) // 내부
      setSecurityoption(res.data.security_option == null ? [] : res.data.security_option.split(','))//보안
      setOfficetelspaceoption()
    }

    if (res.data.prd_type == '상가') {
      setSecurityoption(res.data.security_option.split(','))//보안
      setStoreofficeoption(res.data.prd_option.split(','))//내부
    }

    if (res.data.prd_type == '사무실') {
      setSecurityoption(res.data.security_option.split(','))//보안
      setStoreofficeoption(res.data.prd_option.split(','))//내부
    }

  }, [])

  useEffect(() => {
    setimgsfiles(changeaddedimgs_server.length)

  }, [changeaddedimgs_server, serveruploadimgs_server])

  
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
    // let option = JSON.parse(JSON.stringify(modalOption));
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  const approval = async ()=>{
    let body = {
      prd_status: '거래개시동의요청',
      modify_mem_id: login_user.memid
    }

    let prdstatus_result = await serverController.connectFetchController(`/api/products/${prdID}`, 'PATCH', JSON.stringify(body));
    // let prdstatus_result = await serverController.connectFetchController(`/api/products/${basicinfo.prd_id}`, 'PATCH', JSON.stringify(body));

    if (prdstatus_result) {
      if (prdstatus_result.success) {
        alert('거래개시동의요청 하였습니다.');
        //상태변경내역화면으로 이동시키기전 서버에 반영,알림도 isnert한다. 알림의 경우 그 외부수임인 경우에는 문자알림을 가하고, 중개의뢰요청인 경우엔 notificaition + 문자로(기본값:문자) 로 일단 처리.

        //알릴정보:: 전속매물 거래개시승인 요청입니다. 
        /*
        전속기간 : x 개월
        수임사업체 : 수임전문중개사
        등록번호 : xxx
        물건종류 : xxx,
        건물명 층수 호수
        시도/시군구/읍면동/리
        거래유형, 거래금액
        내용확인.
        */
        let maemul_info_loca = '';
        // maemul_info_loca = '전속기간: ' + basicinfo.exclusive_periods + ' 개월 \n';
        // maemul_info_loca += '등록번호: ' + basicinfo.prd_id + '\n';
        // maemul_info_loca += '물건종류: ' + basicinfo.prd_type + '\n';
        // // maemul_info_loca += (basicinfo.prd_name + ' ' + basicinfo.address_detail) + '\n';
        // maemul_info_loca += (basicinfo.prd_name) + '\n';
        // maemul_info_loca += basicinfo.addr_jibun + '(' + basicinfo.addr_road + ')\n';
        // maemul_info_loca += basicinfo.prd_sel_type + " ";
        // maemul_info_loca += (basicinfo.prd_sel_type == '월세' ? basicinfo.prd_month_price : basicinfo.prd_price);
        maemul_info_loca = '전속기간: ' + basicinfo.exclusive_periods + ' 개월 \n';
        maemul_info_loca += '물건종류: ' + basicinfo.prd_type + '\n';
        maemul_info_loca += '물건이름: ' + (basicinfo.prd_name + ' ' + basicinfo.dong_name + ' ' + basicinfo.ho_name + '호') + '\n';
        maemul_info_loca += '물건주소: ' + basicinfo.addr_jibun + '(' + basicinfo.addr_road + ')\n';
        maemul_info_loca += '거래금액: ' + '(' + basicinfo.prd_sel_type + ')' + basicinfo.prd_price;
        maemul_info_loca += (basicinfo.prd_sel_type == '월세' ? '월세 : ' + basicinfo.prd_month_price : '보증금 : ' + basicinfo.prd_price);


        if (basicinfo.product_create_origin == '중개의뢰') {
          let noti_info = {
            prd_identity_id: basicinfo.prd_id,
            request_memid: basicinfo.request_memid,//중개의뢰인 경우엔 request_memid존재한다. 따라서 이를 보낸다. 외부수임인 경우는 미존재로, 알리고api호출한다.
            request_mem_selectsosokid: basicinfo.request_mem_selectsosokid,//해당 매물의 신청자id,신청자 선택소속companyid 거래개시동의요청.
            message: basicinfo.prd_id + '::해당 매물 선임중개사에서 거래개시동의요청이 왔습니다.',
            company_id: basicinfo.company_id,//선임중개사 값.
            maemul_info: maemul_info_loca,
            noti_type: 5//거래승인요청 
          }
          let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
          if (noti_res) {
            if (noti_res.success) {
              console.log('notii resss:', noti_res);
            } else {
              alert(noti_res.message);
            }
          }

        } else {
          //이떈 알리고문자 전송. 외부수임매물인경우 외부수임인에겐 문자로만!
          if (basicinfo.request_mem_phone && basicinfo.request_mem_name) {
            let sms_info = {
              receiver: basicinfo.request_mem_phone,
              // msg: '선임중개사에서 거래개시동의요청이 왔습니다.\n\n' + maemul_info_loca + '\n\n [[내용확인]]:' + "http://localhost:3000/Preview/" + basicinfo.prd_id,
              msg: basicinfo.prd_id + '::선임중개사에서 전속매물 등록 요청이 왔습니다.\n\n' + maemul_info_loca + '\n\n [[내용확인]]:' + "http://localhost:3000/Preview/" + basicinfo.prd_id,
              msg_type: 'LMS',
              title: '거래개시동의요청 전송',
              type: '거래개시동의요청'
            };
            let sms_res = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info));
            console.log('aligosms send res reuslstsss:', sms_res);

            if (sms_res) {
              if (!sms_res.success) {
                alert('발송오류발생:', sms_res.message);
              }
            }

          } else {
            alert('외부수임인 정보가 없습니다! 알림을 보낼수 없습니다');
            return;
          }

        }
        // history.push('/Mypage');
      } else {
        alert(prdstatus_result.message);
      }
    }

  }

  const nextstep = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "추가정보",
      content: { type: "text", text: `저장 완료되었습니다.\n거래개시가 되려면 의뢰인 동의가 필요합니다.\n의뢰인에게 동의 요청을 하시겠습니까?`, component: "" },
      submit: { show: true, title: "확인", link: "/MyPage", event: () => {approval(); offModal(); } },
      cancle: { show: true, title: "나가기", link: "/PropertyManagement", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreen: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }


  const nextbtn = async ()=>{

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


  // 추가 정보 저장 
    // 이미지 저장하기
    let formData = new FormData();
    formData.append('folder', 'productImgs');

    for (let f = 0; f < serveruploadimgs_server.length; f++) {
      let file_item = serveruploadimgs_server[f];
      formData.append('images', file_item);
    }

    let res2 = await serverController2.connectFetchController('/api/images', 'POST', formData);


    console.log('기본정보확인', res2);
    console.log('기본정보확인', basicinfo);

    // EditData
    let body = {
      //기본 정보 - 수정 예정
      
      bathroom_count: basicinfo.prd_type == '아파트' || basicinfo.prd_type == '오피스텔' ? bathroomcount : null ,//	욕실 수
      room_count: basicinfo.prd_type == '아파트' || basicinfo.prd_type == '오피스텔' ? bathroomcount : null,//	방 수
      prd_status: basicinfo.prd_status,//물건상태(거래준비, 거래개시 등)
      prd_imgs: !!basicinfo.prd_imgs ? basicinfo.prd_imgs.concat(',', res2.data.join(',')) : res2.data.join(',') ,//물건이미지
      room_structure: basicinfo.prd_type == '오피스텔' ? Optionroom : null ,//	방구조
      // room_structure: Optionroom,//	방구조
      // include_managecost: '',//	관리비포함항목
      // is_managecost: '',//관리비여부

      //추가사항-수정
      storeoffice_building_totalfloor: '',//	상가, 사무실 건물 최고층
      request_message: '',//	요청메시지
      is_current_biz_job: '',//	현재업종여부
      current_biz_job: '',//	현재업종
      prd_usage: '',//	물건 사용타입(업무용, 주거용 등)
      is_rightprice: '',//권리금여부
      direction: direction,//방향
      entrance: Optionent,//	복도방식
      recommend_biz_job: '',//추천업종
      // month_base_guaranteeprice	:'',//월기보증금
      heat_fuel_type: Optionfuel,//	난방연료타입
      heat_method_type: Optionmethod,//난방방식
      is_contract_renewal: iscontractrenewal,//	계약갱신권청구여부
      is_duplex_floor: '',//	복층여부
      is_elevator: iselevator,//	승강기여부
      is_parking: isparking,//주차장여부
      is_pet: '',//반려동물여부
      loanprice: loanprice,//융자금
      prd_description: maemul_description,//물건간단설명
      prd_description_detail: maemul_descriptiondetail,//	물건상세설명
      parking_option: parkingoptions,//	주차옵션
      security_option: '',//	보안옵션
      is_toilet: istoilet,//	화장실여부
      is_interior: isinteriror,//인테리어여부
      space_option: standardspaceoption.join(','),//공간옵션
      // space_option: EditData.prd_type !== '오피스텔' ? standardspaceoption.join(',') : officetelspaceoption.join(','),//공간옵션
      prd_option: '',//	물건옵션
      modify_mem_id: login_user.user_name,	//수정인
      existed_deposit: guaranteeprice,	//기보증금
      existed_month_price: guaranteemonthprice,	//기월세
    }

    // console.log('수정확인555', brokerRequest_product_data.prdidentityid);
    console.log('수정확인555', body.prd_imgs);
    //####수정 api 동작이 false됨 body를 모두 빈값으로 넣어 돌렸는데도 false가 나타남..... 
    let patchdata = await serverController.connectFetchController(`/api/products/${brokerRequest_product_data.prdidentityid}`, 'PATCH', JSON.stringify(body));
    console.log('수정확인555', patchdata);
    console.log('수정확인555', brokerRequest_product_data.prdidentityid);

    if (patchdata.success) {
      nextstep()
    } else {
      alert('수정 오류 - 항목을 다시 작성해주세요');
    }


    // nextstep()
  }


  useEffect(() => {
    if (!roomcount || !bathroomcount || !iscontractrenewal) {
      console.log('987987987', iscontractrenewal);
      setactive(false)
      console.log('비활성')
    } else {
      console.log('활성')
      setactive(true)
    }
  }, [roomcount, bathroomcount, iscontractrenewal])

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
          {console.log('복층확인',isduplexfloor)}
          {
            temp_brokerRequest.maemultype == '오피스텔' ?
              <div className="par-spacing">
                <FormControl component="fieldset">
                  <FormLabel component="legend" required>복층 여부</FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    // defaultValue={isduplexfloor == 0 ? '0' : "1"}
                    defaultValue={isduplexfloor ==  0 ? '단층' : '복층'}

                    name="radio-buttons-group"
                    onChange={change_isduplexfloor}
                    
                  >
                    <FormControlLabel value='단층' control={<Radio/>} label="단층" />
                    <FormControlLabel value='복층' control={<Radio/>} label="복층" />
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
                      // defaultValue={isparking ==  0 ? '불가' : '가능'}
                      defaultValue={isparking == 0  ? '불가' : '가능'}
                      // defaultValue='가능'
                      // defaultValue='1'
                      name="radio-buttons-group"
                    >
                      {/* <FormControlLabel value='불가' onClick={() => { setPark(false) }} control={<Radio type="radio" name="parking" id="park1" value={0} onChange={change_isparking} />} label="불가" />
                      <FormControlLabel value='가능' onClick={() => { setPark(true) }} control={<Radio type="radio" name="parking" id="park2" value={1} onChange={change_isparking} />} label="가능" /> */}
                      <FormControlLabel value='불가' onClick={() => { setPark(false) }} control={<Radio onChange={change_isparking} />} label="불가" />
                      <FormControlLabel value='가능' onClick={() => { setPark(true) }} control={<Radio onChange={change_isparking}  />} label="가능" />
                      {

                        // park ?
                        isparking == '1' ?
                          <InputPark type="text" placeholder="(e.g 1대 가능)" value={parkingoptions} onChange={e => setParkingoptions(e.target.value)} />
                          :
                          null
                      }
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="par-spacing">
                  <FormControl component="fieldset">
                    {console.log('엘리베이터', iselevator)}
                    <FormLabel component="legend" required>엘리베이터</FormLabel>
                    <RadioGroup
                      row
                      aria-label=""
                      // defaultValue={iselevator == "0" ? '없음' : '있음'}
                      defaultValue={iselevator ==  0 ? '없음' : '있음'}
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
                    // defaultValue={iswithpet}
                    // defaultValue={iswithpet == "0" ? '공용' : '전용'}
                    defaultValue={iselevator == 0 ? '공용' : '전용'}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="공용" control={<Radio onChange={change_iswithpet} />} label="불가" />
                    <FormControlLabel value="전용" control={<Radio onChange={change_iswithpet} />} label="가능" />
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
                    // defaultValue={istoilet == "0" ? '공용' : '전용'}
                    defaultValue={istoilet == 0 ? '공용' : '전용'}
                  >
                    <FormControlLabel value="공용" control={<Radio onChange={change_istoilet} />} label="공용" />
                    <FormControlLabel value="전용" control={<Radio onChange={change_istoilet} />} label="전용" />
                    {/* <FormControlLabel value="공용" control={<Radio type="radio" name="is_toilet" id="is_toilet1" value='0' onChange={change_istoilet} />} label="공용" />
                    <FormControlLabel value="전용" control={<Radio type="radio" name="is_toilet" id="is_toilet2" value='1' onChange={change_istoilet} />} label="전용" /> */}
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
                 
                  <h4>등록된 사진 수 : {imgsfiles}</h4> 
                
                 
                
                  {/* {
                    imgsfiles.map((value, index) => {
                      return (
                        <UploadImg src={localStringData.imagePath + value} />
                      )
                    })
                  } */}
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
                            // defaultValue="없음"
                            defaultValue={isinteriror == 0 ? '없음' : '있음'}
                            name="radio-buttons-group"
                          >
                            <FormControlLabel value="없음" control={<Radio onChange={change_isinterior} />} label="없음" />
                            <FormControlLabel value="있음" control={<Radio onChange={change_isinterior} />} label="있음" />
                            {/* <FormControlLabel value="없음" control={<Radio type="radio" name="is_interior" id="is_interior1" defaultChecked value='0' onChange={change_isinterior} />} label="없음" />
                            <FormControlLabel value="있음" control={<Radio type="radio" name="is_interior" id="is_interior2" value='1' onChange={change_isinterior} />} label="있음" /> */}
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <div className="par-spacing">
                        {}
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
                                    {/* {console.log('아파트 공간', standardspaceoption.filter(checkitem => checkitem == '베란다') == '' ? false : true)} */}
                                    {console.log('아파트 공간', standardspaceoption)}
                                    {console.log('아파트 공간', standardspaceoption.filter(checkitem => checkitem == '베란다') == '' ? false : true)}
                                  </div>
                                  {
                                    mode == '수정' ? 
                                      <div className="par-indent-left">
                                        <FormGroup row>
                                          <FormControlLabel control={<Checkbox id="standard_spaceoption1" value='발코니' checked={standardspaceoption.filter(checkitem => checkitem == '발코니') == '' ? false : true} className='standard_spaceoption' onChange={e => changeCheckBox(e, standardspaceoption, setStandardspaceoption)} />} label="발코니" />
                                          <FormControlLabel control={<Checkbox id="standard_spaceoption2" value='베란다' checked={standardspaceoption.filter(checkitem => checkitem == '베란다') == '' ? false : true} className='standard_spaceoption' onChange={e => changeCheckBox(e, standardspaceoption, setStandardspaceoption)} />} label="베란다" />
                                          <FormControlLabel control={<Checkbox id="standard_spaceoption3" value='테라스' checked={standardspaceoption.filter(checkitem => checkitem == '테라스') == '' ? false : true} className='standard_spaceoption' onChange={e => changeCheckBox(e, standardspaceoption, setStandardspaceoption)} />} label="테라스" />
                                        </FormGroup>
                                      </div>

                                    :
                                  <div className="par-indent-left">
                                    <FormGroup row>
                                          <FormControlLabel control={<Checkbox id="standard_spaceoption1" value='발코니' checked={standardspaceoption.filter(checkitem => checkitem == '발코니') == '' ? false : true}className='standard_spaceoption' onChange={e => changeCheckBox(e, standardspaceoption, setStandardspaceoption)}  />} label="발코니" />
                                          <FormControlLabel control={<Checkbox id="standard_spaceoption2" value='베란다' checked={standardspaceoption.filter(checkitem => checkitem == '베란다') == '' ? false : true}className='standard_spaceoption' onChange={e => changeCheckBox(e, standardspaceoption, setStandardspaceoption)} />} label="베란다" />
                                          <FormControlLabel control={<Checkbox id="standard_spaceoption3" value='테라스' checked={standardspaceoption.filter(checkitem => checkitem == '테라스') == '' ? false : true} className='standard_spaceoption' onChange={e => changeCheckBox(e, standardspaceoption, setStandardspaceoption)} />} label="테라스" />
                                    </FormGroup>
                                  </div>

                                  }
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
                                      <FormControlLabel control={<Checkbox id="officetel_spaceoption1" value='베란다' checked={standardspaceoption.filter(checkitem => checkitem == '베란다') == '' ? false : true} className='officetel_spaceoption' onChange={e => changeCheckBox(e, officetelspaceoption, setOfficetelspaceoption)} />} label="베란다" />

                                      <FormControlLabel control={<Checkbox id="officetel_spaceoption2" value='테라스' checked={standardspaceoption.filter(checkitem => checkitem == '테라스') == '' ? false : true} className='officetel_spaceoption' onChange={e => changeCheckBox(e, officetelspaceoption, setOfficetelspaceoption)} />} label="테라스" />
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
                                    {
                                      mode == '수정' ? 
                                    <FormGroup row>
                                      {
                                        officeteloption_array.map((value , index) => {                                   
                                          return (
                                            // < FormControlLabel control = {< Checkbox id = { "officteloption" + value.oi_id } className = 'officteloption' onChange = { e => changeCheckBox(e, officeteloption, setOfficeteloption)} value={value.label}  checked = {officeteloption.filter(checkitem => checkitem.label == value.label) == '' ? true : false} />} label={value.label} />
                                            //##$$영기 수정함확인하기                                            
                                            <FormControlLabel control={<Checkbox key={index} checked={officeteloption.filter(checkitem => checkitem == value.label) == '' ? false : true} value={value.label} />} label={value.label} />
                                            // <FormControlLabel control={<Checkbox id={"officteloption" + value.oi_id} className='officteloption' onChange={e => changeCheckBox(e, officeteloption, setOfficeteloption)} value={value.label} defaultChecked={value.default ? true : false} />} label={value.label} />

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
                                      
                                      : 
                                    <FormGroup row>
                                      {
                                        officeteloption_array.map((value , index) => {
                                          return (
                                            // < FormControlLabel control = {< Checkbox id = { "officteloption" + value.oi_id } className = 'officteloption' onChange = { e => changeCheckBox(e, officeteloption, setOfficeteloption)} value={value.label}  checked = {officeteloption.filter(checkitem => checkitem.label == value.label) == '' ? true : false} />} label={value.label} />
                                            <FormControlLabel control={<Checkbox id={"officteloption" + value.oi_id} className='officteloption' onChange={e => changeCheckBox(e, officeteloption, setOfficeteloption)} value={value.label} defaultChecked={officeteloption.filter(checkitem => checkitem == value.label) == '' ? false : true} />} label={value.label} />
                                            // <FormControlLabel control={<Checkbox id={"officteloption" + value.oi_id} className='officteloption' onChange={e => changeCheckBox(e, officeteloption, setOfficeteloption)} value={value.label} defaultChecked={value.default ? true : false} />} label={value.label} />

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


                                    }
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
                                    {mode == '수정' ?
                                      <FormGroup row>
                                        {
                                          storeofficeoption_array.map((value) => {
                                            return (
                                              <FormControlLabel control={<Checkbox onChange={e => changeCheckBox(e, storeofficeoption, setStoreofficeoption)} value={value.label} checked={storeofficeoption.filter(checkitem => checkitem == value.label) == '' ? false : true} />} label={value.label} />
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
                                  :
                                      <FormGroup row>
                                        {
                                          storeofficeoption_array.map((value) => {
                                            return (
                                              <FormControlLabel control={<Checkbox onChange={e => changeCheckBox(e, storeofficeoption, setStoreofficeoption)} value={value.label} defaultChecked={value.default ? true : false} />} label={value.label} />
                                            )
                                          }
                                          )}
                                      </FormGroup>
                                  }
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
                                    {mode == '수정' ?
                                      <FormGroup row>
                                        {
                                          OptionProtect.map((value) => {
                                            return (
                                              <FormControlLabel control={<Checkbox onChange={e => changeCheckBox(e, securityoption, setSecurityoption)} value={value.label} checked={securityoption.filter(checkitem => checkitem == value.label) == '' ? false : true} />} label={value.label} />
                                            )
                                          }
                                          )}
                                      </FormGroup>
                                    :
                                    <FormGroup row>
                                      {
                                        OptionProtect.map((value) => {
                                          return (
                                            <FormControlLabel control={<Checkbox id={"securityoption" + value.op_id} className='securityoptions' onChange={e => changeCheckBox(e, securityoption, setSecurityoption)} value={value.label} defaultChecked={value.default ? true : false} />} label={value.label} />
                                          )
                                        }
                                        )}
                                    </FormGroup>
                                    }
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
            {console.log('계약갱신권', iscontractrenewal)}
            <FormControl>
              <FormLabel required>계약갱신권 행사여부</FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                // defaultValue="0"
                name="radio-buttons-group"
                // defaultValue={iscontractrenewal !== 1 ? '미확인' : '확인'}
                defaultValue={iscontractrenewal == '0'  ?  "0"  : '1'  }
              >
                {console.log('987987',iscontractrenewal)}
                <FormControlLabel value="0" control={<Radio onChange={change_iscontractrenewal}/>} label="미확인" />
                <FormControlLabel value="1" control={<Radio onChange={change_iscontractrenewal}/>} label="확인" />
                {/* <FormControlLabel value="0" control={<Radio type="radio" onChange={change_iscontractrenewal} value='0' name="is_contractrenewal" id="radi1" />} label="미확인" />
                <FormControlLabel value="1" control={<Radio type="radio" onChange={change_iscontractrenewal} value='1' name="is_contractrenewal" id="radi2" />} label="확인" /> */}

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
          {/* {mode == '수정' ?
            <MUButton_Validation variant="contained" type="button" name="" active={active} onClick={editBtn}>수정하기</MUButton_Validation>
            :
            // <MUButton_Validation variant="contained" type="button" name="" active={active} onClick={() => nextstep()}>다음</MUButton_Validation>
            <MUButton_Validation variant="contained" type="button" name="" active={active} onClick={nextbtn}>다음</MUButton_Validation>
          } */}
          <MUButton_Validation variant="contained" type="button" name="" active={active} onClick={nextbtn}>저장후 다음</MUButton_Validation>
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
