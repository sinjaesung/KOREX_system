//★★★★아파트, 오피스텔 중개의뢰 입니다★★★★

//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

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
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import { styled as MUstyled } from '@mui/material/styles';

//img
import SearchImg from '../../../../img/map/search.png';
import WhiteClose from '../../../../img/member/white_close.png';
import SelectArrow from '../../../../img/member/arrow_down.png';

//redux addon sassetss.
import {useSelector } from 'react-redux';
import {tempBrokerRequestActions } from '../../../../store/actionCreators';

//server process
import serverController from '../../../../server/serverController';

export default function SearchApartOfficetel({setActiveIndex, activeIndex}) {

  console.log('searchApartofficeselectinfo요소 실행 요소 display:',tempBrokerRequestActions,activeIndex);

  const [active,setActive] = useState(false);
  
  const [dong,setDong] = useState('');
  const [floor,setFloor] = useState('');
  const [hosil,setHosil] = useState('');
  const [dong_name,setDongname] = useState('');
  const [floorname, setfloorname] = useState('');
  const [ho_name, setho_name] = useState('');

  /*모달*/
  const [modalDanji,setModalDanji] = useState(false);
  
  const dongchange =  async (e) => { 
    setvalue(e.target.value);
    setDong(e.target.value.split&&e.target.value.split(',')[0]); setDongname(e.target.value.split&&e.target.value.split(',')[1]);

    //해당 선택동 bld_id에 해당하는 floor리스트 조회 및 처리.
    let body_info ={
      bld_id : e.target.value.split(',')[0]
    }
    let floor_list = await serverController.connectFetchController('/api/matterial/complexdetail_match_floorSearch','POST',JSON.stringify(body_info));
    if(floor_list){
      console.log('floorl listlissss;;',floor_list);

      if(floor_list.result){
        setfloorlist(floor_list.result);
      }
    }
  } //선택한 건물bld_id정보(동정보)저장.

  const floorchange = async (e) => {
    setvalue2(e.target.value);
    setFloor(e.target.value.split&&e.target.value.split(',')[0]); setfloorname(e.target.value.split&&e.target.value.split(',')[1])
    
    //해당 선택 층flr_id에 해당하는 hoinfo리스트 조회 및 처리
    let body_info = {
      flr_id : e.target.value.split(',')[0]
    }
    let hosil_list= await serverController.connectFetchController('/api/matterial/complexdetail_match_hosilSearch','POST',JSON.stringify(body_info));
    if(hosil_list){
      console.log('hosil lis lisisit:',hosil_list);

      if(hosil_list.result){
        sethosillist(hosil_list.result);
      }
    }
  }  //선택한 층 정보flr_id저장
  const hosilchange = (e) => { setvalue3(e.target.value); setHosil(e.target.value.split&&e.target.value.split(',')[0]); setho_name(e.target.value.split&&e.target.value.split(',')[1])}  //선택한 ho_info ho_id저장
  
  //선택한 단지(오피,아파트)와 매칭되는 관련되는 buidlings(동),floor(층),hosil(호실) 정보들 조회저장.
  const [donglist,setdonglist] = useState([]);
  const [floorlist,setfloorlist] = useState([]);
  const [hosillist,sethosillist] = useState([]);

  //임시저장된 단지정보 complex정보 조회저장.
  const temp_selectComplexinfo = useSelector(data => data.temp_selectComplexinfo);
  console.log('=>>>temp_selecdtComplexinfo::',temp_selectComplexinfo);

  /*useEffect( async () => {
    
    let body_info ={
      complexid: temp_selectComplexinfo.complexid,
      bldpk : temp_selectComplexinfo.bldpk
    };
    var res_result=await serverController.connectFetchController('/api/matterial/complexdetail_join_search','POST',JSON.stringify(body_info));
    if(res_result){
      console.log('res_result::',res_result);

      if(res_result.result[0]){
        setdonglist(res_result.result[0])
      }
      if(res_result.result[1]){
        setfloorlist(res_result.result[1]);
      }
      if(res_result.result[2]){
        sethosillist(res_result.result[2]);
      }
    }
  },[]);*/
  // useEffect( async () => {
  //   let body_info ={
  //     complexid :temp_selectComplexinfo.complexid,
  //     bldpk : temp_selectComplexinfo.bldpk
  //   };
  //   var res_result = await serverController.connectFetchController('/api/matterial/complexdetail_match_dongSearch','POST',JSON.stringify(body_info));//해당 단지에 속한 동bld-pk buildings건물들 정보만 불러옴!!!
  //   if(res_result){
  //     console.log('res_resultss::',res_result);

  //     if(res_result.result && res_result.result.length>=1){
  //       setdonglist(res_result.result);
  //     }else{
  //       alert('해당선택단지에 소속된 동 정보가 없습니다');
  //     }
  //   }
  // },[]);

  useEffect( () => {
    console.log('donglist,floorlist,hosillist변할시마다 :',donglist,floorlist,hosillist);
  },[donglist,floorlist,hosillist]);

  const [value, setvalue] = useState('');
  const [value2, setvalue2] = useState('');
  const [value3, setvalue3] = useState('');


  //동을 변화하면 하부의층도 같이 불러오고, 층을 변화하면 하부의 호들도 불러온다!!! 처음엔 해당 단지의 동만 불러옴!!!
    return (
        <Container>
          <WrapSearch>
            <Box>


              <SearchBox>
                <Search type="search" value={temp_selectComplexinfo.complexname}/>
                <SearchBtn type="button"/>
                <WhiteCloseImg>
                  <ResetSearch/>
                </WhiteCloseImg>
              </SearchBox>


            </Box>
            <WrapSelectBox>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">동 선택</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label="동 선택"
                onChange={dongchange}
              >
                <MenuItem selected style={{ color: "#979797" }}>동 선택</MenuItem >
                {
                  donglist.map((value) => {
                    console.log('donglist:', value);
                    return (
                      <MenuItem value={value['bld_id'] + ',' + value['dong_name']}>{value['dong_name']}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">층 선택</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value2}
                label="층 선택"
                onChange={floorchange}
              >
                <MenuItem selected style={{ color: "#979797" }}>층 선택</MenuItem >
                {
                  floorlist.map((value) => {
                    return (
                      <MenuItem value={value['flr_id'] + ',' + (value['flr_type'] + ' ' + value['floor'])}>{value['flr_type'] + ' ' + value['floor']}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">호 선택</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value3}
                label="호 선택"
                onChange={hosilchange}
              >
                <MenuItem selected style={{ color: "#979797" }}>호 선택</MenuItem>
                {
                  hosillist.map((value) => {
                    return (
                      <MenuItem value={value['ho_id'] + ',' + value['ho_name'] + '호'}>{value['ho_name']}호{value['floor']}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>

            </WrapSelectBox>
          <Button variant="contained" onClick={() => {
            // <Next onClick={()=>{
                console.log('==>>>다음버튼 클릭>>단지:');
              
                //리덕스 정보 저장. state정보 -> 리덕스 저장(동,층,호실, 단지명,단지주소등 저장.)
                tempBrokerRequestActions.dongchange({dongs: dong});
                tempBrokerRequestActions.floorchange({floors: floor});
                tempBrokerRequestActions.hosilchange({hosils: hosil});
                tempBrokerRequestActions.dong_namechange({dong_names: dong_name });
                tempBrokerRequestActions.floornamechange({floornames: floorname});
                tempBrokerRequestActions.ho_namechange({ho_names: ho_name});

                tempBrokerRequestActions.dangichange({dangis : temp_selectComplexinfo.complexname});
                tempBrokerRequestActions.dangijibunaddresschange({ dangijibunaddress : temp_selectComplexinfo.addrjibun});
                tempBrokerRequestActions.dangiroadaddresschange({ dangiroadaddress: temp_selectComplexinfo.addrroad});
                tempBrokerRequestActions.xchange({x_pos : temp_selectComplexinfo.x});
                tempBrokerRequestActions.ychange({y_pos : temp_selectComplexinfo.y});

                switch(activeIndex){
                  case 0:
                    tempBrokerRequestActions.maemultypechange({maemultypes: '아파트'});
                  break;
                  case 1:
                    tempBrokerRequestActions.maemultypechange({maemultypes: '오피스텔'});
                  break;
                  case 2:
                    tempBrokerRequestActions.maemultypechange({maemultypes: '상가'});
                  break;
                  case 3:
                    tempBrokerRequestActions.maemultypechange({maemultypes: '사무실'});
                  break;
                }
              }}>
              <Link className="data_link" to="/AddRequestBroker"/>
              
              {/* <NextBtn type="button">다음</NextBtn> */}
            {/* </Next> */}
            조회</Button>
          </WrapSearch>
        </Container>
  );
}
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
    width: 100%;
  }
`
const WrapSearch = styled.div`
  width:100%;
  margin-top:8px;
`
const Box = styled.div`
  width:100%;
`
const Label = styled.label`
  display:block;
  font-size:12px;transform:skew(-0.1deg);
  font-weight:600;
  margin-bottom:10px;color:#4a4a4a;
`
const SearchBox = styled.div`
  position:relative;
  display:flex;justify-content:flex-start;align-items:center;
  flex-wrap:wrap;
  width:100%;
  height:auto;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
`
const Search = styled.input`
  display:inline-block;
  width:100%;
  height:43px;
  text-align:center;
  font-size:15px;transform:skew(-0.1deg);
  font-weight:600;
  color:#4a4a4a;background:transparent;
  &::placeholder{color:#979797;}
`
const SearchBtn = styled.button`
  position:absolute;right:0;top:0;
  width:43px;height:43px;
  background:url(${SearchImg}) no-repeat center center;
  background-size:19px 18px;
`
const WhiteCloseImg = styled.div`
  position:absolute;
  display:flex;align-items:center;justify-content:center;
  right:43px;top:0;
  width:43px;height:43px;
  cursor:pointer;
`
const ResetSearch = styled.div`
  display:inline-block;
  border-radius:100%;
  width:20px;height:20px;
  background:#cecece url(${WhiteClose}) no-repeat center center;
  background-size:8px 8px;
`
const WrapSelectBox = styled.div`
  width:100%;
  display:flex;justify-content:space-between;align-items:center;
  margin-top:8px;
`
// const Select = styled.select`
//   width:125px;
//   height:43px;
//   border-radius:4px;
//   border:1px solid #e4e4e4;
//   background:#fff;
//   font-size:15px;
//   font-weight:600;
//   color:#4a4a4a;
//   transform:skew(-0.1deg);
//   padding-left:10px;
//   appearance:none;
//   background:url(${SelectArrow}) no-repeat 100px center; background-size:11px;
// `
const Option = styled.option`
`
const Next = styled.div`
  position:relative;
  width: 100%;
  margin-top:70px;
`
const NextBtn = styled.button`
  width:100%;
  height: 66px;
  line-height:60px;
  font-size:20px;color:#fff;
  font-weight:800;transform:skew(-0.1deg);
  border-radius: 11px;
  border: solid 3px #e4e4e4;
  background-color: #979797;
  text-align:center;
  /*액티브 됐을때
  border: solid 3px #01684b;
  background-color: #01684b;
  */
`
