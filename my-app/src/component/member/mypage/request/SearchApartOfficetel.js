//★★★★아파트, 오피스텔 중개의뢰 입니다★★★★

//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//material-ui
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import { styled as MUstyled } from '@mui/material/styles';

//css
import styled from "styled-components"
import { Mobile, PC } from "../../../../MediaQuery"

//img
import SearchImg from '../../../../img/map/search.png';
import WhiteClose from '../../../../img/member/white_close.png';

//component
import ModalDanjiSelect from './modal/ModalDanjiSelect';

//server process
import serverController from '../../../../server/serverController';

export default function SearchApartOfficetel({selectInfo, setSelectInfo}) {
  const [activeIndex,setActiveIndex] = useState(-1);
  const [complex_searchlist,setComplex_searchlist] = useState([]);
  const [select_complexid, setSelect_complexid] = useState('');

  //const [searchword, setSearchWord] = useState("");
  const searchWord = async (e) =>{
    //setSearchWord(e.target.value);
    console.log('아파트오피 검색필드 검색단어 string길이:',e.target.value,e.target.value.length);
    if(e.target.value.length >= 1){
      setActive(true);
    }else{
      setActive(false);
    }
    let body_info={
       dangi_name : e.target.value
    };
    
    let res_result=await serverController.connectFetchController('/api/matterial/complex_search_query','POST',JSON.stringify(body_info));

    if(res_result){
      console.log('res_result:::',res_result);
       setComplex_searchlist(res_result.result);
    }
    
  }
  const [active,setActive] = useState(false);
  const [searchresult_close,setSearchresult_close]= useState(false);
  /*모달 & show,hide */
  const [modalDanji,setModalDanji] = useState(false);

  /*useEffect(()=>{
    if(checkVaildate()){
        //setSearchresult_close(false);
        setActive(true);
    }
    else{
        setActive(false);
        //setSearchresult_close(true);
    }
  },)*/

  const search_windowclose =() =>{
    // setSearchresult_close(false)
    setActive(false)
  }

  useEffect( () => {

  },[complex_searchlist]);

    return (
        <Container>
          <WrapSearch>
            <Box>
              <Label>중개의뢰 가능한 단지 검색</Label>
              <SearchBox>

              <MUTextField
                id="input-with-icon-textfield"
                // label="TextFiezxxld"
                placeholder="중개의뢰 가능한 단지 검색 예: 반포자이"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <WhiteCloseImg active={active} onClick={search_windowclose}>
                        <ResetSearch />
                      </WhiteCloseImg>
                    </InputAdornment>
                  ),
                }}
                onChange={searchWord}
                variant="outlined"
              />

                

                {/* <Search type="search" placeholder="중개의뢰 가능한 단지 검색 예: 반포자이" onChange={searchWord}/>
                <SearchBtn type="button"/>
                <WhiteCloseImg active={active} onClick={search_windowclose}>
                  <ResetSearch/>
                </WhiteCloseImg> */}
                {/*검색했을때 나오는 부분 */}
                <SearchResult active={active}>
                  {
                    complex_searchlist.map((value) => {
                      return (
                        <ResultBox onClick={() => {setSelect_complexid(value.complex_id); setModalDanji(true)}} >
                          <Title>{value.complex_name}</Title>
                          <ResultAddress>{value.addr_road}</ResultAddress>
                        </ResultBox>
                      )
                    })
                  }
                  {/*<ResultBox >
                    <Link onClick={() => {setModalDanji(true)}} className="data_link"/>
                    <Title>반포자이</Title>
                    <ResultAddress>서울 특별시 서초구 반포동</ResultAddress>
                  </ResultBox>
                  <ResultBox >
                    <Link onClick={() => {setModalDanji(true)}} className="data_link"/>
                    <Title>반포 센트럴자이</Title>
                    <ResultAddress>서울 특별시 서초구 잠원동</ResultAddress>
                  </ResultBox>
                  */}
                  {/*검색결과가 없을 경우*/}
                  <ResultBox style={{display:"none"}}>
                    <NoResult>
                    현재 전문중개사가 배정된 단지가 아닙니다.<br/>
                    빠른 시일내로 서비스하도록 하겠습니다.
                    </NoResult>
                  </ResultBox>
                </SearchResult>
              </SearchBox>
            </Box>
            {
              modalDanji ?
              <ModalDanjiSelect modalDanji={modalDanji} setActive={setActive} setModalDanji={setModalDanji} setSelectInfo={setSelectInfo} select_complexid={select_complexid}/>
              :
              null

            }
          </WrapSearch>
        </Container>
  );
}

const MUTextField = MUstyled(TextField)`
  width:100%;
  height:43px;
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
const Label = styled.label`
  display:block;
  font-size:12px;transform:skew(-0.1deg);
  font-weight:600;
  margin-bottom:10px;color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(10/428));
  }
`
const SearchBox = styled.div`
  position:relative;
  display:flex;justify-content:flex-start;align-items:center;
  flex-wrap:wrap;
  width:100%;
  height:auto;
  border-radius: 4px;
  /* border: solid 1px #e4e4e4; */
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
  background:#fff url(${SearchImg}) no-repeat center center;
  background-size:19px 18px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(43/428));
    height:calc(100vw*(43/428));
    background-size:calc(100vw*(19/428)) calc(100vw*(18/428));
  }
`
const SearchResult = styled.div`
  width:408px; height:320px; overflow-y:auto;
  position:absolute;
  left:-1px;top:57px;background:#fff;
  border:1px solid #e4e4e4;z-index:2;border-top:0;border-radius:3px;
  display:${({active}) => active ? "block" : "none"};
  @media ${(props) => props.theme.mobile} {
    /* width:calc(100vw*(380/428)); */
    height:calc(100vw*(320/428));
    overflow-y:scroll;
    z-index:3;
    background-size:calc(100vw*(19/428)) calc(100vw*(18/428));
  }
`
const ResultBox = styled.div`
  cursor: pointer;
  position:relative;
  width:100%;
  padding:13px 28px;
  background:#fff;
  border-radius:3px;
  transition:all 0.3s;
  &:hover{background:#f8f7f7;}
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(13/428)) calc(100vw*(20/428));
  }
`
const Title = styled.h5`
    font-size:15px;font-weight:600;
    transform:skew(-0.1deg);
    margin-bottom:10px;
    color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
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
const NoResult =styled.p`
  font-size: 15px;transform:skew(-0.1deg);
  line-height: 1.13;
  text-align: center;
  color: #979797;
  padding:35px 0;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    padding:calc(100vw*(30/428));
  }
`
const WhiteCloseImg = styled.div`
  position:absolute;
  display:flex;align-items:center;justify-content:center;
  right:43px;top:6px;
  width:43px;height:43px;
  cursor:pointer;
  display:${({active}) => active ? "flex" : "none"};
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
    background-size:calc(100vw*(8/428)) calc(100vw*(8/428));
  }
`
