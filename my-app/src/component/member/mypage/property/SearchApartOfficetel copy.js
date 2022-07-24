//★★★★아파트, 오피스텔 중개의뢰 입니다★★★★

//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"
import { Mobile, PC } from "../../../../MediaQuery"

//material-ui
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

//img
import SearchImg from '../../../../img/map/search.png';
import WhiteClose from '../../../../img/member/white_close.png';

//component
import ModalCommon from '../../../common/modal/ModalCommon';
import ModalDanjiSelect from './modal/ModalDanjiSelect';

import { temp_SelectComplexinfo } from '../../../../store/actionCreators';

//server process
import serverController from '../../../../server/serverController';

import { useSelector } from 'react-redux';

export default function SearchApartOfficetel({ selectInfo, setSelectInfo, activeIndex, overdos }) {
  const temp_selectcomplexinfor = useSelector(data => data.temp_selectComplexinfo);

  // const [activeIndex, setActiveIndex] = useState(-1);

  const [complex_searchlist, setComplex_searchlist] = useState([]);
  const [select_complexid, setSelect_complexid] = useState('');

  // const [Searchword, setSearchWord] = useState("");

  useEffect(() => {
    setComplex_searchlist([])
  }, [selectInfo])

  useEffect(() => {
    setSelectInfo(false)
  }, [activeIndex])



  const searchWord = async (e) => {
    //setSearchWord(e.target.value);
    console.log('아파트오피 검색필드 검색단어 string길이:', e.target.value, e.target.value.length);
    if (e.target.value.length >= 1) {
      setActive(true);
    } else {
      setActive(false);
    }

    console.log('정보확인', e.target.value);

    let body_info = {
      dangi_name: e.target.value
    };
    // let res_result = await serverController.connectFetchController('/api/matterial/complex_search_query', 'POST', JSON.stringify(body_info));
    console.log('6666', activeIndex);
    // let res_result = await serverController.connectFetchController(`/api/complexes?complex_name=${e.target.value}`, 'GET');
    let res_result = await serverController.connectFetchController(`/api/complexes?auto_complete=1&filter=${JSON.stringify({ default: { bld_type: activeIndex == 0 ? '아파트' : '오피스텔' }, special: { search: e.target.value } })}`, 'GET');

    console.log('정보확인 : ', res_result);
    // console.log('정보확인 : ',res_result1);
    console.log('정보확인666 : ', res_result.data);
    // console.log('정보확인 : ',res_result1.data);

    if (res_result) {
      // console.log('res_result:::',res_result);
      // setComplex_searchlist(res_result.result);
      setComplex_searchlist(res_result.data);
    }
  }


  const [active, setActive] = useState(false);
  const [searchresult_close, setSearchresult_close] = useState(false);

  /*모달 & show,hide */
  const [modalDanji, setModalDanji] = useState(false);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  const search_windowclose = () => {
    setSearchresult_close(true);
    setActive(false);
  }

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  useEffect(() => {
    console.log('complex_searchlist', complex_searchlist);
  }, [complex_searchlist]);

  const search_danji = async () => {
    let res_result = await serverController.connectFetchController(`/api/complexes/${select_complexid}`, 'GET');
    console.log('res_resultss::', res_result);
  }

  useEffect(async () => {
    let res_result = await serverController.connectFetchController(`/api/complexes/${select_complexid}`, 'GET');
    console.log('res_resultss::', res_result);
    console.log('456456', res_result);


    if (res_result.data) {
      temp_SelectComplexinfo.complexidchange({ complexid: res_result.data.complex_id });
      temp_SelectComplexinfo.bldpkchange({ bldpk: res_result.data.bld_pk });
      temp_SelectComplexinfo.complexnamechange({ complexname: res_result.data.complex_name });
      temp_SelectComplexinfo.dongcntchange({ dongcnt: res_result.data.dong_cnt });
      temp_SelectComplexinfo.addrjibunchange({ addrjibun: res_result.data.addr_jibun });
      temp_SelectComplexinfo.addrroadchange({ addrroad: res_result.data.addr_road });
      temp_SelectComplexinfo.developerchange({ developer: res_result.data.developer });
      temp_SelectComplexinfo.constructorchange({ constructor: res_result.data.constructor });
      temp_SelectComplexinfo.approvaldatechange({ approvaldate: res_result.data.approval_date });
      temp_SelectComplexinfo.totalparkingcntchange({ totalparkcnt: res_result.data.total_parking_cnt });
      temp_SelectComplexinfo.householdcntchange({ householdcnt: res_result.data.household_cnt });
      temp_SelectComplexinfo.xchange({ x: res_result.data.x });
      temp_SelectComplexinfo.ychange({ y: res_result.data.y });
      temp_SelectComplexinfo.heattypechange({ heattype: res_result.data.heat_type });
      temp_SelectComplexinfo.halltypechange({ halltype: res_result.data.hall_type });
      temp_SelectComplexinfo.bldtypechange({ bldtype: res_result.data.bld_type });

    }

    // setSelectInfo(true);
  }, [select_complexid])


  return (
    <>
      <Autocomplete
        key={overdos}
        freeSolo
        id="country-select-demo"
        //sx={{ width: 300 }}
        options={complex_searchlist}
        autoHighlight
        getOptionLabel={(option) =>  option.addr_jibun || option.addr_road}
        // getOptionLabel={(option) => (option ? option.complex_name : option.addr_jibun )}
        // getOptionLabel={(option) =>  option.addr_road }
        renderOption={(props, option) => (
          <li {...props} >
            <Box component="li" sx={{}} onClick={() => { setSelect_complexid(option.complex_id); setSelectInfo(true); }}>
          {/* <Link onClick={() => { setSelect_complexid(option.complex_id); setModalDanji(true); setActive(false); }} className='data_link' /> */}
          {/* {option.complex_name !== '' ? 
                <Title>{`${option.bld_pk} (건물명 없음)`}
                  <ResultAddress>{option.addr_road}</ResultAddress>
                  <ResultAddress>{option.addr_jibun}</ResultAddress>
                </Title>
            :
              <Title>{option.complex_name}
                <ResultAddress>{option.addr_road}</ResultAddress>
                <ResultAddress>{option.addr_jibun}</ResultAddress>
              </Title>
              }  */}
              <div className="par-spacing">
                <p className="list-subtit fw-b">{option.complex_name || `${option.bld_pk}(건물명 없음)`}</p>
                <div className="ml-0p5">
                  <p className="capt-a1">{option.addr_road}</p>
                </div>
                <div className="ml-0p5">
                  <p className="capt-a1 ml-0p5">{option.addr_jibun}</p>
                </div>
              </div>
        </Box>
      </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="단지 검색"
            placeholder="예: 반포자이"
            onChange={searchWord}
            InputProps={{
              ...params.InputProps,
              type: 'search',
              startAdornment:
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>,
            }}
          />
        )}
      />


      {/* <SearchBox>
        <Search type="search" placeholder="중개의뢰 가능한 단지 검색 예: 반포자이" onChange={searchWord} />
        <SearchBtn type="button" />
        <WhiteCloseImg active={active} onClick={search_windowclose}>
          <ResetSearch />
        </WhiteCloseImg>
        <SearchResult active={active}>
          {
            complex_searchlist.map((value) => {
              return (
                <ResultBox>
                  <Link onClick={() => { setSelect_complexid(value.complex_id); setModalDanji(true); setActive(false); }} className='data_link' />
                  <Title>{value.complex_name}</Title>
                  <ResultAddress>{value.addr_road}</ResultAddress>
                </ResultBox>
              )
            })
          }
          <ResultBox style={{ display: "none" }}>
            <NoResult>
              현재 전문중개사가 배정된 단지가 아닙니다.<br />
              빠른 시일내로 서비스하도록 하겠습니다.
            </NoResult>
          </ResultBox>
        </SearchResult>
      </SearchBox> */}


      {
        modalDanji ?
          <ModalDanjiSelect modalDanji={modalDanji} setModalDanji={setModalDanji} setSelectInfo={setSelectInfo} select_complexid={select_complexid} modalDanji={modalDanji} />
          :
          null
      }
      {/*<ModalCommon modalOption={modalOption}/>*/}


    </>
  );
}

