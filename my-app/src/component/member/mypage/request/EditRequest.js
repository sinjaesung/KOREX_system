//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

import serverController from '../../../../server/serverController';

//css
import styled from "styled-components"

//img

import ArrowTop from '../../../../img/map/arrow_top.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import Enter from '../../../../img/member/enter.png';
import CheckImg from '../../../../img/map/radio.png';
import CheckedImg from '../../../../img/map/radio_chk.png';
import RadioImg from '../../../../img/map/radi.png';
import RadioChkImg from '../../../../img/map/radi_chk.png';

import { Mobile, PC } from "../../../../MediaQuery"

//component

import BrokerInfoLess from './component/BrokerInfoLess';
import ModalMap from './modal/ModalMap';
import NewRequestTopInfosouter from './NewRequestTopInfosouter';

//redux addons saseests.
import {useSelector} from 'react-redux';
//import {tempBrokerRequestActions} from '../../../../store/actionCreators';

export default function Request({setFilter,value,type,confirmModal,probrokerinfo,prd_identity_id,viewInput,viewDate,addr_detail,addr_jibun,addr_road,prdtype,prdstatus,maemulname,jeonyongdimension,jeonyongpyeong,supplydimension,supplypyeong,selltype,usetype,sellprice,Managecost,is_immediate_ibju,ibju_specifydate,exclusive_periods,requestMessage,job,jobType,deposit,monthly,selectMana,isrightprice,setAddress_detail,setAddressjibun,setAddressroad,setPrdtype,setPrdstatus,setMaemulname,setJeonyongdimension,setJeonyongpyeong,setSupplydimension,setSupplypyeong,setSelltype,setUsetype,setSellprice,setChangemanagecost,setIbju_isinstant,setIbju_specifydate,setExculsive_periods,setRequestMessage,setJob,setJobType,setDeposit,setMonthly,setSelectMana,onChangeMana,setViewDate,setViewInput,setIsrightprice}) {
  console.log('EditReuqesst compeont element:',probrokerinfo);
  const [activeIndex,setActiveIndex] = useState(-1);
  const excRange=[3,6,9,12,15,18,24];
  const manageData=['전기','수도','가스','인터넷','티비'];
 
  const [openMore, setOpenMore] = useState(false);
  //redux 데이터 사전 조회.
  //const tempBrokerRequest= useSelector(data => data.tempBrokerRequest);

  //console.log(tempBrokerRequestActions,tempBrokerRequest);

  /*모달*/
  const [map, setMap] = useState(false);//주소 눌렀을때 지도 모달
  const [success,setSuccess] = useState(false);//중개의뢰 성공모달
  const [fail,setFail] = useState(false);//중개의뢰 실패 모달

  const rotate=()=>{
    if(openMore == true) {
      return "rotate(180deg)"
    }else{
      return "rotate(0deg)"
    }
  }
  
   // 해당 페이지 정보들입니다.
  // 리덕스에 그대로 담아 활요하시면 됩니다.
  // 다음 버튼 눌렀을때 다음 액션이 없습니다.
  
  const nextStep = async () => {
    
    console.log('전속기간:',exclusive_periods); // 전속 기간
    console.log('건물명:',maemulname); // 건물명
    console.log('용도:',usetype); // 용도 
    console.log('job:',job); // 업종유무
    console.log('jobType:',jobType); // 현재 업종
    console.log('jeonyongdimension:',jeonyongdimension); // 전용면적 m²
    console.log('jeonyongpyeong:',jeonyongpyeong); // 전용면적 평
    console.log('supplydimension:',supplydimension); // 공급면적 m²
    console.log('supplypyeong:',supplypyeong); // 공급면적 평
    console.log('selltype:',selltype); // 거래 유형
    console.log('sellprice:',sellprice); // 거래 가격
   // console.log('deposit:',deposit); // 보증금
    console.log('monthly:',monthly); // 월세
    console.log('viewInput:',viewInput) // 관리비 유무
    console.log('Managecost:',Managecost); // 관리비 
    console.log('selectMana:',selectMana); // 관리비 포함
    console.log('viewDate:',viewDate); // 입주 가능일  false->즉시 true->날짜선택
    console.log('is_immediate_ibju:',is_immediate_ibju);//즉시 입주가능 여부
    console.log('ibju_specifydate:',ibju_specifydate); // 입주 날짜
    console.log('requestMessage:',requestMessage); // 요청사항
    console.log('권리금유무::',isrightprice);//권리금 유무(상가)

    let body_info = {
      prd_identity_id : prd_identity_id,

      maemulname : maemulname,
      exclusive_periods: exclusive_periods,
      usetype : usetype,//용도
      job: job, //업종유무
      jobtype: jobType,//현재 업종
      jeonyongdimension: jeonyongdimension,
      jeonyongpyeong: jeonyongpyeong,
      supplydimension: supplydimension,
      supplypyeong: supplypyeong,
      selltype: selltype,
      sellprice: sellprice,//매매,전세,월세 보증금 등 가격.
      //deposit: deposit,//보증금
      monthly: monthly,//월세
      managecost: Managecost,
      manageincludes: selectMana.join(','),//관리비포함
      ismangement : viewInput,
      is_immediate_ibju : is_immediate_ibju,
      ibju_specifydate : ibju_specifydate,
      request_message : requestMessage,
      isrightprice : isrightprice
    }
    console.log('server send bod info중개의뢰매물 수정처리:',body_info);//해당 요청 prdidneitityid의 관련 product내역들 전부수정. 히스토리내역의 모든 내역 일괄수정.
    
    let res=await serverController.connectFetchController('/api/broker/user_brokerRequest_modifyProcess','post',JSON.stringify(body_info));

    if(res.success){
      //alert('중개의뢰수정 성공!');
      //history.push('/Mypage');
      confirmModal();
    }else{
      alert(res.message);
    }
  }
  
  const sellpricechange=(event)=>{
    setSellprice(event.target.value);
  }
  const monthlychange=(event)=>{
    setMonthly(event.target.value);
  }
  
    return (
        <Container>
          <NewRequestTopInfosouter item={probrokerinfo}/>
          <WrapRequest>
            <WrapBrokerInfo>
              <Condition>상태 : <ConditionDetail>{prdstatus}</ConditionDetail></Condition>
              <BrokerInfoLess setMap={setMap} probrokersingleinfo={probrokerinfo}/>
            </WrapBrokerInfo>

            {
              map ?
              <ModalMap map={map} setMap={setMap}/>
              :
              null

            }
            <WrapBox>
              <Box>
                <SubTitle>
                  <Title>전속정보</Title>
                  <Line/>
                </SubTitle>
                <TopDesc>
                  전속기간의 기산일은 전문중개사의 의뢰 수락 후<br/>
                  의뢰인의 거래 개시 승인일 다음날부터입니다.
                </TopDesc>
                <SelectBox>
                  <Label>전속기간<Pilsu>*</Pilsu></Label>
                  <Select onChange={ e => setExculsive_periods(e.target.value)}>
                    <Option>기간 선택</Option>

                    {
                      excRange.map((item,index) => {
                        console.log('exculsivepreidos:',exclusive_periods);
                        return(
                          <Option value={item} key={index} selected={exclusive_periods === item}>{item} 개월</Option>
                        )
                      })
                    }
                  </Select>
                </SelectBox>
              </Box>
              <Box>
                <SubTitle>
                  <Title>물건정보</Title>
                  <Line/>
                </SubTitle>
                <WrapInputBox>
                  <InputBox>
                    <Label>물건종류</Label>
                    <InputDisabled type="text" value={prdtype} disabled/>
                  </InputBox>
                  <InputBox>
                    <Label>주소</Label>
                    <InputDisabled type="text" value={addr_jibun+'('+addr_road+')'} disabled/>
                  </InputBox>
                  <InputBox>
                    <Label>상세<Pilsu>호수는 공개되지 않습니다.</Pilsu></Label>
                    <InputDisabled type="text" value={addr_detail} disabled/>
                  </InputBox>
                </WrapInputBox>
                <WrapItemInfo>
                  <LongLine/>
                  <InputBox>
                    <Label>건물명<Pilsu>*</Pilsu></Label>
                    <InputTxt type="text" placeholder="건물명을 입력하여주세요." value={maemulname} onChange={e=>setMaemulname(e.target.value)}/>
                  </InputBox>
                  {/*!!!!!! 05.21 용도는 오피스텔일때만 노출됩니다. display:none처리!!!!*/}
                  {
                    prdtype=='오피스텔'?
                    <SelectBox>
                    <Label>용도<Pilsu>*</Pilsu></Label>
                    <SelectMb onChange={e => setUsetype(e.target.value)}>
                      <Option>용도를 선택하여주세요.</Option>
                      <Option value='주거용' selected={usetype=='주거용'}>주거용</Option>
                      <Option value='업무용' selected={usetype=='업무용'}>업무용</Option>
                    </SelectMb>
                   </SelectBox>
                  :
                  null
                  
                  }
                  
                   {/*!!!!!!현재 업종은 상가일때만 노출됩니다. display:none처리!!!!*/}
                   {
                     prdtype =='상가'?
                     <InputBox>
                     <Label>현재업종<Pilsu>*</Pilsu></Label>
                    {/*<SwitchButton>
                       <Switch type="checkbox" id="switch_job"/>
                       <SwitchLabel for="switch_job" onClick={()=>{setJob(!job)}}>
                         <SwitchSpan/>
                         <SwithTxtOff className="no">없음</SwithTxtOff>
                         <SwithTxtOn className="yes">있음</SwithTxtOn>
                       </SwitchLabel>
                    </SwitchButton>*/}
                    <Radiobox>
                      <Radio type="radio" name="job" value='0' checked={job==0 ? true : false}  id="job1"/>
                      <RadioLabel for="job1"  onClick={()=>{setJob(0)}}>
                        <RadioSpan/>
                        없음
                      </RadioLabel>
                    </Radiobox>
                    <Radiobox>
                      <Radio type="radio" name="job" value='1' checked={job==1? true : false} id="job2"/>
                      <RadioLabel for="job2"  onClick={()=>{setJob(1)}}>
                        <RadioSpan/>
                        있음
                      </RadioLabel>
                    </Radiobox>
                     {
                       job ?
                       <Flex>
                         <InputTxt type="text" placeholder="현재 업종 입력" value={jobType} onChange={e => setJobType(e.target.value)}/>
                       </Flex>
                       :
                       null
                     }   
                   </InputBox>
                    :
                    null
                   }
                   
                  <InputBox>
                    <Label>전용면적<Pilsu>*</Pilsu></Label>
                    <Widthbox>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" value={jeonyongdimension} onChange={e=>setJeonyongdimension(e.target.value)}/>
                        <Span>m²</Span>
                      </Inbox>
                      <Same>=</Same>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" value={jeonyongpyeong} onChange={e=>setJeonyongpyeong(e.target.value)}/>
                        <Span>평</Span>
                      </Inbox>
                    </Widthbox>
                  </InputBox>
                  <InputBox>
                    <Label>공급면적<Pilsu>*</Pilsu></Label>
                    <Widthbox>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" value={supplydimension} onChange={e=>setSupplydimension(e.target.value)}/>
                        <Span>m²</Span>
                      </Inbox>
                      <Same>=</Same>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" value={supplypyeong} onChange={e=>setSupplypyeong(e.target.value)}/>
                        <Span>평</Span>
                      </Inbox>
                    </Widthbox>
                  </InputBox>
                </WrapItemInfo>
              </Box>
            
              <Box>
                <SubTitle>
                  <Title>거래정보</Title>
                  <Line/>
                </SubTitle>
                <SelectBox>
                  <Label>거래유형<Pilsu>*</Pilsu></Label>
                  <SelectMb onChange={e=>setSelltype(e.target.value)}>
                    <Option>거래유형을 선택하여주세요.</Option>
                    <Option selected={selltype=='매매'}>매매</Option>
                    <Option selected={selltype=='전세'}>전세</Option>
                    <Option selected={selltype=='월세'}>월세</Option>
                  </SelectMb>
                </SelectBox>
                <InputBox>
                  <Label>가격<Pilsu>*</Pilsu></Label>
                   {
                  /*거래유형 > 매매 선택됐을때 하단의 InputMidi placeholder ="매매가 입력" <Example>(e.g 1억 5,000)</Example>
                  거래유형 > 전세 선택됐을때 하단의 InputMidi placeholder ="전세가 입력" <Example>1,000/50</Example>
                  */
                   }
                  
                  <Example>{selltype=="매매"?'(e.g 1억 5,000)':'1,000/50'}</Example>
                  <Flex>
                    <InputMidi type="text" placeholder={`${selltype}가 입력`} value={selltype!='월세'?sellprice:monthly} onChange={selltype=='월세'?monthlychange:sellpricechange}/>
                    <Dan>만원</Dan>
                  </Flex>
                 
                  {
                    selltype=="월세"&&
                    <FlexMt>
                      <InputShortWd type="text" placeholder="보증금 입력" value={sellprice} onChange={sellpricechange}/>
                      <InputShortWd type="text" placeholder="월세" value={monthly}onChange={monthlychange}/>
                      <Dan>만원</Dan>
                    </FlexMt>
                  }
                </InputBox>
                {
                  prdtype=='상가'?
                  <Flex>
                  <InputBox>
                    <Label>권리금</Label>
                    {/*<SwitchButton>
                      <Switch type="checkbox" id="is_rightsprice"/>
                      <SwitchLabel for="is_rightsprice" onClick={()=>{set_isrightsprice(!isrightprice);}}>
                        <SwitchSpan/>
                        <SwithTxtOff className="no">없음</SwithTxtOff>
                        <SwithTxtOn className="yes">있음</SwithTxtOn>
                      </SwitchLabel>
                    </SwitchButton>*/}
                    <Radiobox>
                      <Radio type="radio" name="is_rightsprice" value='0' checked={isrightprice==0 ? true : false}  id="is_rightsprice1"/>
                      <RadioLabel for="is_rightsprice1"  onClick={()=>{setIsrightprice(0)}}>
                        <RadioSpan/>
                        없음
                      </RadioLabel>
                    </Radiobox>
                    <Radiobox>
                      <Radio type="radio" name="is_rightsprice" value='1' checked={isrightprice==1? true : false} id="is_rightsprice2"/>
                      <RadioLabel for="is_rightsprice2"  onClick={()=>{setIsrightprice(1)}}>
                        <RadioSpan/>
                        있음
                      </RadioLabel>
                    </Radiobox>
                  </InputBox>
                  
                  </Flex>
                  :
                  null
                  }
              </Box>
              
              <WrapMoreView>
                <SubTitle onClick={()=>{setOpenMore(!openMore)}} style={{cursor:"pointer"}}>
                  <EnterImg src={Enter}/>
                  <Title>더보기</Title>
                  <ShortLine/>
                  <ArrowTopImg src={ArrowTop} rotate={rotate}/>
                </SubTitle>
              {
                openMore ?
                <MoreView>
                  <MoreBox>
                    <Label>관리비<Pilsu>*</Pilsu></Label>
                    {/*<SwitchButton>
                      <Switch type="checkbox" id="switch"/>
                      <SwitchLabel for="switch" onClick={()=>{setViewInput(!viewInput)}}>
                        <SwitchSpan/>
                        <SwithTxtOff className="no">없음</SwithTxtOff>
                        <SwithTxtOn className="yes">있음</SwithTxtOn>
                      </SwitchLabel>
                    </SwitchButton>
                    {
                      Managecost ?
                      <Flex>
                        <InputMidi type="text" placeholder="가격 입력" value={Managecost} onChange={e=>setChangemanagecost(e.target.value)}/>
                        <Dan>만원</Dan>
                      </Flex>
                      :
                      null

                    }*/}

                    <Radiobox>
                      <Radio type="radio" name="ismanagement" value='0' checked={viewInput=='0' ? true : false}  id="ismanagement2"/>
                      <RadioLabel for="ismanagement2"  onClick={()=>{setViewInput(0)}}>
                        <RadioSpan/>
                        없음
                      </RadioLabel>
                    </Radiobox>
                    <Radiobox>
                      <Radio type="radio" name="ismanagement" value='1' checked={viewInput=='1'? true : false}id="ismanagement1"/>
                      <RadioLabel for="ismanagement1"  onClick={()=>{setViewInput(1)}}>
                        <RadioSpan/>
                        있음
                      </RadioLabel>
                    </Radiobox>
                    {
                      viewInput =='1' ?
                      <Flex>
                        <InputMidi type='text' placeholder='가격 입력' value={Managecost} onChange={e=>setChangemanagecost(e.target.value)}/>
                        <Dan>만원</Dan>
                      </Flex>
                      :
                      null
                    }
                  </MoreBox>
             
                  <MoreBox>
                    <Label>관리비 포함<Pilsu>*</Pilsu></Label>
                    <WrapCheck>
                      {
                        manageData.map((item,index)=>{
                          return(
                            <Checkbox>
                              <Check onChange={e => onChangeMana(e)} value={item} type='checkbox' id={`check${index}`} checked={selectMana.indexOf(item)!=-1}/>
                              <CheckLabel for={`check${index}`}>
                                <CheckSpan/>
                                {item}
                              </CheckLabel>
                            </Checkbox>
                          )
                        })
                      }
                    </WrapCheck>
                  </MoreBox>
            
                  <MoreBox>
                    <Label>입주가능일<Pilsu>*</Pilsu></Label>
                    <WrapCheck>
                      <Radiobox>
                        <Radio type="radio" name="possible" id="radi1" value='1' checked={is_immediate_ibju} />
                        <RadioLabel for="radi1" onClick={()=>{setIbju_isinstant(1);setViewDate(false);}}>
                          <RadioSpan/>
                          즉시
                        </RadioLabel>
                      </Radiobox>
                      <Radiobox>
                        <Radio type="radio" name="possible" id="radi2" value='0' checked={!is_immediate_ibju} />
                        <RadioLabel for="radi2" onClick={()=>{setIbju_isinstant(0);setViewDate(true)}}>
                          <RadioSpan/>
                          날짜 선택
                        </RadioLabel>
                      {
                        !is_immediate_ibju ?
                        <InputDate type="date" onChange={e=>setIbju_specifydate(e.target.value)} value={ibju_specifydate}/>
                        :
                        null
                      }
                      </Radiobox>
                    </WrapCheck>
                  </MoreBox>
             
                  <MoreBox>
                    <Label>요청사항 입력</Label>
                    <Textarea type="textarea" placeholder="요청사항을 입력하여주세요." value={requestMessage} onChange={e=>setRequestMessage(e.target.value)}/>
                  </MoreBox>
                </MoreView>
                :
                null

              }
              </WrapMoreView>
            </WrapBox>
     
            <NextButton>
              <Link className="data_link" onClick={()=>{

                nextStep();
                
              }}/>
              <Next type="button">확인</Next>
            </NextButton>
           </WrapRequest>
        </Container>
  );
}

