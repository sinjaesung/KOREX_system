//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import ArrowDown from '../../../img/member/arrow_down.png';

//필터 모달
export default function Reserve({currentFilter, setCurrentFilter, onChangeSort, onChangeCondi}) {

  //Filter 모달창
  return (
    <Container>
      <WrapFilterModal>
          <WrapFilterSelect>
          {/*정렬기준 select*/}
            <FilterBox>
              <FilterLabel>정렬기준</FilterLabel>
              <FilterSelectSort>
                <FilterSelectSortList onChange={(e) => onChangeSort(e)}>
                  <InOption selected={currentFilter.sort == 0 ? true : false} value={0} >최신등록순</InOption>
                  <InOption selected={currentFilter.sort == 1 ? true : false} value={1}>과거등록순</InOption>
                  <InOption selected={currentFilter.sort == 2 ? true : false} value={2}>가나다순</InOption>
                </FilterSelectSortList>
              </FilterSelectSort>
            </FilterBox>
          {/*상태 select*/}
            <FilterBox>
              <FilterLabel>보기</FilterLabel>
              <FilterSelectCondition>
                <FilterSelectConditionList onChange={(e) => onChangeCondi(e)}>
                  <InOption selected={currentFilter.view == 0 ? true : false} value={0} >전체</InOption>
                  <InOption selected={currentFilter.view == 1 ? true : false} value={1}>Live방송 예고</InOption>
                </FilterSelectConditionList>
              </FilterSelectCondition>
            </FilterBox>
          </WrapFilterSelect>
      </WrapFilterModal>
    </Container>
  );
}


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
