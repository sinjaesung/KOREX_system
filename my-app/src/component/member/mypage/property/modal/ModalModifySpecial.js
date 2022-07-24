//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import ArrowDown from '../../../../../img/member/arrow_down.png';
import Check from '../../../../../img/map/radio.png';
import Checked from '../../../../../img/map/radio_chk.png';
import Radi from '../../../../../img/map/radi.png';
import RadiChk from '../../../../../img/map/radi_chk.png';

//리덕스 데이터 저장한다.
import {temp_tourReservsettingActions } from '../../../../../store/actionCreators';

//필터 모달
export default function AddSpecial({speIsTimeRef, speTimeRef, speDateRef,speExcRef, load_tour_set_specifydate, load_tour_set_specifydate_times,load_tour_specifyday_except}) {
  const [swit,setSwitch] = useState(false);
  
   console.log('=>?>>>>>modalAddsepcial요소 실행>>>>>>>>>>>>>>',load_tour_set_specifydate,load_tour_set_specifydate_times,load_tour_specifyday_except);
  
  const [specifydate,setSpecifydate] = useState('');
  const [specifydatetimes,setSpecifydatetimes] = useState('');
  const [isexceptspecifydate,setIsexceptspecifydate] = useState('');
  const change_specifydate = (e) => {setSpecifydate(e.target.value);}
  const change_specifydate_times = (e) => {
    let specifydate_times= document.getElementsByClassName('specifydate_times');

    let checked_items=[];
    for(let i=0,c=0; i<specifydate_times.length; i++){
      if(specifydate_times[i].checked){
        checked_items[c]=specifydate_times[i].value;
        c++;
      }
    }
    // console.log('특정선택일 선택시간대들 변화change:',checked_items);
    setSpecifydatetimes(checked_items.join(','));
  }
  const change_is_except_specifydate = (e) => {
    if(e.target.checked){
      setIsexceptspecifydate(1);
    }else{
      setIsexceptspecifydate(0);
    }
  }
  
  useEffect(()=>{
    setSpecifydate(load_tour_set_specifydate);
    setSpecifydatetimes(load_tour_set_specifydate_times);
    setIsexceptspecifydate(load_tour_specifyday_except);

    if(load_tour_set_specifydate_times!=''){
        setSwitch(true);
    }
    
  },[]);
  
  //Add 모달창
    return (
        <Container>
            <WrapAddSelect>
          {/*일자선택*/}
              <AddBox>
                <Label>일자 선택 selectDate: {specifydate}</Label>
                {/* <IputDate type="date" placeholder="일자 선택" onChange={change_specifydate}/> */}
                <IputDate ref={speDateRef} type="date" placeholder={load_tour_set_specifydate} value={specifydate}onChange={change_specifydate}/>
              </AddBox>
              <AddBox>
                <Label>시간</Label>
                <SwitchButton>
                  <Switch type="checkbox" ref={speIsTimeRef} id="switch"/>
                  <SwitchLabel for="switch" onClick={()=>{setSwitch(!swit);}}>
                    <SwitchSpan/>
                  </SwitchLabel>
                  <Span2>시간 끔</Span2>
                </SwitchButton>
                {
                  swit ?
                <WrapSwit ref={speTimeRef}>
                  <LineBox>
                      {/* <InputCheck type="checkbox" onChange={change_specifydate_times} className='specifydate_times'name="" id="time1" value='오전1T'/> */}
                      <InputCheck type="checkbox" className='specifydate_times'name="" id="time1" value='오전1T' checked={specifydatetimes.indexOf('오전1T')!=-1} onChange={change_specifydate_times}/>
                      <CheckLabelInBox for="time1">
                        <Span3/>
                        오전 1T
                      </CheckLabelInBox>
                    </LineBox>
                    <LineBox>
                      {/* <InputCheck type="checkbox" onChange={change_specifydate_times} className='specifydate_times' name="" id="time2" value='오후1T'/> */}
                      <InputCheck type="checkbox" className='specifydate_times' name="" id="time2" value='오후1T'checked={specifydatetimes.indexOf('오후1T')!=-1} onChange={change_specifydate_times}/>
                      <CheckLabelInBox for="time2">
                        <Span3/>
                        오후 1T
                      </CheckLabelInBox>
                    </LineBox>
                    <LineBox>
                      {/* <InputCheck type="checkbox" onChange={change_specifydate_times} className='specifydate_times' name="" id="time3" value='오후2T'/> */}
                      <InputCheck type="checkbox" className='specifydate_times' name="" id="time3" value='오후2T'checked={specifydatetimes.indexOf('오후2T')!=-1} onChange={change_specifydate_times}/>
                      <CheckLabelInBox for="time3">
                        <Span3/>
                        오후 2T
                      </CheckLabelInBox>
                    </LineBox>
                  </WrapSwit>
                  :
                  null

                }   
              </AddBox>
              <AddBox>
                <Label>제외</Label>
                <LineBox>
                  {/* <Radio type="checkbox" ref={speExcRef} name="" value='1' id="radi"/> */}
                  {/* <Radio type="checkbox" ref={speExcRef} name="" value='1' id="radi" onClick={change_is_except_specifydate}/> */}
                  <Radio type="checkbox" ref={speExcRef} name="" value='1' id="radi" checked={isexceptspecifydate} onClick={change_is_except_specifydate} />
                  <RadioLabel for="radi">
                    <Span/>
                    제외
                  </RadioLabel>
                </LineBox>
              </AddBox>
            
           </WrapAddSelect>

        </Container>
  );
}

