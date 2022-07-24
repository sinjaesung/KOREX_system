//★★★★상가, 사무실 중개의뢰 입니다★★★★

//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

//img
import SearchImg from '../../../../img/map/search.png';
import Close from '../../../../img/main/modal_close.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import { Mobile, PC } from "../../../../MediaQuery"

//component
import SearchStoreOfficeApi from './SearchStoreOfficeApi';
import ModalCommon from '../../../common/modal/ModalCommon';

//redux addons assettss
import { useSelector } from 'react-redux';
import { tempBrokerRequestActions } from '../../../../store/actionCreators';
import tempBrokerRequest from '../../../../store/modules/tempBrokerRequest';

//server process
import serverController from '../../../../server/serverController';

export default function SearchApartOfficetel({ setActiveIndex, activeIndex }) {
  const history = useHistory();

  const [ActiveBtn, setActiveBtn] = useState(false);

  const [hosu, setHosu] = useState(false);
  const [addressApi, setAddressApi] = useState(false);

  const [fail, setFail] = useState(false);

  const [search_address, setSearch_address] = useState('');
  const [floor, setFloor] = useState('');
  const [floorname, setfloorname] = useState('');
  const [ho_name, setho_name] = useState('');

  console.log('searchsoterfoffice물건외부관리 실행요소 display:', tempBrokerRequestActions, activeIndex)
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  //도로명 and 지번주소 검색한 관련된 flr_id리스트 여러개 다른 종류의 매물들 층 여러개 나올수있음
  const [flooridlist, setflooridlist] = useState([]);

  const [value, setValue] = useState(''); //층 선택 정보

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const updateModal = () => {
    nextStep();

    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "물건 등록",
      content: { type: "text", text: `해당물건은 전속매물이 아닙니다.\n이미 다른 중개사에게 의뢰되었거나\n거래중인 물건은 시스템에 등록할 수 없습니다.\n상기 사유에 해당하지 않는 경우,\n고객센터로 문의해주세요.`, component: "" },
      submit: { show: false, title: "확인", event: () => { offModal(); } },
      cancle: { show: false, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", link: "/AddPropertyBasicInfo", event: () => { offModal(); } }
    });
  }

  const floorchange = (e) => { setValue(e.target.value); setFloor(e.target.value.split('|')[0]); setfloorname(e.target.value.split('|')[1]); console.log('floor change층수변경:', e.target.value); console.log('floor change층수변경:', e.target.value.split('|')[0]); }
  const ho_namechange = (e) => { setho_name(e.target.value); }

  const nextStep = async (e) => {
    console.log('다음단계 클릭 >>>>', floor, floorname, ho_name, search_address);

    //리덕스 저장한다.
    tempBrokerRequestActions.ho_namechange({ ho_names: '' });//기존것이 있다면.비워놓고한다.

    tempBrokerRequestActions.floorchange({ floors: floor });
    tempBrokerRequestActions.floornamechange({ floornames: floorname });
    tempBrokerRequestActions.ho_namechange({ ho_names: ho_name });
    tempBrokerRequestActions.dangijibunaddresschange({ dangijibunaddress: flooridlist[0]['addr_jibun'] });
    tempBrokerRequestActions.dangiroadaddresschange({ dangiroadaddress: flooridlist[0]['addr_road'] });

    tempBrokerRequestActions.hosilchange({ hosils: '' });
    tempBrokerRequestActions.dongchange({ dongs: '' });//값을 강제저ㅏㄱ으로 비움 상가사무실케이스떄는 값을 동,호실 여부 지운다.
    tempBrokerRequestActions.dong_namechange({ dong_names: '' });


    switch (activeIndex) {
      case 0:
        tempBrokerRequestActions.maemultypechange({ maemultypes: '아파트' });
        break;
      case 1:
        tempBrokerRequestActions.maemultypechange({ maemultypes: '오피스텔' });
        break;
      case 2:
        tempBrokerRequestActions.maemultypechange({ maemultypes: '상가' });
        break;
      case 3:
        tempBrokerRequestActions.maemultypechange({ maemultypes: '사무실' });
        break;
    }

    //해당 floorid에 대하ㅑㄴ floor queryt결과 정보 어든ㄴ다.
    let body_info = {
      floorid_val: floor
    };
    let res_results = await serverController.connectFetchController('/api/matterial/getFloor_xy', 'POST', JSON.stringify(body_info));
    if (res_results.result) {
      console.log('res_resulstssss:', res_results);

      let result_x = res_results.result.x;
      let result_y = res_results.result.y;

      tempBrokerRequestActions.xchange({ x_pos: result_x });
      tempBrokerRequestActions.ychange({ y_pos: result_y });
    }
  }

  useEffect(async () => {
    console.log('search_address값 변경 감지:', search_address);
    let jibun_address = search_address.jibunaddress_val;
    let road_address = search_address.roadaddress_val;

    let body_info = {
      jibunaddress: jibun_address,
      roadaddress: road_address
    };
    let res_result = await serverController.connectFetchController('/api/matterial/floorid_search_query', 'POST', JSON.stringify(body_info));
    if (res_result) {
      if (res_result.result) {
        let result_var = res_result.result;
        console.log('reuslt_var::', result_var);

        setflooridlist(result_var);
        //선택층 값은 따로 floorname등으로 하고 총층값 그 나온 건물 상가사무실건물나온것 그 하나의건물관련된 층들이 나오는데 그 건물의 총층은 지상최고층이다.
        var ground_floor_list = [];
        for (let j = 0; j < result_var.length; j++) {
          if (result_var[j].flr_type == '지상') {
            let item = result_var[j]['floor'];
            ground_floor_list.push(item);
          }
        }
        console.log('저장한 모든 리스트 지상층들:', ground_floor_list);
        var max_floor_num_value = Math.max.apply(null, ground_floor_list);//최상층값.
        tempBrokerRequestActions.storeofficebuildingfloorchange({ storeofficebuildingfloor: max_floor_num_value });
      }
    }
  }, [search_address]);


  const hosuChange = () =>{
    if(hosu == false){
      setHosu(!hosu)
    }else{
      setho_name('')
      setHosu(!hosu)
    }
  }


  //유효성 검사
  useEffect(() => {
  
    if (hosu == false){
 
      !!floorname ? setActiveBtn(true) : setActiveBtn(false)

    }else{
   
      !!floorname && !!hosu && !!ho_name ? setActiveBtn(true) : setActiveBtn(false)
    }
  }, [value, hosu, ho_name])


  return (
    <>
      <div className="par-spacing">
        {/* <Label>물건 소재지</Label> */}
        {/* <SearchBox onClick={() => setAddressApi(true)}>
          <Search type="search" placeholder="물건 소재지 주소 검색" />
          <SearchBtn type="button" />
        </SearchBox> */}
        <div className="clearfix">
          {/* <InputTitle>주소</InputTitle> */}
          <ButtonAddrSearch variant="contained" disableElevation onClick={() => {
            setAddressApi(true);
          }}>주소 검색</ButtonAddrSearch>
        </div>
        {
          addressApi ?

            <Dialog
              open={addressApi}
            >
              <DialogTitle>
                <CloseImg src={Close} onClick={() => setAddressApi(false)} />
              </DialogTitle>

              <DialogContent>
                <SearchStoreOfficeApi setSearch_address={setSearch_address} setAddressApi={setAddressApi} />
              </DialogContent>
            </Dialog>


            // <AddressApi>
            //   <CloseImg src={Close} onClick={() => setAddressApi(false)}/>
            //   <SearchStoreOfficeApi setSearch_address={setSearch_address} setAddressApi={setAddressApi}/>
            // </AddressApi>


            :
            null
        }
        {/*주소 검색 후에 나오는 부분*/}

        {/* <SearchBox>
            <Search type="search" value={search_address.jibunaddress_val && search_address.roadaddress_val ? search_address.jibunaddress_val + '|' + search_address.roadaddress_val : ''} />
            <SearchBtn type="button" />
          </SearchBox> */}
        {console.log('1번째 확인  ',search_address)}
        {console.log('2번째 확인  ', search_address.roadaddress_val)}
        {console.log('3번째 확인  ', search_address.jibunaddress_val)}

        <div className="par-spacing">
          <MUTextField_100 variant="standard" disabled type="text" placeholder="도로명 주소" value={search_address.roadaddress_val} />
        </div>
        <div className="par-spacing">
          <MUTextField_100 variant="standard" disabled type="text" placeholder="지번 주소" value={search_address.jibunaddress_val} />
        </div>
      </div>
      {/* <SelectFloor onChange={floorchange}>
                  <Option>층 선택</Option>
                  {
                    flooridlist.map((value) => {
                      return (
                        <Option value={value['flr_id']+'|'+value['flr_type']+value['floor']}>{value['flr_type']+value['floor']}</Option>
                      );
                    })
                  }
                </SelectFloor> */}

      <div className="par-spacing">
        <MUFormControl variant="standard">
          <InputLabel>층 선택</InputLabel>
          <Select
            onChange={floorchange}
            value={value}
          >
            <MenuItem selected value={"층 선택"}>층 선택</MenuItem>
            {
              flooridlist.map((value , index) => {
                console.log('선택 좌표구하기',);
                return (
                  <MenuItem value={value['flr_id'] + '|' + value['flr_type'] + value['floor']}>{value['flr_type'] + value['floor']}</MenuItem>
                );
              })
            }
          </Select>
        </MUFormControl>
      </div>
      <div className="par-spacing">
        <Hosu>
          <Label>호수</Label>

          {/* <SwitchButton>
                  <Switch type="checkbox" id="switch" readonly />
                  <SwitchLabel readonly for="switch" onClick={()=>{setHosu(!hosu)}}>
                      <SwitchSpan/>
                      <SwithTxtOff className="no">없음</SwithTxtOff>
                      <SwithTxtOn className="yes">있음</SwithTxtOn>
                    </SwitchLabel>
                  </SwitchButton> */}


          <FormControlLabel control={<Switch onClick={hosuChange} />} label={hosu ? "있음" : "없음"} />
          {/* <FormControlLabel control={<Switch onClick={() => { setHosu(!hosu) }} />} label={hosu ? "있음" : "없음"} /> */}

          {
            hosu ?
              // <Flex>
              //   <InputMidi type="text" placeholder="호 입력" onChange={ho_namechange} />
              //   <Dan>호</Dan>
              // </Flex>
              <MUTextField_Ho label="호 입력" variant="standard" onChange={ho_namechange}
                InputProps={{ endAdornment: (<InputAdornment position="end">호</InputAdornment>) }} />
              :
              null

          }
        </Hosu>
      </div>

      <div className="par-spacing">
        {/*<Link to="/AddPropertyBasicInfo" className="data_link"/>*/}
        {/* <Next type="button" onClick={async () => {
            //나중에 여기에 단수알고리즘 점검 로직 넣어야함 해당 요청 주소값(도로명,지번매칭주소), floorid에 대한 매물이 코렉스상에 존재하는지 여부 
            //updateModal();

            nextStep();
            history.push('/AddPropertyBasicInfo');
          }}>다음</Next> */}
        <MUButton_Validation variant="contained" type="button" name="" active={ActiveBtn} onClick={async () => {
          //나중에 여기에 단수알고리즘 점검 로직 넣어야함 해당 요청 주소값(도로명,지번매칭주소), floorid에 대한 매물이 코렉스상에 존재하는지 여부 
          //updateModal();

          nextStep();
          history.push('/AddPropertyBasicInfo');
        }}><Link to="/AddPropertyBasicInfo" className="data_link" />다음</MUButton_Validation>
      </div>

      <ModalCommon modalOption={modalOption} />
    </>
  );
}

