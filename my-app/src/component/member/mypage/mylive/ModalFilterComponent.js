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
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Location from '../../../../img/member/loca.png';
import Set from '../../../../img/member/setting.png';
import Item from '../../../../img/main/item01.png';
import Noimg from '../../../../img/main/main_icon3.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';

//필터 모달
export default function Reserve({ filter, setFilter }) {

  const [value, setvalue] = useState('최신등록순');
  const [value2, setvalue2] = useState('전체');

  const handleChange = (e) => {
    setvalue(e.target.value);
    setFilter(ob => { ob.order = e.target.value; return ob; })
  };

  const handleChange2 = (e) => {
    setvalue2(e.target.value);
    setFilter(ob => { ob.sort = e.target.value; return ob; })
  };



  return (
    <Container>
      <>
        {/*정렬기준 select*/}
        <FilterBox>

          <FormControl fullWidth >
            <InputLabel>정렬기준</InputLabel>
            <Select
              value={filter.order}
              label="상태"
              onChange={handleChange}
            >
              <MenuItem value="DESC" selected={filter.order == "DESC"}>최신등록순</MenuItem>
              <MenuItem value="ASC" selected={filter.order == "ASC"}>과거등록순</MenuItem>
              <MenuItem value="KR" selected={filter.order == "KR"}>가나다순</MenuItem>
            </Select>
          </FormControl>

          {/* <FilterLabel>정렬기준</FilterLabel>
                  <FilterSelectSort>
                  <FilterSelectSortList onChange={(e)=>{setFilter(ob => {  ob.order = e.target.value;  return ob;} )}}>
                      <InOption value="DESC" selected={filter.order =="DESC"}>최신등록순</InOption>
                      <InOption value="ASC" selected={filter.order =="ASC"}>과거등록순</InOption>
                      <InOption value="KR" selected={filter.order =="KR"}>가나다순</InOption>
                    </FilterSelectSortList>
                  </FilterSelectSort> */}

        </FilterBox>
        {/*상태 select*/}
        <FilterBox>

          <FormControl fullWidth >
            <InputLabel>상태</InputLabel>
            <Select
              value2={filter.sort}
              label="상태"
              onChange={handleChange2}
            >
              <MenuItem value="ALL" selected={filter.sort == "ALL"}>전체</MenuItem>
              <MenuItem value="TODAY" selected={filter.sort == "TODAY"}>오늘</MenuItem>
              <MenuItem value="WEEKEND" selected={filter.sort == "WEEKEND"}>이번주</MenuItem>
              <MenuItem value="CANCEL" selected={filter.sort == "CANCEL"}>예약 취소</MenuItem>
              <MenuItem value="DELETE" selected={filter.sort == "DELETE"}>예약 해제</MenuItem>
            </Select>
          </FormControl>



          {/* <FilterLabel>상태</FilterLabel>
                  <FilterSelectCondition>
                    <FilterSelectConditionList onChange={(e)=>{setFilter(ob=>{  ob.sort = e.target.value; return ob;})}}>
                        <InOption value="ALL" selected={filter.sort == "ALL"}>전체</InOption>
                        <InOption value="TODAY" selected={filter.sort == "TODAY"}>오늘</InOption>
                        <InOption value="WEEKEND" selected={filter.sort == "WEEKEND"}>이번주</InOption>
                        <InOption value="CANCEL" selected={filter.sort == "CANCEL"}>예약 취소</InOption>
                        <InOption value="DELETE" selected={filter.sort == "DELETE"}>예약 해제</InOption>
                        <InOption value="OVER" selected={filter.sort == "OVER"}>만료</InOption>
                      </FilterSelectConditionList>
                  </FilterSelectCondition> */}


        </FilterBox>
      </>
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
  margin-bottom:40px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(40/428));
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
const WrapFilterSelect = styled.div`
  width:100%;
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
    height:calc(100vw*(43/428));
    background:url(${ArrowDown}) no-repeat 90% center;background-size:calc(100vw*(11/428));
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
