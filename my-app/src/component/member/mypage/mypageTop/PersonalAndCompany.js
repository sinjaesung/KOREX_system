//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import Louder from '../../../../img/member/louder.png';
import Checking from '../../../../img/member/checking.png';

//components
import CommonFlexBox from "./commonFlexBox";

//redux
import {useSelector} from 'react-redux';

//server
import serverController from '../../../../server/serverController';

export default function PersonalAndCompany() {
  console.log('p...personsal and company함수 실행...');

  const login_user=useSelector(data => data.login_user);
  const [txnstatus_structure,setTxnstatus_structure]=useState({});
  useEffect(async() => {
    //페이지 도달시점에 실행, 로그인 개인,기업회원의 소속,회원타입등 보낸다.
    let body_info = {
      mem_id : login_user.memid,
      user_type : login_user.user_type,//로그인memid,로그인 유저타입
      company_id : login_user.company_id//로그인한 유저의 현재 선택 소속companyid값>>>
    }
    let result=await serverController.connectFetchController('/api/broker/brokerRequest_product_staticview','POST',JSON.stringify(body_info));

    if(result){
      console.log('====>>resultss:',result);
      let brokerRequest_transactionlist=result.result_data;

      var txn_status_structure={
        now_doing : {
          'jeonse': [],
          'walse' : [],
          'maemae' : []
        },
        complete: {
          'jeonse': [],
          'walse':[],
          'maemae':[]
        }
      };
      if(brokerRequest_transactionlist){
        for(let ss=0; ss<brokerRequest_transactionlist.length; ss++){
          let txn_status= brokerRequest_transactionlist[ss].transaction_status;
          let productinfo = brokerRequest_transactionlist[ss].match_product;
          console.log('hmm????>>>',txn_status,productinfo);
          if(txn_status=='거래완료'){
            switch(productinfo.prd_sel_type){
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
          }/*else if(txn_status=='검토대기' || txn_status=='검토중' || txn_status=='거래준비' || txn_status=='거래개시요청' || txn_status=='거래개시' || txn_status=='거래개시동의요청' || txn_status=='거래완료승인요청'){*/
          else if(txn_status=='검토대기' || txn_status=='검토중'){
            switch(productinfo.prd_sel_type){
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
          }
        }
        console.log('txn status sturcture all form:',txn_status_structure);
        setTxnstatus_structure(txn_status_structure);
      }
    }
  },[]);
  useEffect(()=>{
    console.log('txntns stusru::',txnstatus_structure);
  },[txnstatus_structure])

    return ( 
      <>
          {/* -- 수정 코드입니다. */}
          {
            txnstatus_structure['now_doing'] && txnstatus_structure['complete'] ?
            <>
            <CommonFlexBox icon={Louder} subTitle={"중개의뢰"} price={txnstatus_structure['now_doing']['maemae'].length} jeonse={txnstatus_structure['now_doing']['jeonse'].length} monthly={txnstatus_structure['now_doing']['walse'].length} />
            <CommonFlexBox icon={Checking} subTitle={"거래완료"} price={txnstatus_structure['complete']['maemae'].length} jeonse={txnstatus_structure['complete']['jeonse'].length} monthly={txnstatus_structure['complete']['walse'].length} />
            </>
            :
            <>
            <CommonFlexBox icon={Louder} subTitle={"중개의뢰"} price={0} jeonse={0} monthly={0} />
            <CommonFlexBox icon={Checking} subTitle={"거래완료"} price={0} jeonse={0} monthly={0} />
            </>
          }
          
          {/* -- 원래 코드입니다. */}
          {/*
            <FlexBox>
              <Left>
                <Icon src={Louder} alt="icon"/>
                <SubTitle>중개의뢰</SubTitle>
              </Left>
              <Right>
                <TxtHave>매매2</TxtHave>
                <Part/>
                <Txt>전세0</Txt>
                <Part/>
                <Txt>월세0</Txt>
              </Right>
            </FlexBox>
            <FlexBox>
              <Left>
                <Icon src={Checking} alt="icon"/>
                <SubTitle>거래완료</SubTitle>
              </Left>
              <Right>
                <TxtHave>매매1</TxtHave>
                <Part/>
                <Txt>전세0</Txt>
                <Part/>
                <Txt>월세0</Txt>
              </Right>
            </FlexBox>
          */}
      </>
  );
}

