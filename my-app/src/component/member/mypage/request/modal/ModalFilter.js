//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//material-ui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


//css
import styled from "styled-components"

//img

import Close from '../../../../../img/main/modal_close.png';
import ArrowDown from '../../../../../img/member/arrow_down.png';

//필터 모달
export default function Reserve({filter,setFilter,maemultype_ref,prdstatus_ref,orderby_ref}) {
  //Filter내 셀렉트 박스
  const [filterSelect,setFilterSelect] = useState(false);
  const [filterSelect2,setFilterSelect2] = useState(false);
  const [filterSelect3,setFilterSelect3] = useState(false);

  const showFilterSelect = ()=>{
    setFilterSelect(!filterSelect);
  }
  const showFilterSelect2 = ()=>{
    setFilterSelect2(!filterSelect2);
  }
  const showFilterSelect3 = ()=>{
    setFilterSelect3(!filterSelect3);
  }
  
  //필터 선택state표현값.
  const [orderby,setorderby] =useState('');
  const [prdstatus,setprdstatus] = useState('');
  const [maemultype,setmaemultype] = useState('');


  const [value, setvalue] = useState('상태변경 최신순');
  const [value2, setvalue2] = useState('0');
  const [value3, setvalue3] = useState('전체');

  const handleChange = (e) => {
    setvalue(e.target.value);
    setorderby(e.target.value)
  };

  const handleChange2 = (e) => {
    setvalue2(e.target.value);
    setprdstatus(e.target.value);
  };
  const handleChange3 = (e) => {
    setvalue3(e.target.value);
    setmaemultype(e.target.value);
  };
  
  if(filter == false)
    return null;
  //Filter 모달창
    return (
        <Container>
              <WrapFilterSelect>
              {/*정렬기준 select*/}
                <FilterBox>

            <FormControl fullWidth >
              <InputLabel>정렬기준</InputLabel>
              <Select
                className="OptionSelect"
                option={value}
                value={value}
                label="정렬기준"
                onChange={handleChange}
                ref={orderby_ref}
              >
                <MenuItem value='상태변경 최신순' selected={orderby == '상태변경 최신순' ? true : false}>상태변경 최신순</MenuItem>
                <MenuItem value='최신등록순' selected={orderby == '최신등록순' ? true : false}>최신등록순</MenuItem>
                <MenuItem value='과거등록순' selected={orderby == '과거등록순' ? true : false}>과거등록순</MenuItem>
              </Select>
            </FormControl>

                  {/* <FilterLabel>정렬기준</FilterLabel>
                  <FilterSelectSort>
                    <FilterSelectSortList ref={orderby_ref} onChange={(e)=>{setorderby(e.target.value)}}>
                      <InOption value='상태변경 최신순' selected={orderby=='상태변경 최신순'?true:false}>상태변경 최신순</InOption>
                      <InOption value='최신등록순'selected={orderby=='최신등록순'?true:false}>최신등록순</InOption>
                      <InOption value='과거등록순'selected={orderby=='과거등록순'?true:false}>과거등록순</InOption>
                    </FilterSelectSortList>
                  </FilterSelectSort> */}

                </FilterBox>
              {/*상태 select*/}
                <FilterBox>

            <FormControl fullWidth >
              <InputLabel>상태</InputLabel>
              <Select
                className="OptionSelect2"
                option={value2}
                value={value2}
                label="정렬기준"
                onChange={handleChange2}
                ref={prdstatus_ref}
              >
                <MenuItem value='0' selected={prdstatus == '0'}>전체</MenuItem>
                <MenuItem value='1' selected={prdstatus == '1'}>검토 대기</MenuItem>
                <MenuItem value='2' selected={prdstatus == '2'}>←검토 중</MenuItem>
                <MenuItem value='3' selected={prdstatus == '3'}>의뢰 철회</MenuItem>
                <MenuItem value='4' selected={prdstatus == '4'}>←의뢰 수락(거래 준비)</MenuItem>
                <MenuItem value='5' selected={prdstatus == '5'}>←의뢰 거절</MenuItem>
                <MenuItem value='6' selected={prdstatus == '6'}>←거래개시승인 요청</MenuItem>
                <MenuItem value='7' selected={prdstatus == '7'}>거래 개시</MenuItem>
                <MenuItem value='8' selected={prdstatus == '8'}>거래개시 거절</MenuItem>
                <MenuItem value='9' selected={prdstatus == '9'}>위임 취소</MenuItem>
                <MenuItem value='10' selected={prdstatus == '10'}>←수임 취소</MenuItem>
                <MenuItem value='11' selected={prdstatus == '11'}>←거래완료승인 요청</MenuItem>
                <MenuItem value='12' selected={prdstatus == '12'}>거래 완료</MenuItem>
                <MenuItem value='13' selected={prdstatus == '13'}>거래완료 거절</MenuItem>
                <MenuItem value='14' selected={prdstatus == '14'}>←기한 만료</MenuItem>
              </Select>
            </FormControl>

                  {/* <FilterLabel>상태</FilterLabel>
                  <FilterSelectCondition>
                  <FilterSelectConditionList ref={prdstatus_ref} onChange={(e)=> {setprdstatus(e.target.value);}}>
                      <InOption value='0'selected={prdstatus=='0'}>전체</InOption>
                      <InOption value='1'selected={prdstatus=='1'}>검토 대기</InOption>
                      <InOption value='2'selected={prdstatus=='2'}>←검토 중</InOption>
                      <InOption value='3'selected={prdstatus=='3'}>의뢰 철회</InOption>
                      <InOption value='4'selected={prdstatus=='4'}>←의뢰 수락(거래 준비)</InOption>
                      <InOption value='5'selected={prdstatus=='5'}>←의뢰 거절</InOption>
                      <InOption value='6'selected={prdstatus=='6'}>←거래개시승인 요청</InOption>
                      <InOption value='7'selected={prdstatus=='7'}>거래 개시</InOption>
                      <InOption value='8'selected={prdstatus=='8'}>거래개시 거절</InOption>
                      <InOption value='9'selected={prdstatus=='9'}>위임 취소</InOption>
                      <InOption value='10'selected={prdstatus=='10'}>←수임 취소</InOption>
                      <InOption value='11'selected={prdstatus=='11'}>←거래완료승인 요청</InOption>
                      <InOption value='12'selected={prdstatus=='12'}>거래 완료</InOption>
                      <InOption value='13'selected={prdstatus=='13'}>거래완료 거절</InOption>
                      <InOption value='14'selected={prdstatus=='14'}>←기한 만료</InOption>
                    </FilterSelectConditionList>
                  </FilterSelectCondition> */}


                </FilterBox>
                {/*물건종류 select*/}
                  <FilterBox>

            <FormControl fullWidth >
              <InputLabel>물건종류</InputLabel>
              <Select
                className="OptionSelect3"
                option={value3}
                value={value3}
                label="상태"
                onChange={handleChange3}
                ref={maemultype_ref}
              >
                <MenuItem value='전체' selected={maemultype == '전체' ? true : false}>전체</MenuItem>
                <MenuItem value='아파트' selected={maemultype == '아파트' ? true : false}>아파트</MenuItem>
                <MenuItem value='오피스텔' selected={maemultype == '오피스텔' ? true : false}>오피스텔</MenuItem>
                <MenuItem value='상가' selected={maemultype == '상가' ? true : false}>상가</MenuItem>
                <MenuItem value='사무실' selected={maemultype == '사무실' ? true : false}>사무실</MenuItem>
              </Select>
            </FormControl>

                    {/* <FilterLabel>물건종류</FilterLabel>
                    <FilterSelectKind>
                      <FilterSelectKindList ref={maemultype_ref} onChange={(e)=>{setmaemultype(e.target.value)}}>
                        <InOption value='전체'selected={maemultype=='전체'?true:false}>전체</InOption>
                        <InOption value='아파트'selected={maemultype=='아파트'?true:false}>아파트</InOption>
                        <InOption value='오피스텔'selected={maemultype=='오피스텔'?true:false}>오피스텔</InOption>
                        <InOption value='상가'selected={maemultype=='상가'?true:false}>상가</InOption>
                        <InOption value='사무실'selected={maemultype=='사무실'?true:false}>사무실</InOption>
                      </FilterSelectKindList>
                    </FilterSelectKind> */}


                  </FilterBox>
              </WrapFilterSelect>
        </Container>
  );
}