const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = styled.div`
    width:680px;
    margin:0 auto;
    padding:0 0 250px;
    @media ${(props) => props.theme.mobile} {
      width:100%;
      padding:calc(100vw*(30/428)) 0 calc(100vw*(150/428));
      }
`
const WrapRequest = styled.div`
  width:100%;
  padding-top:40px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(380/428));
    padding-top:0;
    margin:0 auto;
    }
`
const WrapBrokerInfo = styled.div`
  width:465px;margin:0 auto;
  padding-top:0;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding-top:calc(100vw*(15/428));
    }
`
const TopTitle = styled.h2`
  font-size:20px;color:#707070;
  text-align:left;padding-left:30px;
  font-weight:800;transform:skew(-0.1deg);
  margin-bottom:40px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding-left:calc(100vw*(16/428));
    }
`
const WrapBox = styled.div`
  width:408px;margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(380/428));
    }
`
const Box = styled.div`
  width:100%;
  margin-bottom:55px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(40/428));
    }
`
const SubTitle = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:40px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(40/428));
    }
`
const Title = styled.h2`
  font-size:15px;color:#4e4e4e;
  font-weight:800;transform:skew(-0.1deg);
  margin-right:7px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-right:calc(100vw*(7/428));
    }
`
const Line = styled.div`
  width:340px;height:1px;
  background:#cecece;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(300/428));
    }
