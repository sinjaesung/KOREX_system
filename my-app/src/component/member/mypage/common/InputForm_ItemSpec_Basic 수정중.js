//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import serverController from '../../../../server/serverController';

import { brokerRequest_productEditActions } from '../../../../store/actionCreators';
//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_1col_input, } from '../../../../theme';

//img
import Picture from '../../../../img/member/picture.png';

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
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';


//component
import { Mobile, PC } from "../../../../MediaQuery";
import ModalCommon_New from '../../../common/modal/ModalCommon_New';
import ModalPicture from '../property/modal/ModalPicture';

//redux addons전페이지 정보 갖고 오기 위함(veiw형태로 정보 유지 및 vieㅈ용도) eidt하려면 state에 저장해줌
import { useSelector } from 'react-redux';
import { tempBrokerRequestActions } from '../../../../store/actionCreators';
import tempBrokerRequest from '../../../../store/modules/tempBrokerRequest';
import serverController2 from '../../../../server/serverController2';


export default function InputForm_ItemSpec_Basic({ mode, failModal, nextModal, forwarding, brokerRequest_product, saveNext, setModalOption, modalOption, prd_id, updateModal, serveruploadimgs_server, changeaddedimgs_server, prd_state }) {
  const tempBrokerRequests = useSelector(data => data.tempBrokerRequest);
  const login_user = useSelector(data => data.login_user);
  //기본정보 입력 사항
  console.log('여기를 확인 수정모드', brokerRequest_product);
  console.log('여기를 확인 생성모드', tempBrokerRequests);
  console.log('여기를 확인 생성모드', login_user);
  const history = useHistory();
  const [Active, setActive] = useState(false);

  //물건관련 정보 state
  const [exclusive_periods, setExclusive_periods] = useState('');//전속기간
  const [buildingtype, setbuildingtype] = useState(tempBrokerRequests.maemultype); //물건종류
  const [Selladdress, setSelladdress] = useState(tempBrokerRequests.dangijibunaddress + '(' + tempBrokerRequests.dangiroadaddress + ')'); // 물건주소
  const [Sellstate, setSellstate] = useState(tempBrokerRequests.dong_name + tempBrokerRequests.floor + '층 ' + tempBrokerRequests.hosil + '호'); // 물건상세
  const [maemulname, setMaemulname] = useState(tempBrokerRequests.maemultype == '상가' || tempBrokerRequests.maemultype == '사무실' ? '' : tempBrokerRequests.dangi + '(' + tempBrokerRequests.dong_name + ')'); //건물명
  const [jeonyongdimension, setJeonyongdimension] = useState(''); //전용면적 m*
  const [jeonyongpyeong, setJeonyongpyeong] = useState('');  //전용면적 평
  const [supplydimension, setSupplydimension] = useState('');//공급면적 m*
  const [supplypyeong, setSupplypyeong] = useState('');//공급면적 평
  const [selltype, setSelltype] = useState('');//거래유형(판매정보)
  const [sellprice, setSellprice] = useState('');  // 가격 / 보증금
  const [monthsellprice, setMonthsellprice] = useState(''); //월세
  const [Managecost, setChangemanagecost] = useState('');//관리비
  const [ismanagementcost, setismanagementcost] = useState(true);//관리비있음여부.
  const [managecostincludes, setManagecostincludes] = useState([]);//관리비포함항목
  const manageData = ["전기", "수도", "가스", "인터넷", "티비"];
  const manageEditDate = [];
  const [viewDate, setViewDate] = useState(false);//입주가능일 선택할 경우 date박스
  const [ibju_specifydate, setIbju_specifydate] = useState('');//입주일
  const [usetype, setUsetype] = useState('');//오피스텔 - 용도
  const [isstorejob, setisstorejob] = useState(false); //상가 - 업종 있음/없음
  //업종유무,업종타입
  const [storejob, setstorejob] = useState('');//업종 입력
  const [openMore, setOpenMore] = useState(false);
  const [ibju_isinstant, setIbju_isinstant] = useState('');//입주즉시
  //권리금유무
  const [isrightprice, set_isrightsprice] = useState('');

  const [imgsfiles, setimgsfiles] = useState(0)  //이미지 개수
  // const [activeIndex, setActiveIndex] = useState(-1);
  // const [viewInput, setViewInput] = useState(false);//관리비 있음일때 input박스 노출
  // const [job, setJob] = useState(false);//현재업종 선택할 경우 box show/hide  -- 사용안함
  // const [modalBroker, setModalBroker] = useState(false);


  useEffect(() => {
    console.log('이미지 파일 확인', serveruploadimgs_server);
    console.log('이미지 파일 확인', changeaddedimgs_server);
    // console.log('이미지 파일 확인', changeaddedimgs_server.split(','));
    // setimgsfiles(!!changeaddedimgs_server ?  changeaddedimgs_server.split(',').length  :  0);

  }, [serveruploadimgs_server, changeaddedimgs_server])

  //상가 물건등록 시 물건 상세 
  useEffect(async () => {
    if (mode == '수정') {
      console.log(' 여기를 확인112', brokerRequest_product)
      setExclusive_periods(brokerRequest_product.exclusive_periods) //기간
      setbuildingtype(brokerRequest_product.prd_type) //물건 타입
      setSelladdress(brokerRequest_product.addr_jibun + '(' + brokerRequest_product.addr_road + ')') // 주소
      setSellstate(brokerRequest_product.dong_name + brokerRequest_product.floorint + '층 ' + brokerRequest_product.ho_name + '호') //상세 주소
      setimgsfiles(!!brokerRequest_product.prd_imgs ? brokerRequest_product.prd_imgs.split(',').length : '') // 사진 갯수
      setMaemulname(brokerRequest_product.prd_name) //건물명
      setSelltype(brokerRequest_product.prd_sel_type) // 거래유형
      setSellprice(brokerRequest_product.prd_price) // 금액
      setJeonyongdimension(brokerRequest_product.exclusive_area) //전용면적
      setJeonyongpyeong(brokerRequest_product.exclusive_pyeong) // 전용면적 평
      setSupplydimension(brokerRequest_product.supply_area) //공급면적
      setSupplypyeong(brokerRequest_product.supply_pyeong) //공급면적 평
      setChangemanagecost(brokerRequest_product.managecost)//관리비
      setManagecostincludes(brokerRequest_product.include_managecost == null ? [''] : brokerRequest_product.include_managecost.split(',')) // 관리비 포함 항목
      setIbju_isinstant(brokerRequest_product.is_immediate_ibju) // 즉시 입주 여부
      setViewDate(brokerRequest_product.is_immediate_ibju == 0 ? false : true)
      // setIbju_specifydate(brokerRequest_product.is_immediate_ibju == 0 ? '' : brokerRequest_product.modify_date)
      setIbju_specifydate(brokerRequest_product.ibju_specifydate)
      setisstorejob(brokerRequest_product.is_current_biz_job)//현재업종 유무
      setstorejob(brokerRequest_product.current_biz_job)//현재 업종
      set_isrightsprice(brokerRequest_product.is_rightprice)//권리금 유무
      console.log('권리금', brokerRequest_product.is_rightprice)
      setismanagementcost(brokerRequest_product.is_managecost)// 관리비


      console.log('수정모드 ', brokerRequest_product.is_immediate_ibju);
      if (brokerRequest_product.prd_sel_type == '월세') {
        setMonthsellprice(brokerRequest_product.prd_month_price)
      }


      if (brokerRequest_product.prd_type == '오피스텔') {
        setUsetype(brokerRequest_product.prd_usage)

      }

      console.log('스플릿', brokerRequest_product.is_immediate_ibju);

      //추가항목 수정 시 필요한 prd_id 값 리덕스 임시 저장 .. 후에 다른 방법으로 변경
      brokerRequest_productEditActions.prdidentityidchange({ prd_identity_ids: brokerRequest_product.prd_id });
      tempBrokerRequestActions.maemultypechange({ maemultypes: brokerRequest_product.prd_type });

    } else {
      if (tempBrokerRequests.maemultype == '상가' || tempBrokerRequests.maemultype == '사무실') {
        setSellstate(tempBrokerRequests.hosil == '' ? tempBrokerRequests.floor + '층 ' : tempBrokerRequests.floor + '층 ' + tempBrokerRequests.hosil + '호')
      }
      if (!!tempBrokerRequests.supplydimension) {
        setSupplydimension(tempBrokerRequests.supplydimension.toFixed(2));
        setSupplypyeong((tempBrokerRequests.supplydimension * 0.3025).toFixed(2))
        tempBrokerRequestActions.supplydimensionchange({ supplydimensions: tempBrokerRequests.supplydimension.toFixed(2) });
        tempBrokerRequestActions.supplypyeongchange({ supplypyeongs: (tempBrokerRequests.supplydimension * 0.3025).toFixed(2) });

      }
      if (!!tempBrokerRequests.jeonyongdimension) {
        setJeonyongdimension(tempBrokerRequests.jeonyongdimension.toFixed(2));
        setJeonyongpyeong((tempBrokerRequests.jeonyongdimension * 0.3025).toFixed(2))
        tempBrokerRequestActions.jeonyongdimensionchange({ jeonyongdimensions: tempBrokerRequests.jeonyongdimension.toFixed(2) });
        tempBrokerRequestActions.jeonyongpyeongchange({ jeonyongpyeongs: (tempBrokerRequests.jeonyongdimension * 0.3025).toFixed(2) });
      }
      //입주가능일 미선택 자동으롤 즉시 값을 리덕스로 넘긴다.
      tempBrokerRequestActions.ibjuisinstantchange({ is_immediate_ibjus: ibju_isinstant });
      tempBrokerRequestActions.ismanagementcostchange({ ismanagementcost: ismanagementcost });

    }


    //사진 수정 기능 임시 조치
    // brokerRequest_productEditActions.prdidentityidchange({ prd_identity_ids: '' });
  }, [brokerRequest_product])

  useEffect(() => {
    console.log('789456123 : ', !!exclusive_periods);
    console.log('789456123 : ', !!buildingtype);
    console.log('789456123 : ', !!Selladdress);
    console.log('789456123 : ', !!Sellstate);
    console.log('789456123 : ', !!maemulname);
    console.log('789456123 : ', !!jeonyongdimension);
    console.log('789456123 : ', !!jeonyongpyeong);
    console.log('789456123 : ', !!supplydimension);
    console.log('789456123 : ', !!supplypyeong);
    console.log('789456123 : ', !!selltype);
    console.log('789456123 : ', !!sellprice);
    console.log('789456123 : ', viewDate);

    if (mode == '수정') {
      //수정 모드
      setActive(true)
    } else {
      //생성 모드 
      console.log('생성모드555', exclusive_periods);
      if (!exclusive_periods || !buildingtype || !Selladdress || !Sellstate || !maemulname || !jeonyongdimension || !jeonyongpyeong || !supplydimension || !supplypyeong || !selltype || !sellprice) {
        setActive(false)
      } else {
        setActive(true)
      }
      //월세 유효성 버튼
      if (selltype == '월세') {
        console.log('동작');
        !monthsellprice || !sellprice ? setActive(false) : setActive(true);
      }

      if (viewDate == "1") {
        if (ibju_specifydate == '' || !exclusive_periods || !buildingtype || !Selladdress || !Sellstate || !maemulname || !jeonyongdimension || !jeonyongpyeong || !supplydimension || !supplypyeong || !selltype || !sellprice) {
          setActive(false)
        } else {
          setActive(true)
        }
      }

      if (ismanagementcost == true) {
        if (Managecost == '') {
          setActive(false)
        } else {
          setActive(true)
        }
      }
      //입주가능일 날짜선택 시 
      if (viewDate == true) {
        if (ibju_specifydate == '') {
          setActive(false)
        } else {
          setActive(true)
        }
      }

    }

  }, [exclusive_periods, buildingtype, Selladdress, Sellstate, maemulname, jeonyongdimension, jeonyongpyeong, supplydimension, supplypyeong, selltype, sellprice, monthsellprice, Managecost, ismanagementcost, viewDate, managecostincludes, ibju_specifydate, usetype, isstorejob, storejob, isrightprice])


  //물건관련 정보 셋팅
  const change_maemulname = (e) => {
    // if (maemulname)
    console.log('동작은한다ㅣ');
    setMaemulname(e.target.value);
    tempBrokerRequestActions.maemulnamechange({ maemulnames: e.target.value });
  }
  const change_jeonyong_dimension = (e) => {

    console.log('전용면적', e.target.value);
    console.log('전용면적-평', (e.target.value * 0.3025).toFixed(2));
    setJeonyongdimension(e.target.value);
    setJeonyongpyeong((e.target.value * 0.3025).toFixed(2))
    tempBrokerRequestActions.jeonyongdimensionchange({ jeonyongdimensions: e.target.value });
    tempBrokerRequestActions.jeonyongpyeongchange({ jeonyongpyeongs: (e.target.value * 0.3025).toFixed(2) });
  }
  const change_jeonyong_pyeong = (e) => {
    console.log('전용면적', e.target.value);
    console.log('전용면적-평', (e.target.value / 0.3025).toFixed(2));
    setJeonyongdimension((e.target.value / 0.3025).toFixed(2));
    setJeonyongpyeong(e.target.value);
    tempBrokerRequestActions.jeonyongpyeongchange({ jeonyongpyeongs: e.target.value });
    tempBrokerRequestActions.jeonyongdimensionchange({ jeonyongdimensions: (e.target.value / 0.3025).toFixed(2) });
  }
  const change_supply_dimension = (e) => {
    setSupplydimension(e.target.value);
    setSupplypyeong((e.target.value * 0.3025).toFixed(2));
    tempBrokerRequestActions.supplydimensionchange({ supplydimensions: e.target.value });
    tempBrokerRequestActions.supplypyeongchange({ supplypyeongs: (e.target.value * 0.3025).toFixed(2) });
  }
  const change_supply_pyeong = (e) => {
    setSupplydimension((e.target.value / 0.3025).toFixed(2));
    setSupplypyeong(e.target.value);
    tempBrokerRequestActions.supplydimensionchange({ supplydimensions: (e.target.value / 0.3025).toFixed(2) });
    tempBrokerRequestActions.supplypyeongchange({ supplypyeongs: e.target.value });
  }


  const change_selltype = (e) => {
    setSelltype(e.target.value);
    setSellprice('');
    // tempBrokerRequestActions.selltypechange({ selltypes: selltype });
    tempBrokerRequestActions.selltypechange({ selltypes: e.target.value });
    tempBrokerRequestActions.sellpricechange({ sellprices: sellprice });
  }
  const change_sellprice = (e) => {
    setSellprice(e.target.value);
    tempBrokerRequestActions.sellpricechange({ sellprices: e.target.value });
  }
  const change_monthsellprice = (e) => {
    setMonthsellprice(e.target.value);
    tempBrokerRequestActions.monthsellpricechange({ monthsellprice: e.target.value });
  }
  const change_Managecost = (e) => {
    setChangemanagecost(e.target.value);
    tempBrokerRequestActions.managecostchange({ managecosts: e.target.value });
  }

  const radio_ibju_isinstant = (e) => {
    console.log('수정중..123555 : ', e.target.value);

    if (e.target.value == '날짜선택') {
      console.log('수정중..123 : ');
      setViewDate(true)
      setIbju_isinstant(1);
      // tempBrokerRequestActions.ibjuisinstantchange({ ibju_isinstants: ibju_isinstant });
      tempBrokerRequestActions.ibjuisinstantchange({ is_immediate_ibjus: 1 });
    } else if (e.target.value == '즉시') {
      //즉시 선택시
      console.log('수정중..123 : 즉시선택');
      setIbju_isinstant(0);
      setViewDate(false)
      tempBrokerRequestActions.ibjuisinstantchange({ is_immediate_ibjus: 0 });
      setIbju_specifydate('');
      tempBrokerRequestActions.ibjuspecifydatechange({ ibju_specifydates: '' });
    }
    // setIbju_isinstant(e.target.value);
    // if (viewDate == false) {
    //   setViewDate(true)
    // } else {
    //   setViewDate(false)
    // }
    // setIbju_isinstant(e.target.value);
  }

  const is_managecostchange = (e) => {
    console.log('관리비 여부 : ', ismanagementcost);

    setismanagementcost(!ismanagementcost);
    tempBrokerRequestActions.ismanagementcostchange({ ismanagementcost: !ismanagementcost });

  }

  const change_ibju_specifydate = (e) => {
    console.log('선택한 날짜 : ', e.target.value);
    setIbju_specifydate(e.target.value);
    // tempBrokerRequestActions.ibjuspecifydatechange({ ibju_specifydates: ibju_specifydate });
    tempBrokerRequestActions.ibjuspecifydatechange({ ibju_specifydates: e.target.value });
  }
  const change_exclusive_periods = (e) => {
    setExclusive_periods(e.target.value);
    tempBrokerRequestActions.exclusiveperiodschange({ exclusive_periodss: e.target.value });//전속기간
  }

  const managecost_includes_change = (e) => {
    let newArr = managecostincludes;
    if (e.target.checked) {
      newArr.push(e.target.value);
    } else {
      newArr = newArr.filter(item => item !== e.target.value);
    }
    setManagecostincludes([...newArr]);
    tempBrokerRequestActions.include_managecostchange({ include_managecosts: [...newArr] });

  }

  const offModal = () => {
    // let option = JSON.parse(JSON.stringify(modalOption));
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }


  const saveModal = (prdID) => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "물건 저장",
      content: { type: "text", text: `저장 완료되었습니다.\n 거래가 개시되려면 추가정보를 입력하셔야 합니다.\n추가정보를 입력하시겠습니까?`, component: "" },
      cancle: { show: true, title: "나가기", link: "/PropertyManagement", event: () => { offModal(); } },
      submit: { show: true, title: "확인", link: `/AddPropertyThird/${prdID}`, event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }

  // const [prdID, setprdID] = useState()


  const saveNextBtn = async () => {
    if (!Active) {
      alert('미입력된 항목이 있습니다.')
    } else {
      if (!!prd_id) {
        // saveModal(prd_id)
      } else {

        let formData = new FormData();
        formData.append('folder', 'productImgs');

        for (let f = 0; f < serveruploadimgs_server.length; f++) {
          let file_item = serveruploadimgs_server[f];
          formData.append('images', file_item);
        }

        let res2 = await serverController2.connectFetchController('/api/images', 'POST', formData);


        console.log('기본정보확인', res2);


        let body = {
          company_id: login_user.company_id, //사업자식별자
          // prd_name: temp_selectComplexinfo.complexname, // 물건명
          prd_name: tempBrokerRequests.maemultype == '상가' || tempBrokerRequests.maemultype == '사무실' ? tempBrokerRequests.maemulname : tempBrokerRequests.dangi, // 물건명
          prd_type: tempBrokerRequests.maemultype, 	//물건타입(아파트, 오피스텔 등)
          prd_sel_type: tempBrokerRequests.selltype,	//거래타입(매매, 전세, 월세)
          prd_price: tempBrokerRequests.sellprice,//	매매금, 전세금
          prd_month_price: tempBrokerRequests.monthsellprice,	//월세
          prd_latitude: tempBrokerRequests.y,	//위도
          prd_longitude: tempBrokerRequests.x,//경도
          addr_detail: '',//상세주소
          supply_area: tempBrokerRequests.supplydimension, //공급면적
          supply_pyeong: tempBrokerRequests.supplypyeong,	//공급 평
          exclusive_area: tempBrokerRequests.jeonyongdimension, 	//전용면적
          exclusive_pyeong: tempBrokerRequests.jeonyongpyeong,	//전용 평
          managecost: tempBrokerRequests.managecost,	//관리비
          is_immediate_ibju: tempBrokerRequests.is_immediate_ibju,	//즉시입주여부
          ibju_specifydate: tempBrokerRequests.ibju_specifydate,	//입주예정일
          exclusive_periods: tempBrokerRequests.exclusive_periods,	//전속기간(개월)

          include_managecost: tempBrokerRequests.include_managecost == '' ? '' : tempBrokerRequests.include_managecost.join(','),//관리비포함항목
          addr_jibun: tempBrokerRequests.dangijibunaddress,//물건지번주소
          addr_road: tempBrokerRequests.dangiroadaddress,//물건도로명주소
          dong_name: tempBrokerRequests.dong_name,//	동명
          floorint: tempBrokerRequests.floor,//층수
          flr_type: tempBrokerRequests.floorname,//층구분
          is_managecost: tempBrokerRequests.ismanagementcost,	//관리비여부
          prd_usage: tempBrokerRequests.maemultype == '오피스텔' ? tempBrokerRequests.officetelusetype : '', // 오피스텔 용도
          is_rightprice: '',	// 상가 - 권리금여부
          is_current_biz_job: tempBrokerRequests.is_current_biz_job,	//현재업종여부 - 상가,사무실
          current_biz_job: tempBrokerRequests.is_current_biz_job == 1 ? tempBrokerRequests.current_biz_job : '',	//현재업종 - 상가,사무실
          //상가 , 사무실
          storeoffice_building_totalfloor: '',	//상가, 사무실 건물 최고층 

          bld_id: tempBrokerRequests.dong,//건물식별자
          ho_id: tempBrokerRequests.ho_name, 	//호식별자,ho_name 삭제하고 리덕스 새로 만들기
          ho_name: tempBrokerRequests.hosil,//	호명
          request_mem_name: tempBrokerRequests.name,	//의뢰인명
          request_mem_phone: tempBrokerRequests.phone,	//의뢰인 핸드폰
          prd_create_origin: tempBrokerRequests.request_type, 	//의뢰타입(중개의뢰, 외부수임)
          request_mem_id: '', 	//의뢰인식별자 - 외부 수임일 경우 안들어간다.
          request_company_id: '',	//의뢰인소속식별자 - 외부 수임일 경우 안들어간다.
          prd_status: '거래개시동의요청',	//물건상태(거래준비, 거래개시 등)

          prd_imgs: res2.data.join(','),
          // prd_imgs: !!basicinfo.prd_imgs ? basicinfo.prd_imgs.concat(',', res2.data.join(',')) : res2.data.join(','),//수정모드일때
        }
        console.log('생성모드', body);

        let request_avail = await serverController.connectFetchController('/api/products', 'POST', JSON.stringify(body));
        console.log('생성모드 888', request_avail);

        if (request_avail.success) {
          // alert('의뢰인 확인 요청을 하였습니다.');
          let maemul_info_loca = '';
          maemul_info_loca = '전속기간: ' + body.exclusive_periods + ' 개월 \n';
          maemul_info_loca += '물건종류: ' + body.prd_type + '\n';
          maemul_info_loca += '물건이름: ' + (body.prd_name + ' ' + body.dong_name + ' ' + body.ho_name + '호') + '\n';
          maemul_info_loca += '물건주소: ' + body.addr_jibun + '(' + body.addr_road + ')\n';
          maemul_info_loca += '거래금액: ' + '(' + body.prd_sel_type + ')' + body.prd_price + '\n';
          maemul_info_loca += (body.prd_sel_type == '월세' ? '보증금 : ' + body.prd_price : '');

          if (body.product_create_origin == '중개의뢰') {
            let noti_info = {
              prd_identity_id: body.prd_id,
              request_memid: body.request_memid,//중개의뢰인 경우엔 request_memid존재한다. 따라서 이를 보낸다. 외부수임인 경우는 미존재로, 알리고api호출한다.
              request_mem_selectsosokid: body.request_mem_selectsosokid,//해당 매물의 신청자id,신청자 선택소속companyid 거래개시동의요청.
              message: body.prd_id + '::해당 매물 선임중개사에서 거래개시요청이 왔습니다.',
              company_id: body.company_id,//선임중개사 값.
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
            if (body.request_mem_phone && body.request_mem_name) {
              let sms_info = {
                receiver: body.request_mem_phone,
                // msg: '선임중개사에서 거래개시동의요청이 왔습니다.\n\n' + maemul_info_loca + '\n\n [[내용확인]]:' + "http://localhost:3000/Preview/" + body.prd_id,
                msg: '선임중개사에서 전속매물 등록 요청이 왔습니다.\n\n' + maemul_info_loca + '\n\n [[내용확인]]:' + "http://localhost:3000/Preview/" + request_avail.data.prd_id,
                msg_type: 'LMS',
                title: '거래개시동의요청 전송',
                type: '거래개시동의요청'
              };
              let sms_res = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info));
              console.log('aligosms send res reuslstsss:', sms_res);
              console.log('생성모드55', sms_res);
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
          alert('물건이 등록되었습니다. \n 의뢰인 확인 메시지를 보냈습니다.')
          history.push('/PropertyManagement');
        } else {
          alert('입력된 정보가 잘못되었습니다. 다시 입력해주세요.')
        }
      }
    }
  }

  const nextbtn2 = async () => {
    let formData = new FormData();
    formData.append('folder', 'productImgs');

    for (let f = 0; f < serveruploadimgs_server.length; f++) {
      let file_item = serveruploadimgs_server[f];
      formData.append('images', file_item);
    }

    let res2 = await serverController2.connectFetchController('/api/images', 'POST', formData);


    console.log('기본정보확인', res2);

    let body = {
      prd_name: brokerRequest_product.prd_type == '상가' || brokerRequest_product.prd_type == '사무실' ? brokerRequest_product.prd_name : brokerRequest_product.prd_name, // 물건명

      prd_sel_type: selltype,	//거래타입(매매, 전세, 월세)
      prd_month_price: monthsellprice,	//월세
      supply_area: supplydimension, //공급면적
      supply_pyeong: supplypyeong,	//공급 평
      exclusive_area: jeonyongdimension, 	//전용면적
      exclusive_pyeong: jeonyongpyeong,	//전용 평
      managecost: Managecost,	//관리비
      is_immediate_ibju: ibju_isinstant,	//즉시입주여부
      ibju_specifydate: ibju_specifydate,	//입주예정일
      exclusive_periods: exclusive_periods,	//전속기간(개월)
      prd_imgs: !!brokerRequest_product.prd_imgs ? brokerRequest_product.prd_imgs.concat(',', res2.data.join(',')) : res2.data.join(','),
      prd_price: sellprice,//	매매금, 전세금
      include_managecost: managecostincludes,//관리비포함항목
      is_managecost: ismanagementcost,	//관리비여부

      prd_usage: brokerRequest_product.maemultype == '오피스텔' ? brokerRequest_product.officetelusetype : '', // 오피스텔 용도
      is_rightprice: '',	// 상가 - 권리금여부
      is_current_biz_job: storejob,	//현재업종여부 - 상가,사무실
      current_biz_job: brokerRequest_product.is_current_biz_job == 1 ? brokerRequest_product.current_biz_job : '',	//현재업종 - 상가,사무실
      //상가 , 사무실
      storeoffice_building_totalfloor: '',	//상가, 사무실 건물 최고층 

      prd_status: brokerRequest_product.prd_status,	//물건상태(거래준비, 거래개시 등)

    }

    // console.log('수정확인555', brokerRequest_product_data.prdidentityid);
    console.log('수정확인555', brokerRequest_product);
    //####수정 api 동작이 false됨 body를 모두 빈값으로 넣어 돌렸는데도 false가 나타남..... 
    let patchdata = await serverController.connectFetchController(`/api/products/${brokerRequest_product.prd_id}`, 'PATCH', JSON.stringify(body));
    console.log('수정확인555', patchdata);
    if (patchdata.success) {
      // alert('의뢰인 확인 요청을 하였습니다.');
      let maemul_info_loca = '';
      maemul_info_loca = '전속기간: ' + brokerRequest_product.exclusive_periods + ' 개월 \n';
      maemul_info_loca += '물건종류: ' + brokerRequest_product.prd_type + '\n';
      maemul_info_loca += '물건이름: ' + (brokerRequest_product.prd_name + ' ' + brokerRequest_product.dong_name + ' ' + brokerRequest_product.ho_name + '호') + '\n';
      maemul_info_loca += '물건주소: ' + brokerRequest_product.addr_jibun + '(' + brokerRequest_product.addr_road + ')\n';
      maemul_info_loca += '거래금액: ' + '(' + brokerRequest_product.prd_sel_type + ')' + brokerRequest_product.prd_price + '\n';
      maemul_info_loca += (brokerRequest_product.prd_sel_type == '월세' ? '보증금 : ' + brokerRequest_product.prd_price : '');

      if (brokerRequest_product.product_create_origin == '중개의뢰') {
        let noti_info = {
          prd_identity_id: brokerRequest_product.prd_id,
          request_memid: brokerRequest_product.request_memid,//중개의뢰인 경우엔 request_memid존재한다. 따라서 이를 보낸다. 외부수임인 경우는 미존재로, 알리고api호출한다.
          request_mem_selectsosokid: brokerRequest_product.request_mem_selectsosokid,//해당 매물의 신청자id,신청자 선택소속companyid 거래개시동의요청.
          message: brokerRequest_product.prd_id + '::해당 매물 선임중개사에서 거래개시요청이 왔습니다.',
          company_id: brokerRequest_product.company_id,//선임중개사 값.
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
        if (brokerRequest_product.request_mem_phone && brokerRequest_product.request_mem_name) {
          let sms_info = {
            receiver: brokerRequest_product.request_mem_phone,
            // msg: '선임중개사에서 거래개시동의요청이 왔습니다.\n\n' + maemul_info_loca + '\n\n [[내용확인]]:' + "http://localhost:3000/Preview/" + brokerRequest_product.prd_id,
            msg: '선임중개사에서 전속매물 등록 요청(수정)이 왔습니다.\n\n' + maemul_info_loca + '\n\n [[내용확인]]:' + "http://localhost:3000/Preview/" + brokerRequest_product.prd_id,
            msg_type: 'LMS',
            title: '거래개시동의요청 전송',
            type: '거래개시동의요청'
          };
          let sms_res = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info));
          console.log('aligosms send res reuslstsss:', sms_res);
          console.log('생성모드55', sms_res);
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
      alert('필수정보가 수정 되었습니다.');
      history.push('/PropertyManagement');
    } else {
      alert('입력된 정보가 잘못되었습니다. 다시 입력해주세요.')
    }


  }

  const saveBtn = async () => {

    let formData = new FormData();
    formData.append('folder', 'productImgs');

    for (let f = 0; f < serveruploadimgs_server.length; f++) {
      let file_item = serveruploadimgs_server[f];
      formData.append('images', file_item);
    }

    let res2 = await serverController2.connectFetchController('/api/images', 'POST', formData);


    console.log('기본정보확인', res2);

    let body = {
      prd_name: brokerRequest_product.prd_type == '상가' || brokerRequest_product.prd_type == '사무실' ? brokerRequest_product.prd_name : brokerRequest_product.prd_name, // 물건명

      prd_sel_type: selltype,	//거래타입(매매, 전세, 월세)
      prd_month_price: monthsellprice,	//월세
      supply_area: supplydimension, //공급면적
      supply_pyeong: supplypyeong,	//공급 평
      exclusive_area: jeonyongdimension, 	//전용면적
      exclusive_pyeong: jeonyongpyeong,	//전용 평
      managecost: Managecost,	//관리비
      is_immediate_ibju: ibju_isinstant,	//즉시입주여부
      ibju_specifydate: ibju_specifydate,	//입주예정일
      exclusive_periods: exclusive_periods,	//전속기간(개월)
      prd_imgs: !!brokerRequest_product.prd_imgs ? brokerRequest_product.prd_imgs.concat(',', res2.data.join(',')) : res2.data.join(','),
      prd_price: sellprice,//	매매금, 전세금
      include_managecost: managecostincludes,//관리비포함항목
      is_managecost: ismanagementcost,	//관리비여부

      prd_usage: brokerRequest_product.maemultype == '오피스텔' ? brokerRequest_product.officetelusetype : '', // 오피스텔 용도
      is_rightprice: '',	// 상가 - 권리금여부
      is_current_biz_job: storejob,	//현재업종여부 - 상가,사무실
      current_biz_job: brokerRequest_product.is_current_biz_job == 1 ? brokerRequest_product.current_biz_job : '',	//현재업종 - 상가,사무실
      //상가 , 사무실
      storeoffice_building_totalfloor: '',	//상가, 사무실 건물 최고층 

      prd_status: brokerRequest_product.prd_status,	//물건상태(거래준비, 거래개시 등)

    }

    // console.log('수정확인555', brokerRequest_product_data.prdidentityid);
    console.log('수정확인555', brokerRequest_product.prd_id);
    //####수정 api 동작이 false됨 body를 모두 빈값으로 넣어 돌렸는데도 false가 나타남..... 
    let patchdata = await serverController.connectFetchController(`/api/products/${brokerRequest_product.prd_id}`, 'PATCH', JSON.stringify(body));
    console.log('수정확인555', patchdata);

    if (patchdata.success) {
      alert('필수정보가 수정 되었습니다.');
      history.push(`/PropertyManagement`)
    } else {
      alert('수정 오류 - 항목을 다시 작성해주세요');
    }

  }

  const selectinfoBtn = () => {
    history.push(`/AddPropertyThird/${brokerRequest_product.prd_id}`)
  }

  return (
    <>
      <div className="m-1x0x3">
        <Title_Sub>전속정보</Title_Sub>
        <div className="par-indent-left">
          <div className="par-spacing">
            <Desc>
              <p>전속기간의 기산일은 전문중개사의 의뢰 수락 후<br />
                의뢰인의 거래 개시 승인일 다음날부터입니다.</p>
            </Desc>
          </div>
          {mode == '수정' ?

            <div className="par-spacing">
              <FormControl required fullWidth>
                <InputLabel id="demo-simple-select-label">전속기간</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={exclusive_periods}
                  label="기간 선택"
                  onChange={change_exclusive_periods}
                  readOnly
                >
                  {/* <MenuItem value='0'>기간 선택</MenuItem > */}
                  <MenuItem value='3'>3 개월</MenuItem >
                  <MenuItem value='6'>6 개월</MenuItem >
                  <MenuItem value='9'>9 개월</MenuItem >
                  <MenuItem value='12'>12 개월</MenuItem >
                  <MenuItem value='15'>15 개월</MenuItem >
                  <MenuItem value='18'>18 개월</MenuItem >
                  <MenuItem value='21'>21 개월</MenuItem >
                  <MenuItem value='24'>24 개월</MenuItem >
                </Select>
              </FormControl>
            </div>
            :
            <div className="par-spacing">
              <FormControl required fullWidth>
                <InputLabel id="demo-simple-select-label">전속기간</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={exclusive_periods}
                  label="기간 선택"
                  onChange={change_exclusive_periods}
                  required
                >
                  {/* <MenuItem value='0'>기간 선택</MenuItem > */}
                  <MenuItem value='3'>3 개월</MenuItem >
                  <MenuItem value='6'>6 개월</MenuItem >
                  <MenuItem value='9'>9 개월</MenuItem >
                  <MenuItem value='12'>12 개월</MenuItem >
                  <MenuItem value='15'>15 개월</MenuItem >
                  <MenuItem value='18'>18 개월</MenuItem >
                  <MenuItem value='21'>21 개월</MenuItem >
                  <MenuItem value='24'>24 개월</MenuItem >
                </Select>
              </FormControl>
            </div>
          }
        </div>
      </div>
      {/*물건정보*/}
      <div className="m-1x0x3">
        <Title_Sub>물건정보</Title_Sub>
        <div className="par-indent-left">
          <div className="par-spacing">
            <MUTextField_100 required id="standard-required" label="물건종류" variant="filled" value={buildingtype}
              InputProps={{
                readOnly: true,
              }} />
          </div>
          <div className="par-spacing">
            {/* <MUTextField_100 required id="standard-required" label="주소" variant="filled" value={tempBrokerRequests.dangijibunaddress + '(' + tempBrokerRequests.dangiroadaddress + ')'} */}
            <MUTextField_100 required id="standard-required" label="주소" variant="filled" value={Selladdress}
              InputProps={{
                readOnly: true,
              }} />
          </div>
          <div className="par-spacing">
            <MUTextField_100 required id="standard-required" label="상세" variant="filled" value={Sellstate}
              // <MUTextField_100 required id="standard-required" label="상세" variant="filled" value={tempBrokerRequests.dongname + tempBrokerRequests.floorname + '층 ' + tempBrokerRequests.hosilname + '호'}
              InputProps={{
                readOnly: true,
              }} helperText="호수는 공개되지 않습니다" />
          </div>

          {mode == '수정' ?

            <div className="par-spacing">

              <MUTextField_100 required id="standard-required" label="건물명" variant="standard" value={maemulname}
                InputProps={{
                  readOnly: true,
                }} />

            </div>
            :
            <div className="par-spacing">
              {
                buildingtype === '상가' || buildingtype === '사무실' ?

                  <MUTextField_100 required id="standard-required" label="건물명" variant="standard" onChange={change_maemulname} />
                  // maemulname ?
                  :
                  <MUTextField_100 required id="standard-required" label="건물명" variant="standard" value={maemulname}
                  // <MUTextField_100 required id="standard-required" label="건물명" variant="standard" onChange={change_maemulname} />
                  />
                // <MUTextField_100 required id="standard-required" label="건물명" variant="standard" onChange={change_maemulname} />

              }
            </div>

          }


          {/*@@___NewPropertySecond 와 차이가 있음. 그럴 이유가 없는데 왜 그런지????* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/}
          {/*!!!!!!현재 업종은 상가일때만 노출됩니다. display:none처리!!!!*/}
          {
            tempBrokerRequests.maemultype == '상가' ?
              <InputBox>
                <Label>현재업종<Pilsu>*</Pilsu></Label>
                <FormGroup>
                  {
                    mode == '수정' ?
                      <FormControlLabel control={<Switch checked={isstorejob == 1 ? true : false} />} label={isstorejob == true ? '있음' : '없음'} />
                      :
                      <FormControlLabel control={<Switch checked={isstorejob == 1 ? true : false} onClick={() => {
                        setisstorejob(!isstorejob);
                        tempBrokerRequestActions.is_current_biz_jobchange({ is_current_biz_job: isstorejob });
                      }} />} label={isstorejob == true ? '있음' : '없음'} />
                  }
                </FormGroup>
                {/* <Label>현재업종<Pilsu>*</Pilsu></Label>
                    <SwitchButton>
                      <Switch type="checkbox" id="switch_job" onClick={() => {
                        console.log('switch job checkbox클릭>>>');
                        setJob(!job); setisstorejob(!job);
                      }} />
                      <SwitchLabel for="switch_job">
                        <SwitchSpan />
                        <SwithTxtOff className="no">없음</SwithTxtOff>
                        <SwithTxtOn className="yes">있음</SwithTxtOn>
                      </SwitchLabel>
                    </SwitchButton> */}
                {
                  isstorejob ?
                    <div className="flex-spabetween-center">
                      {/* <InputTxt type="text" placeholder="현재 업종 입력" onChange={(e) => { setstorejob(e.target.value); }} /> */}
                      {
                        mode == '수정' ?
                          <MUTextField_100 placeholder="현재 업종 입력" value={storejob} />
                          :
                          <MUTextField_100 placeholder="현재 업종 입력" onChange={(e) => { setstorejob(e.target.value); tempBrokerRequestActions.current_biz_jobchange({ current_biz_job: e.target.value }); }} />

                      }
                    </div>
                    :
                    null
                }
              </InputBox>
              :
              null
          }
          {/*용도는 오피스텔일때만 노출됩니다.*/}
          {
            tempBrokerRequests.maemultype == '오피스텔' ?

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">용도</InputLabel>
                <Select
                  labelId="용도"
                  id="demo-simple-select"
                  value={usetype}
                  label="기간 선택"
                  onChange={(e) => { setUsetype(e.target.value); tempBrokerRequestActions.officetelusetypechange({ officetelusetype: e.target.value }); }}
                >
                  <MenuItem value='주거용'>주거용</MenuItem >
                  <MenuItem value='업무용'>업무용</MenuItem >
                </Select>
              </FormControl>
              :
              null
          }
          {/*@@___NewPropertySecond 와 차이가 있음. 그럴 이유가 없는데 왜 그런지????* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/}

          {mode == '수정' ?
            <div className="par-spacing">
              <MUFormControl>
                <FormLabel >전용면적*</FormLabel>
                <div style={{ display: "flex", }}>
                  <MUInput placeholder="m² 선택 or 입력" value={jeonyongdimension} endAdornment={<InputAdornment position="end">m²</InputAdornment>} />
                  <Same>=</Same>
                  <MUInput placeholder="평수 입력" value={jeonyongpyeong} endAdornment={<InputAdornment position="end">평</InputAdornment>} />
                </div>
              </MUFormControl>
            </div>
            :
            <div className="par-spacing">
              <MUFormControl>
                <FormLabel >전용면적*</FormLabel>
                <div style={{ display: "flex", }}>
                  <MUInput placeholder="m² 선택 or 입력" onChange={change_jeonyong_dimension} value={jeonyongdimension} endAdornment={<InputAdornment position="end">m²</InputAdornment>} />
                  <Same>=</Same>
                  <MUInput placeholder="평수 입력" onChange={change_jeonyong_pyeong} value={jeonyongpyeong} endAdornment={<InputAdornment position="end">평</InputAdornment>} />
                </div>
              </MUFormControl>
            </div>

          }

          {mode == '수정' ?
            // <div className="par-spacing">
            //   <MUFormControl color="primary">
            //     <FormLabel >공급면적*</FormLabel>
            //     <div style={{ display: "flex", }}>
            //       <MUInput placeholder="m² 선택 or 입력" value={supplydimension} endAdornment={<InputAdornment position="end">m²</InputAdornment>} />
            //       <Same>=</Same>
            //       <MUInput placeholder="평수 입력" value={supplypyeong} endAdornment={<InputAdornment position="end">평</InputAdornment>} />
            //     </div>
            //   </MUFormControl>
            // </div>
            <div className="par-spacing">
              <MUFormControl color="primary">
                <FormLabel >공급면적*</FormLabel>
                <div style={{ display: "flex", }}>
                  <MUInput placeholder="m² 선택 or 입력" onChange={change_supply_dimension} value={supplydimension} endAdornment={<InputAdornment position="end">m²</InputAdornment>} />
                  <Same>=</Same>
                  <MUInput placeholder="평수 입력" onChange={change_supply_pyeong} value={supplypyeong} endAdornment={<InputAdornment position="end">평</InputAdornment>} />
                </div>
              </MUFormControl>
            </div>
            :
            <div className="par-spacing">
              <MUFormControl color="primary">
                <FormLabel >공급면적*</FormLabel>
                <div style={{ display: "flex", }}>
                  <MUInput placeholder="m² 선택 or 입력" onChange={change_supply_dimension} value={supplydimension} endAdornment={<InputAdornment position="end">m²</InputAdornment>} />
                  <Same>=</Same>
                  <MUInput placeholder="평수 입력" onChange={change_supply_pyeong} value={supplypyeong} endAdornment={<InputAdornment position="end">평</InputAdornment>} />
                </div>
              </MUFormControl>
            </div>
          }




        </div>
      </div>
      {/*거래정보*/}
      <div className="m-1x0x3">
        <Title_Sub>거래정보</Title_Sub>
        <div className="par-indent-left">
          <div className="par-spacing">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" required>거래유형</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selltype}
                label="거래유형  "
                onChange={change_selltype}
                placeholer='거래유형을 선택하여주세요'
              >
                {/* <MenuItem>거래유형을 선택하여주세요.</MenuItem> */}
                <MenuItem value='매매'>매매</MenuItem>
                <MenuItem value='전세'>전세</MenuItem>
                <MenuItem value='월세'>월세</MenuItem>
              </Select>
            </FormControl>
          </div>
          <InputBox>
            {
              selltype == "매매" &&
              <div className="par-spacing">
                {mode == '수정' ?
                  // <MUTextField_100 required label={`${selltype}가`} placeholder={`${selltype}가 입력`} variant="standard" value={sellprice}
                  //   InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                  <MUTextField_100 required label={`${selltype}가`} value={sellprice} placeholder={`${selltype}가 입력`} variant="standard" onChange={selltype == '월세' ? change_monthsellprice : change_sellprice}
                    InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                  :
                  <MUTextField_100 required label={`${selltype}가`} value={sellprice} placeholder={`${selltype}가 입력`} variant="standard" onChange={selltype == '월세' ? change_monthsellprice : change_sellprice}
                    InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                }
              </div>
            }
            {
              selltype == "전세" &&
              <div className="par-spacing">
                {
                  mode == '수정' ?
                    <MUTextField_100 required label={`${selltype}가`} placeholder={`${selltype}가 입력`} variant="standard" value={sellprice}
                      InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                    :
                    <MUTextField_100 required label={`${selltype}가`} placeholder={`${selltype}가 입력`} variant="standard" onChange={selltype == '월세' ? change_monthsellprice : change_sellprice}
                      InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />

                }
              </div>
            }
            {/* 거래유형 > 월세 선택됐을때 아래 내용 나와야함 */}
            {
              selltype == "월세" &&
              <div className="par-spacing">
                {mode == '수정' ?

                  <div className="flex-spabetween-center">
                    <MUTextField required label="보증금" placeholder="보증금 입력" variant="standard" value={sellprice}
                      InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                    <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
                    <MUTextField required label="월세" placeholder="월세" variant="standard" value={monthsellprice}
                      InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                  </div>
                  :
                  <div className="flex-spabetween-center">
                    <MUTextField required label="보증금" placeholder="보증금 입력" variant="standard" onChange={change_sellprice}
                      InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                    <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
                    <MUTextField required label="월세" placeholder="월세" variant="standard" onChange={change_monthsellprice}
                      InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                  </div>

                }
              </div>
            }
          </InputBox>
          {
            tempBrokerRequests.maemultype == '상가' ?
              <div className="flex-spabetween-center">
                {console.log('권리금', isrightprice)}
                <FormControl component='fieldset'>
                  <FormLabel component='legend' required>권리금</FormLabel>
                  <RadioGroup
                    // rowdefaultValue='없음'
                    row
                    defaultValue='없음'
                    defaultValue={isrightprice == "0" ? '없음' : '있음'}
                    name='radio-buttons-group'>
                    <FormControlLabel value='없음' control={<Radio onClick={(e) => {
                      set_isrightsprice(e.target.value);
                      tempBrokerRequestActions.isrightpricechange({ isrightprice: e.target.value });  //권리금
                    }} />} label='없음' />
                    <FormControlLabel value='있음' control={<Radio onClick={(e) => {
                      set_isrightsprice(e.target.value)
                      // <FormControlLabel value='없음' control={<Radio type='radio' name='is_rightprice' id='is_rightprice1' value='없음' onClick={(e) => { 
                      //   set_isrightsprice(e.target.value); 
                      //   tempBrokerRequestActions.isrightpricechange({ isrightprice: e.target.value });  //권리금
                      //   }} />} label='없음' />
                      // <FormControlLabel value='있음' control={<Radio type='radio' name='is_rightprice' id='is_rightprice2' value='있음' onClick={(e) => { 
                      //   set_isrightsprice(e.target.value)
                      tempBrokerRequestActions.isrightpricechange({ isrightprice: e.target.value });
                    }} />} label='있음' />

                  </RadioGroup>
                </FormControl>
              </div>
              :
              null
          }
          <div className="par-spacing">
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" required>관리비</FormLabel>
              {console.log('6654654654', ismanagementcost)}
              {mode == '수정' ?
                <FormControlLabel control={<Switch checked={ismanagementcost} onClick={is_managecostchange} />} label={ismanagementcost == true ? "있음" : "없음"} />
                :
                <FormControlLabel control={<Switch onClick={is_managecostchange} />} label={ismanagementcost == true ? "있음" : "없음"} />
              }
              {/* <FormControlLabel control={<Switch onClick={() => { setismanagementcost(!ismanagementcost); tempBrokerRequestActions.ismanagementcostchange({ ismanagementcost: ismanagementcost });}} />} label={ismanagementcost == true ? "있음" : "없음"} /> */}
              {
                ismanagementcost == true ?
                  <div className="par-indent-left">
                    <div className="par-spacing">
                      {mode == '수정' ?
                        <MUTextField_100 required placeholder="가격 입력" variant="standard" value={Managecost} onChange={change_Managecost}
                          InputProps={{
                            startAdornment: (<InputAdornment position="start">월</InputAdornment>),
                            endAdornment: (<InputAdornment position="end">만원</InputAdornment>),
                          }} />
                        :
                        <MUTextField_100 required placeholder="가격 입력" variant="standard" onChange={change_Managecost}
                          InputProps={{
                            startAdornment: (<InputAdornment position="start">월</InputAdornment>),
                            endAdornment: (<InputAdornment position="end">만원</InputAdornment>),
                          }} />

                      }
                    </div>
                    <div className="par-spacing">
                      <FormControl component="fieldset" fullWidth>

                        <div className="flex-left-center">
                          <SubdirectoryArrowRightIcon />
                          <FormLabel component="legend">관리비 포함</FormLabel>
                        </div>

                        <div className="par-indent-left">
                          {mode == '수정' ?
                            <FormGroup row>
                              {
                                manageData.map((item, index) => {
                                  return (
                                    <FormControlLabel control={<Checkbox key={index} checked={managecostincludes.filter(checkitem => checkitem == item) == '' ? false : true} onChange={e => managecost_includes_change(e)} value={item} id={`check${index}`} />} label={item} />
                                  )
                                })
                              }
                            </FormGroup>
                            :
                            <FormGroup row>
                              {
                                manageData.map((item, index) => {
                                  return (
                                    <FormControlLabel control={<Checkbox key={index} value={item} id={`check${index}`} onChange={e => managecost_includes_change(e)} />} label={item} />
                                  )
                                })
                              }
                            </FormGroup>
                          }
                        </div>

                      </FormControl>
                    </div>
                  </div>
                  :
                  null
              }
            </FormControl>
          </div>

          {/*입주가능일*/}
          {console.log('입주가능일', ibju_isinstant)}
          <div className="par-spacing">
            <FormControl component="fieldset">
              <FormLabel component="legend" required>입주가능일</FormLabel>
              <RadioGroup
                // defaultValue='즉시'
                // defaultValue={ibju_isinstant}
                defaultValue={ibju_isinstant == 0 ? '즉시' : '날짜선택'}
                name="radio-buttons-group"
              >
                <FormControlLabel value="즉시" control={<Radio onClick={radio_ibju_isinstant} />} label="즉시" />
                <FormControlLabel value="날짜선택" control={<Radio onClick={radio_ibju_isinstant} />} label="날짜 선택" />
                {
                  ibju_isinstant ?
                    <InputDate type="date" value={ibju_specifydate} onChange={change_ibju_specifydate} />
                    :
                    null
                }
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="m-1x0x3">
          <Title_Sub>사진정보</Title_Sub>
          <div className="par-indent-left">

            <div className="par-spacing">
              <FormControl fullWidth>
                <FormLabel required>사진</FormLabel>
                <div className="flex-center-center">
                  <InputFileLabel for="picture" onClick={() => { updateModal() }}>
                    {
                      console.log('imgsfiles____821120', imgsfiles),
                      imgsfiles === 0 ?
                        <>사진 추가</>
                        :
                        <>등록된 사진: {imgsfiles}장</>
                    }
                  </InputFileLabel>
                </div>
              </FormControl>
            </div>
          </div>
        </div>


        <div className="par-spacing">
          {mode == '수정' ?
            prd_state == '거래개시동의요청' ?
              <MUButton_Validation variant="contained" type="button" name="" active={Active} onClick={nextbtn2} >의뢰인 확인(수정)</MUButton_Validation>
              :
              <div>
                <MUButton_Validation variant="contained" type="button" name="" active={Active} onClick={saveBtn} >저장</MUButton_Validation>
                <MUButton_Validation variant="contained" type="button" name="" active={Active} onClick={selectinfoBtn}>선택정보입력</MUButton_Validation>

              </div>


            :
            //  물건 등록 시 버튼
            <MUButton_Validation variant="contained" type="button" name="" active={Active} onClick={saveNextBtn} >의뢰인 확인</MUButton_Validation>

          }
        </div>
      </div>
      <ModalCommon_New >
        <ModalPicture />
      </ModalCommon_New>  
    </>
  );
}


const UploadedMaemulimgs = styled.div`
        width:100%;height:auto;
        display:flex;flex-flow:row wrap;
        `;
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

const MUCheck = MUstyled(FormControlLabel)`
display: flex;
flex-direction: row;
`
const MUTextField_money = MUstyled(TextField)`
width : 92%;
text-align : right;
`
const MUButton = styled(Button)``
const MUTextField = styled(TextField)``

const MUButton_Validation = MUstyled(MUButton)`
        &.MuiButtonBase-root.MuiButton-root{
          background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
        color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
        box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"};
        width:100%;
  }
`

const MUTextField_100 = styled(MUTextField)`
        &.MuiFormControl-root.MuiTextField-root {
          width:100%;    
  }
        `
const MUFormControl = styled(FormControl)`
     /* &.MuiFormControl-root {
          margin:0.3125rem 0; 
     } */
        `
const MUInput = MUstyled(Input)`
// &.MuiInputBase-root.MuiInput-root:after {
          //   border-bottom: 2px solid ${(props) => props.theme.palette.primary.main};
          // }
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
const Title_Sub = styled.h3``

const Desc = styled.div``

const SelectBox = styled.div`
        width:100%;
        `
const Label = styled.label`
        display:block;
        font-size:0.75rem;
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
const Option = styled.option``

const InputBox = styled.div``

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

const Same = styled.span`
        padding: 0 0.5rem;
        `
const MoreView = styled.div`
        transition:all 0.3s;
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
        top:calc(100vw*(-3/428));
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
const InputDate = styled(InputTxt)``