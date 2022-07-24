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
import CkboxCommon from './ckboxCommon';
import BtnCommon from './btnCommon';
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
    const [roomArr, setRoomArr] =useState(["전체", "오픈형원룸", "분리형원룸", "원룸원거실", "투룸", "쓰리룸이상"]); 
    const radioData = {
      purpose:["전체", "주거용", "업무용"],
      //room:["전체", "오픈형원룸", "분리형원룸", "원룸원거실", "투룸", "쓰리룸이상"],
      room:["전체","오픈형원룸","분리형원룸","거실보유형"],
      double:["전체", "단층", "복층"],
      bath:["전체", "1개", "2개이상", "3개이상"],
      pet:["전체", "가능", "불가"],
    }

    const showOpen =()=>{
      setOpen(!open);
      detailRef.current.classList.toggle("hidden");
    }

    const rotate=()=>{
      if(open == true) {
        return "rotate(180deg)"
      }else{
        return "rotate(0deg)"
      }
    }

    // 용도
    const onClickPurpose = (e) => {
      // data.purpose=e.target.dataset.text;
      // uiData.purpose=e.target.dataset.num;
      data.purpose = e.target.value;
      uiData.purpose = e.target.id;
      MapFilterRedux.updateFilterArr({filterArr:data});
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    // 방구조
    const onClickRoom = (e) => {
      if(e.target.checked){
        uiData.roomOfficetel[e.target.dataset.num]=1;
      }else{
        uiData.roomOfficetel[e.target.dataset.num]=0;
      }
      
      // 전체버튼 토글
      if(e.target.dataset.text == "전체"){
        uiData.roomOfficetel=[1, 0, 0, 0, 0, 0];
      }else{
        uiData.roomOfficetel[0]=0;
      }
      MapFilterRedux.updateFilterUI({filterUI:uiData});
      
      setTimeout(() => {

        let count = 0;
        let currentArr=[];
        uiData.roomOfficetel.map((item, index)=>{
          if(item){
            currentArr.push(roomArr[index]);
            count++;
          }
        });
        if(!count){
          currentArr.push(["전체"])
          uiData.roomOfficetel=[1, 0, 0, 0, 0, 0];
        }
        console.log(currentArr);
        data.room=currentArr;
        MapFilterRedux.updateFilterArr({filterArr:data});

      }, 50)
    }

    // 복층여부
    const onClickDouble = (e) => {
      // data.double=e.target.dataset.text;
      // uiData.double=e.target.dataset.num;
      data.double = e.target.value;
      uiData.double = e.target.id;
      MapFilterRedux.updateFilterArr({filterArr:data});
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    // 주차 
    const onClickSwitch = (e) => {
      if(!e.target.checked){
        uiData.parkOfficetel=0;
      }else{
        uiData.parkOfficetel=1;
      }
      MapFilterRedux.updateFilterUI({filterUI:uiData});
    }

    // 반려동물
    const onClickPet = (e) => {
      
      console.clear();
      data.pet=e.target.dataset.text;
      uiData.pet=e.target.dataset.num;
      if(e.target.dataset.num=="0"){
        console.log(123456);
      }
      
      console.log("123123---------------")
      console.log(e.target.dataset.num);
      console.log(uiData);
      console.log(uiData.pet);

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
    
    // 옵션 
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
              <SubDepth  ref={detailRef} className={["optionList", "hidden"]}>
                <RadioCommon noBorder boxId="purposeWrap" title="용도" checked={uiData.purpose} onChange={onClickPurpose} name="purpose" array={radioData.purpose}/> 
                <CkboxCommon boxId="roomWrap" title="방구조" checked={uiData.roomOfficetel} onChange={onClickRoom} name="room" array={radioData.room}/>   
                <RadioCommon boxId="doubleWrap" title="복층여부" checked={uiData.double} onChange={onClickDouble} name="double" array={radioData.double}/> 
                <RadioCommon boxId="toiletWrap" title="욕실수" checked={uiData.bath} onChange={onClickBath} name="bath" array={radioData.bath}/>
                <BtnCommon boxId="parkWrap" title="주차" checked={uiData.parkOfficetel} dataText="주차가능" onChange={onClickSwitch} id="switch1" text="주차가능한곳만 보기"/>
                <RadioCommon boxId="petWrap" title="반려동물" checked={uiData.pet} onChange={onClickPet} name="pet" array={radioData.pet}/> 
                {/*
                  <BoxNoneBorder id="purposeWrap">
                    <SubTitle>용도</SubTitle>
                    <WrapFilter>
                      <WrapRadio>
                        <RadioBox>
                          <InputR className="changeBtn" checked={uiData.purpose==0} data-num={0} onChange={(e)=>onClickPurpose(e)} data-text="전체" type="radio" name="purpose" id="purpose1" defaultChecked/>
                          <LabelR for="purpose1">
                            <SpanR/>
                            전체
                          </LabelR>
                        </RadioBox>
                        <RadioBox>
                          <InputR className="changeBtn" checked={uiData.purpose==1} data-num={1} onChange={(e)=>onClickPurpose(e)} data-text="주거용" type="radio" name="purpose" id="purpose2"/>
                          <LabelR for="purpose2">
                            <SpanR/>
                            주거용
                          </LabelR>
                        </RadioBox>
                        <RadioBox>
                          <InputR className="changeBtn" checked={uiData.purpose==2} data-num={2} onChange={(e)=>onClickPurpose(e)} data-text="업무용" type="radio" name="purpose" id="purpose3"/>
                          <LabelR for="purpose3">
                            <SpanR/>
                            업무용
                          </LabelR>
                        </RadioBox>
                      </WrapRadio>
                    </WrapFilter>
                  </BoxNoneBorder>

                  <Box id="roomWrap">
                    <SubTitle>방구조</SubTitle>
                    <WrapFilter>
                      <WrapRadio>
                        <RadioBox>
                          <InputC className="changeBtn" checked={uiData.roomOfficetel[0]} data-num={0} onChange={(e)=>onClickRoom(e)} data-text="전체" type="checkbox" name="room" id="room1" defaultChecked/>
                          <LabelC for="room1">
                            <SpanC/>
                            전체
                          </LabelC>
                        </RadioBox>
                        <RadioBox>
                          <InputC className="changeBtn" checked={uiData.roomOfficetel[1]} data-num={1} onChange={(e)=>onClickRoom(e)} data-text="오픈형원룸" type="checkbox" name="room" id="room2"/>
                          <LabelC for="room2">
                            <SpanC/>
                            오픈형원룸
                          </LabelC>
                        </RadioBox>
                        <RadioBox>
                          <InputC className="changeBtn" checked={uiData.roomOfficetel[2]} data-num={2} onChange={(e)=>onClickRoom(e)} data-text="분리형원룸" type="checkbox" name="room" id="room3"/>
                          <LabelC for="room3">
                            <SpanC/>
                            분리형원룸
                          </LabelC>
                        </RadioBox>
                        <RadioBox>
                          <InputC className="changeBtn" checked={uiData.roomOfficetel[3]} data-num={3} onChange={(e)=>onClickRoom(e)} data-text="원룸원거실" type="checkbox" name="room" id="room4"/>
                          <LabelC for="room4">
                            <SpanC/>
                            원룸원거실
                          </LabelC>
                        </RadioBox>
                        <RadioBox>
                          <InputC className="changeBtn" checked={uiData.roomOfficetel[4]} data-num={4} onChange={(e)=>onClickRoom(e)} data-text="투룸" type="checkbox" name="room" id="room5"/>
                          <LabelC for="room5">
                            <SpanC/>
                            투룸
                          </LabelC>
                        </RadioBox>
                        <RadioBox>
                          <InputC className="changeBtn" checked={uiData.roomOfficetel[5]} data-num={5} onChange={(e)=>onClickRoom(e)} data-text="쓰리룸이상" type="checkbox" name="room" id="room6"/>
                          <LabelC for="room6">
                            <SpanC/>
                            쓰리룸이상
                          </LabelC>
                        </RadioBox>
                      </WrapRadio>
                    </WrapFilter>
                  </Box>
                

                
                  <Box id="doubleWrap">
                    <SubTitle>복층여부</SubTitle>
                    <WrapFilter>
                      <WrapRadio>
                        <RadioBox>
                          <InputR className="changeBtn" checked={uiData.double==0} data-num={0} onChange={(e) => onClickDouble(e) } data-text="전체" type="radio" name="double" id="double1" defaultChecked/>
                          <LabelR for="double1">
                            <SpanR/>
                            전체
                          </LabelR>
                        </RadioBox>
                        <RadioBox>
                          <InputR className="changeBtn" checked={uiData.double==1} data-num={1} onChange={(e) => onClickDouble(e) } data-text="단층" type="radio" name="double" id="double2"/>
                          <LabelR for="double2">
                            <SpanR/>
                            단층
                          </LabelR>
                        </RadioBox>
                        <RadioBox>
                          <InputR className="changeBtn" checked={uiData.double==2} data-num={2} onChange={(e) => onClickDouble(e) } data-text="복층" type="radio" name="double" id="double3"/>
                          <LabelR for="double3">
                            <SpanR/>
                            복층
                          </LabelR>
                        </RadioBox>
                      </WrapRadio>
                    </WrapFilter>
                  </Box> 

                  <Box id="parkWrap">
                    <SubTitle>주차</SubTitle>
                    <WrapFilter>
                      <SwitchButton>
                        <Switch className="changeBtn" checked={uiData.parkOfficetel} type="checkbox" data-text="주차가능" onChange={(e) =>{ onClickSwitch(e) }} id="switch1"/>
                        <SwitchLabel for="switch1">
                          <SwitchSpan/>
                        </SwitchLabel>
                        <Span>주차가능한곳만 보기</Span>
                      </SwitchButton>
                    </WrapFilter>
                  </Box>
                  

                  <Box id="petWrap">
                    <SubTitle>반려동물</SubTitle>
                    <WrapFilter>
                    <WrapRadio>
                      <RadioBox>
                        <InputR className="changeBtn" checked={uiData.pet==0} data-num={0} onChange={(e) => onClickPet(e)} data-text="전체" type="radio" name="pet" id="pet1"/>
                        <LabelR for="pet1">
                          <SpanR/>
                          전체
                        </LabelR>
                      </RadioBox>
                      <RadioBox>
                        <InputR className="changeBtn" checked={uiData.pet==1} data-num={1} onChange={(e) => onClickPet(e)} data-text="반려동물가능" type="radio" name="pet" id="pet2"/>
                        <LabelR for="pet2">
                          <SpanR/>
                          가능
                        </LabelR>
                      </RadioBox>
                      <RadioBox>
                        <InputR className="changeBtn" checked={uiData.pet==2} data-num={2} onChange={(e) => onClickPet(e)} data-text="반려동물불가" type="radio" name="pet" id="pet3"/>
                        <LabelR for="pet3">
                          <SpanR/>
                          불가
                        </LabelR>
                      </RadioBox>
                    </WrapRadio>
                  </WrapFilter>
                  </Box>
                */}
                  
                {/*옵션*/}
                {/*
                  <Box id="optionWrap">
                    <SubTitle>옵션</SubTitle>
                    <WrapFilter>
                      <WrapRadio>
                        <RadioBox>
                          <InputC className="changeBtn" type="checkbox" onClick={(e) => {onClickOption(e)}} data-text="냉장고" name="option" id="option1"/>
                          <LabelC for="option1">
                            <SpanC/>
                            냉장고
                          </LabelC>
                        </RadioBox>
                        <RadioBox>
                          <InputC className="changeBtn" type="checkbox" onClick={(e) => {onClickOption(e)}} data-text="세탁기" name="option" id="option2"/>
                          <LabelC for="option2">
                            <SpanC/>
                            세탁기
                          </LabelC>
                        </RadioBox>
                        <RadioBox>
                          <InputC className="changeBtn" type="checkbox" onClick={(e) => {onClickOption(e)}} data-text="에어컨" name="option" id="option3"/>
                          <LabelC for="option3">
                            <SpanC/>
                            에어컨
                          </LabelC>
                        </RadioBox>
                        <RadioBoxMarginBottom>
                          <InputC className="changeBtn" type="checkbox" onClick={(e) => {onClickOption(e)}} data-text="가스레인지/인덕션" name="option" id="option4"/>
                          <LabelC for="option4">
                            <SpanC/>
                            가스레인지/인덕션
                          </LabelC>
                        </RadioBoxMarginBottom>
                        <RadioBox>
                          <InputC className="changeBtn" type="checkbox" onClick={(e) => {onClickOption(e)}} data-text="베란다" name="option" id="option5"/>
                          <LabelC for="option5">
                            <SpanC/>
                            베란다
                          </LabelC>
                        </RadioBox>
                        <RadioBox>
                          <InputC className="changeBtn" type="checkbox" onClick={(e) => {onClickOption(e)}} data-text="테라스" name="option" id="option6"/>
                          <LabelC for="option6">
                            <SpanC/>
                            테라스
                          </LabelC>
                        </RadioBox>
                      </WrapRadio>
                    </WrapFilter>
                  </Box>
                */}
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