`
const TopDesc = styled.div`
    padding:0 0 35px;
    font-size:15px;color:#4a4a4a;
    font-weight:600;transform:skew(-0.1deg);
    line-height:1.33;text-align:center;
    @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(13/428));
      padding:0 0 calc(100vw*(35/428));
    }
`
const SelectBox = styled.div`
  width:100%;
`
const Label = styled.label`
  display:block;
  font-size:12px;font-weight:600;
  transform:skew(-0.1deg);color:#4a4a4a;
  margin-bottom:10px;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(12/428));
      margin-bottom:calc(100vw*(10/428));
    }
`
const Pilsu = styled.span`
  display:inline-block;
  font-size:12px;font-weight:600;
  transform:skew(-0.1deg);color:#fe7a01;
  vertical-align:middle;
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(12/428));
      margin-left:calc(100vw*(5/428));
    }
`
const Select = styled.select`
  width:100%;height:43px;
  font-weight:600;transform:skew(-0.1deg);
  text-align-last:center;
  border: solid 1px #e4e4e4;
  border-radius:4px;
  appearance:none;color:#707070;
  font-size:15px;transform:Skew(-0.1deg);
  background:url(${ArrowDown}) no-repeat 92% center;background-size:11px;
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(15/428));
      background-size:calc(100vw*(11/428));
    }
