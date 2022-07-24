//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {Tabs, Tab} from 'react-bootstrap-tabs';

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
export default function SideItemDetail({setDanjiDesc, setList, areainfo_structure,isArea, areaIndex, setAreaIndex, setTypeIndex,isWidth}) {
    
    return (
        <Container>
            <DanjiWidthList>
              <SwiperBennerWrap className="danji_swiper">
 
                      {
                        isArea&&
                        <Swiper
                          slidesPerView={6}
                          loop={false}
                          autoplay={true}
                          onSlideChange={() => console.log('slide change')}
                          onSwiper={(swiper) => console.log(swiper)}>
                          {

                            areainfo_structure.map((value,index)=>{
                              let key_val=value['key'];
                              let information= value['info'];
                              return(
                                <SwiperSlide key={index}>
                                  <Width active={areaIndex == index} onClick={()=>{
                                    setAreaIndex(index);
                                    setDanjiDesc({
                                      area : parseFloat(areainfo_structure[index]['info']['supply_area']).toFixed(3)+'/'+parseFloat(areainfo_structure[index]['info']['exclusive_area']).toFixed(3),
                                      //typeNum: areainfo_structure[index]['sadecnt']
                                    });

                                    var transaction_typelist=[];
                                    for(let d=0; d<areainfo_structure[index]['totaltransaction'].length; d++){
                                      transaction_typelist[d]={};
                                      transaction_typelist[d]['contract_ym'] = areainfo_structure[index]['totaltransaction'][d]['contract_ym'];
                                      transaction_typelist[d]['contract_dt'] = areainfo_structure[index]['totaltransaction'][d]['contract_dt'];
                                      transaction_typelist[d]['type'] = areainfo_structure[index]['totaltransaction'][d]['type'];
                                      transaction_typelist[d]['deposit'] = areainfo_structure[index]['totaltransaction'][d]['deposit'];
                                      transaction_typelist[d]['floor'] = areainfo_structure[index]['totaltransaction'][d]['floor'];
                                    }
                                    setList(
            
                                      transaction_typelist
                                    );
                                    setTypeIndex(0);//0:전체, 1:매매,2:전월세 그 typeindex샅개밧에 따라서 디테일뷰처리펭지에서 보여주는 거래타입을 달리한다.
                                    
                                  }}>{isWidth?`${parseFloat(information['exclusive_area']).toFixed(0)+'('+index+')'}m²`:`${parseFloat(information['exclusive_area']).toFixed(0)}평`}</Width>
                                  <Line active={areaIndex == index} onClick={()=>{setAreaIndex(index)}}/>
                                </SwiperSlide>
                              )     
                          })
                         }
                        </Swiper>
                      }
              </SwiperBennerWrap>
            </DanjiWidthList>
        </Container>
  );
}

const Container = styled.div `
  width:100%;
`
const DanjiWidthList = styled.div`
  width:100%;
  margin-top:35px;
  padding:0 22px;
  border-bottom:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(35/428));
    padding:0 calc(100vw*(20/428));
  }
`
const SwiperBennerWrap = styled.div`
`
const Width = styled.p`
  position:Relative;
  font-size:14px;font-weight:600;color:#707070;
  padding-bottom:22px;
  transform:skew(-0.1deg);
  cursor:pointer;
  text-align:center;
  transition:all 0.3s;
  color:${({active}) => active ? "#01684b" : "#707070"};
  font-weight:${({active}) => active ? 800 : 600};
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding-bottom:0 calc(100vw*(22/428));
  }
`
const Line = styled.p`
  position:absolute;
  width:100%;
  height:3px;
  bottom:0;left:50%;transform:translateX(-50%);
  display:block;content:'';background:#01684b;
  transition:all 0.2s;
  opacity:${({active}) => active ? 1 : 0};
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(3/428));
  }
`
