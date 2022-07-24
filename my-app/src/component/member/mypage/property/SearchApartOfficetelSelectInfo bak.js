//★★★★아파트, 오피스텔 중개의뢰 입니다★★★★

//react
import React ,{useState, useEffect} from 'react';
import {Link,useHistory} from "react-router-dom";

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
import {useSelector } from 'react-redux';
import {tempBrokerRequestActions, temp_SelectComplexinfo } from '../../../../store/actionCreators';

//server process
import serverController from '../../../../server/serverController';

export default function SearchApartOfficetelInfo({setActiveIndex,activeIndex}) {
  const history=useHistory();
  console.log('searchApratofficetleselectinfo요소(외부수임물건관리) 실행요소:',tempBrokerRequestActions);

  const [modalOption,setModalOption] = useState({show : false,setShow:null,link:"",title:"",submit:{},cancle:{},confirm:{},confirmgreen:{},content:{}});

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

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = ()=>{
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
    const updateModal = () =>{
      //여기가 모달 키는 거에엽
      setModalOption({
        show:true,
        setShow:offModal,
        title:"물건 등록",
        content:{type:"text",text:`해당물건은 전속매물이 아닙니다.\n이미 다른 중개사에게 의뢰되었거나\n거래중인 물건은 시스템에 등록할 수 없습니다.\n상기 사유에 해당하지 않는 경우,\n고객센터로 문의해주세요.`,component:""},
        submit:{show:false , title:"확인" , event : ()=>{offModal();}},
        cancle:{show:false , title:"취소" , event : ()=>{offModal(); }},
        confirm:{show:false , title:"확인" , event : ()=>{offModal(); }},
        confirmgreen:{show:true , title:"확인" , link:"/AddPropertyBasicInfo", event : ()=>{offModal(); }}
      });
    }

    
    const dongchange = async(e) => {
      console.log('여기를 확인하기 .. ' ,e.target.value);
      console.log('여기를 확인하기 bld.id.. ', e.target.value.split(',')[0]);
      console.log('여기를 확인하기 동.. ', e.target.value.split(',')[1]);
      setvalue(e.target.value);
      setDong(e.target.value.split(',')[0]); //bld.id
      setDongname(e.target.value.split(',')[1]);//동 정보
      //해당 선택 동bld_id에 해당ㅎ는 floor리슽ㅇ ㅡ조회 및 처리

      let body_info ={
        bld_id : e.target.value.split(',')[0]
      }
      let floor_list = await serverController.connectFetchController('/api/matterial/complexdetail_match_floorSearch','POST',JSON.stringify(body_info));


      if(floor_list){
        console.log('floor list lsss:',floor_list);

        if(floor_list.result){
          setfloorlist(floor_list.result);
        }
      }
    }

    const floorchange = async(e) => {
      setvalue2(e.target.value);
      setFloor(e.target.value.split(',')[0]); setFloorname(e.target.value.split(',')[1]);

      //해당 선택 층flrid에 대항하앟하는 hoinbfo리스트 조회 및 처리
      let body_info = {
        flr_id : e.target.value.split(',')[0]
      }
      let hosil_list= await serverController.connectFetchController('/api/matterial/complexdetail_match_hosilSearch','POST',JSON.stringify(body_info));
      if(hosil_list){
        console.log('hosil lis lsistss:',hosil_list);

        if(hosil_list.result){
          sethosillist(hosil_list.result);
        }
      }
    }
  // const hosilchange = (e) => { setvalue3(e.target.value); setHosil(e.target.value.split(',')[0]); sethosilname(e.target.value.split(',')[1]);}//선택한 ho_info ho_id저장.
  const hosilchange = (e) => { setvalue3(e.target.value); setHosil(e.target.value.split(',')[0]); sethosilname(e.target.value.split(',')[1]);};//선택한 ho_info ho_id저장.


  const hoSearch = async (e) => {
    console.log('동작555',e.target.value);
    // console.log('동작',e.target.value);

    let Search_hosil = await serverController.connectFetchController(`/api/complexes/${temp_selectComplexinfo.complexid}/buildings/${dong}/ho?ho_name=${e.target.value}`, 'GET');
 
    sethosil_list(Search_hosil.data);

    console.log('동작256', Search_hosil.data);
 
  }

    /*useEffect( async () => {
      let body_info = {
        complexid: temp_selectComplexinfo.complexid,
        bldpk: temp_selectComplexinfo.bldpk
      };
      var res_result=await serverController.connectFetchController('/api/matterial/complexdetail_join_search','POST',JSON.stringify(body_info));
      if(res_result){
        console.log('res_result:::',res_result);

        if(res_result.result[0]){
          setdonglist(res_result.result[0]);
        }
        if(res_result.result[1]){
          setfloorlist(res_result.result[1]);
        }
        if(res_result.result[2]){
          sethosillist(res_result.result[2]);
        }
      }
    },[]);*/

    useEffect(() => {
      console.log('확인하기123555', temp_selectComplexinfo );
      setDongname('');
      setHosil('');
      setFloor('');
    }, [temp_selectComplexinfo.complexname])


    useEffect(async () => {
      console.log('확인하기12344', temp_selectComplexinfo );
      console.log('확인하기12344', temp_selectComplexinfo.complexid);
      let body_info ={
        complexid : temp_selectComplexinfo.complexid,
        bldpk : temp_SelectComplexinfo.bldpk
      };
      // var res_result = await serverController.connectFetchController('/api/matterial/complexdetail_match_dongSearch','POST',JSON.stringify(body_info));
      
      var res_result = await serverController.connectFetchController(`/api/complexes/${temp_selectComplexinfo.complexid}/buildings`,'GET');
      
      console.log('확인하기12344', res_result);
      console.log('확인하기12344', res_result.data);
      

      if(res_result){
      
        // if(res_result.result && res_result.result.length >=1){
        if(res_result.data && res_result.data.length >=1){
          // setdonglist(res_result.result);
          setdonglist(res_result.data);
        }else{
          alert('해당선택단지에 소속된 동 정보가 없습니다.');
        }
      }
    }, [temp_selectComplexinfo.complexid]);

    useEffect( () => {
      console.log('donglist,fllorlist,hosilist변할시마다:',donglist,floorlist,hosillist);
    },[donglist,floorlist,hosillist]);


    useEffect( () => {
      if (!value || !hosil || !floor){
        setActive(false)
        console.log('동작555')
      }else{
        setActive(true)
        console.log('동작555', temp_selectComplexinfo)
        console.log('동작555', dongname)
        
      }

    }, [dongname, hosil, floor]);


    //동을 변화하면 하부의층도 같이 불러오고, 층을 변화하면 하부의 호들도 불러온다!!! 처음엔 해당 단지의 동만 불러옴!!!

    return (
        <Container>
          <WrapSearch>
            {/* <Box>
              <SearchBox>
              {console.log('temp_selectComplexinfo', temp_selectComplexinfo)}
                <Search type="search" value={temp_selectComplexinfo.complexname}/>
                <SearchBtn type="button"/>
                <WhiteCloseImg>
                  <ResetSearch/>
                </WhiteCloseImg>
              </SearchBox>
            </Box> */}

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
                {/* <MenuItem selected style={{ color: "#979797" }}>동 선택</MenuItem > */}
                {
                  donglist.map((value , index) => {
                    console.log('donglist::', value);
                    return (
                      <MenuItem  value={value['bld_id'] + ',' + value['dong_name']}>{value['dong_name']}</MenuItem >
                    )
                  })
                }
              </Select>
            </FormControl>


              {/* <Select name='dong' onChange={dongchange}>
                <Option selected style={{color:"#979797"}}>동 선택</Option>
          
                {
                  donglist.map((value) => {
                    console.log('donglist::',value);
                    return(
                      <Option value={value['bld_id']+','+value['dong_name']}>{value['dong_name']}</Option>
                    )
                  })
                }
              </Select> */}

            {/* <FormControl fullWidth>
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
            </FormControl> */}

              {/* <Select name='floor' onChange={floorchange}>
                <Option selected style={{color:"#979797"}}>층 선택</Option>
                {
                  floorlist.map((value) => {
                    return(
                      <Option value={value['flr_id']+','+(value['flr_type']+' '+value['floor'])}>{value['flr_type']+' '+value['floor']}</Option>
                    )
                  })
                }
              </Select> */}

            {/* <FormControl fullWidth>
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
            </FormControl> */}

            <Autocomplete
              freeSolo
              id="country-select-demo"
              //sx={{ width: 300 }}
              options={hosil_list}
              autoHighlight
              onClose={() => { console.log('닫기 버튼');}}
              getOptionLabel={(option) => option.ho_name}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Box component="li" sx={{}} {...props} onClick={(e) => { console.log('동작123', option); selected = true; setHosil(option.ho_name); setFloor(option.floor); setFloorname(option.flr_type); setho_id(option.ho_id); }}>
                    <ResultAddress>{option.ho_name}</ResultAddress>
                </Box>
                </li>
              )}
           
              renderInput={(params) => (
                <MUTextField
                  {...params}
                  // value={temp_selectComplexinfo.complexname}
                  label="호수 검색"
                  placeholder="예: 101 -> 101호"
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



              {/* <Select name='hosil' onChange={hosilchange}>
                <Option selected style={{color:"#979797"}}>호 선택</Option>
                {
                  hosillist.map((value) => {
                    return(
                      <Option value={value['ho_id']+','+value['ho_name']+'호'}>{value['ho_name']}호{value['floor']}</Option>
                    )
                  })
                }
              </Select> */}


            </WrapSelectBox>
            <div>
            {/* <TextField id="outlined-basic" label="" variant="outlined" value={`${floorname}` === '지상' ? `${floor}층` : `${Hosildata.flr_type}${floor}층`} /> */}
            <TextField id="outlined-basic" label="층 정보" variant="outlined" value={!floor ? floor : `${floorname}` === '지상' ? `${floor}층` : `${Hosildata.flr_type}${floor}층`} Autocomplete='off' />

            </div>
            <Next>
      {/*조회 성공했을때(물건이 전속매물일 경우)*/}
              {/*<Link className="data_link" to="/AddPropertyBasicInfo"/>*/}
           

              {/* <NextBtn type="button" onClick={()=>{ */}
            <MUButton_Validation variant="contained" active={active}  onClick={ async ()=>{
                //updateModal();
                //나중에 여기에 단수체크 넣어야함. 선택한 단지complexid,bld_id동, 층,호(ho_id)에 대한 또한 해당 단지주소값에 해당하는 매물 조건 만족(상태값조건여부) 여부 검사한다.

                  //중복체크하기
                  //전속매물 조회 - prd_id로 단지 중복검색

              var res_result = await serverController.connectFetchController(`/api/products/check/exclusive?category=${temp_selectComplexinfo.bldtype}&bld_id=${dong}&ho_id=${ho_id}`, 'GET');
              
              // console.log('동작한다.', res_result)
              // console.log('동작한다.', temp_selectComplexinfo.bldtype)
              // console.log('동작한다.', dong)
              // console.log('동작한다.', ho_id)
              
              if(res_result.data == true){
                alert('해당물건은 이미 등록된 물건입니다.')
                history.push('/PropertyManagement')
              }else{
                
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

              // }}>조회</NextBtn>
            }}>조회</MUButton_Validation>
            </Next>
          </WrapSearch>
      {/*조회 실패했을때 모달창*/}
          <ModalCommon modalOption={modalOption}/>
        </Container>
  );
}

const MUButton = MUstyled(Button)`
  margin-bottom: 5px;
  width : 100%;
`

const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`

const MUTextField = MUstyled(TextField)`
  width : 250px%;
`

const ResultAddress = styled.p`
  font-size:15px;font-weight:500;
  transform:skew(-0.1deg);
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
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
  margin-top:8px;
  @media ${(props) => props.theme.mobile} {
      margin-top:calc(100vw*(8/428));
    }
`
const Box = styled.div`
  width:100%;
`
const Label = styled.label`
  display:block;
  font-size:12px;transform:skew(-0.1deg);
  font-weight:600;
  margin-bottom:10px;color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(12/428));
    }
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
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(15/428));
    }
