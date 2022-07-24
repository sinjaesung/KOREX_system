//react
import React ,{useState, useEffect,useRef} from 'react';
import {Link} from "react-router-dom";

//material-ui
import IconButton from '@material-ui/core/IconButton';

//css
import styled from "styled-components"

//img
import IconRecent from "../../../../img/main/icon_view.png";

//component
//server controlelr..
import serverController from '../../../../server/serverController';

//redux
import {useSelector} from 'react-redux';

export default function Request({filterModal,value,type,setBrokerproductlist}) {
  const maemultype_ref=useRef();
  const seltype_ref=useRef();
  const price_ref=useRef();
  const pyeong_ref=useRef();
  
  const login_user_redux= useSelector(data=> data.login_user);

  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const showMenu =()=>{
    setMenu(!menu);
  }

  // 이 부분만 추가/수정하면 됩니다.
  const listData = [
    ["유형","아파트", "오피스텔", "상가", "사무실"],
    ["거래 유형","매매", "전세", "월세"],
    ["가격","100만이하", "100만~500만", "500만~1000만","1000만~4000만","4000만~1억","1억~3억","3억이상"],//매매는 prdprdice매매거래액,전세는 prdprice 전세보증금값, 월세는 prdprice월세보증값,월세액(월세개 그 보증금이 없으면 prdprice를 월세로 해도되게으나)월세의 경우 보증금+월세액 둘다 취급하기에 prd_price,prd_month_prcie로 처리.
    ["면적","10평이하", "10평이상20평이하", "20평이상30평이하", "30평이상40평이하","40평이상"],
  ]


  const onChangeList = async (e) => {
    // 0 - 물건종류
    // 1 - 거대유형
    // 2 - 가격
    // 3 - 면적
    // console.log(index);
    console.log('각 셀렉트박스별 상태값변화에 따른 조건에 따른 처리.',e);
    let maemultype=maemultype_ref.current.value;
    let seltype=seltype_ref.current.value;
    let price=price_ref.current.value;
    let pyeong=pyeong_ref.current.value;
    console.log(maemultype_ref,seltype_ref,price_ref,pyeong_ref);
    console.log('각 셀렉박스 변화상태시점별 선택값상태:',maemultype,seltype,price,pyeong);
    // 선택 항목
    // console.log(e.target.value);
    let body_info ={
      user_type: login_user_redux.user_type,
      maemultype: maemultype,
      price:price,
      pyeong:pyeong,
      seltype:seltype
    }

    let res=await serverController.connectFetchController('/api/broker/user_brokerRequestlistview_filter','POST',JSON.stringify(body_info));
    console.log('res reusltsss:',res);

    if(res){
      if(res.success){
        if(res.result_data){
          console.log('res resultsssss:',res.result_data);
          setBrokerproductlist(res.result_data);
        }
      }else{

      }
    }
  }

  const commonList = (array) => {
    return(<>{
      // listData의 자식요소에 접근
      array.map((item, index) => {
        return(
        <ItemList onChange={e => onChangeList(e, index)} key={index}>
          {
            item.map((itemChild, indexChild) => {
              // listData의 자식요소의 자식요소에 접근
              if(indexChild == 0){return(<ItemSubList key={indexChild} selected>{itemChild}</ItemSubList>)}
              return(<ItemSubList key={indexChild}>{itemChild}</ItemSubList>);
            })
          }
        </ItemList>
        )
      })
    }</>)
  }
  
    return (
        <Container>
          <ModalSelect>
              {/* 수정코드입니다. */}
              {/*commonList(listData)*/}
              {/* -- 원래 코드입니다. */}
                     
                {/*매물물건종류별 셀렉트박스 */}
                <ItemList onChange={e => onChangeList(e)} ref={maemultype_ref}>
                {
                listData[0].map((item,index)=> {       
                  return(<ItemSubList key={index}>{item}</ItemSubList>)           
                })
                }
                </ItemList>
                <ItemList onChange={e => onChangeList(e)} ref={seltype_ref}>
                {
                listData[1].map((item,index)=> {       
                  return(<ItemSubList key={index}>{item}</ItemSubList>)           
                })
                }
                </ItemList>
                <ItemList onChange={e => onChangeList(e)} ref={price_ref}>
                {
                listData[2].map((item,index)=> {       
                  return(<ItemSubList key={index}>{item}</ItemSubList>)           
                })
                }
                </ItemList>
                <ItemList onChange={e => onChangeList(e)} ref={pyeong_ref}>
                {
                listData[3].map((item,index)=> {       
                  return(<ItemSubList key={index}>{item}</ItemSubList>)           
                })
                }
                </ItemList>
                {/*
                <ItemList>
                  <ItemSubList selected disabled>물건종류</ItemSubList>
                  <ItemSubList>물건종류1</ItemSubList>
                  <ItemSubList>물건종류2</ItemSubList>
                  <ItemSubList>물건종류3</ItemSubList>
                </ItemList>
                <ItemList>
                  <ItemSubList selected disabled>거래유형</ItemSubList>
                  <ItemSubList>거래유형1</ItemSubList>
                  <ItemSubList>거래유형2</ItemSubList>
                  <ItemSubList>거래유형3</ItemSubList>
                </ItemList>
                <ItemList>
                  <ItemSubList selected disabled>가격</ItemSubList>
                  <ItemSubList>가격1</ItemSubList>
                  <ItemSubList>가격2</ItemSubList>
                  <ItemSubList>가격3</ItemSubList>
                </ItemList>
                <ItemList>
                  <ItemSubList selected disabled>면적</ItemSubList>
                  <ItemSubList>면적1</ItemSubList>
                  <ItemSubList>면적2</ItemSubList>
                  <ItemSubList>면적3</ItemSubList>
                </ItemList>
              */}
            
            <SortRecent> 
            <IconButton onClick={() => { filterModal(); }}>
              <RecentImg src={IconRecent} />
            </IconButton>


              {/* <RecentList>
                  <Span onClick={()=>{filterModal();}}><RecentImg src={IconRecent}/></Span>
              </RecentList> */}
            </SortRecent>
          </ModalSelect>
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
`
const ModalSelect = styled.div`
  width:100%;
  margin-top:40px;
  display:flex;justify-content:center;align-items:flex-start;
  @media ${(props) => props.theme.mobile} {
      margin-top:calc(100vw*(28/428));
    }
`


const ItemList = styled.select`
  width:81px;
  border-radius:4px;border:1px solid #979797;
  padding:6px 0;
  margin-right:5px;
  background:#fff;
  text-align:center;
  text-align-last:center;
  position:relative;
  z-index:2;
  font-size:13px;
  transform:skew(-0.1deg);font-weight:600;
  appearance:none;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(80/428));
      padding:calc(100vw*(6/428));
      margin-right:calc(100vw*(5/428));
      font-size:calc(100vw*(13/428));
    }