`
const SelectMb = styled(Select)`
  margin-bottom:30px;
  @media ${(props) => props.theme.mobile} {
      margin-bottom:calc(100vw*(25/428));
    }
`
const Option = styled.option`
`
const WrapInputBox = styled.div`
  width:100%;
`
const InputBox = styled.div`
  position:relative;
  margin-bottom:14px;
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.mobile} {
     margin-bottom:calc(100vw*(14/428));
    }
`
const InputDisabled = styled.input`
  width:100%;height:43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #fbfbfb;
  color:#979797;
  font-size:15px;font-weight:500;
  text-align:center;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(15/428));
    }
`
const InputTxt= styled.input`
  width:100%;
  height:43px;
  text-align:center;
  background:transparent;
  font-size:15px;color:#4a4a4a;
  transform:skew(-0.1deg);
  border-radius: 4px;font-weight:600;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(15/428));
    }
`
const WrapItemInfo = styled.div`
`

const Widthbox = styled.div`
  width:100%;display:flex;justify-content:space-between;
  align-items:center;
`
const Inbox = styled.div`
  display:flex;justify-content:center;
  align-items:center;
  width: 177px;
  height: 43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(170/428));
      height:calc(100vw*(43/428));
    }
`
const InputShort = styled.input`
  width:70%;
  height:100%;
  text-align:center;
  background:transparent;font-weight:600;
  font-size:15px;color:#4a4a4a;
  transform:skew(-0.1deg);
  &::placeholder{color:#979797}
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }
`
const Span = styled.span`
  vertical-align:middle;
  font-size:15px;font-weight:600;
  color:#4a4a4a;transform:skew(-0.1deg);
  margin-left:10px;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
      margin-left:calc(100vw*(10/428));
    }
