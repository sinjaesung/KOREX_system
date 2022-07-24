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
import RadioCommon from './radioCommon';
import DetailTopCommon from './detailTopCommon';
import { Mobile, PC } from "../../../../MediaQuery";

//redux
import { MapFilterRedux } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';

export default function ApartFilter({open, setOpen}) {
    const mapFilterRedux = useSelector(state=>{ return state.mapFilter});
    let data = JSON.parse(JSON.stringify(mapFilterRedux.filterArr));
    let uiData = JSON.parse(JSON.stringify(mapFilterRedux.filterUI));
    const detailRef = useRef();
    const radioData = {
      roomApart:["전체", "1개", "2개", "3개", "4개이상"],
      bath:["전체", "1개", "2개이상", "3개이상"],
    }

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

    // 방수
    const onClickRoomApart = (e) => {
      // data.roomApart=e.target.dataset.text;
      // uiData.roomApart=e.target.dataset.num;
      data.roomApart = e.target.value;
      uiData.roomApart = e.target.id;
      MapFilterRedux.updateFilterArr({filterArr:data});
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    // 욕실
    const onClickBath = (e) => {
      // data.bath=e.target.dataset.text;
      // uiData.bath=e.target.dataset.num;
      data.bath = e.target.value;
      uiData.bath = e.target.id;
      MapFilterRedux.updateFilterArr({filterArr:data});
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    // 옵션  -- 사용 x
    const onClickOption = (e) => {
      let newArr = JSON.parse(JSON.stringify(mapFilterRedux.filterArr));
      if(e.target.checked){
        newArr.life_facilites.push(e.target.dataset.text)
      }else{
        newArr.life_facilites = newArr.life_facilites.filter(item => item != e.target.dataset.text);
      }
      MapFilterRedux.updateFilterArr({  filterArr: newArr });
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
                  {/* -- 수정 코드입니다. */}
                  <RadioCommon noBorder boxId="roomApartWrap" title="방수" checked={uiData.roomApart} onChange={onClickRoomApart} name="roomApart" array={radioData.roomApart}/>
                  <RadioCommon boxId="toiletWrap" title="욕실수" checked={uiData.bath} onChange={onClickBath} name="bath" array={radioData.bath}/>
                  {/* -- 원래 코드입니다. */}
                  {/*
                    <BoxNoneBorder id="roomApartWrap">
                      <SubTitle>방수</SubTitle>
                      <WrapFilter>
                        <WrapRadio>
                          <RadioBox>
                            <InputR type="radio" checked={uiData.roomApart==0} className="changeBtn" data-num={0} data-text="전체" onChange={(e) => onClickRoomApart(e)} name="roomApart" id="room1"/>
                            <LabelR for="room1">
                              <SpanR/>
                              전체
                            </LabelR>
                          </RadioBox>
                          <RadioBox>
                            <InputR type="radio" checked={uiData.roomApart==1} className="changeBtn" data-num={1} data-text="1개" onChange={(e) => onClickRoomApart(e)} name="roomApart" id="room2"/>
                            <LabelR for="room2">
                              <SpanR/>
                              1개
                            </LabelR>
                          </RadioBox>
                          <RadioBox>
                            <InputR type="radio" checked={uiData.roomApart==2} className="changeBtn" data-num={2} data-text="2개" onChange={(e) => onClickRoomApart(e)} name="roomApart" id="room3"/>
                            <LabelR for="room3">
                              <SpanR/>
                              2개
                            </LabelR>
                          </RadioBox>
                          <RadioBox>
                            <InputR type="radio" checked={uiData.roomApart==3} className="changeBtn" data-num={3} data-text="3개" onChange={(e) => onClickRoomApart(e)} name="roomApart" id="room4"/>
                            <LabelR for="room4">
                              <SpanR/>
                              3개
                            </LabelR>
                          </RadioBox>
                          <RadioBox>
                            <InputR type="radio" checked={uiData.roomApart==4} className="changeBtn" data-num={4} data-text="4개이상" onChange={(e) => onClickRoomApart(e)} name="roomApart" id="room5"/>
                            <LabelR for="room5">
                              <SpanR/>
                              4개이상
                            </LabelR>
                          </RadioBox>
                        </WrapRadio>
                      </WrapFilter>
                    </BoxNoneBorder>
                    
                    <Box id="toiletWrap">
                      <SubTitle>욕실수</SubTitle>
                      <WrapFilter>
                        <WrapRadio>
                          <RadioBox>
                            <InputR type="radio" checked={uiData.bath==0} data-num={0} className="changeBtn" onChange={(e) => onClickBath(e)} data-text="전체" name="bath" id="bath1" defaultChecked/>
                            <LabelR for="bath1">
                              <SpanR/>
                              전체
                            </LabelR>
                          </RadioBox>
                          <RadioBox>
                            <InputR type="radio" checked={uiData.bath==1} data-num={1} className="changeBtn" onChange={(e) => onClickBath(e)} data-text="1개" name="bath" id="bath2"/>
                            <LabelR for="bath2">
                              <SpanR/>
                              1개
                            </LabelR>
                          </RadioBox>
                          <RadioBox>
                            <InputR type="radio" checked={uiData.bath==2} data-num={2} className="changeBtn" onChange={(e) => onClickBath(e)} data-text="2개이상" name="bath" id="bath3"/>
                            <LabelR for="bath3">
                              <SpanR/>
                              2개이상
                            </LabelR>
                          </RadioBox>
                          <RadioBox>
                            <InputR type="radio" checked={uiData.bath==3} data-num={3} className="changeBtn" onChange={(e) => onClickBath(e)} data-text="3개이상" name="bath" id="bath4"/>
                            <LabelR for="bath4">
                              <SpanR/>
                              3개이상
                            </LabelR>
                          </RadioBox>
                        </WrapRadio>
                      </WrapFilter>
                    </Box>
                  */}
                  
                  {/*옵션*/}
                  {/* <Box id="optionWrap">
                    <SubTitle>옵션</SubTitle>
                    <WrapFilter>
                      <WrapRadio>
                        <RadioBox>
                          <InputC type="checkbox" className="changeBtn" onClick={(e) => {onClickOption(e)}} data-text="발코니" name="option" id="option1"/>
                          <LabelC for="option1">
                            <SpanC/>
                            발코니
                          </LabelC>
                        </RadioBox>
                        <RadioBox>
                          <InputC type="checkbox" className="changeBtn" onClick={(e) => {onClickOption(e)}} data-text="베란다" name="option" id="option2"/>
                          <LabelC for="option2">
                            <SpanC/>
                            베란다
                          </LabelC>
                        </RadioBox>
                        <RadioBox>
                          <InputC type="checkbox" className="changeBtn" onClick={(e) => {onClickOption(e)}} data-text="테라스" name="option" id="option3"/>
                          <LabelC for="option3">
                            <SpanC/>
                            테라스
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
