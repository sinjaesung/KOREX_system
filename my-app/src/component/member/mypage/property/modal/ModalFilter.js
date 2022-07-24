//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import Close from '../../../../../img/main/modal_close.png';
import ArrowDown from '../../../../../img/member/arrow_down.png';

//필터 모달
export default function Reserve({ filter, setFilter, cate, setCate, order, setOrder, setfilterItem, filterItem}) {

  const optionList = {
    sort: [
      { name: "상태변경 최신순", order: 'history_create_date', orderType: 'desc' }, 
      { name: "최신등록순 최신순", order: 'create_date', orderType: 'desc' },
      { name: "과거등록순", order: 'create_date', orderType: 'asc' }
    ],      // "최신등록순", "과거등록순"],
    condition:[
      { name: "전체" },
      { name: "←검토 대기" , key: "prd_status", value: '검토대기'},
      { name: "검토 중" , key: "prd_status", value: '검토중'},
      { name: "←의뢰 철회" , key: "prd_status", value: '외뢰철회'},
      { name: "의뢰 수락(거래 준비)" , key: "prd_status", value: '거래준비'},
      { name: "의뢰 거절" , key: "prd_status", value: '의뢰거절'},
      { name: "거래개시승인 요청" , key: "prd_status", value: '거래개시동의요청'},
      { name: "←거래개시 거절" , key: "prd_status", value: '거래개시동의요청 거절'},
      { name: "←거래 개시" , key: "prd_status", value: '거래개시'},
      { name: "←위임 취소" , key: "prd_status", value: '위임취소'},
      { name: "수임 취소" , key: "prd_status", value: '수임취소'},
      { name: "거래완료승인 요청" , key: "prd_status", value: '거래완료승인요청'},
      { name: "←거래완료 거절" , key: "prd_status", value: '거래완료승인요청 거절 '},
      { name: "거래 완료" , key: "prd_status", value: '거래완료 '},
      { name: "←기한만료" , key: "prd_status", value: '기한만료'},
                
      
      
      // "전체",
      //           "←검토 대기" ,
      //           "검토 중" ,
      //           "←의뢰 철회" ,
      //           "의뢰 수락(거래 준비)" ,
      //           "의뢰 거절" ,
      //           "거래개시승인 요청",
      //           "←거래 개시",
      //           "←거래개시 거절" ,
      //           "←위임 취소" ,
      //           "수임 취소" ,
      //           "거래완료승인 요청" ,
      //           "거래 완료" ,
      //           "←거래완료 거절" ,
      //           "←기한만료"
    ],
    item:[
      {name : "전체"},
      {name : '아파트', key: "prd_type", value: "아파트"},
      { name: '오피스텔', key: "prd_type", value: "오피스텔"},
      { name: '상가', key: "prd_type", value: "상가"},
      { name: '사무실', key: "prd_type", value: "사무실"},
      //  "아파트", "오피스텔", "상가", "사무실"
    ],
    mandate:[
      { name: '전체'},
      { name: '사용자의뢰', key: "prd_create_origin", value: "사용자의뢰"},
      { name: '외부수임', key: "prd_create_origin", value: "외부수임"},
      
      // "전체", "사용자의뢰", "외부수임"
    ]
  }

  const commonOption = (item, index, catIndex) => {
    return(
      <InOption selected={cate[catIndex] == index} value={JSON.stringify(item)} key={index}>{item.name}</InOption>
    )
  }

  const onChangeSelect = (e, index) => {
    // switch (key) {
    //   case value:
        
    //     break;
    
    //   default:
    //     break;
    // }
    // let newCate = cate;
    // newCate[index] = e.target.value;
    // setCate([...newCate]);
    // console.log(e.target.value);
    // console.log([...newCate]);
    

    
    console.log(e.target.value);
    if (!!e.target.value){
      const obj = JSON.parse(e.target.value);
      
      if (!!obj.key && !!obj.value) { 
        filterItem[obj.key] = obj.value
         setfilterItem(filterItem);
        console.log('확인하기', filterItem);
      };
      
      if (!!obj.order && !!obj.orderType) { 
        
        console.log('확인하기', obj);
        order['order'] = obj.order
        order['orderType'] = obj.orderType
         setOrder(order); 
      };
      
    }

  }


  //Filter 모달창
    return (
      <Container>
        <WrapFilterSelect>
          {/*정렬기준 select*/}
          <FilterBox>
            <FilterLabel>정렬기준</FilterLabel>
            <FilterSelectSort>
              <FilterSelectSortList onChange={(e) => onChangeSelect(e, 0)}>
                {
                  optionList.sort.map((item, index) => {
                    return( <> {commonOption(item, index, 0)} </> );
                  })
                }
                {/*
                  <InOption>상태변경 최신순</InOption>
                  <InOption>최신등록순</InOption>
                  <InOption>과거등록순</InOption>
                */}
              </FilterSelectSortList>
            </FilterSelectSort>
          </FilterBox>
          {/*상태 select*/}
          <FilterBox>
              <FilterLabel>상태</FilterLabel>
              <FilterSelectCondition>
                <FilterSelectConditionList onChange={(e) => onChangeSelect(e, 1)}>
                  {
                    optionList.condition.map((item, index) => {
                      return( <> {commonOption(item, index, 1)} </> );
                    })
                  }
                  {/*
                    <InOption>전체</InOption>
                    <InOption>←검토 대기</InOption>
                    <InOption>검토 중</InOption>
                    <InOption>←의뢰 철회</InOption>
                    <InOption>의뢰 수락(거래 준비)</InOption>
                    <InOption>의뢰 거절</InOption>
                    <InOption>거래개시승인 요청</InOption>
                    <InOption>←거래 개시</InOption>
                    <InOption>←거래개시 거절</InOption>
                    <InOption>←위임 취소</InOption>
                    <InOption>수임 취소</InOption>
                    <InOption>거래완료승인 요청</InOption>
                    <InOption>←거래 완료</InOption>
                    <InOption>←거래완료 거절</InOption>
                    <InOption>←기한 만료</InOption>
                  */}
                </FilterSelectConditionList>
              </FilterSelectCondition>
            </FilterBox>
          {/*물건종류 select*/}
          <FilterBox>
              <FilterLabel>물건종류</FilterLabel>
              <FilterSelectCondition>
                <FilterSelectConditionList onChange={(e) => onChangeSelect(e, 2)}>
                  {
                    optionList.item.map((item, index) => {
                      return( <> {commonOption(item, index, 2)} </> );
                    })
                  }
                  {/*
                    <InOption>전체</InOption>
                    <InOption>아파트</InOption>
                    <InOption>오피스텔</InOption>
                    <InOption>상가</InOption>
                    <InOption>사무실</InOption>
                  */}
                </FilterSelectConditionList>
              </FilterSelectCondition>
            </FilterBox>
          {/*수임방식 select*/}
          <FilterBox>
            <FilterLabel>수임방식</FilterLabel>
            <FilterSelectCondition>
              <FilterSelectConditionList onChange={(e) => onChangeSelect(e, 3)}>
                {
                  optionList.mandate.map((item, index) => {
                    return( <> {commonOption(item, index, 3)} </> );
                  })
                }
                {/*
                  <InOption>전체</InOption>
                  <InOption>사용자의뢰</InOption>
                  <InOption>외부수임</InOption>
                */}
              </FilterSelectConditionList>
            </FilterSelectCondition>
          </FilterBox>
        </WrapFilterSelect>
    </Container>
  );
}

const Container = styled.div`
`
const WrapModalMap = styled.div`
  width:100%;
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

const WrapFilterSelect = styled.div`
  width:100%;
  margin-bottom:40px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(40/428));
  }

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
