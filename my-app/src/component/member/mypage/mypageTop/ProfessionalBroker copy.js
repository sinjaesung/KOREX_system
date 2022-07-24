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
    //페이지 도달시점에 실행, 로그인 개인,기업회원의 소속,회원타입등 보낸다.
    let body_info = {
      company_id: login_user.company_id,//당시에 선택되었었던 companyid기준으로 관련 처리진행>>
      user_type: login_user.user_type
    }

    console.log('사업자 번호', login_user.company_id);
    
    let result = await serverController.connectFetchController('/api/broker/brokerProduct_commit_liststatic', 'POST', JSON.stringify(body_info));
    let result2 = await serverController.connectFetchController(`/api/realtors/${login_user.company_id}/pro/info`, 'GET');
    
    console.log('사업자 번호', result2);
    //전문성 및 거래개시,거래완료,중개의뢰현황 계산 및 조회.
    if (result) {
      console.log('====>>brokerProduct commits listatic resultss:', result);
      let brokerRequest_commit_transactionlist = result.result_data;

      var txn_status_structure = {
        now_doing: {
          'jeonse': [],
          'walse': [],
          'maemae': []
        },
        complete: {
          'jeonse': [],
          'walse': [],
          'maemae': []
        },
        now_going: [],
        now_complete: [],//거래완료(성사)된건수.
      };

      if (brokerRequest_commit_transactionlist) {
        for (let ss = 0; ss < brokerRequest_commit_transactionlist.length; ss++) {
          let txn_status = brokerRequest_commit_transactionlist[ss].transaction_status;
          let productinfo = brokerRequest_commit_transactionlist[ss].match_product;
          //console.log('hmm????>>>',txn_status,productinfo);
          if (txn_status == '거래완료') {
            txn_status_structure['now_complete'].push(productinfo);
            switch (productinfo.prd_sel_type) {
              case '월세':
                txn_status_structure['complete']['walse'].push(productinfo);
                break;

              case '전세':
                txn_status_structure['complete']['jeonse'].push(productinfo);
                break;

              case '매매':
                txn_status_structure['complete']['maemae'].push(productinfo);
                break;
            }
          }/*else if(txn_status=='검토대기' || txn_status=='검토중' || txn_status=='거래준비' || txn_status=='거래개시요청' || txn_status=='거래개시' || txn_status=='거래개시승인 요청' || txn_status=='거래완료승인 요청' || txn_status=='거래승인 요청'){*/
          else if (txn_status == '검토대기' || txn_status == '검토중') {
            switch (productinfo.prd_sel_type) {
              case '월세':
                txn_status_structure['now_doing']['walse'].push(productinfo);
                break;

              case '전세':
                txn_status_structure['now_doing']['jeonse'].push(productinfo);
                break;

              case '매매':
                txn_status_structure['now_doing']['maemae'].push(productinfo);
                break;
            }

          } else if (txn_status == '거래개시') {
            txn_status_structure['now_going'].push(productinfo);//거래개시인 항목들 카운트.저장.
          }
        }

        console.log('txn status sturcture all form:', txn_status_structure);
        setTxnstatus_structure(txn_status_structure);
      }

      /*
     총등록건수: 코렉스시스템상 전체에서 각 업소별 등록건수(거래개시인건들)총합.거래개시인 product매물 전체항목
     업소별등록건수:밑의 쿼리에서 거래개시상태인항목들의 count값. 
     전문성지수 = 등록률(업소별 등록건수/총 등록건수)*등록가중치 + 성사율(업소별성사건수/업소별등록건수)*성사가중치
     if(총등록건수>100)등록가중치 = 0.5 , 등록가중치=0.3
     if(업소별등록건수>10) 성사가중치 0.5 , 성사가중치 0.3
     업소별등록건수,업소별성사건수,성사가중치 등은 프론트단에서 판단최종적으로 하고(데이터확인까지)
     총등록건수,등록가중치 등 정보는 서버에서 쿼리로 전달 알려줌
     */
      let all_regist_count = result.all_regist_count;//총 등록건수
      let probroker_per_regist_count = txn_status_structure['now_going'].length;//특정업소 거래개시건수.등록건수
      let probroker_per_complete_count = txn_status_structure['now_complete'].length;//특정업소 거래완료(거래성사)건수 성공건수.

      let regist_weight;
      let complete_weight;

      let professional_score;
      //등록가중치
      if (all_regist_count > 100) {
        regist_weight = 0.5
      } else {
        regist_weight = 0.3
      }
      //성사가중치
      if (probroker_per_regist_count > 10) {
        complete_weight = 0.5;
      } else {
        complete_weight = 0.3;
      }
      //0~0.1 1 / 0.1~0.4 2 / 0.4~0.06 3 / 0.6~0.9 4 / 0.9~?? 5
      professional_score = ((probroker_per_regist_count / all_regist_count) * regist_weight) + ((probroker_per_complete_count / probroker_per_regist_count) * complete_weight);
      console.log('professiaonl score valuess계산:load', professional_score);
      if (professional_score) {
        if (professional_score >= 0 && professional_score < 0.1) {
          setprofessionalscore(1);
        } else if (professional_score >= 0.1 && professional_score < 0.4) {
          setprofessionalscore(2);
        } else if (professional_score >= 0.4 && professional_score < 0.6) {
          setprofessionalscore(3);
        } else if (professional_score >= 0.6 && professional_score < 0.9) {
          setprofessionalscore(4);
        } else if (professional_score >= 0.9) {
          setprofessionalscore(5);
        }
      }
    }
    //중개매너 점수 환산(유저별로 각 유저별 최근점수매긴 값들의 합 각 유저별 임의중개사에 매긴 점수의 합계 평균치로 판단)
    let score_info = {
      company_id: login_user.company_id,
    }
    let score_result = await serverController.connectFetchController('/api/broker/probroker_mannerscore_process', 'POST', JSON.stringify(score_info));

    if (score_result) {
      if (score_result.success) {
        console.log('score_reusltsss:', score_result.result);
        let average = score_result.result.average;
        if (average >= 1 && average < 2) {
          setbrokermanner(1);
        } else if (average >= 2 && average < 3) {
          setbrokermanner(2);
        } else if (average >= 3 && average < 4) {
          setbrokermanner(3);
        } else if (average >= 4 && average < 5) {
          setbrokermanner(4);
        } else if (average >= 5) {
          setbrokermanner(5);
        }
      }
    }
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
            {/* <CommonFlexBox icon={Louder} subTitle={"중개의뢰"} price={0} jeonse={0} monthly={0} /> */}
            <CommonFlexBox icon={Checking} subTitle={"거래완료"} price={0} jeonse={0} monthly={0} />
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