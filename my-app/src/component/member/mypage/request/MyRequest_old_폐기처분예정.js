//react
import React ,{useState, useEffect,useRef} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import Button from '@material-ui/core/Button';


//img
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Location from '../../../../img/member/loca.png';
import Set from '../../../../img/member/setting.png';
import Item from '../../../../img/main/item01.png';
import Noimg from '../../../../img/member/company_no.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';

import { Mobile, PC } from "../../../../MediaQuery"

import serverController from '../../../../server/serverController';

//component
import RequestListPage from "./RequestList";
import RequestSorting from "./RequestSorting";
import ModalAddUserInfo from './modal/ModalAddUserInfo';
import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';

//redux addons assets;
import {useSelector } from 'react-redux';
import login_user from '../../../../store/modules/login_user';

export default function Request({mannerModal,startModal,filterModal,cancleModal,completeModal,cancle2Modal,setFilter,value,type,brokerproductlist,setBrokerproductlist,alramsetting_tiny,setalramsetting_tiny}) {
 
  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const showModal =()=>{
    setMenu(!menu);
  }
  
  //const [is_serveron,setIs_serveron] = useState(false);
  const [userInfo,setUserInfo] = useState(false);

  const login_user_redux = useSelector(data => data.login_user);//로그인 정보 저장 리덕스.로그인 mem_id조회.

  /*data map*/
  const RequestListItem =[
    {
      prd_identity_id : 0,
      prd_img:Item,
      date:"21.00.00 - 21.00.00",
      prd_status:"검토 대기",
      modify_date:"2021.00.00",
      prd_name:"충남내포신도시2차대방엘리움더센트럴",
      prd_type:"아파트",
      address:"자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      addr_detail: "자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      prd_sel_type:"매매",
    },
    {
      prd_identity_id : 1,
      prd_img:Item,
      date:"21.00.00 - 21.00.00",
      prd_status:"거래 준비",
      modify_date:"2021.00.00",
      prd_name:"충남내포신도시2차대방엘리움더센트럴",
      prd_type:"아파트",
      address:"자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)  강남구 서초동 서초동 서초동",
      addr_detail:"자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)  강남구 서초동 서초동 서초동",
      prd_sel_type:"매매"
    },
    {
      prd_identity_id : 2,
      prd_img:Noimg,
      date:"21.00.00 - 21.00.00",
      prd_status:"의뢰 철회",
      modify_date:"2021.00.00",
      prd_name:"충남내포신도시2차대방엘리움더센트럴",
      prd_type:"아파트",
      address:"자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      addr_detail:"자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      prd_sel_type:"매매",
    },
    {
      prd_identity_id : 3,
      prd_img:Noimg,
      date:"21.00.00 - 21.00.00",
      prd_status:"위임 취소",
      modify_date:"2021.00.00",
      prd_name:"충남내포신도시2차대방엘리움더센트럴",
      prd_type:"아파트",
      address:"자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      addr_detail:"자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      prd_sel_type:"매매",
    }
]

  const topInfoContent = () => {
    return(
      <FilterAndAdd>
      {/*유저 정보 있을 경우 이부분 주석 해제 되어야함*/}
      
      {/**/}

      {/*05.21 유저 정보가 없을 경우 본인정보 추가 모달 떠야함!! default 값으로 고정*/}
      {
        !login_user_redux.user_name || !login_user_redux.phone ?
          <div className="cursor-p" onClick={()=>{setUserInfo(true)}}>
          {/* <AddBtn>추가</AddBtn> */}
              <Button variant="contained">추가</Button>
         </div>
         :
         <Link to="/AddRequest" className="cursor-p">
           {/* <AddBtn>추가</AddBtn> */}
              <Button variant="contained">추가</Button>
         </Link>
      }
      
    </FilterAndAdd>
    )
  }

    return (
        <Container>
          <WrapRequest>
            <TopTitle>내 중개의뢰</TopTitle>
            <RequestSorting filterModal={filterModal} setBrokerproductlist={setBrokerproductlist}/>{/*컴포넌트입니다*/}

            {/* 수정코드입니다. */}
            <CommonTopInfo length={brokerproductlist.length?brokerproductlist.length:0} leftComponent={topInfoContent()}/>
            {/* -- 원래 코드입니다. */}
            {/*
              <TopInfo>
                <All>총 <GreenColor>{ is_serveron == true ? brokerproductlist.length : RequestListItem.length}</GreenColor> 건</All>
                <FilterAndAdd>
                  <Link to="/AddRequest">
                    <AddBtn>추가</AddBtn>
                  </Link>
                </FilterAndAdd>
              </TopInfo>
            */}

            <RequestList>
              {/*console.log('server logon or error여부 :',is_serveron)*/}
            {
              /*
            is_serveron == true &&  RequestListItem.length > 0 ?  //false -> true 바꾼기...
            RequestListItem.map((value) => {
              const type=()=>{
                if(value.prd_status == "검토 대기") { //검토대기
                  return 1
                }else if(value.prd_status == "거래 준비") {//거래준비
                  return 1
                } else if(value.prd_status == "의뢰 철회") { // 의뢰 철회
                  return 0.5
                } else if(value.prd_status == "위임 취소") { // 위임 취소
                  return 0.5
                }
              }
              return(
                <RequestListPage filterModal={filterModal} mannerModal={mannerModal} cancleModal={cancleModal} startModal={startModal} cancle2Modal={cancle2Modal} completeModal={completeModal} type={type} value={value}/>
              )
            })
            :
            null
            */
          }
          
          {
            brokerproductlist.length > 0 ? 
            brokerproductlist.map((value) => {

              let local_item= value['prd_id_history_child'][0];//prdidienitiyid요소의 자식들중 히스토리내역중 가장 최근것 0번 가장 초기origin요소(x,y포함한 모든 최근 수정정보까지 매물정보) 그 이후의 내역들은 사실상 상태변경의 내역들만 저장하고있을뿐이다.
              let match_transaction_item=value['match_transaction_row'][0];//그 각 그룹prdiientityi별 하나별의 최근 transaciton내역한개를 정보저장.
              const type=()=>{
                if(match_transaction_item.prd_status == '대기' || match_transaction_item.prd_status=='검토대기'){
                  return 1
                }else if(match_transaction_item.prd_status == '거래준비'){
                  return 1
                }else if(match_transaction_item.prd_status == '의뢰철회'){
                  return 0.5
                }else if(match_transaction_item.prd_status == '위임취소'){
                  return 0.5
                }
              }

              return(
                <RequestListPage setFilter={setFilter} type={type} value={local_item} match_transaction_item={match_transaction_item} filterModal={filterModal} mannerModal={mannerModal} cancleModal={cancleModal} startModal={startModal} cancle2Modal={cancle2Modal} completeModal={completeModal} alramsetting_tiny={alramsetting_tiny} setalramsetting_tiny={setalramsetting_tiny} setBrokerproductlist={setBrokerproductlist}/>
              )
              
            })
            :null
          }

        </RequestList>
      </WrapRequest>
      
          {
            userInfo ?
            <ModalAddUserInfo setUserInfo={setUserInfo}/>
            :
            null
          }
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
const WrapRequest = styled.div`
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
  margin-top:30px;
  border-top:1px solid #f2f2f2;
  border-bottom:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(30/428));
    padding:calc(100vw*(22/428)) calc(100vw*(10/428));
    }
`
const All = styled.span`
  font-size:17px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    }
`
const FilterAndAdd = styled.div`
  position:relative;
  display:flex;justify-content:flex-start; align-items:center;
`
const AddBtn = styled.div`
  width: 81px;
  height: 30px;
  border-radius: 4px;
  border: solid 2px #f0a764;
  background-color: #fe7a01;
  line-height:26px;
  font-size:13px;
  font-weight:800;transform:skew(-0.1deg);
  text-align:center;
  margin-left:15px;
  color:#fff;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(80/428));
    height:calc(100vw*(30/428));
    line-height:calc(100vw*(26/428));
    font-size:calc(100vw*(13/428));
    margin-left:calc(100vw*(15/428));
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
const RequestList = styled.ul`
  width:100%;
`