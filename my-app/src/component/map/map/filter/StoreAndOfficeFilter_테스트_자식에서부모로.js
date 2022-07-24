//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

import Switch from '@material-ui/core/Switch';

//img
import Radio from '../../../../img/map/radi.png';
import RadioChk from '../../../../img/map/radi_chk.png';
import Check from '../../../../img/map/radio.png';
import Checked from '../../../../img/map/radio_chk.png';
import ArrowTop from '../../../../img/map/arrow_top.png';

// components
import { Mobile, PC } from "../../../../MediaQuery";
import StoreAndOfficeItem from "./StoreAndOfficeItem";
import OfficetelFilterItem from "./OfficetelFilterItem";
import ApartFilterItem from "./ApartFilterItem";
import RadioCommon from './radioCommon';

// redux
import { MapFilterRedux } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';

// Range
import Rheostat from "rheostat";
import 'rheostat/initialize';
import './slider.css';
import RangeDetail from './rangeDetail';

export default function MapFilter({openBunyang, rank, status, open, setOpen}) {

    const mapFilterRedux = useSelector(state=>{ return state.mapFilter});
    let data = JSON.parse(JSON.stringify(mapFilterRedux.filterArr));//filterarr텍스트정보 / 텍스트string형태의 자료형태로 구조화.
    let uiData = JSON.parse(JSON.stringify(mapFilterRedux.filterUI));//uiData ui형상정보. 숫자형태의 자료형태로 구조화
    // 가격
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100); 
    const [dropdownValue, setDropdownValue] = useState([0, 100])
    const [snapArr, setSnapArr] = useState([]);
    const [priceText, setPriceText] = useState("");

    // 관리비 
    const [minPriceMana, setMinPriceMana] = useState(0);
    const [maxPriceMana, setMaxPriceMana] = useState(75); 
    const [dropdownValueMana, setDropdownValueMana] = useState([0, 75])
    const [snapManaArr, setSnapManaArr] = useState([]);
    const [manaText, setManaText] = useState("");
    
    // 면적 
    const [minArea, setMinArea] = useState(0);
    const [maxArea, setMaxArea] = useState(100); 
    const [dropdownValueArea, setDropdownValueArea] = useState([0, 100])
    const [snapAreaArr, setSnapAreaArr] = useState([]);
    const [areaText, setAreaText] = useState("");

    // 보증금( 전세금 )
    const [minJeonse, setMinJeonse] = useState(0);
    const [maxJeonse, setMaxJeonse] = useState(30); 
    const [dropdownValueJeonse, setDropdownValueJeonse] = useState([0, 30])
    const [snapJeonseArr, setSnapJeonseArr] = useState([]);
    const [jeonseText, setJeonseText] = useState("");

    // 월세
    const [minMonthly, setMinMonthly] = useState(0);
    const [maxMonthly, setMaxMonthly] = useState(18); 
    const [dropdownValueMonthly, setDropdownValueMonthly] = useState([0, 18])
    const [snapMonthlyArr, setSnapMonthlyArr] = useState([]);
    const [monthlyText, setMonthlyText] = useState("");

    const radioData = {
      floor:["전체", "1층", "5층이상", "5층이하"],//층수
      use:["전체", "5년 이내", "10년 이내", "20년 이내", "20년 이상"],//사용승인일
      danji:["전체", "200세대 이상", "500세대 이상", "1000세대 이상", "2000세대 이상"]//세대수(아파트단지)
    } 

    useEffect(() => {
      let min = uiData.priceRangeValue[0];//fileterArr배열형태자료구조.
      let max = uiData.priceRangeValue[1];
      rangeText(min, max, minPrice, maxPrice, priceToKor(min), priceToKor(max), setPriceText, "",);
    }, [uiData.priceRangeValue])//매매가격값 변경시에(filterArr int형태.변경시에) 관련 처리 -> setPriceText처리 

    useEffect(() => {
      let min = uiData.manaRangeValue[0];
      let max = uiData.manaRangeValue[1];
      rangeText(min, max, minPriceMana, maxPriceMana, min, max, setManaText, "만");
    }, [uiData.manaRangeValue])//관리비가격값 변경시에 filterARR int형태.변경시에 관려처리 ->> setManATEXT

    useEffect(() => {
      let min = uiData.areaRangeValue[0];
      let max = uiData.areaRangeValue[1];
      rangeText(min, max, minArea, maxArea, min, max, setAreaText, "평");
    }, [uiData.areaRangeValue])//면적범위 변경시에 filterarr int형태.변경시에 setAreatext state볁경.
    
    useEffect(() => {
      let min = uiData.jeonseRangeValue[0];
      let max = uiData.jeonseRangeValue[1];
      rangeText(min, max, minJeonse, maxJeonse, jeonseTextfunc(min), jeonseTextfunc(max), setJeonseText, "");
    }, [uiData.jeonseRangeValue])//전세범위가격변경시에 filterarr int형태.변경 >> setJeonseText state변경.
    
    useEffect(() => {
      let min = uiData.monthlyRangeValue[0];
      let max = uiData.monthlyRangeValue[1];
      rangeText(min, max, minMonthly, maxMonthly, monthlyTextfunc(min), monthlyTextfunc(max), setMonthlyText, "");
    }, [uiData.monthlyRangeValue])//월세번ㅁ위가격 변경시 filterarr int형태.변경 >> setmonthyltext state변경.
    
    //pricetext,manatext,areatext,jseonstext,monthyltext state변경시에 따른 액션->>filtereredux.uypdlateifleteraarr
    useEffect(() => {
      data.priceRange = priceText; //text자료구조로 취급되고있는 부분에 state변경처리된 값으로 매매가격값으로 저장처리.(filterArr string)
      MapFilterRedux.updateFilterArr({  filterArr: data });
    }, [priceText])

    useEffect(() => {
      data.manaRange = manaText;//manaRagne
      MapFilterRedux.updateFilterArr({  filterArr: data });
    }, [manaText])

    useEffect(() => {
      data.areaRange = areaText;//areaRange
      MapFilterRedux.updateFilterArr({  filterArr: data });
    }, [areaText])

    useEffect(() => {
      data.jeonseRange = jeonseText;//jeonseRange
      MapFilterRedux.updateFilterArr({  filterArr: data });
    }, [jeonseText])

    useEffect(() => {  
      data.monthlyRange = monthlyText;//monthlyRange
      MapFilterRedux.updateFilterArr({  filterArr: data });
    }, [monthlyText])

    // 전세 텍스트
    const jeonseTextfunc = (num) => {
      let text="";
      switch(num){
        case 1:text = "50만"; break;
        case 2:text = "백만"; break;
        case 3:text = "2백만"; break;
        case 4:text = "3백만"; break;
        case 5:text = "5백만"; break;
        case 6:text = "1천"; break;
        case 7:text = "2천"; break;
        case 8: text = "3천"; break;
        case 9:text = "4천"; break;
        case 10:text = "5천"; break;
        case 11:text = "6천"; break;
        case 12:text = "7천"; break;
        case 13:text = "8천"; break;
        case 14:text = "9천"; break;
        case 15:text = "1억"; break;
        case 16:text = "1억2천"; break;
        case 17:text = "1억5천"; break;
        case 18:text = "1억7천"; break;
        case 19:text = "2억"; break;
        case 20:text = "2억5천"; break;
        case 21:text = "3억"; break;
        case 22:text = "3억5천"; break;
        case 23:text = "4억"; break;
        case 24:text = "5억"; break;
        case 25:text = "7억"; break;
        case 26:text = "10억"; break;
        case 27:text = "12억"; break;
        case 28:text = "15억"; break;
        case 29:text = "20억"; break;
      }
      return(text);
    }

    // 월세 텍스트
    const monthlyTextfunc = (num) => {
      let text="";
      switch(num){
        case 1:text = "5만"; break;
        case 2:text = "10만"; break;
        case 3:text = "20만"; break;
        case 4:text = "25만"; break;
        case 5:text = "30만"; break;
        case 6:text = "35만"; break;
        case 7:text = "40만"; break;
        case 8: text = "50만"; break;
        case 9:text = "60만"; break;
        case 10:text = "70만"; break;
        case 11:text = "100만"; break;
        case 12:text = "150만"; break;
        case 13:text = "200만"; break;
        case 14:text = "250만"; break;
        case 15:text = "300만"; break;
        case 16:text = "400만"; break;
        case 17:text = "500만"; break;
      }
      return(text);
    }

    // 매매 억/천 단위
    const priceToKor = (num) => {
      let newNum = String(num).split('');
      if(newNum.length == 1){
        newNum.splice(1, 0, '천');
        newNum = newNum.join('');
        return newNum;
      }
      newNum.splice(1, 0, '억');
      if(newNum[2] == "0"){
        newNum.pop();
      }else{
        newNum.splice(3, 0, '천');
      }
      newNum = newNum.join('');
      return newNum;
    }

    // 범위 텍스트
    const rangeText = (min, max, minPrice, maxPrice, minText, maxText, setText, unit) => {
      if(min == minPrice && max == maxPrice){
        setText("전체");
        return;
      }
      if(min == minPrice){
        setText(maxText + unit);
      }else if(max == maxPrice){
        setText(`${minText}${unit}~전체`);
      }else{
        setText(`${minText}${unit}~${maxText}${unit}`)
      }
    }

    // 층수 
    const onChangeFloor = (e) => {
      //console.log('what e ???:',e);
      data.floor = e.target.dataset.text;//string형태에 저장
      uiData.floor = e.target.dataset.num;//int형자료형태에 저장.
      MapFilterRedux.updateFilterArr({filterArr:data});
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    } 

    // 사용승인일
    const onChangeUse = (e) => {
      //console.log('what e ???:',e);
      data.use = e.target.dataset.text;
      uiData.use = e.target.dataset.num;
      MapFilterRedux.updateFilterArr({filterArr:data});
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    // 관리비 토글
    const onClickAdmin = (e) => {
      //console.log('what e ???:',e);
      if(e.target.checked){
        uiData.manaStatus=1;
      }else{
        uiData.manaStatus=0;
      }
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    }
    
    // 아파트 총세대수
    const onChangeDanji = (e) => {
      //console.log('what e ???:',e);
      data.danji = e.target.dataset.text;
      uiData.danji = e.target.dataset.num;
      MapFilterRedux.updateFilterArr({filterArr:data});
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    // 검색 타입 아파트/오피스텔/상가, 사무실
    const filterType = () => {
      if(status == "apart"){ 
        return <ApartFilterItem open={open} setOpen={setOpen}/>
      }
      else if(status == "officetel"){
        return <OfficetelFilterItem open={open} setOpen={setOpen}/>
      }
      else if(status == "store" || status == "office"){
        return <StoreAndOfficeItem open={open} setOpen={setOpen}/>
      }
    }

    // 로컬에 저장되어있는 값을 가져와 리덕스에 넣는다.
    useEffect(() => {
      let filterData = JSON.parse(localStorage.getItem("filterData"));
      if(!filterData){return;}
      MapFilterRedux.updateFilterArr({filterArr: filterData.filterArr});
      MapFilterRedux.updateFilterUI({filterUI:filterData.filterUI});
    }, [])

    // 관리비 없음 버튼
    const manaBtn = () => {
      return(
        <SwitchButton>
          <Switch checked={uiData.manaStatus} data-text="관리비없음" className={["adminSwitch", "changeBtn"]} type="checkbox" onChange={(e) => {onClickAdmin(e)}} id="switch"/>
          {/* <SwitchLabel for="switch">
            <SwitchSpan/>
          </SwitchLabel> */}
          <Span>관리비 없는것만 보기</Span>
        </SwitchButton>
      )
    }

    const getValueSell = (value) => {
      uiData.priceRangeValue=value;  MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    const getValueDeposit = (value) => {
      uiData.jeonseRangeValue=value;  MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    const getValueRent = (value) => {
      uiData.monthlyRangeValue=value;  MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    const getValueMana = (value) => {
      uiData.manaRangeValue=value;  MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    const getValueArea = (value) => {
      uiData.areaRangeValue=value;  MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    return (
        <Container>
          <WrapApart>
            {/* -- 수정코드입니다. */}
            {/* 매매 -- 매매-- */}
            <RangeDetail
              bool={mapFilterRedux.filterArr.prd_sel_type.some(item => item == "매매")}
              id="priceWrap"
              title="매매"
              price={priceText}
              min={minPrice}
              max={maxPrice}
              value={uiData.priceRangeValue}
              onChange={(e) => {uiData.priceRangeValue=e.values;  MapFilterRedux.updateFilterUI({filterUI:uiData});}}
              getValue={getValueSell}
              snapPoints={snapArr}
              txt="최소"
              txt2="3억"
              txt3="7억"
              txt4="최대"
            />
            {/*보증금 (전세금) --전세, 월세 --*/}
            <RangeDetail
              bool={mapFilterRedux.filterArr.prd_sel_type.some(item => item == "전세" || item == "월세" )}
              id="jeonseWrap"
              title="보증금 (전세금)"
              price={jeonseText}
              min={minJeonse}
              max={maxJeonse}
              value={uiData.jeonseRangeValue}
              onChange={(e) => {uiData.jeonseRangeValue=e.values;  MapFilterRedux.updateFilterUI({filterUI:uiData});}}
              getValue={getValueDeposit}
              snapPoints={snapJeonseArr}
              txt="최소"
              txt2="5천만"
              txt3="2.5억"
              txt4="최대"
            />
            {/*월세 -- 월세 --*/}
            <RangeDetail
              bool={mapFilterRedux.filterArr.prd_sel_type.some(item => item == "월세" )}
              id="monthlyWrap"
              title="월세"
              price={monthlyText}
              min={minMonthly}
              max={maxMonthly}
              value={uiData.monthlyRangeValue}
              onChange={(e) => {uiData.monthlyRangeValue=e.values;  MapFilterRedux.updateFilterUI({filterUI:uiData});}}
              getValue={getValueRent}
              snapPoints={snapMonthlyArr}
              txt="최소"
              txt2="35만"
              txt3="150만"
              txt4="최대"
            />
            {/*관리비 -- 항상 --*/}
            <RangeDetail
              bool
              id="manaWrap"
              title="관리비"
              price={manaText}
              min={minPriceMana}
              max={maxPriceMana}
              value={uiData.manaRangeValue}
              onChange={(e) => {uiData.manaRangeValue=e.values;  MapFilterRedux.updateFilterUI({filterUI:uiData});}}
              getValue={getValueMana}
              snapPoints={snapAreaArr}
              txt="최소"
              txt2="25만"
              txt3="50만"
              txt4="최대"
              btn={manaBtn}
            />
            {/*면적(공급면적) -- 항상 -- */}
            <RangeDetail
              bool
              id="areaWrap"
              title={status == "apart"?"면적(공급면적)":"면적(전용면적)"}
              price={areaText}
              min={minArea}
              max={maxArea}
              value={uiData.areaRangeValue}
              onChange={(e) => {uiData.areaRangeValue=e.values;  MapFilterRedux.updateFilterUI({filterUI:uiData});}}
              getValue={getValueArea}
              snapPoints={snapAreaArr}
              txt="최소"
              txt2={status == "apart"?"30평(99m²)":"30평(99m²)"}
              txt3={status == "apart"?"70평(233m²)":"70평(233m²)"}
              txt4="최대"
            />
            {/* 층수 */}
            <RadioCommon boxId="floorWrap" title="층수" checked={uiData.floor} onChange={onChangeFloor} name="floor" array={radioData.floor}/>
            {/* 물건상세 */}
            {filterType()}
            {/* 사용승인일 */}
            <RadioCommon boxId="useWrap" title="사용승인일" checked={uiData.use} onChange={onChangeUse} name="use" array={radioData.use}/>
            {/* 총세대수 */}
            {
              status == "apart"?
              <RadioCommon boxId="danjiWrap" isWidth title="총세대수" checked={uiData.danji} onChange={onChangeDanji} name="danji" array={radioData.danji}/>
              :<></>
            }
            
          </WrapApart>
        </Container>
  );
}

const Container = styled.div`
`
const WrapApart = styled.div`
  width:100%;
`
const Box = styled.div`
  width:100%;
  padding:22px 17px;
  //border-top:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(22/428)) calc(100vw*(33/428));
  }

`
const BoxNoneBorder = styled(Box)`
  border-top:none;
  padding-top:0;
`
const SubTitle = styled.h5`
  font-size:12px;
  color:#4a4a4a;transform:skew(-0.1deg);
  margin-bottom:13px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(13/428));
    font-weight:600;
  }
`
const WrapFilter = styled.div`
  width:100%;
`
const PriceView = styled.div`
  width:100%;
  font-size:15px;font-weight:800;transform:skew(-0.1deg);
  color:#01684b;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(20/428));
  }
`
const WrapRange = styled.div`
  width:95%;
  position:relative;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:98%;
  }
`
const LeftRange = styled.div`
  position:absolute;
  left:0;top:-8px;
  width:19px;height:19px;border-radius:100%;
  border: solid 2px #01684b;
  background-color: #ffffff;
  z-index:3;cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(19/428));
    height:calc(100vw*(19/428));
    top:calc(100vw*(-8/428));
  }
`
const RightRange = styled.div`
  position:absolute;
  right:0;top:-8px;
  width:19px;height:19px;border-radius:100%;
  border: solid 2px #01684b;
  background-color: #ffffff;
  z-index:3;cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(19/428));
    height:calc(100vw*(19/428));
    top:calc(100vw*(-8/428));
  }
`
const GreenBar = styled.div`
  position:absolute;z-index:2;
  left:50%;top:0;
  transform:translateX(-50%);
  width:100%;
  margin:0 auto;
  height:3px;
  background:#01684b;
  border-radius:6px;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(3/428));
  }
`
const GreenBar2 = styled(GreenBar)`
  width:50%;
  left:15%;
  transform:translateX(0);
`
const LeftRange2 = styled(LeftRange)`
  left:15%;
`
const RightRange2 = styled(RightRange)`
  right:35%;
`
const GrayBar = styled(GreenBar)`
  background:#e4e4e4;
  width:100%;
  z-index:1;
`
const BottomBar = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding-top:35px;
  @media ${(props) => props.theme.mobile} {
    width:102%;
    height:calc(100vw*(3/428));
    padding-top:calc(100vw*(40/428));
  }
`
const BarTxt = styled.p`
  position:relative;
  font-size:14px;color:#979797;
  font-weight:600;transform:skew(-0.1deg);
  &:before{position:absolute;content:'';display:block;left:50%;top:-15px;transform:translateX(-50%);width:1px;height:8px;background:#c7c7c7;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    &:before{top:calc(100vw*(-10/428));height:calc(100vw*(8/428));}
  }
`
const BarTxtMl = styled(BarTxt)`
  margin-left:-40px;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(-55/428));
  }
`
const BarTxtMR = styled(BarTxt)`
  margin-right:-30px;
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(-40/428));
  }
`
const BarTxtMR2 = styled(BarTxt)`
margin-right:-26px;
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(-36/428));
  }