const MUFormControl = styled(FormControl)`
  &.MuiFormControl-root {
    width:100%;
 }
`
const MUButton = styled(Button)``

const MUTextField = styled(TextField)``

const MUTextField_100 = styled(TextField)`
  &.MuiFormControl-root {
    width:100%;
  }
`

const ButtonAddrSearch = styled(MUButton)`
float:right;
`

//---------------------------------------

const AddressApi = styled.div`
  position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
  width:450px;height:auto;z-index:2;
  border:1px solid #eee;
  background:#fff;
  padding:70px 10px 0;
  @media ${(props) => props.theme.mobile} {
    width:90%;
    padding:calc(100vw*(70/428)) calc(100vw*(10/428)) 0;
    }
`
const CloseImg = styled.img`
  position:Absolute;top:20px;right:10px;
  width:18px;
  cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
    top:calc(100vW*(20/428));right:calc(100vw*(10/428));
    }
`

const WrapBottomBox = styled.div`
  width:100%;
  margin-top:9px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vW*(9/428));
    }
`
const Hosu = styled.div`
  display:flex;
  align-items:baseline;
`
const Label = styled.label``

const MUTextField_Ho = styled(MUTextField)`
  flex-grow:1;
`
const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`

// //★★★★상가, 사무실 중개의뢰 입니다★★★★

// //react
// import React, { useState, useEffect } from 'react';
// import { Link, useHistory } from "react-router-dom";

// //css
// import styled from "styled-components"

// //material-ui
// import { styled as MUstyled } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
// import Switch from '@material-ui/core/Switch';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import DialogContent from '@material-ui/core/DialogContent';
// import InputAdornment from '@mui/material/InputAdornment';

// //img
// import SearchImg from '../../../../img/map/search.png';
// import Close from '../../../../img/main/modal_close.png';
// import ArrowDown from '../../../../img/member/arrow_down.png';
// import { Mobile, PC } from "../../../../MediaQuery"

// //component
// import SearchStoreOfficeApi from './SearchStoreOfficeApi';
// import ModalCommon from '../../../common/modal/ModalCommon';

// //redux addons assettss
// import { useSelector } from 'react-redux';
// import { tempBrokerRequestActions } from '../../../../store/actionCreators';
// import tempBrokerRequest from '../../../../store/modules/tempBrokerRequest';

// //server process
// import serverController from '../../../../server/serverController';

// export default function SearchApartOfficetel({ setActiveIndex, activeIndex }) {
//   const history = useHistory();

//   const [ActiveBtn, setActiveBtn] = useState(false);

//   const [hosu, setHosu] = useState(false);
//   const [addressApi, setAddressApi] = useState(false);

//   const [fail, setFail] = useState(false);

//   const [search_address, setSearch_address] = useState('');
//   const [floor, setFloor] = useState('');
//   const [floorname, setfloorname] = useState('');
//   const [hosilname, sethosilname] = useState('');

//   console.log('searchsoterfoffice물건외부관리 실행요소 display:', tempBrokerRequestActions, activeIndex)
//   const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

//   //도로명 and 지번주소 검색한 관련된 flr_id리스트 여러개 다른 종류의 매물들 층 여러개 나올수있음
//   const [flooridlist, setflooridlist] = useState([]);

//   const [value, setValue] = useState(''); //층 선택 정보

//   //여기 두개가 핵심이에여
//   //모달 끄는 식
//   const offModal = () => {
//     let option = JSON.parse(JSON.stringify(modalOption));
//     option.show = false;
//     setModalOption(option);
//   }

//   //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
//   const updateModal = () => {
//     nextStep();

//     //여기가 모달 키는 거에엽
//     setModalOption({
//       show: true,
//       setShow: offModal,
//       title: "물건 등록",
//       content: { type: "text", text: `해당물건은 전속매물이 아닙니다.\n이미 다른 중개사에게 의뢰되었거나\n거래중인 물건은 시스템에 등록할 수 없습니다.\n상기 사유에 해당하지 않는 경우,\n고객센터로 문의해주세요.`, component: "" },
//       submit: { show: false, title: "확인", event: () => { offModal(); } },
//       cancle: { show: false, title: "취소", event: () => { offModal(); } },
//       confirm: { show: false, title: "확인", event: () => { offModal(); } },
//       confirmgreen: { show: true, title: "확인", link: "/AddPropertyBasicInfo", event: () => { offModal(); } }
//     });
//   }

//   // const floorchange = (e) => { setValue(e.target.value); setFloor(e.target.value.split('|')[0]); setfloorname(e.target.value.split('|')[1]); console.log('floor change층수변경:', e.target.value); }
//   const floorchange = (e) => { 
//     console.log('층 가져오기',e.target.value); 
//     setValue(e.target.value)
//     setfloorname(e.target.value)
//   }



//   const hosilnamechange = (e) => { sethosilname(e.target.value); }

//   const nextStep = async (e) => {
//     console.log('다음단계 클릭 >>>>', floor, floorname, hosilname, search_address);

//     //리덕스 저장한다.
//     tempBrokerRequestActions.hosilnamechange({ hosilnames: '' });//기존것이 있다면.비워놓고한다.

//     tempBrokerRequestActions.floorchange({ floors: floor });
//     tempBrokerRequestActions.floornamechange({ floornames: floorname });
//     tempBrokerRequestActions.hosilnamechange({ hosilnames: hosilname });
//     tempBrokerRequestActions.dangichange({ dangis: '' });
//     tempBrokerRequestActions.dangijibunaddresschange({ dangijibunaddress: flooridlist[0]['addr_jibun'] });
//     tempBrokerRequestActions.dangiroadaddresschange({ dangiroadaddress: flooridlist[0]['addr_road'] });

//     tempBrokerRequestActions.hosilchange({ hosils: '' });
//     tempBrokerRequestActions.dongchange({ dongs: '' });//값을 강제저ㅏㄱ으로 비움 상가사무실케이스떄는 값을 동,호실 여부 지운다.
//     tempBrokerRequestActions.dongnamechange({ dongnames: '' });


//     switch (activeIndex) {
//       case 0:
//         tempBrokerRequestActions.maemultypechange({ maemultypes: '아파트' });
//         break;
//       case 1:
//         tempBrokerRequestActions.maemultypechange({ maemultypes: '오피스텔' });
//         break;
//       case 2:
//         tempBrokerRequestActions.maemultypechange({ maemultypes: '상가' });
//         break;
//       case 3:
//         tempBrokerRequestActions.maemultypechange({ maemultypes: '사무실' });
//         break;
//     }

//     //해당 floorid에 대하ㅑㄴ floor queryt결과 정보 어든ㄴ다.
//     let body_info = {
//       floorid_val: floor
//     };
//     let res_results = await serverController.connectFetchController('/api/matterial/getFloor_xy', 'POST', JSON.stringify(body_info));
//     if (res_results.result) {
//       console.log('res_resulstssss:', res_results);

//       let result_x = res_results.result.x;
//       let result_y = res_results.result.y;

//       tempBrokerRequestActions.xchange({ x_pos: result_x });
//       tempBrokerRequestActions.ychange({ y_pos: result_y });
//     }
//   }


//   let arr_addr = new Array();

//   useEffect(async () => {
//     console.log('search_address값 변경 감지:', search_address);
//     let jibun_address = search_address.jibunaddress_val;
//     let road_address = search_address.roadaddress_val;

//     let body_info = {
//       jibunaddress: jibun_address,
//       roadaddress: road_address
//     };
//     // let res_result = await serverController.connectFetchController('/api/matterial/floorid_search_query', 'POST', JSON.stringify(body_info));
//     let res_result = await serverController.connectFetchController(`/api/floor?sgg_code=${search_address.sgg_code}&dong_code=${search_address.dong_code}&road_code=${search_address.road_code}&addr_jibun=${search_address.addr_jibun}&addr_road=${search_address.addr_road}`, 'GET');
    
//     console.log('층 가져오기 ', res_result);
//     console.log('층 가져오기 ', res_result.data.grd_floor);

//     let arr_addr = new Array();
    
//     let under_addr = new Array();

//     for (let i = 1; i < res_result.data.grd_floor+1; i++) {
//       arr_addr[i] = i;
//     }
//     console.log('층 가져오기', arr_addr);
    
//     setflooridlist(arr_addr)
//     // if (res_result) {
//     //   if (res_result.result) {
//     //     let result_var = res_result.result;
//     //     console.log('reuslt_var::', result_var);

//     //     setflooridlist(result_var);
//     //     //선택층 값은 따로 floorname등으로 하고 총층값 그 나온 건물 상가사무실건물나온것 그 하나의건물관련된 층들이 나오는데 그 건물의 총층은 지상최고층이다.
//     //     var ground_floor_list = [];
//     //     for (let j = 0; j < result_var.length; j++) {
//     //       if (result_var[j].flr_type == '지상') {
//     //         let item = result_var[j]['floor'];
//     //         ground_floor_list.push(item);
//     //       }
//     //     }
//     //     console.log('저장한 모든 리스트 지상층들:', ground_floor_list);
//     //     var max_floor_num_value = Math.max.apply(null, ground_floor_list);//최상층값.
//     //     tempBrokerRequestActions.storeofficebuildingfloorchange({ storeofficebuildingfloor: max_floor_num_value });
//     //   }
//     // }
//   }, [search_address]);


//   const hosuChange = () => {
//     if (hosu == false) {
//       setHosu(!hosu)
//     } else {
//       sethosilname('')
//       setHosu(!hosu)
//     }
//   }


//   //유효성 검사
//   useEffect(() => {

//     if (hosu == false) {

//       !!floorname ? setActiveBtn(true) : setActiveBtn(false)

//     } else {

//       !!floorname && !!hosu && !!hosilname ? setActiveBtn(true) : setActiveBtn(false)
//     }
//   }, [value, hosu, hosilname])


//   return (
//     <>
//       <div className="par-spacing">
//         {/* <Label>물건 소재지</Label> */}
//         {/* <SearchBox onClick={() => setAddressApi(true)}>
//           <Search type="search" placeholder="물건 소재지 주소 검색" />
//           <SearchBtn type="button" />
//         </SearchBox> */}
//         <div className="clearfix">
//           {/* <InputTitle>주소</InputTitle> */}
//           <ButtonAddrSearch variant="contained" disableElevation onClick={() => {
//             setAddressApi(true);
//           }}>주소 검색</ButtonAddrSearch>
//         </div>
//         {
//           addressApi ?

//             <Dialog
//               open={addressApi}
//             >
//               <DialogTitle>
//                 <CloseImg src={Close} onClick={() => setAddressApi(false)} />
//               </DialogTitle>

//               <DialogContent>
//                 <SearchStoreOfficeApi setSearch_address={setSearch_address} setAddressApi={setAddressApi} />
//               </DialogContent>
//             </Dialog>


//             // <AddressApi>
//             //   <CloseImg src={Close} onClick={() => setAddressApi(false)}/>
//             //   <SearchStoreOfficeApi setSearch_address={setSearch_address} setAddressApi={setAddressApi}/>
//             // </AddressApi>


//             :
//             null
//         }
//         {/*주소 검색 후에 나오는 부분*/}

//         {/* <SearchBox>
//             <Search type="search" value={search_address.jibunaddress_val && search_address.roadaddress_val ? search_address.jibunaddress_val + '|' + search_address.roadaddress_val : ''} />
//             <SearchBtn type="button" />
//           </SearchBox> */}
//         {console.log('1번째 확인  ', search_address)}
//         {console.log('2번째 확인  ', search_address.roadaddress_val)}
//         {console.log('3번째 확인  ', search_address.jibunaddress_val)}

//         <div className="par-spacing">
//           <MUTextField_100 variant="standard" disabled type="text" placeholder="도로명 주소" value={search_address.addr_jibun} />
//         </div>
//         <div className="par-spacing">
//           <MUTextField_100 variant="standard" disabled type="text" placeholder="지번 주소" value={search_address.addr_road} />
//         </div>
//       </div>
//       {/* <SelectFloor onChange={floorchange}>
//                   <Option>층 선택</Option>
//                   {
//                     flooridlist.map((value) => {
//                       return (
//                         <Option value={value['flr_id']+'|'+value['flr_type']+value['floor']}>{value['flr_type']+value['floor']}</Option>
//                       );
//                     })
//                   }
//                 </SelectFloor> */}

//       <div className="par-spacing">
//         <MUFormControl variant="standard">
//           <InputLabel>층 선택</InputLabel>
//           <Select
//             onChange={floorchange}
//             value={value}
//           >
//             {/* <MenuItem selected value={"층 선택"}>층 선택</MenuItem> */}
//             {
//               flooridlist.map((value, index) => {
//                 console.log('층 가져오기',value);
//                 return (
//                   // <MenuItem value={value['flr_id'] + '|' + value['flr_type'] + value['floor']}>{value['flr_type'] + value['floor']}</MenuItem>
//                   <MenuItem value={value}>{value}층</MenuItem>
//                 );
//               })
//             }
//           </Select>
//         </MUFormControl>
//       </div>
//       <div className="par-spacing">
//         <Hosu>
//           <Label>호수</Label>

//           {/* <SwitchButton>
//                   <Switch type="checkbox" id="switch" readonly />
//                   <SwitchLabel readonly for="switch" onClick={()=>{setHosu(!hosu)}}>
//                       <SwitchSpan/>
//                       <SwithTxtOff className="no">없음</SwithTxtOff>
//                       <SwithTxtOn className="yes">있음</SwithTxtOn>
//                     </SwitchLabel>
//                   </SwitchButton> */}


//           <FormControlLabel control={<Switch onClick={hosuChange} />} label={hosu ? "있음" : "없음"} />
//           {/* <FormControlLabel control={<Switch onClick={() => { setHosu(!hosu) }} />} label={hosu ? "있음" : "없음"} /> */}

//           {
//             hosu ?
//               // <Flex>
//               //   <InputMidi type="text" placeholder="호 입력" onChange={hosilnamechange} />
//               //   <Dan>호</Dan>
//               // </Flex>
//               <MUTextField_Ho label="호 입력" variant="standard" onChange={hosilnamechange}
//                 InputProps={{ endAdornment: (<InputAdornment position="end">호</InputAdornment>) }} />
//               :
//               null

//           }
//         </Hosu>
//       </div>

//       <div className="par-spacing">
//         {/*<Link to="/AddPropertyBasicInfo" className="data_link"/>*/}
//         {/* <Next type="button" onClick={async () => {
//             //나중에 여기에 단수알고리즘 점검 로직 넣어야함 해당 요청 주소값(도로명,지번매칭주소), floorid에 대한 매물이 코렉스상에 존재하는지 여부 
//             //updateModal();
//             nextStep();
//             history.push('/AddPropertyBasicInfo');
//           }}>다음</Next> */}
//         <MUButton_Validation variant="contained" type="button" name="" active={ActiveBtn} onClick={async () => {
//           //나중에 여기에 단수알고리즘 점검 로직 넣어야함 해당 요청 주소값(도로명,지번매칭주소), floorid에 대한 매물이 코렉스상에 존재하는지 여부 
//           //updateModal();

//           // nextStep();
//           // history.push('/AddPropertyBasicInfo');
//         }}><Link to="/AddPropertyBasicInfo" className="data_link" />다음</MUButton_Validation>
//       </div>

//       <ModalCommon modalOption={modalOption} />
//     </>
//   );
// }

// const MUFormControl = styled(FormControl)`
//   &.MuiFormControl-root {
//     width:100%;
//  }
// `
// const MUButton = styled(Button)``

