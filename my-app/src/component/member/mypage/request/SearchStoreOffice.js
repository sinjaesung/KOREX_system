//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
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
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@mui/material/InputAdornment'
//css
import styled from "styled-components"

import ModalCommon from '../../../common/modal/ModalCommon'

//img

import SearchImg from '../../../../img/map/search.png';
import Close from '../../../../img/main/modal_close.png';

import { Mobile, PC } from "../../../../MediaQuery"

//component
import SearchStoreOfficeApi from './SearchStoreOfficeApi';

//redux addons asseets
import { useSelector } from 'react-redux';
import { tempBrokerRequestActions } from '../../../../store/actionCreators';

//server request
import serverController from '../../../../server/serverController';

export default function SearchApartOfficetel({ setActiveIndex, activeIndex }) {

  const history = useHistory();

  const [hosu, setHosu] = useState(false);
  const [addressApi, setAddressApi] = useState(false);

  //사용자 입력데이터.
  // const [search_address, setSearch_address] = useState({});//검색api에 의한 액션에 의해서만 처리되는것(사용자 직접 능동입력형태x)
  const [search_address, setSearch_address] = useState({});//검색api에 의한 액션에 의해서만 처리되는것(사용자 직접 능동입력형태x)
  const [floor, setFloor] = useState('');//선택한 제공 floorid값 ..
  const [floorname, setfloorname] = useState('');
  const [ho_name, setho_name] = useState('');//선택x이 아니고 입력 직접입력한 있거나 없거나 한 호값..(상가,사무실의 경우 flr_id만 있어도 된다고함.)

  //도로명 and 지번주소 검색한 관련된 flr_id매물리스트 여러개 다른종류의 다른건물의 매물들 층이 나올수있음?일단 도로명주소까지 풀로 다 검색시에는 거의 웬만해선 한 종류의 건물종류가 나오게됨(그 건물의 층flr_id들 리스트)

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  const [value, setValue] = useState('');

  const [flooridlist, setflooridlist] = useState([]);

  console.log('searchStoreoffice요소 실행요소 dispay:', tempBrokerRequestActions, activeIndex);

  const floorchange = (e) => { 
    setValue(e.target.value); 
    setFloor(e.target.value.split('|')[0]); 
    setfloorname(e.target.value.split('|')[1]);
   }
  const ho_namechange = (e) => { setho_name(e.target.value); }

  const nextStep = async (e) => {
    console.log('다음단계 클릭>>>>', floor, floorname, ho_name, search_address['alldata'], search_address['alldata']['bname']);//소재지 주소값,층수,호실값 확인

    //리덕스 저장한다.
    tempBrokerRequestActions.ho_namechange({ ho_names: '' });

    tempBrokerRequestActions.floorchange({ floors: floor });
    tempBrokerRequestActions.floornamechange({ floornames: floorname });
    tempBrokerRequestActions.ho_namechange({ ho_names: ho_name });
    tempBrokerRequestActions.dangijibunaddresschange({ dangijibunaddress: flooridlist[0] && flooridlist[0]['addr_jibun'] });//검색한 floor정보해당 나온 임의건물에 있는 모든 층들정보는 모두 같은 법정도,도로명주소갖고있음. 해당 특정 읍면동 지번주소,도로명 주소에 관련된 도로명주소 매칭 리스트->, 지번주소매칭리스트관련된 각 리스트들이 floor건물의 지번,도로명주소값에 해당하는 값을 저장.그리고 이러한 주소에 해당하는 전문중개사리스트 조회.
    tempBrokerRequestActions.dangiroadaddresschange({ dangiroadaddress: flooridlist[0] && flooridlist[0]['addr_road'] });
    tempBrokerRequestActions.jibunsimplechange({ jibunsimple: search_address['alldata'] && search_address['alldata'].bname });//검색했었던 상가사무실 주소api검색했던 법정동 읍면동 단위의 레벨값 만을 저장하여 그것 기준으로의 부합하는 읍면동레벨의 전문중개사 조회하기위함.

    //상가사무실의 경우 기존 리덕스 있던 호id정보,동id정보 없앤다.
    tempBrokerRequestActions.dongchange({ dongs: '' });
    tempBrokerRequestActions.hosilchange({ hosils: '' });
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

    //해당 floor id에 대한 floor query결과 정보를 얻는다. 
    let body_info = {
      floorid_val: floor
    };
    let res_results = await serverController.connectFetchController('/api/matterial/getFloor_xy', 'POST', JSON.stringify(body_info));
    if (res_results.result) {
      console.log('res_resultssss:::', res_results);

      let result_x = res_results.result.x;
      let result_y = res_results.result.y; //얻어낸 그 특정 도로명 주소 flrid에 대한 x,y경도 위도 값.

      tempBrokerRequestActions.xchange({ x_pos: result_x });
      tempBrokerRequestActions.ychange({ y_pos: result_y });//해당 추가하려는 매물에 대하여 x,y pos추가. 해당 flrid매물은 이제 x,y pos도 저장가능.
    }
  };

  useEffect(async () => {
    console.log('search_address값 변경감지:', search_address);
    let jibun_address = search_address['jibunaddress'];
    let road_address = search_address['roadaddress'];

    let body_info = {
      jibunaddress: jibun_address,
      roadaddress: road_address
    };
    let res_result = await serverController.connectFetchController('/api/matterial/floorid_search_query', 'POST', JSON.stringify(body_info));
    if (res_result) {
      if (res_result.result) {
        let result_var = res_result.result;

        console.log('result_var::', result_var);

        setflooridlist(result_var);

        //선택층값은 따로 floorname등으로 하고 총층값 나온 건물 상가삼쉴건물 나온것 하나에 관련된 층들
        var ground_floor_list = [];
        for (let j = 0; j < result_var.length; j++) {
          if (result_var[j].flr_type == '지상') {
            let item = result_var[j]['floor'];
            ground_floor_list.push(item);
          }
        }
        console.log('저장한 모든 리스트 지상층들:::', ground_floor_list);
        var max_floor_num_value = Math.max.apply(null, ground_floor_list);//최상층 값.
        tempBrokerRequestActions.storeofficebuildingfloorchange({ storeofficebuildingfloor: max_floor_num_value });
      }
    }
  }, [search_address]);//searchstoreoffcieapi에서 의해서 변하는 state값에 대해 감지하며, 도로명(지번)주소값 변경시마다 비동기 검색할수있도록 한다. 해당 주소에 대해서 검색한다.


  return (
    <>
      <div className="par-spacing">
        <div className="clearfix">
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
            :
            null
        }
        {
          search_address && search_address['alldata'] ?
            <div>
              <div className="par-spacing">
                <MUTextField_100 variant="standard" disabled type="text" placeholder="도로명 주소" value={search_address['alldata'].roadAddress} />
              </div>
              <div className="par-spacing">
                <MUTextField_100 variant="standard" disabled type="text" placeholder="지번 주소" value={search_address['alldata'].jibunAddress} />
              </div>
            </div>
            :
            <div>
              <div className="par-spacing">
                <MUTextField_100 variant="standard" disabled type="text" placeholder="도로명 주소" value={''} />
              </div>
              <div className="par-spacing">
                <MUTextField_100 variant="standard" disabled type="text" placeholder="지번 주소" value={''} />
              </div>
            </div>
        }

      </div>
      <div className="par-spacing">
        <MUFormControl variant="standard">
          <InputLabel>층 선택</InputLabel>
          <Select
            onChange={floorchange}
            value={value}
          >
            <MenuItem selected value={"층 선택"}>층 선택</MenuItem>
            {
              flooridlist.map((value) => {
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
              </SwitchButton> 
            */}

          <FormControlLabel control={<Switch onClick={() => { setHosu(!hosu) }} />} label={hosu ? "있음" : "없음"} />

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
        <MUButton_Validation variant="contained" type="button" name="" active={""} onClick={async () => {
          //나중에 여기에 단수알고리즘 점검 로직 넣어야함 해당 요청 주소값(도로명,지번매칭주소), floorid에 대한 매물이 코렉스상에 존재하는지 여부 
          //updateModal();

          nextStep();
          history.push('/AddRequestBroker');
        }}><Link to="/AddRequestBroker" className="data_link" />다음</MUButton_Validation>
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
const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`

const ButtonAddrSearch = styled(MUButton)`
float:right;
`

const MUTextField_Ho = styled(MUTextField)`
  flex-grow:1;
`


const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = styled.div`
  width:408px;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:100%;
  }
`
const WrapSearch = styled.div`
  width:100%;
  margin-top:35px;
  @media ${(props) => props.theme.mobile} {
      margin-top:calc(100vw*(35/428));
    }
`
const Box = styled.div`
  width:100%;
`
const AddressApi = styled.div`
  position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
  width:450px;height:auto;z-index:2;
  border:1px solid #eee;
  background:#fff;
  padding:70px 10px 0;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(380/428));
      padding:calc(100vw*(60/428)) 0 0;
    }
