//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//img
import Arrow from "../../../../img/map/filter_next.png";
import Detail from "../../../../img/map/detail_img.png";
import Trade from "../../../../img/map/trade.png";
import Report from "../../../../img/map/report.png";
import Change from "../../../../img/member/change.png";

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';


// components
import { Mobile, PC } from "../../../../MediaQuery";

SwiperCore.use([Navigation, Pagination]);
// export default function SideItemDetail({openBunyang, rank, updatePageIndex,historyInfo,setMap}) {
export default function DanjiDetailView({ topDesc ,list, areaIndex , setList, danjiDesc, areainfo_structure, typeIndex, setTypeIndex}) {
    console.log('===>danjdetailview시행:::',list);
    return (
        <Container>
            <DanjiWidthList>
              <TopInfo>
                <TextLine>
                  <Title>공급/전용면적</Title>
                  <Data>{danjiDesc['area']}</Data>
                </TextLine>
                {/*<TextLine>
                  <Title>해당타입세대수</Title>
                  <Data>{topDesc['danji']}/{danjiDesc['typeNum']}</Data>
                </TextLine>
                */}
              </TopInfo>
              <WrapPriceList>
                <PriceListTop>
                  <Title>실거래가</Title>
                  <TabBtn>
                    <Tab active={typeIndex == 0 } onClick={()=>{
                      setTypeIndex(0);
                      let transaction_typelist=[];
                      for(let d=0; d<areainfo_structure[areaIndex]['totaltransaction'].length; d++){
                        transaction_typelist[d]={};
                        transaction_typelist[d]['contract_ym'] = areainfo_structure[areaIndex]['totaltransaction'][d]['contract_ym'];
                        transaction_typelist[d]['contract_dt'] = areainfo_structure[areaIndex]['totaltransaction'][d]['contract_dt'];
                        transaction_typelist[d]['type'] = areainfo_structure[areaIndex]['totaltransaction'][d]['type'];
                        transaction_typelist[d]['deposit'] = areainfo_structure[areaIndex]['totaltransaction'][d]['deposit'];
                        transaction_typelist[d]['floor'] = areainfo_structure[areaIndex]['totaltransaction'][d]['floor'];
                      }
                      setList(transaction_typelist);
                    }}>전체</Tab>
                    <Part/>
                    <Tab active={typeIndex == 1 } onClick={()=>{
                      setTypeIndex(1);
                      let transaction_typelist=[];
                      for(let d=0; d<areainfo_structure[areaIndex]['mametransaction'].length; d++){
                        transaction_typelist[d]={};
                        transaction_typelist[d]['contract_ym'] = areainfo_structure[areaIndex]['mametransaction'][d]['contract_ym'];
                        transaction_typelist[d]['contract_dt'] = areainfo_structure[areaIndex]['mametransaction'][d]['contract_dt'];
                        transaction_typelist[d]['type'] = areainfo_structure[areaIndex]['mametransaction'][d]['type'];
                        transaction_typelist[d]['deposit'] = areainfo_structure[areaIndex]['mametransaction'][d]['deposit'];
                        transaction_typelist[d]['floor'] = areainfo_structure[areaIndex]['mametransaction'][d]['floor'];
                      }
                      setList(transaction_typelist);
                    }}>매매</Tab>
                    <Part/>
                    <Tab active={typeIndex == 2 } onClick={()=>{
                      setTypeIndex(2);
                      let transaction_typelist=[];
                      for(let d=0; d<areainfo_structure[areaIndex]['jeonsewalsetransaction'].length; d++){
                        transaction_typelist[d]={};
                        transaction_typelist[d]['contract_ym'] = areainfo_structure[areaIndex]['jeonsewalsetransaction'][d]['contract_ym'];
                        transaction_typelist[d]['contract_dt'] = areainfo_structure[areaIndex]['jeonsewalsetransaction'][d]['contract_dt'];
                        transaction_typelist[d]['type'] = areainfo_structure[areaIndex]['jeonsewalsetransaction'][d]['type'];
                        transaction_typelist[d]['deposit'] = areainfo_structure[areaIndex]['jeonsewalsetransaction'][d]['deposit'];
                        transaction_typelist[d]['floor'] = areainfo_structure[areaIndex]['jeonsewalsetransaction'][d]['floor'];
                      }

                      setList(transaction_typelist);
                    }}>전월세</Tab>
                  </TabBtn>
                </PriceListTop>
                <PriceList>
                  <DivTitle>
                    <Div>계약일</Div>
                    <Div>거래유형</Div>
                    <Div>거래금액</Div>
                    <Div>층수</Div>
                  </DivTitle>
                  
                  
                  {
                    list.map((value, index) => {
                      return(
                        <DivCont key={index}>
                          <Divv>{value.contract_ym}{value.contract_dt}</Divv>
                          <Divv>{value.type}</Divv>
                          <Divv>{value.deposit}</Divv>
                          <Divv>{value.floor}</Divv>
                        </DivCont>
                      )
                    })
                  }

                </PriceList>
              </WrapPriceList>
            </DanjiWidthList>
        </Container>
  );
}

