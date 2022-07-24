//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

import Rating from '@mui/material/Rating';

//img
import Louder from '../../../../img/member/louder.png';
import Checking from '../../../../img/member/checking.png';
import OrangeStar from '../../../../img/member/star_orange.png';
import GreenStar from '../../../../img/member/star_green.png';
import WhiteStar from '../../../../img/member/star_white.png';

//components
import CommonFlexBox from "./commonFlexBox";
import { useSelector } from 'react-redux';

//별점 rating
import BrokerRating from '../../../common/broker/brokerRating';

//server
import serverController from '../../../../server/serverController';

export default function Professional() {
  const login_user = useSelector(data => data.login_user);

  const [txnstatus_structure, setTxnstatus_structure] = useState({});

  //중개매너점수,전문성점수
  const [brokermanner, setbrokermanner] = useState(0);
  const [professionalscore, setprofessionalscore] = useState(0);

  const [all_count, setall_count] = useState([])
  const [complete_count, setcomplete_count] = useState([])
  const [request_all_count, setrequest_all_count] = useState([])
  const [request_count, setrequest_count] = useState([])

  // star(아이콘이미지, 제목, 별수, 오랜지 여부)
  const star = (icon, title, length, isOrange) => {
    console.log("여기 :  " + length);
    let arr = [];
    let whiteLength = 0;
    let isWhite = false;
    let whiteArr = [];
    for (let i = 0; i < length; i++) { arr.push(i); }
    if (5 - length !== 0) {
      whiteLength = 5 - length;
      isWhite = true;
      for (let i = 0; i < whiteLength; i++) { whiteArr.push(i); }
    }
    return (
      <FlexBox>
        <LeftSect>
          <Icon src={icon} alt="icon" />
          <SubTitle>{title}</SubTitle>
        </LeftSect>
        <RightSect>
          {
            arr.map((item, index) => {
              return (
                <Star key={index} src={isOrange ? OrangeStar : GreenStar} />
              )
            })
          }
          {
            isWhite &&
            whiteArr.map((item, index) => {
              return (
                <Star key={index} src={WhiteStar} />
              )
            })
          }
        </RightSect>
      </FlexBox>
    )
  }

  useEffect(async () => {
    let result2 = await serverController.connectFetchController(`/api/realtors/${login_user.company_id}/pro/product-count`, 'GET');//중개의뢰,거래완료 수
    
    let result3 = await serverController.connectFetchController(`/api/realtors/${login_user.company_id}/pro/score`, 'GET');//전문성,매너
    setbrokermanner(result3.data.manner_score);
    setprofessionalscore(result3.data.pro_score);
    
    setall_count(result2.data.all_count)
    setcomplete_count(result2.data.complete_count)

    setrequest_all_count(result2.data.request_all_count)
    setrequest_count(result2.data.request_count)

    console.log('사업자 번호', result2.data);
    console.log('사업자 번호', result3.data);


  }, []);

  // useEffect(()=>{
  //   console.log('tnxtstus tsturctudss:',txnstatus_structure);
  // },[txnstatus_structure]);

  return (
    <>
      {/* -- 수정코드입니다. */}

      {
        txnstatus_structure['now_doing'] && txnstatus_structure['complete'] ?
          <>
            {/* <CommonFlexBox icon={Louder} subTitle={"중개의뢰"} price={txnstatus_structure['now_doing']['maemae'].length} jeonse={txnstatus_structure['now_doing']['jeonse'].length} monthly={txnstatus_structure['now_doing']['walse'].length} /> */}
            <CommonFlexBox icon={Checking} subTitle={"거래완료"} price={txnstatus_structure['complete']['maemae'].length} jeonse={txnstatus_structure['complete']['jeonse'].length} monthly={txnstatus_structure['complete']['walse'].length} />
          </>
          :
          <>
            {/* <CommonFlexBox icon={Louder} subTitle={"중개의뢰"} 
              price={`${request_count.trade_count}/${all_count.trade_count}`} 
              jeonse={`${request_count.deposit_count}/${all_count.deposit_count}`}
              monthly={`${request_count.monthly_count}/${all_count.monthly_count}`} /> */}
            <CommonFlexBox icon={Checking} subTitle={"거래완료"} 
              price={`${complete_count.trade_count}/${all_count.trade_count}`}
              jeonse={`${complete_count.deposit_count}/${all_count.deposit_count}`}
              monthly={`${complete_count.monthly_count}/${all_count.monthly_count}`} />
          </>
      }

      <BrokerRating title={"전문성"} score={professionalscore} />
      <BrokerRating title={"중개매너"} score={brokermanner} />

      {/* {star(Like, "전문성",professionalscore, true)}
          {star(Smile, "중개매너", brokermanner, false)} */}

    </>
  );
}

const FlexBox = styled.div`
display: flex;flex-wrap: wrap;justify-content:space-between;
`
const LeftSect = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
`
const Icon = styled.img`
  width:20px;margin-right:12px;
`
const SubTitle = styled.p`

`
const RightSect = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
`
const Star = styled.img`
  display:inline-block;
  width:16px;
  margin-right:9px;
  &:last-child{margin-right:0;}
  vertical-align:middle;
`