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

function calculateDiffTime(date){
  var stDate =  new Date();
  var endDate = date;
  
  var btMs = endDate.getTime() - stDate.getTime();
  var btDay = btMs / (1000*60*60*24) ;
  
  return Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일"
}

function checkZero(checkString){
  return checkString.toString().length == 1 ?  "0" + checkString : checkString;
}

function getDateType(date){
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
  return temp;
}

function getDateTimeType(date){
  
  var temp = `${date.getHours() > 12 ? "오후 " : "오전 "} ${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${checkZero(date.getMinutes())} `;
  return temp;
}

//필터 모달
export default function Reserve({settingList,filter,filter_data,setFilter}) {
  
  const [value, setvalue] = useState('DESC');
  const [value2, setvalue2] = useState('DESC');

  const handleChange = (e) => {
    setvalue(e.target.value);
   // let temp=[...filter_data];//filter정보가져옴.
   // temp.order=e.target.value;
   // console.log('반영filters:',temp);
    //filter_data.order=e.target.value;
    //setFilter((ob) => {  return temp; })
    setFilter((ob)=> {console.log('ob whatss:',ob); ob.order= e.target.value; return ob;});
  };
  const handleChange2 = (e) => {
    setvalue2(e.target.value);
    //let temp=[...filter_data];
    //temp.index=e.target.value;
    //console.log('반영filterss:',temp);
    //setFilter((ob) => { return temp; })
    //filter_data.index=e.target.value;
    setFilter((ob)=> {console.log('ob whatsss:',ob); ob.index=e.target.value; return ob;})
  };

  //Filter내 셀렉트 박스
  const getStatus = (v) =>{
    return calculateDiffTime(new Date(v.tour_start_date.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/') + " " + v.td_starttime));
  }

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
                  </FilterBox>

                    {/* <FilterSelectSort>
                        <FilterSelectSortList onChange={(e)=>{setFilter(ob => { console.log(e.target.value); ob.order = e.target.value;  return ob;} )}}>
                          <InOption value="DESC" selected={filter.order =="DESC"}>최신등록순</InOption>
                          <InOption value="ASC" selected={filter.order =="ASC"}>과거등록순</InOption>
                          <InOption value="KR" selected={filter.order =="KR"}>가나다순</InOption>
                        </FilterSelectSortList>
                    </FilterSelectSort>*/}
                  

                  {/* <FilterLabel>정렬기준</FilterLabel>
                  <FilterSelectSort>
                    <FilterSelectSortList onChange={(e)=>{setFilter(ob => {  ob.order = e.target.value;  return ob;} )}}>
                      <InOption value="DESC" selected={filter.order =="DESC"}>최신등록순</InOption>
                      <InOption value="ASC" selected={filter.order =="ASC"}>과거등록순</InOption>
                      <InOption value="KR" selected={filter.order =="KR"}>가나다순</InOption>
                    </FilterSelectSortList>
                  </FilterSelectSort> */}
                  
                  <FormControl fullWidth >
                    <InputLabel>방송</InputLabel>
                    <Select
                      value={filter.index}
                      label="방송"
                      onChange={handleChange2}
                    >
                      {
                        settingList.map((value, index) => {
                          return (
                            <MenuItem key={index + "filter_key"} selected={filter.index == index} value={index}>
                              ({value.tour_id}){getDateType(new Date(value.tour_start_date.split('T')[0].replace(/T/gi, ' ').replace(/-/gi, '/') + " " + value.td_starttime))}
                              {getDateTimeType(new Date(value.tour_start_date.split('T')[0].replace(/T/gi, ' ').replace(/-/gi, '/') + " " + value.td_starttime))}
                              ({getStatus(value)}일후)
                            </MenuItem>
                          )
                        })
                      }
                    </Select>
                    </FormControl>
                    {/*
                    <FilterSelectCondition>
                        <FilterSelectConditionList onChange={(e)=>{  setFilter(ob=>{ ob.index = e.target.value;  return ob;}) }}>
                          {
                            settingList.map((value,index)=>{
                              return  (
                              <InOption key={index+"filter_key"} selected={filter.index == index} value={index}>
                                ({value.tour_id}){getDateType(new Date(value.tour_start_date.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/') + " " + value.td_starttime))} 
                                {getDateTimeType(new Date(value.tour_start_date.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/') + " " + value.td_starttime))} 
                                ({getSta>
                              )tus(value)}일후)
                              </InOption
                            })
                          }
                        }
                        </FilterSelectConditionList>
                      </FilterSelectCondition>
                    */}
                  {/* <FilterLabel>방송</FilterLabel>
                  <FilterSelectCondition>
                    <FilterSelectConditionList onChange={(e)=>{  setFilter(ob=>{ ob.index = e.target.value;  return ob;}) }}>
                      {
                        settingList.map((value,index)=>{
                          return  (
                          <InOption key={index+"filter_key"} selected={filter.index == index} value={index}>
                            ({value.tour_id}){getDateType(new Date(value.tour_start_date.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/') + " " + value.td_starttime))} 
                            {getDateTimeType(new Date(value.tour_start_date.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/') + " " + value.td_starttime))} 
                             ({getStatus(value)}일후)
                           </InOption>
                          )
                        })
                      }
                    </FilterSelectConditionList>
                  </FilterSelectCondition> */}

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
  position:fixed;
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