const Container = styled.div`
`
const WrapAddSelect = styled.div`
  width:100%;
  margin-bottom:40px;
    padding:0 20px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(40/428));
    padding:0 calc(100vw*(15/428));
  }
`
const AddBox = styled.div`
  position:relative;
  width:100%;
  margin-bottom:30px;

  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(20/428));
  }
`

const AddSelectSort = styled.div`
  width:100%;
`
const LineBox = styled.div`
  width:100%;
  margin-bottom:20px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(20/428));
  }
`
const AddSelectSortList = styled.select`
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
    background-size:calc(100vw*(11/428));
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
const InputCheck = styled.input`
  display:none;
  &:checked+label span{background:url(${Checked}) no-repeat;background-size:100% 100%;}
`
const CheckLabel = styled.label`
  display:inline-block;
  font-size:15px;font-weight:600;transform:skew(-0.1deg);
  color:#4a4a4a;
  font-family:'NanumSquare', sans-serif;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
  }
`
const WrapSwit = styled.div`
`
const AddSelectConditionList = styled(AddSelectSortList)`
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
const Radio = styled.input`
  display:none;
  &:checked+label span{background:url(${RadiChk}) no-repeat;background-size:100% 100%;}
`
const RadioLabel = styled.label`
  display:inline-block;
  font-size:15px;font-weight:500;transform:skew(-0.1deg);
  color:#4a4a4a;
  font-family:'NanumSquare', sans-serif;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
  }
`
const BoxWeek = styled.div`
  margin-bottom:30px;  
  padding:0 3px 0 0;
  @media ${(props) => props.theme.modal} {
    padding:0 calc(100vw*(3/428)) 0 0;
    margin-bottom:calc(100vw*(35/428));
  }
`
const WrapWeek = styled.div`
  width:100%;
  display:flex;justify-content:space-between;align-items:center;
`
const InBox = styled.div`
  position:relative;
`
const CheckLabelInBox = styled(RadioLabel)`
`
const CheckLabelPt = styled(CheckLabelInBox)`
  padding-top:25px;
  @media ${(props) => props.theme.modal} {
    padding-top:calc(100vw*(25/428));
  }
`
const Span = styled.span`
  display:inline-block;
  width:20px;height:20px;
  background:url(${Radi}) no-repeat;background-size:100% 100%;
  margin-right:10px;
  vertical-align:middle;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));
    margin-right:calc(100vw*(10/428));
  }
`
const Span3 = styled(Span)`
  display:inline-block;
  width:20px;height:20px;
  background:url(${Check}) no-repeat;background-size:100% 100%;
  margin-right:10px;
  vertical-align:middle;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));
    margin-right:calc(100vw*(10/428));
  }
`
const IputDate = styled.input`
  width:100%;height:43px;
  text-align:center;
  font-size:15px; transform:skew(-0.1deg);
  font-weight:600;color:#707070;
  border:1px solid #e4e4e4;border-radius:4px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    height:calc(100vw*(43/428));
  }
`

const Label = styled.label`
  display:block;
  font-size:12px;color:#4a4a4a;
  font-weight:600;transform:skew(-0.1deg);
  line-height:1.33;margin-bottom:10px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(10/428));
  }
`
const SwitchButton = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin-bottom:20px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(20/428));
  }
`
const Switch = styled.input`
  display:none;
  &:checked+label{background:#009053}
  &:checked+label span{left:22px;}
  @media ${(props) => props.theme.modal} {
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
  @media ${(props) => props.theme.modal} {
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
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(18/428));
    height:calc(100vw*(18/428));
  }
`
const Span2 = styled.span`
  display:inline-block;font-size:15px;
  font-weight:normal;transform:skew(-0.1deg);color:#4a4a4a;
  margin-left:5px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    margin-left:calc(100vw*(10/428));
  }
`