`
const Same = styled.span`
  font-size:15px;font-weight:600;
  color:#4a4a4a;transform:skew(-0.1deg);
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }

`
const LongLine = styled.div`
  width:100%;height:1px;
  background:#cecece;
  margin:26px 0 40px;
  @media ${(props) => props.theme.mobile} {
      margin:calc(100vw*(26/428)) 0 calc(100vw*(40/428));
    }
`
const Example = styled.p`
  position:absolute;right:0;
  top:0;
  font-size:12px;transform:skew(-0.1deg);
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(12/428));
    }

`
const Flex = styled.div`
  display:flex;justify-content:space-between;align-items:center;
`
const InputMidi = styled.input`
  width: 353px;
  height: 43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  font-size:15px;color:#4a4a4a;
  font-weight:600;
  transform:skew(-0.1deg);text-align:center;
  &::placeholder{color:#979797}
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(315/428));
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(15/428));
    }
`
const Dan = styled.p`
  font-size:15px;color:#4a4a4a;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }
`
const WrapMoreView = styled.div`
  width:100%;
  margin-top:50px;
  @media ${(props) => props.theme.mobile} {
      margin-top:calc(100vw*(50/428));
    }
`
const EnterImg = styled.img`
  display:inline-block;
  width:19px;
  margin-right:27px;
  margin-top:-13px;
  @media ${(props) => props.theme.mobile} {
      margin-right:calc(100vw*(27/428));
      margin-top:calc(100vw*(-13/428));
      width:calc(100vw*(19/428));
    }