const Container = styled.div`
  /* width:408px;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(380/428));
  } */
`
const WrapSearch = styled.div`
  /* width:100%;
  margin-top:35px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(40/428));
  } */
`
const Box = styled.div`
  width:100%;
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
  flex-wrap:wrap;
  width:100%;
  height:auto;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  @media ${(props) => props.theme.mobile} {
        width:calc(100vw*(380/428));
    }
`
const Search = styled.input`
  display:inline-block;
  width:100%;
  height:43px;
  /* text-align:center;
  font-size:15px;transform:skew(-0.1deg);
  font-weight:600;
  color:#4a4a4a;background:transparent;
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(43/428));
    font-size:calc(100vw*(15/428));
  } */
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
  width:408px;height:320px;overflow-y:auto;
  position:absolute;
  left:-1px;top:35px;background:#fff;
  border:1px solid #e4e4e4;z-index:2;border-top:0;border-radius:3px;
  display:${({ active }) => active ? "block" : "none"};
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(380/428));
    top:calc(100vw*(38/428));
  }
`
const ResultBox = styled.div`
  position:relative;
  width:100%;
  padding:13px 28px;
  background:#fff;
  border-radius:3px;
  transition:all 0.3s;
  &:hover{background:#f8f7f7;}
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(13/428)) calc(100vw*(28/428));
  }
`
const Title = styled.h5`
    /* font-size:15px;font-weight:600;
    transform:skew(-0.1deg);
    margin-bottom:10px;
    color:#4a4a4a;
    @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
      margin-bottom:calc(100vw*(10/428));
    } */
`
const ResultAddress = styled.p`
  font-size:15px;font-weight:500;
  transform:skew(-0.1deg);
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const NoResult = styled.p`
  font-size: 15px;transform:skew(-0.1deg);
  line-height: 1.13;
  text-align: center;
  color: #979797;
  padding:35px 0;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding:calc(100vw*(35/428)) 0;
    line-height:1.5;
  }
`
const WhiteCloseImg = styled.div`
  position:absolute;
  display:flex;align-items:center;justify-content:center;
  right:43px;top:0;
  width:43px;height:43px;
  cursor:pointer;
  display:${({ active }) => active ? "flex" : "none"};
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(43/428));height:calc(100vw*(43/428));
    right:calc(100vw*(43/428));
  }
`
const ResetSearch = styled.div`
  display:inline-block;
  border-radius:100%;
  width:20px;height:20px;
  background:#cecece url(${WhiteClose}) no-repeat center center;
  background-size:8px 8px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));height:calc(100vw*(20/428));
    background-size:calc(100vw*(8/428)) calc(100vw*(8/428));;
  }
`