`
const BarTxtMl2 = styled(BarTxt)`
  margin-left:-10px;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(-16/428));
  }
`
const SwitchButton = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
  }
`
// const Switch = styled.input`
//   display:none;
//   &:checked+label{background:#009053}
//   &:checked+label span{left:22px;}
//   @media ${(props) => props.theme.mobile} {
//     &:checked+label span{left:calc(100vw*(24/428));}
//   }
// `
const SwitchLabel = styled.label`
  position:relative;display:inline-block;
  width:41px;
  height:15px;background:#e4e4e4;
  border-radius: 18px;
  border: solid 1px #d6d6d6;
  transition:all 0.3s;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(41/428));
    height:calc(100vw*(15/428));
  }
`
const SwitchSpan = styled.span`
  position:absolute;left:-1px;top:50%;transform:translateY(-50%);
  width:18px;height:18px;border-radius:100%;
  border: solid 1px #888888;
  background-color: #ffffff;
  transition:all 0.3s;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
    height:calc(100vw*(18/428));
  }
`
const Span = styled.span`
  display:inline-block;font-size:15px;
  font-weight:normal;transform:skew(-0.1deg);color:#4a4a4a;
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-left:calc(100vw*(10/428));
  }

`
const WrapRadio = styled.div`
  width:100%;display:flex;justify-content:flex-start;align-items:center;
  flex-wrap:wrap;
`
const RadioBox = styled.div`
  width:33%;
`
const RadioBoxWidth50 = styled.div`
  width:50%;
`
const InputR = styled.input`
  display:none;
  &:checked+label span{background:url(${RadioChk}) no-repeat; background-size:100% 100%;}
`
const InputC = styled.input`
  display:none;
  &:checked+label span{background:url(${Checked}) no-repeat; background-size:100% 100%;}
`
const LabelR = styled.label`
  display:inline-block;
  font-size:15px;color:#4a4a4a;
  margin-bottom:10px;
  font-weight:normal;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(20/428));
  }
`
const LabelC = styled(LabelR)`
`
const SpanR = styled.span`
  display:inline-block;width:22px;height:22px;
  margin-right:8px;vertical-align:middle;
  background:url(${Radio}) no-repeat;background-size:100% 100%;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));
  }
`
const SpanC = styled(SpanR)`
  background:url(${Check}) no-repeat;background-size:100% 100%;

`
