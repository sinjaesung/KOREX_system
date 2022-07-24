//★★★★아파트, 오피스텔 중개의뢰 입니다★★★★

//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"
import { Mobile, PC } from "../../../../MediaQuery"

//material-ui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { styled as MUstyled } from '@material-ui/core/styles';

//img
import SearchImg from '../../../../img/map/search.png';
import WhiteClose from '../../../../img/member/white_close.png';
import SelectArrow from '../../../../img/member/arrow_down.png';

//component
import ModalCommon from '../../../common/modal/ModalCommon';

//redux addon assestess
import { useSelector } from 'react-redux';
import { tempBrokerRequestActions, temp_SelectComplexinfo } from '../../../../store/actionCreators';

//server process
import serverController from '../../../../server/serverController';

export default function SearchApartOfficetelInfo({ setActiveIndex, activeIndex, setSelectInfo, setoverdos}) {
  const history = useHistory();
  console.log('searchApratofficetleselectinfo요소(외부수임물건관리) 실행요소:', tempBrokerRequestActions);

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  //임시 저장된 단지정보 complex정보 조회저장.

  const temp_selectComplexinfo = useSelector(data => data.temp_selectComplexinfo);
  console.log('==>>>temp_selectcomplexinfo:::', temp_selectComplexinfo);
  console.log('==>>>temp_selectcomplexinfo:::', temp_selectComplexinfo.complexname);

  const [active, setActive] = useState(false);

  const [Hosildata, setHosildata] = useState('')

  const [hosil_list, sethosil_list] = useState([])

  const [ho_id, setho_id] = useState('')

  const [dong, setDong] = useState('');
  const [floor, setFloor] = useState('');
  const [hosil, setHosil] = useState('');
  const [dongname, setDongname] = useState('');
  const [floorname, setFloorname] = useState('');
  const [hosilname, sethosilname] = useState('');

  const [supply_area, setsupply_area] = useState('')
  const [exclusive_area, setexclusive_area] = useState('')
  
  /*모달*/
  const [modalDanji, setModalDanji] = useState(false);
  const [userinfo, setUserinfo] = useState(false);

  const [value, setvalue] = useState('');
  const [value2, setvalue2] = useState('');
  const [value3, setvalue3] = useState('');

  //선택한 단지(오피,아파트) 매치되은 관련된 동,층,호실 정보들 조회저장
  const [donglist, setdonglist] = useState([]);
  const [floorlist, setfloorlist] = useState([]);
  const [hosillist, sethosillist] = useState([]);


  const [hoNum, sethoNum] = useState('')
  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const updateModal = () => {
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

  const [hoselect, sethoselect] = useState(false);

  const dongchange = async (e) => {
    console.log('여기를 확인하기 .. ', e.target.value);
    console.log('여기를 확인하기 bld.id.. ', e.target.value.split(',')[0]);
    console.log('여기를 확인하기 동.. ', e.target.value.split(',')[1]);
    setvalue(e.target.value);
    setDong(e.target.value.split(',')[0]); //bld.id
    setDongname(e.target.value.split(',')[1]);//동 정보
    //해당 선택 동bld_id에 해당ㅎ는 floor리슽ㅇ ㅡ조회 및 처리

    let body_info = {
      bld_id: e.target.value.split(',')[0]
    }
    let floor_list = await serverController.connectFetchController('/api/matterial/complexdetail_match_floorSearch', 'POST', JSON.stringify(body_info));


    if (floor_list) {
      console.log('floor list lsss:', floor_list);

      if (floor_list.result) {
        setfloorlist(floor_list.result);
        sethoselect(true);
      }
    }
  }

  const floorchange = async (e) => {
    setvalue2(e.target.value);
    setFloor(e.target.value.split(',')[0]); setFloorname(e.target.value.split(',')[1]);

    //해당 선택 층flrid에 대항하앟하는 hoinbfo리스트 조회 및 처리
    let body_info = {
      flr_id: e.target.value.split(',')[0]
    }
    let hosil_list = await serverController.connectFetchController('/api/matterial/complexdetail_match_hosilSearch', 'POST', JSON.stringify(body_info));
    if (hosil_list) {
      console.log('hosil lis lsistss:', hosil_list);

      if (hosil_list.result) {
        sethosillist(hosil_list.result);
      }
    }
  }
  // const hosilchange = (e) => { setvalue3(e.target.value); setHosil(e.target.value.split(',')[0]); sethosilname(e.target.value.split(',')[1]);}//선택한 ho_info ho_id저장.
  const hosilchange = (e) => { setvalue3(e.target.value); setHosil(e.target.value.split(',')[0]); sethosilname(e.target.value.split(',')[1]); };//선택한 ho_info ho_id저장.


  const hoSearch = async (e) => {
    console.log('동작555', e.target.value);
    // console.log('동작',e.target.value);
    // const regex = /^[0-9\b -]{0,13}$/;
    // // console.log('정규식',regex);
    // if (regex.test(e.target.value)) {
    //   setinputNum2(e.target.value);
    // }
    

    let Search_hosil = await serverController.connectFetchController(`/api/complexes/${temp_selectComplexinfo.complexid}/buildings/${dong}/ho?ho_name=${e.target.value}`, 'GET');

    sethosil_list(Search_hosil.data);

    console.log('동작256', Search_hosil.data);

  }



  useEffect(() => {
    console.log('확인하기123555', temp_selectComplexinfo);
    sethosil_list([]);
    setDongname('');
    setHosil('');
    setFloor('');
    setinputNum('')
  }, [temp_selectComplexinfo.complexname])


  useEffect(async () => {
    console.log('확인하기12344', temp_selectComplexinfo);
    console.log('확인하기12344', temp_selectComplexinfo.complexid);
    let body_info = {
      complexid: temp_selectComplexinfo.complexid,
      bldpk: temp_SelectComplexinfo.bldpk
    };
    // var res_result = await serverController.connectFetchController('/api/matterial/complexdetail_match_dongSearch','POST',JSON.stringify(body_info));

    var res_result = await serverController.connectFetchController(`/api/complexes/${temp_selectComplexinfo.complexid}/buildings`, 'GET');

    console.log('확인하기12344', res_result);
    console.log('확인하기12344', res_result.data);


    if (res_result) {

      // if(res_result.result && res_result.result.length >=1){
      if (res_result.data && res_result.data.length >= 1) {
        // setdonglist(res_result.result);
        setdonglist(res_result.data);
      } else {
        // alert('해당선택단지에 소속된 동 정보가 없습니다.');
      }
    }
  }, [temp_selectComplexinfo.complexid]);

  useEffect(() => {
    console.log('donglist,fllorlist,hosilist변할시마다:', donglist, floorlist, hosillist);
  }, [donglist, floorlist, hosillist]);


  useEffect(() => {
    if (!value || !hosil || !floor) {
      setActive(false)
      console.log('동작555')
    } else {
      setActive(true)
      console.log('동작555', temp_selectComplexinfo)
      console.log('동작555', dongname)

    }

  }, [dongname, hosil, floor]);


  useEffect(() => {
    sethoselect(false);
    setfloorselect(false)
  }, [donglist])

  //동을 변화하면 하부의층도 같이 불러오고, 층을 변화하면 하부의 호들도 불러온다!!! 처음엔 해당 단지의 동만 불러옴!!!

  const [floorselect, setfloorselect] = useState(false);
  const [floorinsertcheck, setfloorinsertcheck] = useState(false);

  const [inputNum, setinputNum] = useState('')
  const [inputNum2, setinputNum2] = useState('')

  const floorinsert = (e)=>{
    const regex = /^[0-9\b -]{0,13}$/;
    // console.log('정규식',regex);
    if (regex.test(e.target.value)) {
      setinputNum(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
    }

    console.log('85264',e.target.value);
    console.log('85264', e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
    console.log('85264', regex.test(e.target.value));
    setFloor(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
  }

  const hoOption =(v)=>{
    console.log('호 옵션',v);
                      console.log('동작123', v);
                    // selected = true; 
                    setHosil(v.ho_name); 
                    setFloor(v.floor); 
                    setFloorname(v.flr_type);
                    setho_id(v.ho_id); 
                    setfloorselect(true); 
                    setsupply_area(v.supply_area !== '' ? v.supply_area : ''); 
                    setexclusive_area(v.exclusive_area !== '' ? v.exclusive_area : ''); 
                    setfloorinsertcheck(v.floor == 0 ? true : false)
  }

  return (
    <>
      <br />
      <div className="par-spacing">
        <FormControl fullWidth variant="standard">
          <InputLabel id="demo-simple-select-label">동 선택</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            label="동 선택"
            onChange={dongchange}
          >
            {/* <MenuItem selected style={{ color: "#979797" }}>동 선택</MenuItem > */}
            {
              donglist.map((value, index) => {
                console.log('donglist::', value);
                if(!value.dong_name){

                  return (
                    <MenuItem value={value['bld_id'] + ',' + value['dong_name']}>{value['bld_pk']}(표제부 동명 확인불가) </MenuItem >
                    )
                  }else{
                    
                    return (
                      <MenuItem value={value['bld_id'] + ',' + value['dong_name']}>{value['dong_name']}</MenuItem >
                      )
                  }
              })
            }
          </Select>
        </FormControl>
      </div>

      {hoselect == true ? 
      //  호수 검색
        <div className="par-spacing">
          <Autocomplete
            freeSolo
            id="country-select-demo"
            options={hosil_list}
            autoHighlight
            onChange={(e, v) => { hoOption(v) }}
            onClose={() => { console.log('닫기 버튼'); }}
            getOptionLabel={(option) => option.ho_name}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Listyle component="li" sx={{}} {...props} 
                // onClick={(e) => { 
                //   console.log('동작123', option);
                //     selected = true; 
                //     setHosil(option.ho_name); 
                //     setFloor(option.floor); 
                //     setFloorname(option.flr_type);
                //     setho_id(option.ho_id); 
                //     setfloorselect(true); 
                //     setsupply_area(option.supply_area !== '' ? option.supply_area : ''); 
                //     setexclusive_area(option.exclusive_area !== '' ? option.exclusive_area : ''); 
                //     setfloorinsertcheck(option.floor == 0 ? true : false) 
                //     }}
                    >
                  <ResultAddress>{option.ho_name}</ResultAddress>
                </Listyle>
              </li>
            )}

            renderInput={(params) => (
              <MUTextField
                {...params}
                // value={temp_selectComplexinfo.complexname}
                variant="standard"
                label="호수 검색"
                placeholder="호수 입력"
                helperText="숫자만 입력 ex)101호 -> 101"
                onChange={hoSearch}
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                  //autoComplete: 'new-password', // disable autocomplete and autofill
                  startAdornment:
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>,
                }}
              />
            )}
          />
        </div>

        :
        null
    }
     
      {floorselect == true ? 
        !!floorinsertcheck ?
        <div className="par-spacing">
            <MUTextField_100 value={inputNum} variant="standard" id="outlined-basic" label="층수" onChange={floorinsert} placeholder={'층을 입력해주세요'} helperText={'숫자만 입력해주세요 ex)2층 -> 2'} Autocomplete='off' />
        </div>
         
        :
        <div className="par-spacing">
          <MUTextField_100 variant="standard" id="outlined-basic" label="층수" value={!floor ? floor : `${floorname}` === '지상' ? `${floor}층` : `${Hosildata.flr_type}${floor}층`} Autocomplete='off' />
        </div>

        
    :
    null
    }
 

    
      <div className="par-spacing mt-3">
        <MUButton_Validation variant="contained" active={active} onClick={async () => {
          var res_result = await serverController.connectFetchController(`/api/products/check/exclusive?category=${temp_selectComplexinfo.bldtype}&bld_id=${dong}&ho_id=${ho_id}`, 'GET');

          console.log('동작256',res_result);
          console.log('동작256', temp_selectComplexinfo.bldtype);
          console.log('동작256', dong);
          console.log('동작256', ho_id);

          if (res_result.data == true) {
            alert('등록불가합니다 이미 중개의뢰된 물건입니다.\n상기 사유에 해당하지 않는 경우.\n 고객센터로 문의해주세요')
            // history.push('/PropertyManagement')
            sethosil_list([]);
            setDongname('');
            setHosil('');
            setFloor('');
            setSelectInfo(false)
            setoverdos(true)
          } else {

            console.log('미등록된 물건 ---> 다음 동작 실행');
            // 리덕스 정보 저장 state정보 ->리덕스 저장(동,층,호실 단지명,단지주소등 저장)
           

            if (active == true) {
              tempBrokerRequestActions.dongchange({ dongs: dong });
              tempBrokerRequestActions.floorchange({ floors: floor });
              tempBrokerRequestActions.hosilchange({ hosils: hosil });
              tempBrokerRequestActions.dong_namechange({ dong_names: dongname });
              tempBrokerRequestActions.floornamechange({ floornames: floorname });
              tempBrokerRequestActions.ho_namechange({ ho_names: ho_id });

              tempBrokerRequestActions.dangichange({ dangis: temp_selectComplexinfo.complexname });
              tempBrokerRequestActions.dangijibunaddresschange({ dangijibunaddress: temp_selectComplexinfo.addrjibun });
              tempBrokerRequestActions.dangiroadaddresschange({ dangiroadaddress: temp_selectComplexinfo.addrroad });
              tempBrokerRequestActions.xchange({ x_pos: temp_selectComplexinfo.x });
              tempBrokerRequestActions.ychange({ y_pos: temp_selectComplexinfo.y });
              tempBrokerRequestActions.requesttypechange({ request_type: '외부수임' });  // 수정할것
              tempBrokerRequestActions.supplydimensionchange({ supplydimensions: supply_area });  
              tempBrokerRequestActions.jeonyongdimensionchange({ jeonyongdimensions: exclusive_area });

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

              history.push('/AddPropertyBasicInfo');

            } else {
              alert('미입력된 보기가 있습니다.')
            }
          }
        }}>조회</MUButton_Validation>
      </div>

      {/*조회 실패했을때 모달창*/}
      <ModalCommon modalOption={modalOption} />
    </>
  );
}


const Listyle = styled.div`
  width: 100%;
`

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
//---------------------------------------

const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`

const ResultAddress = styled.p`
  font-size:15px;font-weight:500;
  transform:skew(-0.1deg);
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`