const Container = styled.div `
  width:100%;
`
const DanjiWidthList = styled.div`
  width:100%;
  margin-top:43px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(40/428));
  }
`
const TopInfo = styled.div`
  padding-left:22px;
  width:100%;
  @media ${(props) => props.theme.mobile} {
    padding-left:calc(100vw*(28/428));
  }
`
const TextLine = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin:35px 0;
  &:last-child{margin-bottom:0}
  @media ${(props) => props.theme.mobile} {
    margin:calc(100vw*(35/428)) 0;
  }
`
const Title = styled.p`
  font-size:15px;font-weight:600;
  transform:skew(-0.1deg);color:#898989;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Data = styled(Title)`
  color:#4a4a4a;
  margin-left:17px;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(10/428));
  }
`
const WrapPriceList = styled.div`
  width:100%;
  margin-top:25px;padding-top:25px;
  border-top:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(25/428));
    padding-top:0;
    border-top:none;
  }
`
const PriceListTop = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:25px;
  padding:0 22px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(384/428));
    margin:0 auto calc(100vw*(25/428));
    padding:calc(100vw*(25/428)) 0 0;
    border-top:1px solid #f2f2f2;
  }
`
const TabBtn = styled.div`
  display:flex;justify-content:space-between;align-items:center;
`
const Tab = styled.div`
  font-size:15px;font-weight:600;
  transform:skew(-0.1deg);
  cursor:pointer;
  transition:all 0.3s;
  color:${({active}) => active ? "#01684b" : "#707070"};
  font-weight:${({active}) => active ? 800 : 600};
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Part = styled.p`
  display:inline-block;
  width:1px;height:16px;
  margin:0 14px;
  vertical-align:middle;
  background:#707070;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(13/428));
  }
`
const PriceList = styled.table`
  width:100%;
  table-layout:fixed;
`
const DivTitle = styled.div`
  display:flex;justify-content:space-around;align-items:center;
  text-align:center;
  padding:17px 0 18px;
  background:#f8f7f7;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(13/428)) 0 calc(100vw*(13/428)) calc(100vw*(0/428));
    border-top:1px solid #f8f7f7;
  }

`
const Div = styled.div`
  text-align:center;
  font-size:15px;color:#898989;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    &:first-child{padding-left:calc(100vw*(12/428));}
    &:nth-child(3){margin-left:calc(100vw*(-2/428));}
    &:last-child{padding-left:calc(100vw*(10/428));}
  }
`
const DivCont = styled(DivTitle)`
  background:transparent; display:flex;justify-content:space-around;align-items:center;
  text-align:center;
  &:nth-child(2) div{color:#fe7a01;}
  @media ${(props) => props.theme.mobile} {
    padding-left:0;
  }
`
const Divv = styled(Div)`
  color:#4a4a4a;
  &:nth-child(1){width:25%;}
  &:nth-child(2){width:10%;}
  &:nth-child(3){width:20%;}
  &:nth-child(4){width:10%;}
  @media ${(props) => props.theme.mobile} {
    &:first-child{padding-left:0;}
    &:nth-child(3){margin-left:0;}
    &:last-child{padding-left:0;}
  }
`