const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.modal} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.modal} {
        display:block;
    }
`
const Container = styled.div`
`
const WrapModalMap = styled.div`
  width:100%;
`
const ModalMapBg = styled.div`
  width:100%;height:100%;
  position:fixed;left:0;top:0;
  background:rgba(0,0,0,0.2);
  display:block;content:'';
  z-index:3;
`
const ModalMap = styled.div`
  position:absolute;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:535px;border-radius:24px;
  border:1px solid #f2f2f2;
  background:#fff;
  padding:49px 50px 60px 50px;
  z-index:3;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(395/428));
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`
const MapCloseBtn = styled.div`
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const MapCloseImg = styled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(12/428));
  }
`
const ModalMapTitle = styled.h3`
  font-size:20px;font-weight:800;color:#707070;
  transform:skew(-0.1deg);
  padding-bottom:20px;
  border-bottom:1px solid #707070;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    padding-bottom:calc(100vw*(15/428));
  }
`

const InMapBox = styled.div`
  width:100%;height:100%;
  background:#eee;
`
const WrapFilterModal = styled(WrapModalMap)`
`
const ModalFilterBg = styled(ModalMapBg)`
`
const ModalFilter = styled(ModalMap)`
  height:544px;
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(489/428));
  }
`
const FilterCloseBtn = styled(MapCloseBtn)`
`
const FilterCloseImg = styled(MapCloseImg)`
`
const ModalFilterTitle = styled(ModalMapTitle)`
  margin-bottom:12px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(12/428));
  }
