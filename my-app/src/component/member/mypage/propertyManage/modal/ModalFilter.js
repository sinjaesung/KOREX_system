//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

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
export default function Reserve({ filter, setFilter, orderby_ref, trstatus_ref, prdtype_ref, createorigin_ref }) {

  const [value, setvalue] = useState('최신등록순');
  const [value2, setvalue2] = useState('전체');
  const [value3, setvalue3] = useState('전체');
  const [value4, setvalue4] = useState('전체');
  const handleChange3 = (e) => {
    setvalue3(e.target.value);
  };
  const handleChange2 = (e) => {
    setvalue2(e.target.value);
  };
  const handleChange = (e) => {
    setvalue(e.target.value);
  };
  const handleChange4 = (e) => {
    setvalue4(e.target.value);
  };
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
              label="상태"
              onChange={handleChange}
              ref={orderby_ref}
            >
              <MenuItem value='최신등록순'>최신등록순</MenuItem>
              <MenuItem value='과거등록순'>과거등록순</MenuItem>
              <MenuItem value='가나다순'>가나다순</MenuItem>
            </Select>
          </FormControl>
          {/* <FilterLabel>정렬기준</FilterLabel>
          <FilterSelectSort>
            <FilterSelectSortList ref={orderby_ref}>
              <InOption value='최신등록순'>최신등록순</InOption>
              <InOption value='과거등록순'>과거등록순</InOption>
              <InOption value='가나다순'>가나다순</InOption>
            </FilterSelectSortList>
          </FilterSelectSort> */}
        </FilterBox>
        {/*상태 select*/}
        <FilterBox>
          <FormControl fullWidth >
            <InputLabel>상태</InputLabel>
            <Select
              className="OptionSelect2"
              option2={value2}
              value={value2}
              label="상태"
              onChange={handleChange2}
              ref={trstatus_ref}
            >
              <MenuItem value='전체'>전체</MenuItem>
              <MenuItem value='오늘'> 오늘</MenuItem>
              <MenuItem value='내일'>내일</MenuItem>
              <MenuItem value='예약 취소'>예약 취소</MenuItem>
              <MenuItem value='만료'>만료</MenuItem>
            </Select>
          </FormControl>
          {/* <FilterLabel>상태</FilterLabel>
          <FilterSelectCondition>
            <FilterSelectConditionList ref={trstatus_ref}>
              <InOption value='전체'>전체</InOption>
              <InOption value='오늘'> 오늘</InOption>
              <InOption value='내일'>내일</InOption>
              <InOption value='예약 취소'>예약 취소</InOption>
              <InOption value='만료'>만료</InOption>
            </FilterSelectConditionList>
          </FilterSelectCondition> */}
        </FilterBox>
        {/*물건종류 select*/}
        <FilterBox>
          <FormControl fullWidth >
            <InputLabel>물건종류</InputLabel>
            <Select
              className="OptionSelect3"
              option3={value3}
              value={value3}
              label="상태"
              onChange={handleChange3}
              ref={prdtype_ref}
            >
              <MenuItem value='전체'>전체</MenuItem>
              <MenuItem value='아파트'>아파트</MenuItem>
              <MenuItem value='오피스텔'>오피스텔</MenuItem>
              <MenuItem value='상가'>상가</MenuItem>
              <MenuItem value='사무실'>사무실</MenuItem>
            </Select>
          </FormControl>
          {/* <FilterLabel>물건종류</FilterLabel>
          <FilterSelectCondition>
            <FilterSelectConditionList ref={prdtype_ref}>
              <InOption value='전체'>전체</InOption>
              <InOption value='아파트'>아파트</InOption>
              <InOption value='오피스텔'>오피스텔</InOption>
              <InOption value='상가'>상가</InOption>
              <InOption value='사무실'>사무실</InOption>
            </FilterSelectConditionList>
          </FilterSelectCondition> */}
        </FilterBox>
        {/*수임방식 select*/}
        <FilterBox>
          <FormControl fullWidth >
            <InputLabel>수임방식</InputLabel>
            <Select
              className="OptionSelect4"
              option4={value4}
              value={value4}
              label="상태"
              onChange={handleChange4}
              ref={createorigin_ref}
            >
              <MenuItem value='전체'>전체</MenuItem>
              <MenuItem value='사용자의뢰'>사용자의뢰</MenuItem>
              <MenuItem value='외부수임'>외부수임</MenuItem>
            </Select>
          </FormControl>
          {/* <FilterLabel>수임방식</FilterLabel>
          <FilterSelectCondition>
            <FilterSelectConditionList ref={createorigin_ref}>
              <InOption value='전체'>전체</InOption>
              <InOption value='사용자의뢰'>사용자의뢰</InOption>
              <InOption value='외부수임'>외부수임</InOption>
            </FilterSelectConditionList>
          </FilterSelectCondition> */}
        </FilterBox>
      </WrapFilterSelect>

    </Container>
  );
}

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
display:inline-block;
  font-size:12px;color:#4a4a4a;
  transform:skew(-0.1deg);
  font-family:'nbg', sans-serif;
  margin-bottom:9px;
  padding-left:3px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(9/428));
    font-size:calc(100vw*(12/428));
    padding-left:calc(100vw*(3/428));
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
