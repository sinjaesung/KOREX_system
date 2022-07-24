//react
import React ,{useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//img
import ArrowDown from '../../../../../img/member/arrow_down.png';
import Check from '../../../../../img/map/radio.png';
import Checked from '../../../../../img/map/radio_chk.png';

//리덕스 데이터 저장한다.
import { temp_tourReservsettingActions } from '../../../../../store/actionCreators';

//필터 모달
export default function AddBasic({dataRef, timeRef, dayRef, holiRef}) {
  //  console.log('==>>>>>modalAddbasic요소 실행>>>>>>>>>>');


    const [isHoli, setIsHoli] = useState(false);
   const [normal_select_days,setNormal_select_days] = useState('');
   const [normal_select_times,setNormal_select_times] = useState('');
   const [normal_isholidayexcept,setNormal_isholidayexcept] = useState('');
   const [normal_select_daycount,setNormal_select_daycount] = useState('');
 
   const dateData = [
     {kor:"일", eng:"sun"},
     {kor:"월", eng:"mon"},
     {kor:"화", eng:"tue"},
     {kor:"수", eng:"wed"},
     {kor:"목", eng:"thr"},
     {kor:"금", eng:"fri"},
     {kor:"토", eng:"sat"},
   ];
   const timeData = [
    {kor:"오전 1T", eng:"time1"},
    {kor:"오후 1T", eng:"time2"},
    {kor:"오후 2T", eng:"time3"},
   ];
   const elData=[1, 2, 3, 4, 5, 6, 7];

   // 아래 코드는 사용하지 않았습니다.
   /*
  const change_normal_days = (e) => {
    let normal_select_days=document.getElementsByClassName('normal_select_days');

    //공휴일제외 체크상태라면 공휴일 sat,sun체크하려고 할때에 한해서 체크를 막는다.
    let checked_items=[];
    if(normal_isholidayexcept){
      for(let i=0,c=0; i<normal_select_days.length; i++){
        if(normal_select_days[i].checked){
           if(normal_select_days[i].value == 'sat' || normal_select_days[i].value == 'sun'){
             normal_select_days[i].checked=false;
           }else{
            checked_items[c]=normal_select_days[i].value;
            c++; //공휴일제외 체크상태라면 공휴일제외한 체크항목들에 대한 카운팅만 될수있게.
           }         
        }
      }
    }else{
      //주말제외상태아니면
      for(let i=0,c=0; i<normal_select_days.length; i++){
        if(normal_select_days[i].checked){
           
            checked_items[c]=normal_select_days[i].value;
          c++;
        }
      }
    }
   
    // console.log('=-=>>>일반추가 선택 요일들 요일 변화change:',checked_items.join(','));
    setNormal_select_days(checked_items.join(','));
  };
  const change_normal_days_times = (e) => {
    let normal_select_times=document.getElementsByClassName('normal_select_times');

    let checked_items=[];
    for(let i=0,c=0; i<normal_select_times.length; i++){
      if(normal_select_times[i].checked){
          checked_items[c]=normal_select_times[i].value;
        c++;
      }
    }
    // console.log('=-=>>>일반추가 선택 시간들 요일 변화change:',checked_items.join(','));
    setNormal_select_times(checked_items.join(','));
  }
  const change_isholidayexcept = (e) => {
    if(e.target.checked){
      //alert('공휴일 제외!');
      setNormal_isholidayexcept(1);

      let normal_select_days=document.getElementsByClassName('normal_select_days');

      for(let i=0; i<normal_select_days.length; i++){
        if(normal_select_days[i].value == 'sat' || normal_select_days[i].value =='sun'){
          normal_select_days[i].checked=false;
        }
      }
    }else{
      //alert('공휴일 포함');
      setNormal_isholidayexcept(0);
    }
  }
  const change_daycount = (e) => {
    // console.log('>>>>>>선택한 값:...ㅇ',e.target.value);

    setNormal_select_daycount(e.target.value);
  }

  useEffect( async () => {
    // console.log('=>>>>>>modal modaladdbasdic요소 state내부값들 변화발생시마다:',normal_select_days,normal_select_times,normal_isholidayexcept,normal_select_daycount);
    temp_tourReservsettingActions.normal_select_dayschange({normal_select_dayss: normal_select_days});
    temp_tourReservsettingActions.normal_select_timeschange({normal_select_timess: normal_select_times});
    temp_tourReservsettingActions.normal_isholidayexceptchange({normal_isholidayexcepts : normal_isholidayexcept});
    temp_tourReservsettingActions.normal_select_daycountchange({normal_select_daycounts : normal_select_daycount});
  },[normal_select_days,normal_select_times,normal_isholidayexcept,normal_select_daycount]);
*/

  const holiOffDate = () => {
    if(isHoli){
      dataRef.current.children[0].children[0].checked = false;
      dataRef.current.children[6].children[0].checked = false;
    }
  }

  useEffect(() => {
    holiOffDate();
  }, [isHoli])

  //Add 모달창
    return (
        <Container>
            <WrapAddSelect>
              <BoxWeek>
                <Label>요일</Label>
                <WrapWeek ref={dataRef}>
                  {
                    dateData.map((item, index) => {
                      return(
                        <InBox key={index}>
                          {/* <InputCheck type="checkbox" onChange={() => change_normal_days()}className='normal_select_days'name="" id={item.eng} value={item.eng}/> */}
                          <InputCheck type="checkbox" onChange={e => holiOffDate()} className='normal_select_days'name="" id={item.eng} value={item.eng}/>
                          <CheckLabelPt for={item.eng}>
                            <SpanAbsolute/>
                            {item.kor}
                          </CheckLabelPt>
                        </InBox>
                      )
                    })
                  }
                </WrapWeek>
              </BoxWeek>
              {/*상태 select*/}
                <AddBox>
                  <Label>시간</Label>
                  <AddSelectCondition ref={timeRef}>
                    {
                      timeData.map((item, index) => {
                        return(
                          <LineBox key={index}>
                            {/* <InputCheck type="checkbox" onChange={() => change_normal_days_times()} className='normal_select_times' name="" id={item.eng} value={item.kor}/> */}
                            <InputCheck type="checkbox" className='normal_select_times' name="" id={item.eng} value={item.kor}/>
                            <CheckLabelInBox for={item.eng}>
                              <Span/>
                              {item.kor}
                            </CheckLabelInBox>
                          </LineBox>
                        )
                      })
                    }
                  </AddSelectCondition>
                </AddBox>
            {/*선택항목수 select*/}
                <AddBox>
                  <Label>선택 항목수(일자)</Label>
                  <AddSelectCondition>
                    {/* <AddSelectConditionList onChange={change_daycount}>  */}
                    <AddSelectConditionList ref={dayRef}> 
                      <InOption selected disabled>갯수 선택</InOption>
                      {
                        elData.map((item, index) => {
                          return(
                            <InOption value={item} key={index}>{item}</InOption>
                          )
                        })
                      }
                    </AddSelectConditionList>
                  </AddSelectCondition>
                </AddBox>
            {/*수임방식 select*/}
                <AddBox>
                  <Label>공휴일 제외여부</Label>
                  <AddSelectCondition>
                    <LineBox>
                      {/* <InputCheck type="checkbox" name="" id="hday" onClick={change_isholidayexcept}/> */}
                      <InputCheck ref={holiRef} type="checkbox" name="" checked={isHoli} id="hday" onClick={(e) => setIsHoli(!isHoli)}/>
                      <CheckLabelInBox for="hday">
                        <Span/>
                        공휴일 제외
                      </CheckLabelInBox>
                    </LineBox>
                  </AddSelectCondition>
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
const AddLabel = styled.label`
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
const AddSelectSort = styled.div`
  width:100%;
`
const AddSelectCondition = styled(AddSelectSort)`
  z-index:99;
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
const CheckLabelInBox = styled(CheckLabel)`
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
  background:url(${Check}) no-repeat;background-size:100% 100%;
  margin-right:10px;
  vertical-align:middle;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));
    margin-right:calc(100vw*(10/428));
  }
`
const SpanAbsolute = styled(Span)`
  position:absolute;
  left:50%;transform:translateX(-50%);
  top:0;
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