// const MUTextField = styled(TextField)``

// const MUTextField_100 = styled(TextField)`
//   &.MuiFormControl-root {
//     width:100%;
//   }
// `

// const ButtonAddrSearch = styled(MUButton)`
// float:right;
// `

// //---------------------------------------

// const AddressApi = styled.div`
//   position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
//   width:450px;height:auto;z-index:2;
//   border:1px solid #eee;
//   background:#fff;
//   padding:70px 10px 0;
//   @media ${(props) => props.theme.mobile} {
//     width:90%;
//     padding:calc(100vw*(70/428)) calc(100vw*(10/428)) 0;
//     }
// `
// const CloseImg = styled.img`
//   position:Absolute;top:20px;right:10px;
//   width:18px;
//   cursor:pointer;
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(18/428));
//     top:calc(100vW*(20/428));right:calc(100vw*(10/428));
//     }
// `

// const WrapBottomBox = styled.div`
//   width:100%;
//   margin-top:9px;
//   @media ${(props) => props.theme.mobile} {
//     margin-top:calc(100vW*(9/428));
//     }
// `
// const Hosu = styled.div`
//   display:flex;
//   align-items:baseline;
// `
// const Label = styled.label``

// const MUTextField_Ho = styled(MUTextField)`
//   flex-grow:1;
// `
// const MUButton_Validation = MUstyled(MUButton)`
//   &.MuiButtonBase-root.MuiButton-root{
//     background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
//     color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
//     box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
//     width:100%;
//   }
// `