`
const CloseImg = styled.img`
  position:Absolute;top:20px;right:10px;
  width:18px;
  cursor:pointer;
  @media ${(props) => props.theme.mobile} {
      top:calc(100vw*(20/428));
      right:calc(100vw*(10/428));
      width:calc(100vw*(18/428));
    }
`

const WrapBottomBox = styled.div`
  width:100%;
  margin-top:9px;
  @media ${(props) => props.theme.mobile} {
      margin-top:calc(100vw*(10/428));
    }
`
const SelectFloor = styled.select`
  margin-top:9px;
  width:125px;height:43px;
  border-radius:4px;
  border:1px solid #e4e4e4;
  font-size:15px;color:#707070;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(125/428));
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(15/428));
    }
`
const Option = styled.option`
`
const Hosu = styled.div`
  width:100%;
  margin-top:14px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(14/428));
  }
`
const Label = styled.label`
  /* display:block;
  font-size:12px;transform:skew(-0.1deg);
  font-weight:600;
  margin-bottom:10px;color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(10/428));
  } */
`
const SearchBox = styled.div`
  position:relative;
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  height:43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(43/428));
  }
`
const Search = styled.input`
  display:inline-block;
  width:100%;
  height:100%;
  text-align:center;
  font-size:15px;transform:skew(-0.1deg);
  font-weight:600;
  color:#4a4a4a;background:transparent;
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const SearchBtn = styled.button`
  position:absolute;right:0;top:50%;transform:translateY(-50%);
  width:43px;height:43px;
  background:url(${SearchImg}) no-repeat center center;
  background-size:19px 18px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(43/428));
    height:calc(100vw*(43/428));
    background-size:calc(100vw*(19/428)) calc(100vw*(18/428));
  }
`
const SwitchButton = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin-top:20px;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(20/428));
    margin-bottom:calc(100vw*(20/428));
  }
