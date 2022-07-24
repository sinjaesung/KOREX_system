//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img

import { Mobile, PC } from "../../../../MediaQuery"

import ConditionChangeList from "./ConditionChangeList";

export default function Condition({setMap,setFilter,setVisit,setVCal,value, type, type2,conditionchangelist}) {

  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const showModal =()=>{
    setMenu(!menu);
  }
  /*data map*/
  const ConditionListItem =[
    {
      c_id : 0,
      condition:"의뢰거절",
      date:"2020.01.01",
      subtitle:"처리자명",
      name:"홍길동",
      type:"gray",
      reason:"안녕하세요 요청사항 말씀드립니다 -안녕하세요 요청사항 말씀드립니다. 이렇게 이렇게 해주세요 등등."

    },
    {
      c_id :1,
      condition:"검토중",
      date:"2020.01.01",
      subtitle:"처리자명",
      name:"홍길동",
      type:"green",
      reason:""
    },
    {
      c_id : 2,
      condition:"검토대기",
      date:"2020.01.01",
      subtitle:"의뢰인명",
      name:"홍길동",
      type:"orange",
      reason:""
    },
    {
      c_id : 3,
      condition:"거래완료",
      date:"2020.01.01",
      subtitle:"의뢰인명",
      name:"홍길동",
      type:"green",
      reason:""
    },
    {
      c_id : 4,
      condition:"거래완료 승인 요청",
      date:"2020.01.01",
      subtitle:"처리자명",
      name:"홍길동",
      type:"green",
      reason:""
    },
    {
      c_id : 5,
      condition:"거래개시 승인 요청",
      date:"2020.01.01",
      subtitle:"처리자명",
      name:"홍길동",
      type:"orange",
      reason:""
    },
    {
      c_id :6,
      condition:"거래 준비",
      date:"2020.01.01",
      subtitle:"처리자명",
      name:"홍길동",
      type:"green",
      reason:""
    },
    {
      c_id :7,
      condition:"검토 대기",
      date:"2020.01.01",
      subtitle:"처리자명",
      name:"홍길동",
      type:"orange",
      reason:""
    },

]


return (
  <Container>
          <WrapCondition>
            <TopTitle>상태변경 내역</TopTitle>
            <ConditionList>
            {
              conditionchangelist.map((value) => {
                let item=value['item_info'];
                let generator_who=value.generator_who;
              const type=()=>{
                if(item.prd_status == "검토대기" || item.prd_status=='검토중' || item.prd_status=='거래준비' || item.prd_status=='거래개시 승인 요청' ) {
                  return "#fe7a01"
                }else if(item.prd_status == "의뢰철회" || item.prd_status=='수임취소' || item.prd_status=='위임취소' || item.prd_status=='의뢰거절') {
                  return "#707070"
                } else if(item.prd_status == "거래완료" || item.prd_status=='거래완료 승인 요청') {
                  return "#01684b"
                }
              }
              const type2=()=>{
                if(item.prd_status == "검토대기" || item.prd_status=='검토중' || item.prd_status=='거래준비' || item.prd_status=='거래개시 승인 요청' ) {
                  return 1
                }else if(item.prd_status == "의뢰철회" || item.prd_status=='수임취소' || item.prd_status=='위임취소' || item.prd_status=='의뢰거절') {
                  return 0.5
                } else if(item.prd_status == "거래완료" || item.prd_status=='거래완료 승인 요청') {
                  return 1
                }
              }

              return(
                <ConditionChangeList setMap={setMap} setFilter={setFilter} setVisit={setVisit} setVCal={setVCal} value={item} generator_who={generator_who} type={type} type2={type2}/>
              )
            })
          }
        </ConditionList>
      </WrapCondition>
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
    width:680px;
    margin:0 auto;
    padding:24px 0 250px;
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(380/428));
      padding:calc(100vw*(30/428)) 0 calc(100vw*(150/428));
      }
`
const WrapCondition = styled.div`
  width:100%;
`
const TopTitle = styled.h2`
  font-size:20px;color:#707070;
  text-align:left;padding-left:30px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding-left:calc(100vw*(16/428));
    }
`
const TopInfo = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:16px 40px;
  margin-top:40px;
  border-top:1px solid #f2f2f2;
  border-bottom:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(30/428));
    padding:calc(100vw*(22/428)) calc(100vw*(18/428));
    }
`
const All = styled.span`
  font-size:17px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    }
`
const GreenColor = styled(All)`
  color:#01684b;
`
const FilterImg = styled.img`
  display:inline-block;
  width:18px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
  }
`
const ConditionList = styled.ul`
  width:450px;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    }
`
