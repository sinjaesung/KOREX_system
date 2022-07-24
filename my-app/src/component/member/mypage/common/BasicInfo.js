//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components";

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

//img
import RadioImg from '../../../../img/map/radi.png';

import { Mobile, PC } from "../../../../MediaQuery";

//redux addons전페이지 정보 갖고 오기 위함(veiw형태로 정보 유지 및 view용도) eidt하려면 state에 저장해줌
import { useSelector } from 'react-redux';
import { tempBrokerRequestActions } from '../../../../store/actionCreators';
import tempBrokerRequest from '../../../../store/modules/tempBrokerRequest';

export default function Request({ nextModal, setActive, Productdata , mode}) {
  const tempBrokerRequests = useSelector(data => data.tempBrokerRequest);

  //기본정보 입력 사항
if(mode == '수정'){
  console.log('수정모드');

  
}else{
  console.log('생성모드');

}
  console.log('수정모드', Productdata);
  // console.log('수정모드', Productdata.prd_name);
  
  //물건관련 정보 state
  const [exculsive_periods, setExculsive_periods] = useState('');//전속기간
  const [buildingtype, setbuildingtype] = useState(mode == '수정' ? Productdata.prd_type : tempBrokerRequests.maemultype); //물건종류
  const [Selladdress, setSelladdress] = useState(mode == '수정' ? Productdata.addressjibun + '(' + Productdata.addressroad+')': tempBrokerRequests.dangijibunaddress + '(' + tempBrokerRequests.dangiroadaddress + ')'); // 물건주소
  const [Sellstate, setSellstate] = useState(tempBrokerRequests.dongname +tempBrokerRequests.floorname + '층 ' +tempBrokerRequests.hosilname + '호'); // 물건상세
  const [maemulname, setMaemulname] = useState(mode == '수정' ? Productdata.prd_name : tempBrokerRequests.dangi + tempBrokerRequests.dongname); //건물명
  const [jeonyongdimension, setJeonyongdimension] = useState(''); //전용면적 m*
  const [jeonyongpyeong, setJeonyongpyeong] = useState('');  //전용면적 평
  const [supplydimension, setSupplydimension] = useState('');//공급면적 m*
  const [supplypyeong, setSupplypyeong] = useState('');//공급면적 평
  const [selltype, setSelltype] = useState('');//거래유형(판매정보)
  const [sellprice, setSellprice] = useState('');  // 가격 / 보증금
  const [monthsellprice, setMonthsellprice] = useState(''); //월세
  const [Managecost, setChangemanagecost] = useState('');//관리비
  const [ismanagementcost, setismanagementcost] = useState(0);//관리비있음여부.
  const [managecostincludes, setManagecostincludes] = useState([]);//관리비포함항목
  const manageData = ["전기", "수도", "가스", "인터넷", "티비"];
  const [viewDate, setViewDate] = useState("즉시");//입주가능일 선택할 경우 date박스
  const [ibju_specifydate, setIbju_specifydate] = useState('');//입주일
  
  const [usetype, setUsetype] = useState('');//오피스텔 - 용도
  const [isstorejob, setisstorejob] = useState(false); //상가 - 업종 있음/없음
  //업종유무,업종타입
  const [storejob, setstorejob] = useState('');//업종 입력
  

  const [openMore, setOpenMore] = useState(false);
  const [ibju_isinstant, setIbju_isinstant] = useState(0);//입주즉시

  
  // const [activeIndex, setActiveIndex] = useState(-1);
  // const [viewInput, setViewInput] = useState(false);//관리비 있음일때 input박스 노출
  // const [job, setJob] = useState(false);//현재업종 선택할 경우 box show/hide  -- 사용안함
  // const [modalBroker, setModalBroker] = useState(false);


  //권리금유무
  const [isrightprice, set_isrightsprice] = useState('없음');

  useEffect(() => {
    console.log('여기를 확인하기 : ', tempBrokerRequests);
    // console.log('수정중..전속기간 : ', exculsive_periods);
    // console.log('수정중..물건종류 : ', buildingtype);
    // console.log('수정중..주소 : ', Selladdress);
    // console.log('수정중..상세 : ', Sellstate);
    // console.log('수정중..건물명 : ', maemulname);
    // console.log('수정중..전용면적 m* : ', jeonyongdimension);
    // console.log('수정중..전용면적 평 : ', jeonyongpyeong);
    // console.log('수정중..공급면적 m* : ', supplydimension);
    // console.log('수정중..공급면적 평 : ', supplypyeong);

    // console.log('수정중..거래유형 : ', selltype);
   
    // console.log('수정중..가격/보증금 : ', sellprice);
    // console.log('수정중..월세 : ', monthsellprice);
    console.log('수정중..관리비 금액 : ', Managecost); 
    // console.log('수정중..관리비 체크유무 : ', ismanagementcost);
    // console.log('수정중..관리비 체크항목 : ', managecostincludes);
    // console.log('수정중..입주가능일 선택사항 : ', viewDate); // 입주가능일 선택사항 
    // console.log('수정중..입주가능일 입주가능일-날짜선택 : ', ibju_specifydate);  //입주가능일 날짜선택
    // console.log('수정중..오피스텔-용도 : ', usetype);  //입주가능일 날짜선택
    // console.log('수정중..상가-현재업종 체크유무: ', isstorejob);  
    // console.log('수정중..상가-현재업종 종류 : ', storejob);
    console.log('수정중..상가-권리금 유무 : ', isrightprice);
    // console.log('수정중.. : ', !!monthsellprice);
    console.log('여기를 확인123', !exculsive_periods, !buildingtype, !Selladdress, !Sellstate, !maemulname, !jeonyongdimension, !jeonyongpyeong, !supplydimension, !supplypyeong, !selltype, !sellprice, !monthsellprice);
   

    if (!exculsive_periods || !buildingtype || !Selladdress || !Sellstate || !maemulname || !jeonyongdimension || !jeonyongpyeong || !supplydimension || !supplypyeong || !selltype || !sellprice){
      // setActive(false)
    }else{
      setActive(true)
    }
    //월세 유효성 버튼
    if(selltype == '월세'){
      console.log('동작');
      !monthsellprice || !sellprice ? setActive(false) : setActive(true);
    }

    if (viewDate == "1"){
      if (ibju_specifydate == '' || !exculsive_periods || !buildingtype || !Selladdress || !Sellstate || !maemulname || !jeonyongdimension || !jeonyongpyeong || !supplydimension || !supplypyeong || !selltype || !sellprice){
        setActive(false)
      }else{
        setActive(true)
      }
    }

    // if (ismanagementcost == true){
    //   if (Managecost == ''){
    //     setActive(false)
    //   }else{
    //     setChangemanagecost('')
    //     setActive(true)

    //   }
    // }

     
    // }
  }, [exculsive_periods, buildingtype, Selladdress, Sellstate, maemulname, jeonyongdimension, jeonyongpyeong, supplydimension, supplypyeong, selltype, sellprice, monthsellprice, Managecost, ismanagementcost, viewDate, managecostincludes, ibju_specifydate, usetype, isstorejob, storejob, isrightprice])


  //물건관련 정보 셋팅
  const change_maemulname = (e) => {
    // if (maemulname)
    setMaemulname(e.target.value);
  }
  const change_jeonyong_dimension = (e) => {
    setJeonyongdimension(e.target.value);
  }
  const change_jeonyong_pyeong = (e) => {
    setJeonyongpyeong(e.target.value);
  }
  const change_supply_dimension = (e) => {
    setSupplydimension(e.target.value);
  }
  const change_supply_pyeong = (e) => {
    setSupplypyeong(e.target.value);
  }
  const change_selltype = (e) => {
    setSelltype(e.target.value);
    setSellprice('');
  }
  const change_sellprice = (e) => {
    setSellprice(e.target.value);
  }
  const change_monthsellprice = (e) => {
    setMonthsellprice(e.target.value);
  }
  const change_Managecost = (e) => {
    setChangemanagecost(e.target.value);
  }

  const radio_ibju_isinstant = (e) => {
    console.log('수정중..123 : ',e.target.value);
    if (e.target.value == '날짜선택') {
      setViewDate(true)
    } else {
      setViewDate(false)
      setIbju_specifydate('');
    }
    // setIbju_isinstant(e.target.value);
    // if (viewDate == false) {
    //   setViewDate(true)
    // } else {
    //   setViewDate(false)
    // }
    // setIbju_isinstant(e.target.value);
  }

  

  const change_ibju_specifydate = (e) => {
    setIbju_specifydate(e.target.value);
  }
  const change_exculsive_periods = (e) => {
    setExculsive_periods(e.target.value);
   
  }

  const managecost_includes_change = (e) => {
    let newArr = managecostincludes;
    if (e.target.checked) {
      newArr.push(e.target.value);
    } else {
      newArr = newArr.filter(item => item !== e.target.value);
    }
    setManagecostincludes([...newArr]);
    // console.log('managecost_includes_checkbox 체크박스 관리비포함 체크박스항목들 변화발생:',document.getElementsByClassName('managecost_includes_checkbox'));
    // var managecost_includes_checkboxs=document.getElementsByClassName('managecost_includes_checkbox');
    // var checked_items=[];
    // for(let i=0,c=0; i<managecost_includes_checkboxs.length; i++){
    //   if(managecost_includes_checkboxs[i].checked){
    //     checked_items[c]=managecost_includes_checkboxs[i].value;
    //     c++;
    //   }
    // }
    // console.log('현재 변화 선택된 관리비포함 항목들:',checked_items.join(','));
    // setManagecostincludes(checked_items.join(','));
  }

  useEffect(() => {
    tempBrokerRequestActions.maemulnamechange({ maemulnames: maemulname });
    tempBrokerRequestActions.jeonyongdimensionchange({ jeonyongdimensions: jeonyongdimension });
    tempBrokerRequestActions.jeonyongpyeongchange({ jeonyongpyeongs: jeonyongpyeong });
    tempBrokerRequestActions.supplydimensionchange({ supplydimensions: supplydimension });
    tempBrokerRequestActions.supplypyeongchange({ supplypyeongs: supplypyeong });
    tempBrokerRequestActions.selltypechange({ selltypes: selltype });
    tempBrokerRequestActions.sellpricechange({ sellprices: sellprice });
    tempBrokerRequestActions.monthsellpricechange({ monthsellprice: monthsellprice });
    tempBrokerRequestActions.managecostchange({ managecosts: Managecost });
    tempBrokerRequestActions.ibjuisinstantchange({ ibju_isinstants: ibju_isinstant });
    tempBrokerRequestActions.ibjuspecifydatechange({ ibju_specifydates: ibju_specifydate });
    tempBrokerRequestActions.exculsiveperiodschange({ exculsive_periodss: exculsive_periods });//전속기간
    // tempBrokerRequestActions.managecostincludeschange({ managecostincludess: managecostincludes });
    // tempBrokerRequestActions.storejobchange({ storejob: storejob });
    // tempBrokerRequestActions.isstorejobchange({ isstorejob: isstorejob });
    // tempBrokerRequestActions.officetelusetypechange({ officetelusetype: usetype });
    // tempBrokerRequestActions.ismanagementcostchange({ ismanagementcost: ismanagementcost });
    // tempBrokerRequestActions.isrightpricechange({ isrightprice: isrightprice });  //권리금
  }, [
    maemulname, jeonyongdimension, jeonyongpyeong, supplydimension, supplypyeong, selltype, sellprice, monthsellprice, Managecost, ibju_isinstant, ibju_specifydate, exculsive_periods, managecostincludes, storejob, isstorejob, usetype, ismanagementcost, isrightprice
  ])

  return (
    <>
      <Wrapper>
        <p className="tit-a2">기본정보 입력</p>
        <Sect_R2>
          {/* <WrapBox> */}
          <div className="m-1x0x3">
            <Title_Sub>전속정보</Title_Sub>
            <div className="par-indent-left">
              <div className="par-spacing">
                <Desc>
                  <p>전속기간의 기산일은 전문중개사의 의뢰 수락 후<br />
                    의뢰인의 거래 개시 승인일 다음날부터입니다.</p>
                </Desc>
              </div>
              <div className="par-spacing">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">전속기간</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={exculsive_periods}
                    label="기간 선택"
                    onChange={change_exculsive_periods}
                  >
                    <MenuItem value='0'>기간 선택</MenuItem >
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
                <MUTextField_100 required id="standard-required" label="상세" variant="filled" value={tempBrokerRequests.dongname + tempBrokerRequests.floor + '층' + tempBrokerRequests.hosil+'호'}
                // <MUTextField_100 required id="standard-required" label="상세" variant="filled" value={tempBrokerRequests.dongname + tempBrokerRequests.floorname + '층 ' + tempBrokerRequests.hosilname + '호'}
                  InputProps={{
                    readOnly: true,
                  }} helperText="호수는 공개되지 않습니다" />
              </div>
              <div className="par-spacing">
                {
                  maemulname ? 
                    <MUTextField_100 required id="standard-required" label="건물명" variant="standard" defaultValue={tempBrokerRequests.dangi + "(" + tempBrokerRequests.dongname +')'} />
              :
              <MUTextField_100 required id="standard-required" label="건물명" variant="standard" onChange={change_maemulname} />
              }
                
              </div>
              {/*@@___NewPropertySecond 와 차이가 있음. 그럴 이유가 없는데 왜 그런지????* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/}
              {/*!!!!!!현재 업종은 상가일때만 노출됩니다. display:none처리!!!!*/}
              {
                tempBrokerRequests.maemultype == '상가' ?
                  <InputBox>
                    <Label>현재업종<Pilsu>*</Pilsu></Label>
                    <FormGroup>
                      <FormControlLabel control={<Switch onClick={() => { setisstorejob(!isstorejob); }} />} label={isstorejob == true ? '있음' : '없음'} />
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
                          <MUTextField_100  placeholder="현재 업종 입력" onChange={(e) => { setstorejob(e.target.value); }} />
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
                    onChange={(e) => {setUsetype(e.target.value); }}
                  >
                    <MenuItem value='주거용'>주거용</MenuItem >
                    <MenuItem value='업무용'>업무용</MenuItem >
                  </Select>
                </FormControl>
                  :
                  null
              }
              {/*@@___NewPropertySecond 와 차이가 있음. 그럴 이유가 없는데 왜 그런지????* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/}
              <div className="par-spacing">
                <MUFormControl>
                  <FormLabel >전용면적*</FormLabel>
                  <div style={{ display: "flex", }}>
                    <MUInput placeholder="m² 선택 or 입력" onChange={change_jeonyong_dimension} endAdornment={<InputAdornment position="end">m²</InputAdornment>} />
                    <Same>=</Same>
                    <MUInput placeholder="평수 입력" onChange={change_jeonyong_pyeong} endAdornment={<InputAdornment position="end">평</InputAdornment>} />
                  </div>
                </MUFormControl>
              </div>
              <div className="par-spacing">
                <MUFormControl color="primary">
                  <FormLabel >공급면적*</FormLabel>
                  <div style={{ display: "flex", }}>
                    <MUInput placeholder="m² 선택 or 입력" onChange={change_supply_dimension} endAdornment={<InputAdornment position="end">m²</InputAdornment>} />
                    <Same>=</Same>
                    <MUInput placeholder="평수 입력" onChange={change_supply_pyeong} endAdornment={<InputAdornment position="end">평</InputAdornment>} />
                  </div>
                </MUFormControl>
              </div>
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
                    <MUTextField_100 required label={`${selltype}가`} placeholder={`${selltype}가 입력`} variant="standard" onChange={selltype == '월세' ? change_monthsellprice : change_sellprice}
                      InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                  </div>
                }
                {
                  selltype == "전세" &&
                  <div className="par-spacing">
                    <MUTextField_100 required label={`${selltype}가`} placeholder={`${selltype}가 입력`} variant="standard" onChange={selltype == '월세' ? change_monthsellprice : change_sellprice}
                      InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                  </div>
                }
                {/* 거래유형 > 월세 선택됐을때 아래 내용 나와야함 */}
                {
                  selltype == "월세" &&
                  <div className="par-spacing">
                    <div className="flex-spabetween-center">
                      <MUTextField required label="보증금" placeholder="보증금 입력" variant="standard" onChange={change_sellprice}
                        InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                      <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
                      <MUTextField required label="월세" placeholder="월세" variant="standard" onChange={change_monthsellprice}
                        InputProps={{ endAdornment: (<InputAdornment position="end">만원</InputAdornment>) }} />
                    </div>
                  </div>
                }
              </InputBox>
              {
                tempBrokerRequests.maemultype == '상가' ?
                  <div className="flex-spabetween-center">
                 
                    <FormControl component='fieldset'>
                      <FormLabel component='legend' required>권리금</FormLabel>
                      <RadioGroup
                        rowdefaultValue='없음'
                        name='radio-buttons-group'>
                        <FormControlLabel value='없음' control={<Radio type='radio' name='is_rightprice' id='is_rightprice1' value='없음' onClick={(e) => { set_isrightsprice(e.target.value) }} />} label='없음' />
                        <FormControlLabel value='있음' control={<Radio type='radio' name='is_rightprice' id='is_rightprice2' value='있음' onClick={(e) => { set_isrightsprice(e.target.value) }} />} label='있음' />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  :
                  null
              }
            </div>
            {/*더보기*/}
            <div>
              <div className="par-spacing">
                <div className="flex-left-center">
                  {/* <EnterImg src={Enter} /> */}
                  <SubdirectoryArrowRightIcon />
                  <h4>더보기*</h4>
                  <ExpandMore
                    expand={openMore}
                    onClick={() => { setOpenMore(!openMore) }}
                    aria-expanded={openMore}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                  {/* <ArrowTopImg src={ArrowTop} rotate={rotate} /> */}
                </div>
              </div>
              <div className="par-indent-left">
                {
                  openMore ?

                    <MoreView>
                      <div className="par-spacing">
                        <FormControl component="fieldset" fullWidth>
                          <FormLabel component="legend" required>관리비</FormLabel>
                          <FormControlLabel control={<Switch onClick={() => { setismanagementcost(!ismanagementcost); }} />} label={ismanagementcost == true ? "있음" : "없음"} />
                          {
                            ismanagementcost == true ?
                              <div className="par-indent-left">
                                <div className="par-spacing">
                                  <MUTextField_100 required placeholder="가격 입력" variant="standard" onChange={change_Managecost}
                                    InputProps={{
                                      startAdornment: (<InputAdornment position="start">월</InputAdornment>),
                                      endAdornment: (<InputAdornment position="end">만원</InputAdornment>),
                                    }} />
                                </div>
                                <div className="par-spacing">
                                  <FormControl component="fieldset" fullWidth>

                                    <div className="flex-left-center">
                                      <SubdirectoryArrowRightIcon />
                                      <FormLabel component="legend">관리비 포함</FormLabel>
                                    </div>

                                    <div className="par-indent-left">
                                      <FormGroup row>
                                        {
                                          manageData.map((item, index) => {
                                            return (
                                              <FormControlLabel control={<Checkbox key={index} value={item} id={`check${index}`} onChange={e => managecost_includes_change(e)} />} label={item} />
                                            )
                                          })
                                        }
                                      </FormGroup>
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
                      <div className="par-spacing">
                        <FormControl component="fieldset">
                          <FormLabel component="legend" required>입주가능일</FormLabel>
                          <RadioGroup
                            defaultValue='즉시'
                            name="radio-buttons-group"
                          >
                            <FormControlLabel value="즉시" control={<Radio type="radio" name="possible" value='즉시' id="radi1" onClick={radio_ibju_isinstant} />} label="즉시" />
                            <FormControlLabel value="날짜선택" control={<Radio type="radio" name="possible" value="날짜선택" id="radi2" onClick={radio_ibju_isinstant} />} label="날짜 선택" />
                            {
                              viewDate ?
                                <InputDate type="date" onChange={change_ibju_specifydate} />
                                :
                                null
                            }
                          </RadioGroup>
                        </FormControl>
                      </div>
                    </MoreView>

                    :
                    null
                }
              </div>
            </div>
          </div>

          {/*!!!!다음 버튼 , 조건문 맞춰서 액티브 됐을때 색상 바뀌어야함..!!!! */}
          {/* <div className="par-spacing">
            <MUButton_Validation variant="contained" type="button" name="" active={""} onClick={() => {
              if (!maemulname || !jeonyongdimension || !jeonyongpyeong || !jeonyongdimension || !supplydimension || !supplypyeong || !selltype || !sellprice || !managecostincludes) {
                console.log(!maemulname, !jeonyongdimension, !jeonyongpyeong, !jeonyongdimension, !supplydimension, !supplypyeong, !selltype, !sellprice, !managecostincludes);
                alert('필수입력사항을 채워주세요!');
                return;
              }
              nextModal();

              console.log('다음버튼 클릭 입력정보들 물건정보들:', maemulname, jeonyongdimension, jeonyongpyeong, supplydimension, supplypyeong, selltype, sellprice, Managecost, ibju_isinstant, ibju_specifydate, managecostincludes, storejob, isstorejob, ismanagementcost);

              tempBrokerRequestActions.maemulnamechange({ maemulnames: maemulname });
              tempBrokerRequestActions.jeonyongdimensionchange({ jeonyongdimensions: jeonyongdimension });
              tempBrokerRequestActions.jeonyongpyeongchange({ jeonyongpyeongs: jeonyongpyeong });
              tempBrokerRequestActions.supplydimensionchange({ supplydimensions: supplydimension });
              tempBrokerRequestActions.supplypyeongchange({ supplypyeongs: supplypyeong });
              tempBrokerRequestActions.selltypechange({ selltypes: selltype });
              tempBrokerRequestActions.sellpricechange({ sellprices: sellprice });
              tempBrokerRequestActions.monthsellpricechange({ monthsellprice: monthsellprice });
              tempBrokerRequestActions.managecostchange({ managecosts: Managecost });
              tempBrokerRequestActions.ibjuisinstantchange({ ibju_isinstants: ibju_isinstant });
              tempBrokerRequestActions.ibjuspecifydatechange({ ibju_specifydates: ibju_specifydate });
              // tempBrokerRequestActions.exculsiveperiodschange({ exclusive_periodss: exculsive_periods });//전속기간
              tempBrokerRequestActions.managecostincludeschange({ managecostincludess: managecostincludes });
              tempBrokerRequestActions.storejobchange({ storejob: storejob });
              tempBrokerRequestActions.isstorejobchange({ isstorejob: isstorejob });
              tempBrokerRequestActions.officetelusetypechange({ officetelusetype: usetype });
              tempBrokerRequestActions.ismanagementcostchange({ ismanagementcost: ismanagementcost });
              tempBrokerRequestActions.isrightpricechange({ isrightprice: isrightprice });  //권리금
            }}>다음</MUButton_Validation>
          </div> */}
          {/* </WrapBox> */}
        </Sect_R2>
      </Wrapper >
    </>
  );
}

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
const Title = styled.h2``

const Sect_R2 = styled.div`
        ${TtCon_1col_input}
        `
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

const Span = styled.span`
        vertical-align:middle;
        font-size:15px;font-weight:600;
        color:#4a4a4a;transform:skew(-0.1deg);
        margin-left:10px;
        @media ${(props) => props.theme.mobile} {
          font-size:calc(100vw*(15/428));
        margin-left:calc(100vw*(8/428));
    }
        `
const Same = styled.span`
        padding: 0 0.5rem;
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

const Dan = styled.p`
        font-size:15px;color:#4a4a4a;
        transform:skew(-0.1deg);
        @media ${(props) => props.theme.mobile} {
          font-size:calc(100vw*(15/428));
    }
        `
const MoreView = styled.div`
        transition:all 0.3s;
        `
const MoreBox = styled.div`
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
const WrapCheck = styled.div`
        display:flex;justify-content:felx-start;align-items:center;
        flex-wrap:wrap;margin-top:20px;
        @media ${(props) => props.theme.mobile} {
          margin-top:calc(100vw*(20/428));
  }
        `
const Radiobox = styled.div`
        width:100%;
        margin-bottom:20px;
        @media ${(props) => props.theme.mobile} {
          margin-bottom:calc(100vw*(20/428));
  }
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
          width:calc(100vw*(20/428));
        height:calc(100vw*(20/428));margin-right:calc(100vw*(8/428));
  }
        `
const InputDate = styled(InputTxt)``

const MUButton_Validation = MUstyled(MUButton)`
        &.MuiButtonBase-root.MuiButton-root{
          background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
        color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
        box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"};
        width:100%;
  }
        `