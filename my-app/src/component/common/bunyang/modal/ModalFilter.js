//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//material-ui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


//img
// import ArrowDown from '../../../img/member/arrow_down.png';
import ArrowDown from '../../../../img/member/arrow_down.png'
//필터 모달
export default function Reserve({currentFilter, setCurrentFilter, onChangeSort, onChangeCondi}) {


  const [Value, setValue] =useState(0);
  const [Value2, setValue2] =useState(0);

  const handleChange = (e) => {
    setValue(e.target.value);
    onChangeSort(e)
  };
  const handleChange2 = (e) => {
    setValue2(e.target.value);
    onChangeCondi(e)
  };

  //Filter 모달창
  return (
    <>
      <WrapFilterModal>
          <WrapFilterSelect>



          {/*정렬기준 select*/}
            <FilterBox>

          <FormControl fullWidth>
            <InputLabel>정렬기준22222</InputLabel>
            <Select
              value={Value}
              onChange={handleChange}
            >
              <MenuItem selected={currentFilter.sort == 0 ? true : false} value={0} >최신등록순</MenuItem>
              <MenuItem selected={currentFilter.sort == 1 ? true : false} value={1}>과거등록순</MenuItem>
              <MenuItem selected={currentFilter.sort == 2 ? true : false} value={2}>가나다순</MenuItem>
            </Select>
          </FormControl>

              {/* <FilterLabel>정렬기준</FilterLabel>
              <FilterSelectSort>
                <FilterSelectSortList onChange={(e) => onChangeSort(e)}>
                  <InOption selected={currentFilter.sort == 0 ? true : false} value={0} >최신등록순</InOption>
                  <InOption selected={currentFilter.sort == 1 ? true : false} value={1}>과거등록순</InOption>
                  <InOption selected={currentFilter.sort == 2 ? true : false} value={2}>가나다순</InOption>
                </FilterSelectSortList>
              </FilterSelectSort> */}
            </FilterBox>
          {/*상태 select*/}
            <FilterBox>
            <FormControl fullWidth>
              <InputLabel>보기</InputLabel>
              <Select
                value={Value2}
                onChange={handleChange2}
              >
                <MenuItem selected={currentFilter.view == 0 ? true : false} value={0} >전체</MenuItem>
                <MenuItem selected={currentFilter.view == 1 ? true : false} value={1}>Live방송 예고</MenuItem>
              </Select>
            </FormControl>

              {/* <FilterLabel>보기</FilterLabel>
              <FilterSelectCondition>
                <FilterSelectConditionList onChange={(e) => onChangeCondi(e)}>
                  <InOption selected={currentFilter.view == 0 ? true : false} value={0} >전체</InOption>
                  <InOption selected={currentFilter.view == 1 ? true : false} value={1}>Live방송 예고</InOption>
                </FilterSelectConditionList>
              </FilterSelectCondition> */}
            </FilterBox>
          </WrapFilterSelect>
      </WrapFilterModal>
    </>
  );
}


const Container = styled.div``

const WrapFilterModal = styled.div``

const WrapFilterSelect = styled.div``

const FilterBox = styled.div`
  position:relative;
  width:300px;
  margin-bottom:20px;
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(20/428));
  }
`
const FilterLabel = styled.label`
  font-size:12px;color:#4a4a4a;display:inline-block;
  transform:skew(-0.1deg);
  font-family:'nbg', sans-serif;
  margin-bottom:9px;padding-left:7px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(9/428));
    padding-left:calc(100vw*(7/428));
    font-size:calc(100vw*(12/428));
  }
`
const FilterSelectSort = styled.div`
  width:100%;
  text-align:center;
  font-size:15px;color:#4a4a4a;transform:skew(-0.1deg);
  border-radius:4px;
  background:#fff;
  z-index:9999;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
  }
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
  background:url(${ArrowDown}) no-repeat 92% center;background-size:11px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    height:calc(100vw*(43/428));
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