`
const ShortLine = styled(Line)`
  width:250px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(223/428));
    }
`
const ArrowTopImg = styled.img`
  display:inline-block;
  width:26px;
  cursor:pointer;
  transition:all 0.3s;
  transform:${({rotate}) => rotate};
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(26/428));
    }
`
const MoreView = styled.div`
  transition:all 0.3s;
`
const MoreBox = styled.div`
  margin-top:30px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(30/428));
    }
`
const SwitchButton = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin-top:20px;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
    margin-top:calc(100vw*(20/428));
  }
`
const Switch = styled.input`
  display:none;
  &:checked+label{background:#009053}
  &:checked+label span{left:22px;}
  &:checked+label .no{opacity:0;}
  &:checked+label .yes{opacity:1;}
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
const SwithTxtOff = styled.p`
  position:absolute;
  width:100px;
  display:inline-block;
  left:50px;top:-3px;
  font-size: 15px;
  font-weight: normal;
  letter-spacing: normal;
  text-align: left;
  color: #4a4a4a;
  opacity:1;
  transition:all 0.3s;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    left:calc(100vw*(50/428));
    top:calc(100vw*(-2/428));
  }
`
const SwithTxtOn = styled(SwithTxtOff)`
  opacity:0;
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
const Sub = styled.span`
  display:inline-block;font-size:15px;
  font-weight:normal;transform:skew(-0.1deg);color:#4a4a4a;
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-left:calc(100vw*(10/428));
  }
`
const WrapCheck = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  flex-wrap:wrap;margin-top:20px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(20/428));
  }