`
const SearchBtn = styled.button`
  position:absolute;right:0;top:0;
  width:43px;height:43px;
  background:url(${SearchImg}) no-repeat center center;
  background-size:19px 18px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(43/428));
    height:calc(100vw*(43/428));
    background-size:calc(100vw*(19/428)) calc(100vw*(18/428));
  }
`
const WhiteCloseImg = styled.div`
  position:absolute;
  display:flex;align-items:center;justify-content:center;
  right:43px;top:0;
  width:43px;height:43px;
  cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    right:calc(100vw*(43/428));
    width:calc(100vw*(43/428));
    height:calc(100vw*(43/428));
  }
`
const ResetSearch = styled.div`
  display:inline-block;
  border-radius:100%;
  width:20px;height:20px;
  background:#cecece url(${WhiteClose}) no-repeat center center;
  background-size:8px 8px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));
    backgrond-size:calc(100vw*(8/428)) calc(100vw*(8/428));
  }
`
const WrapSelectBox = styled.div`
  width:100%;
  display:flex;justify-content:space-between;align-items:center;
  margin-top:8px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(8/428));
  }
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
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(120/428));
//     height:calc(100vw*(43/428));
//     font-size:calc(100vw*(15/428));
//     padding-left:calc(100vw*(10/428));
//   }
// `
const Option = styled.option`
`
const Next = styled.div`
  position:relative;
  width: 100%;
  margin-top:70px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(50/428));
  }
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
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
  }
`
