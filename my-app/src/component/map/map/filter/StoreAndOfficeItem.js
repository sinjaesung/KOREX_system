//react
import React ,{useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//img
import Radio from '../../../../img/map/radi.png';
import RadioChk from '../../../../img/map/radi_chk.png';
import Check from '../../../../img/map/radio.png';
import Checked from '../../../../img/map/radio_chk.png';
import ArrowTop from '../../../../img/map/arrow_top.png';

// components
import BtnCommon from './btnCommon';
import DetailTopCommon from './detailTopCommon';
import { Mobile, PC } from "../../../../MediaQuery";

//redux
import { MapFilterRedux } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';


export default function ApartFilter({open, setOpen}) {

    const mapFilterRedux = useSelector(state=>{ return state.mapFilter});
    let uiData = JSON.parse(JSON.stringify(mapFilterRedux.filterUI));
    let data = JSON.parse(JSON.stringify(mapFilterRedux.filterArr));
    const detailRef = useRef();
    const showOpen =()=>{
      detailRef.current.classList.toggle("hidden");
      setOpen(!open);
    }
    
    const rotate=()=>{
      if(open == true) {
        return "rotate(180deg)"
      }else{
        return "rotate(0deg)"
      }
    }
    
    // 주차장
    const onClickPark = (e) => {
      if(e.target.checked){
        data.is_park=e.target.dataset.text;
        uiData.parkStore=1;
      }else{
        uiData.parkStore=0;
      }
      MapFilterRedux.updateFilterArr({filterArr:data});
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    }
    
    // 화장실
    const onClickToilet = (e) => {
      if(e.target.checked){
        uiData.toilet=1;
      }else{
        uiData.toilet=0;
      }
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    // 옵션 -- 사용 x
    const onClickOption = (e) => {
      let newArr = JSON.parse(JSON.stringify(mapFilterRedux.filterArr));
      if(e.target.checked){
        newArr.life_facilites.push(e.target.dataset.text)
        MapFilterRedux.updateFilterArr({  filterArr: newArr });
      }else{
        newArr.life_facilites = newArr.life_facilites.filter(item => item != e.target.dataset.text);
        MapFilterRedux.updateFilterArr({  filterArr: newArr });
      }
    } 



    return (
        <Container>
            {/*물건상세*/}
            <DetailOption>
              <DetailTopCommon onClick={showOpen} open={open}/>
              {/*
                <DetailTopBox onClick={showOpen}>
                  <DetailTitle>물건상세</DetailTitle>
                  <Line/>
                  <ArrowImg src={ArrowTop} rotate={rotate}/>
                </DetailTopBox>
              */}
              <SubDepth ref={detailRef} className={["optionList", "hidden"]}>
                {/* -- 수정코드입니다. */}
                <BtnCommon noBorder boxId="parkStoreWrap" title="주차" checked={uiData.parkStore} dataText="주차가능" onChange={onClickPark} id="switch1" text="주차가능한곳만 보기"/>
                <BtnCommon boxId="toiletWrap" title="화장실" checked={uiData.toilet} dataText="전용화장실" onChange={onClickToilet} id="switch2" text="전용화장실만 보기"/>
                {/* -- 원래 코드입니다. */}
                {/*
                  <BoxNoneBorder id="parkStoreWrap">
                    <SubTitle>주차</SubTitle>
                    <WrapFilter>
                      <SwitchButton>
                        <Switch className="changeBtn" checked={uiData.parkStore} type="checkbox" data-text="주차가능" onClick={(e) =>{ onClickPark(e) }} id="switch1"/>
                        <SwitchLabel for="switch1">
                          <SwitchSpan/>
                        </SwitchLabel>
                        <Span>주차가능한곳만 보기</Span>
                      </SwitchButton>
                      </WrapFilter>
                  </BoxNoneBorder>

                  <Box id="toiletWrap">
                    <SubTitle>화장실</SubTitle>
                    <WrapFilter>
                      <SwitchButton>
                        <Switch className="changeBtn" checked={uiData.toilet} type="checkbox" data-text="전용화장실" onClick={(e) =>{ onClickToilet(e) }} id="switch2"/>
                        <SwitchLabel for="switch2">
                          <SwitchSpan/>
                        </SwitchLabel>
                        <Span>전용화장실만 보기</Span>
                      </SwitchButton>
                    </WrapFilter>
                  </Box>
                */}

                {/*옵션*/}
                {/* <Box id="optionWrap">
                  <SubTitle>옵션</SubTitle>
                  <WrapFilter>
                    <WrapRadio>
                      <RadioBox>
                        <InputC className="changeBtn" type="checkbox"  data-text="에어컨"   onClick={(e) => {onClickOption(e)}} name="option" id="option1"/>
                        <LabelC for="option1">
                          <SpanC/>
                          에어컨
                        </LabelC>
                      </RadioBox>
                      <RadioBox>
                        <InputC className="changeBtn" type="checkbox"  data-text="발코니"  onClick={(e) => {onClickOption(e)}} name="option" id="option2"/>
                        <LabelC for="option2">
                          <SpanC/>
                          발코니
                        </LabelC>
                      </RadioBox>
                      <RadioBox>
                        <InputC className="changeBtn" type="checkbox"  data-text="베란다"  onClick={(e) => {onClickOption(e)}} name="option" id="option3"/>
                        <LabelC for="option3">
                          <SpanC/>
                          베란다
                        </LabelC>
                      </RadioBox>
                      <RadioBox>
                        <InputC className="changeBtn" type="checkbox"  data-text="테라스"  onClick={(e) => {onClickOption(e)}} name="option" id="option4"/>
                        <LabelC for="option4">
                          <SpanC/>
                          테라스
                        </LabelC>
                      </RadioBox>
                      <RadioBox>
                        <InputC className="changeBtn" type="checkbox"  data-text="베란다"  onClick={(e) => {onClickOption(e)}} name="option" id="option5"/>
                        <LabelC for="option5">
                          <SpanC/>
                          베란다
                        </LabelC>
                      </RadioBox>
                    </WrapRadio>
                  </WrapFilter>
                </Box> */}
              </SubDepth>

            </DetailOption>{/*물건상세 끝*/}
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
  border-top:1px solid #f2f2f2;
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
const SwitchButton = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
  }
`
const Switch = styled.input`
  display:none;
  &:checked+label{background:#009053}
  &:checked+label span{left:22px;}
  @media ${(props) => props.theme.mobile} {
    &:checked+label span{left:calc(100vw*(24/428));}
  }
`
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
const RadioBoxMarginBottom = styled.div`
  width:100%;margin-bottom:5px;
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
    margin-right:calc(100vW*(10/428));
  }
`
const SpanC = styled(SpanR)`
  background:url(${Check}) no-repeat;background-size:100% 100%;

`
const DetailOption = styled.div`

  & > .hidden {
    display:none;
  }

  width:100%;
`
const DetailTopBox = styled.div`
  width:100%;cursor:pointer;
  padding:22px 17px;
  border-top:1px solid #f2f2f2;
  display:flex;justify-content:space-between;align-items:center;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(22/428)) calc(100vw*(33/428));
  }
`
const DetailTitle = styled.h2`
  font-size:15px;color:#4e4e4e;font-weight:600;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Line = styled.div`
  width:200px;
  height:1px; background:#cecece;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(230/428));
  }
`
const ArrowImg = styled.img`
  display:inline-block;
  width:26px;
  transition:all 0.2s;
  transform:${({rotate}) => rotate};
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(26/428));
  }
`
const SubDepth = styled.div`
  width:100%;
`
