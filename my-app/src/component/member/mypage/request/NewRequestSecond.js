//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


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
import SearchApartOfficetel from "./SearchApartOfficetel";
import SearchStoreOffice from "./SearchStoreOffice";
import SearchApartOfficetelSelectInfo from "./SearchApartOfficetelSelectInfo";
import ModalBrokerRequest from './modal/ModalBrokerRequest';
import NewRequestTopInfos from './NewRequestTopInfos';

//redux addons 전페이지 정보 갖고오기 위함(view형태로 정보 유지 및 view용도) edit하려면 state에 저장해주는게 좋음.
import {useSelector} from 'react-redux';
import {tempBrokerRequestActions} from '../../../../store/actionCreators';

export default function Request({setFilter,value,type}) {

  console.log('nerequetseconds.js>>>',tempBrokerRequestActions);

  const [activeIndex,setActiveIndex] = useState(-1);
  const [openMore, setOpenMore] = useState(false);
  const [viewInput, setViewInput] = useState(false);//관리비 있음일때 input박스 노출
  const [viewDate, setViewDate] = useState(false);//입주가능일 선택할 경우 date박스
  const [job, setJob] = useState(false);//현재업종 선택할 경우 box show/hide
  const [modalBroker,setModalBroker] = useState(false);
  
  const tempBrokerRequests = useSelector(data => data.tempBrokerRequest);
  
  //물건관련 정보 state
  const [maemulname,setMaemulname] = useState('');
  const [jeonyongdimension,setJeonyongdimension] = useState('');
  const [jeonyongpyeong,setJeonyongpyeong] = useState('');
  const [supplydimension,setSupplydimension] = useState('');
  const [supplypyeong,setSupplypyeong] = useState('');
  const [selltype,setSelltype] =useState('');
  const [sellprice,setSellprice] = useState('');
  const [Managecost,setChangemanagecost] = useState('');
  const [is_immediate_ibju, setIbju_isinstant] = useState(false);
  const [ibju_specifydate,setIbju_specifydate] = useState('');
  const [exclusive_periods,setExculsive_periods] = useState('');

  console.log('-=-========addrequetsSecond페이지 얻어온 전 redux정보:',tempBrokerRequests);

  const rotate=()=>{
    if(openMore == true) {
      return "rotate(180deg)"
    }else{
      return "rotate(0deg)"
    }
  }
  //물건관련 정보 셋팅.
  const change_maemulname = (e) => {
    setMaemulname(e.target.value);
  }
  const change_jeonyong_dimension = (e) => {
    setJeonyongdimension(e.target.value);
  }
  const change_jeonyong_pyeong = (e) => {
    setJeonyongpyeong(e.target.value);
  }
  const change_supply_dimension = (e) => {
    setSupplydimension(e.target.value);
  }
  const change_supply_pyeong = (e) => {
    setSupplypyeong(e.target.value);
  }
  const change_selltype = (e) => {
    setSelltype(e.target.value);
  }
  const change_sellprice = (e) => {
    setSellprice(e.target.value);
  }
  const change_Managecost = (e) => {
    setChangemanagecost(e.target.value);
  }
  const radio_is_immediate_ibju = (e) => {
    setIbju_isinstant(e.target.value);//1즉시,0특정날
  }
  const change_ibju_specifydate = (e) => {
    setIbju_specifydate(e.target.value);
  }

  const change_exclusive_periods = (e) => {
    setExculsive_periods(e.target.value);
  }

    return (
        <Container>
          <WrapRequest>
            <TopTitle>기본정보 입력</TopTitle>
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
                  <Select name='realtor_month' onChange={change_exclusive_periods}>
                    <Option>기간 선택</Option>
                    <Option value='3'>3 개월</Option>
                    <Option value='6'>6 개월</Option>
                    <Option value='9'>9 개월</Option>
                    <Option value='12'>12 개월</Option>
                    <Option value='15'>15 개월</Option>
                    <Option value='18'>18 개월</Option>
                    <Option value='24'>24 개월</Option>
                  </Select>
                </SelectBox>
              </Box>
          {/*물건정보*/}
              <Box>
                <SubTitle>
                  <Title>물건정보</Title>
                  <Line/>
                </SubTitle>
                <WrapInputBox>
                  <InputBox>
                    <Label>물건종류</Label>
                    <InputDisabled type="text" value={tempBrokerRequests.maemultype} disabled/>
                  </InputBox>
                  <InputBox>
                    <Label>주소</Label>
                    <InputDisabled type="text" value={tempBrokerRequests.dangijibunaddress+'('+tempBrokerRequests.dangiroadaddress+')'} disabled/>
                  </InputBox>
                  <InputBox>
                    <Label>상세<Pilsu>호수는 공개되지 않습니다.</Pilsu></Label>
                    <InputDisabled type="text" value={tempBrokerRequests.dong_name+' '+tempBrokerRequests.floorname+'층 ' +tempBrokerRequests.ho_name} disabled/>
                  </InputBox>
                </WrapInputBox>
                <WrapItemInfo>
                  <LongLine/>
                  <InputBox>
                    <Label>건물명<Pilsu>*</Pilsu></Label>
                    <InputTxt type="text" placeholder="건물명을 입력하여주세요." onChange={change_maemulname}/>
                  </InputBox>

          {/*!!!!!!현재 업종은 상가일때만 노출됩니다. display:none처리!!!!*/}
                  <InputBox style={{display:"none"}}>
                    <Label>현재업종<Pilsu>*</Pilsu></Label>
                    <SwitchButton>
                      <Switch type="checkbox" id="switch_job"/>
                      <SwitchLabel for="switch_job" onClick={()=>{setJob(!job)}}>
                        <SwitchSpan/>
                        <SwithTxtOff className="no">없음</SwithTxtOff>
                        <SwithTxtOn className="yes">있음</SwithTxtOn>
                      </SwitchLabel>
                    </SwitchButton>
                    {
                      job ?
                      <Flex>
                        <InputTxt type="text" placeholder="현재 업종 입력"/>
                      </Flex>
                      :
                      null
                    }
                  </InputBox>
                  <InputBox>
                    <Label>전용면적<Pilsu>*</Pilsu></Label>
                    <Widthbox>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" onChnage={change_jeonyong_dimension}/>
                        <Span>m²</Span>
                      </Inbox>
                      <Same>=</Same>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" onChange={change_jeonyong_pyeong}/>
                        <Span>평</Span>
                      </Inbox>
                    </Widthbox>
                  </InputBox>
                  <InputBox>
                    <Label>공급면적<Pilsu>*</Pilsu></Label>
                    <Widthbox>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" onChange={change_supply_dimension}/>
                        <Span>m²</Span>
                      </Inbox>
                      <Same>=</Same>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" onChange={change_supply_pyeong}/>
                        <Span>평</Span>
                      </Inbox>
                    </Widthbox>
                  </InputBox>
                </WrapItemInfo>
              </Box>
          {/*거래정보*/}
              <Box>
                <SubTitle>
                  <Title>거래정보</Title>
                  <Line/>
                </SubTitle>
                <SelectBox>
                  <Label>거래유형<Pilsu>*</Pilsu></Label>
                  <SelectMb onChange={change_selltype}>
                    <Option>거래유형을 선택하여주세요.</Option>
                    <Option value='매매'>매매</Option>
                    <Option value='전세'>전세</Option>
                    <Option value='월세'>월세</Option>
                  </SelectMb>
                </SelectBox>
                <InputBox>
                  <Label>가격<Pilsu>*</Pilsu></Label>
                  <Example>(e.g 1억 5,000)</Example>
                  <Flex>
                    <InputMidi type="text" placeholder="가격 입력" onChange={change_sellprice}/>
                    <Dan>만원</Dan>
                  </Flex>
                </InputBox>
              </Box>
            {/*더보기*/}
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
                    <SwitchButton>
                      <Switch type="checkbox" id="switch"/>
                      <SwitchLabel for="switch" onClick={()=>{setViewInput(!viewInput)}}>
                        <SwitchSpan/>
                        <SwithTxtOff className="no">없음</SwithTxtOff>
                        <SwithTxtOn className="yes">있음</SwithTxtOn>
                      </SwitchLabel>
                    </SwitchButton>
                  {
                    viewInput ?
                    <Flex>
                      <InputMidi type="text" placeholder="가격 입력" onChange={change_Managecost}/>
                      <Dan>만원</Dan>
                    </Flex>
                    :
                    null

                  }

                  </MoreBox>
                {/*관리비 포함*/}
                  <MoreBox>
                    <Label>관리비 포함<Pilsu>*</Pilsu></Label>
                    <WrapCheck>
                      <Checkbox>
                        <Check type="checkbox" id="check1" defaultChecked />
                        <CheckLabel for="check1">
                          <CheckSpan/>
                          전기
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="check2" />
                        <CheckLabel for="check2">
                          <CheckSpan/>
                          수도
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="check3" />
                        <CheckLabel for="check3">
                          <CheckSpan/>
                          가스
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="check4" />
                        <CheckLabel for="check4">
                          <CheckSpan/>
                          인터넷
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="check5" />
                        <CheckLabel for="check5">
                          <CheckSpan/>
                          티비
                        </CheckLabel>
                      </Checkbox>
                    </WrapCheck>
                  </MoreBox>
              {/*입주가능일*/}
                  <MoreBox>
                    <Label>입주가능일<Pilsu>*</Pilsu></Label>
                    <WrapCheck>
                      <Radiobox>
                        <Radio type="radio" name="possible" value='1'id="radi1" defaultChecked onClick={radio_is_immediate_ibju}/>
                        <RadioLabel for="radi1" onClick={()=>{setViewDate(false)}}>
                          <RadioSpan/>
                          즉시
                        </RadioLabel>
                      </Radiobox>
                      <Radiobox>
                        <Radio type="radio" name="possible" value='0' id="radi2" onClick={radio_is_immediate_ibju}/>
                        <RadioLabel for="radi2" onClick={()=>{setViewDate(true)}}>
                          <RadioSpan/>
                          날짜 선택
                        </RadioLabel>
                      {
                        viewDate ?
                        <InputDate type="date" onChange={change_ibju_specifydate}/>
                        :
                        null
                      }
                      </Radiobox>
                    </WrapCheck>
                  </MoreBox>

                </MoreView>
                :
                null

              }

              </WrapMoreView>
            </WrapBox>
      {/*!!!!다음 버튼 , 조건문 맞춰서 액티브 됐을때 색상 바뀌어야함..!!!! */}
            <NextButton>
              <Link onClick={()=>{
                setModalBroker(true);
                 
                console.log('다음버튼 클릭 입력정보들 물건정보들:',maemulname,jeonyongdimension,jeonyongpyeong,supplydimension,supplypyeong,selltype,sellprice,Managecost,is_immediate_ibju,ibju_specifydate);
                //지금껏 작성 change정보 redux저장..
                 tempBrokerRequestActions.maemulnamechange({maemulnames: maemulname});
                 tempBrokerRequestActions.jeonyongdimensionchange({jeonyongdimensions: jeonyongdimension});
                 tempBrokerRequestActions.jeonyongpyeongchange({jeonyongpyeongs: jeonyongpyeong});
                 tempBrokerRequestActions.supplydimensionchange({supplydimensions: supplydimension});
                 tempBrokerRequestActions.supplypyeongchange({supplypyeongs: supplypyeong});
                 tempBrokerRequestActions.selltypechange({selltypes: selltype});
                 tempBrokerRequestActions.sellpricechange({sellprices: sellprice});
                 tempBrokerRequestActions.managecostchange({managecosts: Managecost});
                 tempBrokerRequestActions.ibjuisinstantchange({is_immediate_ibjus: is_immediate_ibju});
                 tempBrokerRequestActions.ibjuspecifydatechange({ibju_specifydates: ibju_specifydate});
                 tempBrokerRequestActions.exculsiveperiodschange({exclusive_periodss: exclusive_periods});
                }}>
                <Next type="button">다음</Next>
              </Link>
            </NextButton>

            {
              modalBroker ?
              <ModalBrokerRequest modalBroker={modalBroker} setModalBroker={setModalBroker}/>
              :
              null

            }
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
    padding:24px 0 250px;
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(380/428));
      padding:calc(100vw*(30/428)) 0 calc(100vw*(150/428));
      }
`
const WrapRequest = styled.div`
  width:100%;
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
  margin-right:7px;
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
      margin-left:calc(100vw*(10/428));
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
const RadioboxJob = styled.div`
  width:65px;
  margin-bottom:0;
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