`
const Checkbox = styled.div`
  width:33%;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
  }
`
const Check = styled.input`
  display:none;
  &:checked+label span{background:url(${CheckedImg}) no-repeat; background-size:100% 100%;}
`
const CheckLabel = styled.label`
  font-size:15px;
  transform:skew(-0.1deg);color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const CheckSpan = styled.span`
  display:inline-block;width:20px;height:20px;
  background:url(${CheckImg}) no-repeat; background-size:100% 100%;
  margin-right:8px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));height:calc(100vw*(20/428));
    margin-right:calc(100vw*(8/428));
  }
`
const Radiobox = styled.div`
  width:100%;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
  }
`
const Radio = styled.input`
  display:none;
  &:checked+label span{background:url(${RadioChkImg}) no-repeat; background-size:100% 100%;}
`
const RadioLabel = styled.label`
  font-size:15px;
  transform:skew(-0.1deg);color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const RadioSpan = styled.span`
  display:inline-block;width:20px;height:20px;
  background:url(${RadioImg}) no-repeat; background-size:100% 100%;
  margin-right:8px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));height:calc(100vw*(20/428));
    margin-right:calc(100vw*(8/428));
  }
`
const InputDate = styled(InputTxt)`
  margin-top:20px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(20/428));
  }
`
const NextButton = styled.div`
position:relative; 
  width:100%;text-align:center;
  margin-top:70px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(70/428));
  }
`
const Next = styled.button`
  display:inline-block;
  width:408px;
  height: 66px;
  line-height: 60px;
  font-size:20px;font-weight:800;color:#fff;
  transform:skew(-0.1deg);text-align:center;
  border-radius: 11px;
  border: solid 3px #e4e4e4;
  background-color: #979797;
  /* 액티브 됐을때

  border: solid 3px #04966d;
  background-color: #01684b; */
  @media ${(props) => props.theme.mobile} {
    width:100%;
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
  }
`
const Textarea = styled.textarea`
  width:100%;
  height:140px;
  font-size:15px;color:#4a4a4a;font-weight:600;
  padding:15px 20px;
  border-radius: 4px;transform:skew(-0.1deg);
  border: solid 1px #e4e4e4;
  &::placeholder{color:#979797;font-weight:500;}
  @media ${(props) => props.theme.mobile} {
    width:100%;
    height:calc(100vw*(140/428));
    padding:calc(100vw*(15/428));
    font-size:calc(100vw*(15/428));
  }
`
const Condition = styled.div`
  font-size:15px;color:#707070;
  text-align:left;padding-left:30px;
  font-weight:800;transform:skew(-0.1deg);
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(30/428));
    padding-left:0;
    }
`
const ConditionDetail = styled.span`
  display:inline-block;vertical-align:middle;
  font-size:15px;color:#979797;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    }
`
const InputShortWd = styled(InputShort)`
  width:40%;
  border:solid 1px #e4e4e4;
  border-radius:4px;
  height:43px;
  &:last-child{margin-right:0;}
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(43/428));
  }
`
const FlexMt = styled(Flex)`
  margin-top:10px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(10/428));
  }
`