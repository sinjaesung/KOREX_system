//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//material-ui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//img
import Filter from '../../../../../img/member/filter.png';
import Bell from '../../../../../img/member/bell.png';
import BellActive from '../../../../../img/member/bell_active.png';
import Location from '../../../../../img/member/loca.png';
import Set from '../../../../../img/member/setting.png';
import Item from '../../../../../img/main/item01.png';
import Noimg from '../../../../../img/main/main_icon3.png';
import Close from '../../../../../img/main/modal_close.png';
import Change from '../../../../../img/member/change.png';
import Marker from '../../../../../img/member/marker.png';
import ArrowDown from '../../../../../img/member/arrow_down.png';

//필터 모달
export default function Reserve({filter,setFilter}) {
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

  const [value, setvalue] = useState('DESC');
  const [value2, setvalue2] = useState('ALL');

  const handleChange = (e) => {
    setvalue(e.target.value);
    console.log('e.target.valuess:',e.target.value);
    setFilter(filter => { filter.order = e.target.value; return filter; })
  };

  const handleChange2 = (e) => {
    setvalue2(e.target.value);
    console.log('e,target.valuess:',e.target.value);
    setFilter(filter => { filter.sort = e.target.value; return filter; })
  };

  if(filter == false)
    return null;
  //Filter 모달창
    return (
        <Container>
          <WrapFilterModal>
              <WrapFilterSelect>
              {/*정렬기준 select*/}
                <FilterBox>
              <FormControl fullWidth >
                <InputLabel>정렬기준</InputLabel>
                <Select
                  className="Option"
                  value={filter.order}
                  label="정렬기준"
                  onChange={handleChange}   
                 >
                  <MenuItem value="DESC" selected={filter.order == "DESC"}>최신등록순</MenuItem>
                  <MenuItem value="ASC" selected={filter.order == "ASC"}>과거등록순</MenuItem>
                  <MenuItem value="KR" selected={filter.order == "KR"}>가나다순</MenuItem>
                </Select>
              </FormControl>



                  {/* <FilterLabel>정렬기준</FilterLabel>
                  <FilterSelectSort>
                    <FilterSelectSortList onChange={(e)=>{setFilter(ob=>{  ob.order = e.target.value; return ob;})}}>
                      <InOption value="DESC" selected={filter.order == "DESC"}>최신등록순</InOption>
                      <InOption value="ASC" selected={filter.order == "ASC"}>과거등록순</InOption>
                      <InOption value="KR" selected={filter.order == "KR"}>가나다순</InOption>
                    </FilterSelectSortList>
                  </FilterSelectSort> */}


                </FilterBox>
              {/*상태 select*/}
                <FilterBox>
              <FormControl fullWidth >
                <InputLabel>상태</InputLabel>
                <Select
                  value={filter.sort}
                  onChange={handleChange2}
                >
                  <MenuItem value="ALL" selected={filter.sort == "ALL"}>전체</MenuItem>
                  <MenuItem value="TODAY" selected={filter.sort == "TODAY"}>오늘</MenuItem>
                  <MenuItem value="WEEKEND" selected={filter.sort == "WEEKEND"}>이번주</MenuItem>
                  <MenuItem value="CANCEL" selected={filter.sort == "CANCEL"}>예약 취소</MenuItem>
                  <MenuItem value="DELETE" selected={filter.sort == "DELETE"}>예약 해제</MenuItem>
                  <MenuItem value="OVER" selected={filter.sort == "OVER"}>만료</MenuItem>
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
              </WrapFilterSelect>
          </WrapFilterModal>
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
  margin-bottom:40px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(40/428));
  }

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
  height:480px;
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(400/428));
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
  font-size:12px;color:#4a4a4a;display:inline-block;
  transform:skew(-0.1deg);padding-left:7px;
  font-family:'nbg', sans-serif;
  margin-bottom:9px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(9/428));
    font-size:calc(100vw*(12/428));
    padding-left:calc(100vw*(7/428));
  }
`
const FilterSelectSort = styled.div`
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
  background:url(${ArrowDown}) no-repeat 400px center;background-size:11px;
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