`
// const Switch = styled.input`
//   display:none;
//   &:checked+label{background:#009053}
//   &:checked+label span{left:22px;}
//   &:checked+label .no{opacity:0;}
//   &:checked+label .yes{opacity:1;}
//   @media ${(props) => props.theme.mobile} {
//     &:checked+label span{left:calc(100vw*(24/428));}
//   }
// `
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
const Flex = styled.div`
  width:125px;height:43px;
  border:1px solid #e4e4e4;border-radius:4px;
  display:flex;justify-content:center;align-items:center;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const InputMidi = styled.input`
  width:70%;
  height:100%;
  background:none;
  font-size:15px;color:#4a4a4a;
  text-align:center;
  font-weight:600;transform:skew(-0.1deg);
  &::placeholder{font-weight:500;color:#979797;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Dan = styled.p`
font-size:15px;color:#4a4a4a;
font-weight:600;transform:skew(-0.1deg);
@media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const NextButton = styled.div`
  width:100%;
  margin-top:70px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(60/428));
  }
`
const Next = styled.button`
  width:100%;
  height:66px;
  line-height:60px;
  font-size:20px;font-weight:800;color:#fff;
  border-radius: 11px;
  border: solid 3px #e4e4e4;
  background-color: #979797;
  border-radius: 11px;
  text-align:center;
  /*액티브 됐을 때*/
  /*
  border: solid 3px #04966d;
  background-color: #01684b;
  */
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(20/428));
    
  }
`