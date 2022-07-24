//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import Item from "../../../../img/map/map_item.png";
import FilterDown from "../../../../img/map/filter_down_arrow.png";
import FilterNext from "../../../../img/map/filter_next.png";
import FilterClose from "../../../../img/map/filter_close.png";
import Checked from "../../../../img/map/checked.png";
import Check from "../../../../img/main/heart.png";
import Profile from "../../../../img/map/profile_img.png";
// components
import { Mobile, PC } from "../../../../MediaQuery";
import {opacityAni, retunAnimation, animationDelay} from './contentAnimation';

// redux
import { MapProductEls } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';

const insertYMComma = (string) => {
  let newString = string;
  newString.substring(0, 2);
  newString = newString.substring(2, 6);
  newString = newString.replace(/(.{2})/g,"$1.")
  newString = newString.substring(0, 5);
  return newString
}

function numTokor(num) {
    var newNum = num.replace(",", "");
    newNum = Number(newNum) * 10000;
    var inputNumber  = newNum < 0 ? false : newNum;

    var unitWords    = ['', '만', '억', '조', '경'];
    var splitUnit    = 10000;
    var splitCount   = unitWords.length;
    var resultArray  = [];
    var resultString = '';

    for (var i = 0; i < splitCount; i++){
        var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
        unitResult = Math.floor(unitResult);
        if (unitResult > 0){
            resultArray[i] = unitResult;
        }
    }
    
    for (var i = 0; i < resultArray.length; i++){
        if(!resultArray[i]) continue;
        resultString = String(resultArray[i]) + unitWords[i] + resultString;
    }

    return resultString;
}

function insertZero(string){
  let newString = string;
  if(string.length == 1){
    newString = "0" + string;
  }
  return newString
}

export default function ItemTabContent({updatePageIndex,setHistoryInfo,setMap}) {

  const productRedux = useSelector(state=>{ return state.mapProductEls});
  const mapHeaderRedux = useSelector(state => {return state.mapHeader});
  //console.log('===>>>itemtTABCONENT:',productRedux);

  const onClickEl = (value) => {
    MapProductEls.updateClickBlo({ clickBlo : value.complex_id });
    updatePageIndex(3);
    setHistoryInfo(e => {e.prevIndex.push(0); return JSON.parse(JSON.stringify(e));});
  }
   //날짜들 오름차순 정렬진행
   function data_ascending(a,b){
    var left = a;
    var right = b;

    return left > right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
  }
  function data_descending(a,b){
      var left = a['time'];
      var right = b['time'];

      return left < right ? 1 : -1;
  }

  useEffect(() => {
    let newInt = productRedux.block;
    console.log(newInt);
  }, [productRedux.block]);

  return (
    <Container>
      {
        productRedux.block.length==0?
        <NoList>검색 결과가 없습니다.</NoList>
        :
        <>
          {
            productRedux.block.map((value, index) => {
              //console.log('values::',value);
            // let complex_info=value['info'];
              //let key=value['key'];
              //let match_transaction_total = value['match_transaction_total'];
              if(mapHeaderRedux['originid']['origintype']=='complex'){
                return(
                  <TabContent key={index} highlightcolor={value.complex_id === mapHeaderRedux['originid']['id_vals']} aniDelay={animationDelay(index)}>
                    <Link onClick={() => onClickEl(value) } className="data_link"></Link>
                    <TopBox>
                      <Title>{value&&value.complex_name}</Title>
                      <Address>{value&&value.addr_jibun}({value&&value.addr_road})</Address>
                      {
                        value ?
                        <DanjiInfo>
                        <Date>{insertYMComma(value['contract_ym'])}.{insertZero(value['contract_dt'])}</Date>
                        <Price>{value['type']}{numTokor(value['deposit'])}</Price>
                        <Floor>{value['floor']}층</Floor>
                      </DanjiInfo>
                      :
                      null
                      }
                      
                      <LeftImg>
                        <Img src={FilterNext}/>
                      </LeftImg>
                    </TopBox>
                  </TabContent>
                )
              }else{
                return(
                  <TabContent key={index} highlightcolor={false} aniDelay={animationDelay(index)}>
                    <Link onClick={() => onClickEl(value) } className="data_link"></Link>
                    <TopBox>
                      <Title>{value&&value.complex_name}</Title>
                      <Address>
                        {value&&value.addr_jibun}
                        {/* ({value&&value.addr_road}) */}
                      </Address>
                      {
                        value ?
                        <DanjiInfo>
                        <Date>{insertYMComma(value['contract_ym'])}.{insertZero(value['contract_dt'])}</Date>
                        <Price>{value['type']}{numTokor(value['deposit'])}{value['type']=='월세'?'/'+value['monthly_rent'] + "만원":''}</Price>
                        <Floor>{value['floor']}층</Floor>
                      </DanjiInfo>
                      :
                      null
                      }
                      
                      <LeftImg>
                        <Img src={FilterNext}/>
                      </LeftImg>
                    </TopBox>
                  </TabContent>
                )
              }
              
            })
          }
        </>
      }
    </Container>
  );
}

const Container = styled.div`
`
const NoList = styled.div`
  text-align: center;
  margin-top:2rem;
  font-size:1rem;
`
const TabContent = styled.div`
  animation-name: ${opacityAni}; 
  ${({aniDelay})=>{ return retunAnimation(aniDelay)}}
  position:relative; 
  background-color: ${(props) => (props.highlightcolor==true ? 'rgba(240,240,240,0.9)':'transparent')};
  padding:30px 27px 0 27px;margin-top:17px;
  margin-bottom:30px;
  border-top:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(24/428)) calc(100vw*(12/428)) 0;
    margin-bottom:calc(100vw*(24/428));
  }
`
const TopBox = styled.div`
  display:block;
  width:100%;
  position:relative;
`
const Title= styled.h2`
  font-size:25px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  margin-bottom:10px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(20/428));
    margin-bottom:calc(100vw*(10/428));
  }
`
const Address = styled.p`
  font-size:15px;color:#707070;
  margin-bottom:10px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(10/428));
  }
`
const DanjiInfo = styled.div`
  display:flex;justify-content:flex-start;align-item:center;
`
const Date = styled(Address)`
  color:#01684b;
  margin-bottom:0;
`
const Price = styled(Date)`
  margin:0 8px;
  @media ${(props) => props.theme.mobile} {
    margin:0 calc(100vw*(8/428));
  }
`
const Floor = styled(Date)`
`
const LeftImg = styled.div`
  position:absolute;
  top:50%;transform:translateY(-50%);
  right:0;
`
const Img = styled.img`
  width:10px;
  display:inline-block;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(10/428));
  }
`