`
const WrapFilterSelect = styled.div`
  width:100%;
  margin-bottom:40px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(40/428));
  }
`
const FilterBox = styled.div`
  position:relative;
  width:100%;
  margin-bottom:20px;
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(20/428));
  }
`
const FilterLabel = styled.label`
  font-size:12px;color:#4a4a4a;
  transform:skew(-0.1deg);
  font-family:'nbg', sans-serif;
  margin-bottom:9px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(9/428));
    font-size:calc(100vw*(12/428));
  }
`
const FilterSelectSort = styled.div`
  width:100%;
`
const FilterSelectCondition = styled(FilterSelectSort)`
  z-index:99;
`
const FilterSelectSortList = styled.select`
    width:100%;
    height:43px;
    text-align-last:center;
    font-size:15px;color:#4a4a4a;transform:skew(-0.1deg);
    border-radius:4px;border:1px solid #a3a3a3;
    background:#fff;
    appearance:none;
    background:url(${ArrowDown}) no-repeat 400px center;background-size:11px;
    @media ${(props) => props.theme.modal} {
      font-size:calc(100vw*(14/428));
    }
`
const Option = styled.option`
  font-family:'nbg',sans-serif;
`
const InOption = styled(Option)`
  padding:8px 0;
  background:#fff;
  &:hover{background:#f8f7f7;}
  @media ${(props) => props.theme.modal} {
    padding:calc(100vw*(8/428)) 0;
  }
`
const FilterSelectConditionList = styled(FilterSelectSortList)`
`
const FilterSelectKind = styled(FilterSelectCondition)`
  z-index:90;
`
const FilterSelectKindList = styled(FilterSelectConditionList)`
`
const WrapFilterButtons = styled.div`
  position:Absolute;
  left:50%;bottom:55px;transform:translateX(-50%);
  width:100%;
  display:flex;justify-content:center;align-items:center;
  @media ${(props) => props.theme.modal} {
    bottom:calc(100vw*(35/428));
  }
`
const ResetBtn = styled.button`
  width: 200px;
  height: 66px;
  border-radius: 11px;
  border: solid 3px #e4e4e4;
  background: #979797;
  line-height:60px;color:#fff;
  font-size:20px;font-weight:800;transform:skew(-0.1deg);
  text-align:center;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(180/428));
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
  }
`
const SaveBtn = styled(ResetBtn)`
  background:#01684b;
  border:3px solid #04966d;
  margin-left:8px;
  @media ${(props) => props.theme.modal} {
    margin-left:calc(100vw*(10/428));

  }
`