`
const ItemSubList = styled.option`
`
const SortRecent = styled.div`

`
const RecentList = styled.ul`
  position:relative;
  width:30px;height:30px;padding:0;
  margin-left:30px;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(30/428));height:calc(100vw*(30/428));
      margin-left:calc(100vw*(30/428));
    }
`
const RecentImg = styled.img`
  width:19px;height:19px;vertical-align: -webkit-baseline-middle;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(19/428));height:calc(100vw*(19/428));
    }

`
const Span = styled.span`
  font-size:13px;color:#707070;
  text-align:center;cursor:pointer;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(13/428));
    }

`
const RecentSubdepth = styled.ul`
  position:absolute;top:0;left:30px;
  margin-top:5px;
  border-radius:8px;border:1px solid #707070;
  background:#fff;
  width:70px;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(70/428));
      margin-top:calc(100vw*(5/428));
      top:calc(100vw*(25/428));left:calc(100vw*(-40/428));
    }
`
const ReceentSubList = styled.li`
  font-size:13px;color:#707070;
  text-align:center;
  font-weight:600;transform:skew(-0.1deg);
  cursor:pointer;
  padding:4px 0;
  border-radius:8px;
  transition:all 0.3s;
  &:hover{background:#f8f7f7;}
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(13/428));
      padding:calc(100vw*(4/428)) 0;
    }
`
