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
import NewRequestTopInfos from './NewRequestTopInfos';

//redux addons saseests.
import {useSelector} from 'react-redux';

export default function Request({setFilter,value,type,confirmModal,maemulinfo,probrokerinfo,nowprdstatus}) {
  const [activeIndex,setActiveIndex] = useState(-1);
  const [openMore, setOpenMore] = useState(false);
  const [viewInput, setViewInput] = useState(false);//관리비 있음일때 input박스 노출
  const [viewDate, setViewDate] = useState(false);//입주가능일 선택할 경우 date박스

  //redux 데이터 사전 조회.

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

  const [requestMessage, setRequestMessage] = useState('');
  const [exculsive_periods,setExculsive_periods]= useState('');
  
  //전속기한연자 요청 관련 쿼리진행.
  const nextStep = async (e) => {
    //리덕스에 재 저장.

    //의뢰인(외부수임인or코렉스 회원:개인,기업가입자회원)이 거래개시승인수락한 이후 거래개시상태매물이 있고 이거에 대해서 거의 끝나가는것 연장요청시에.매물이 이미 존재하고있고 그걸 요청하는 행동요청시ㅣ기에 그 날짜부터 전속기나에 해당하는 기한까지로 해서 start~end 하는 연산은 동일함.
    let prd_identity_id=maemulinfo.prd_identity_id;
    let extend_info = {
      prd_identity_id : maemulinfo.prd_identity_id,
      company_id : maemulinfo.company_id,
      exculsive_periods : exculsive_periods,//지정한 연장할 기간만크믕로 현재 날자로부터 추가한다>>
      type:'extend'
    };
    let exculsive_start= await serverController.connectFetchController('/api/broker/brokerRequest_product_exculsivestart','POST',JSON.stringify(extend_info));

      //전속기한 물리적으로 매물에 대해서 일방적 변경후에 update후에 관련된 날짜기간에 대해서 그 마감일당일, 삼일전에 예약형태 알림(노티알림,문자예약알림)가해지게 관련처리.
      if(exculsive_start){
        //특정 매물에 대한(전문중개사 전속매물공급) 전속기한연장요청 관련 된 알림: 전속매물공급관련 알림.
        let nott_info={
          prd_identity_id : prd_identity_id,
          company_id : maemulinfo.company_id,//수임전문중개사에게.
          message:prd_identity_id+'::해당매물 의뢰자로부터 전속기한연장요청이 발생했습니다.\n',
          noti_type: 15
        }
        let nott_res=await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(nott_info));
        if(nott_res){
          if(nott_res.success){
            console.log('nott_ress',nott_res);
          }else{
            alert(nott_res.message);
          }
        }

      console.log('excuslive_startsss 전속기간 계약시작~종료일::',exculsive_start);

      if(!exculsive_start.success){
        alert(exculsive_start.message);
        return false;
      }else{
        //전속기한 관련 수정 및 처리완료시에 수정된 전속기한만료일에 대한 관련 예약알림가한다. 
        let process_result=exculsive_start.result;
        let exclusive_end_date=process_result.exclusive_end_date;//전속기한 만료일.만료예정일.

        //let maemulinfo_data_loca='만료일시:'+prd_exculsive_end_date+'\n수임인:'+maemulinfo.company_id+'중개사\n등록번호:'+prd_identity_id+'\n물건종류:'+maemulinfo.prd_type+'\n건물명:'+maemulinfo.prd_name+' '+maemulinfo.dongname+'동'+maemulinfo.hosilname+'호\n 건물주소:'+maemulinfo.addressroad+'\n 거래유형:'+maemulinfo.prd_sel_type+' '+(maemulinfo.prd_sel_type=='월세'?(maemulinfo.prd_month_price+'만 / 보증금:'+maemulinfo.prd_price+'만'):(maemulinfo.prd_price+'만'));
        let maemulinfo_data_loca = '수임인:'+maemulinfo.company_id+'중개사\n등록번호:'+prd_identity_id+'\n물건종류:'+maemulinfo.prd_type+'\n건물명:'+maemulinfo.prd_name+' '+maemulinfo.dongname+'동'+maemulinfo.hosilname+'호\n 건물주소:'+maemulinfo.addressroad+'\n 거래유형:'+maemulinfo.prd_sel_type+' '+(maemulinfo.prd_sel_type=='월세'?(maemulinfo.prd_month_price+'만 / 보증금:'+maemulinfo.prd_price+'만'):(maemulinfo.prd_price+'만'));

        console.log('maemulinfo locasss:',maemulinfo_data_loca);
        if(exclusive_end_date){
          //전속기간마감일 또는 
          var last_date=exclusive_end_date;
          var last_date_date=new Date(exclusive_end_date);
          var last_date_date2=new Date(exclusive_end_date);
          var last_date_targetdate=last_date_date2.setDate(last_date_date2.getDate()-3);//대상일의 삼일전.
          last_date_targetdate=new Date(last_date_targetdate);
          console.log('전속기한만료일 및 만료삼일전:',last_date,last_date_targetdate);
          var last_targetdate_year=last_date_targetdate.getFullYear();
          var last_targetdate_month=last_date_targetdate.getMonth()+1;
          var last_targetdate_date=last_date_targetdate.getDate();
          last_date_targetdate=String(last_targetdate_year)+(last_targetdate_month<10?'0'+last_targetdate_month:last_targetdate_month)+String(last_targetdate_date<10?'0'+last_targetdate_date:last_targetdate_date);//20210802이런형태로 처리.
          var last_date_year=last_date_date.getFullYear();
          var last_date_month=last_date_date.getMonth()+1;
          var last_date_dates=last_date_date.getDate();
          last_date_date=String(last_date_year)+(last_date_month<10?'0'+last_date_month:last_date_month)+String(last_date_dates<10?'0'+last_date_dates:last_date_dates);

          var noti_reserv_date_threeday=String(last_targetdate_year)+'-'+(last_targetdate_month<10?'0'+last_targetdate_month:last_targetdate_month)+'-'+last_targetdate_date;
          var noti_reserv_date_day=String(last_date_year)+'-'+(last_date_month<10?'0'+last_date_month:last_date_month)+'-'+last_date_dates;

          console.log('예약발송일(전속기한마감 삼일전, 당일):',last_date_targetdate,last_date_date, noti_reserv_date_threeday,noti_reserv_date_day);

          if(maemulinfo.prd_create_origin == '중개의뢰'){
            //삼일전 알림
            let notis_info={
              prd_identity_id : prd_identity_id,//알람 관련 txn_id아디(매물 거래개시된 매물 전속기한 풀린 거래개시매물에 대해서 전속기한마감당일,삼일전 관련 예약알림셋팅)
              request_mem_id : maemulinfo.request_mem_id,//중개의뢰인 경우엔 requestmemid존재한다,. 따라서 이를 보낸다. 
              request_company_id : maemulinfo.request_company_id,//외부수임물건이면 그 외부수임이라면 noti가 의미없음.외부수임인의 경우 코렉스회원이 아니기에.매물신청자에 소속선택값자체가null로없다.그 null소속하의 회원들도 없고,requestmemid도 없다. 이건 예약알림(노티)이기에. 중개의뢰온 것에 대한 것 거의 위주로개발진행.
              message: prd_identity_id+'::매물 전속기한 만료 3일전입니다.\n 기한연장없으면 전문중개사 선임은 자동취소됩니다.\n\n',
              company_id : maemulinfo.company_id,//선임중개사값
              maemul_info:maemulinfo_data_loca,
              reserv_date : noti_reserv_date_threeday,//삼일전에 전속기한만료 삼일전날짜에 예약알림가한다.보여지게끔.
              noti_type: 13, //기한만료 삼일전.(예약알림)
              action:'update'//전속기한을 연장
            }
            let notis_res= await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(notis_info));
            if(notis_res){
              if(notis_res.success){
                console.log('notissrses resultss:',notis_res);
              }else{
                alert(notis_res.message);
              }
            }
            //당일알림(전속기한만료)
            let notis_info2={
              prd_identity_id : prd_identity_id,
              request_mem_id : maemulinfo.request_mem_id,//중개의뢰인 경우
              request_company_id: maemulinfo.request_company_id,
              message: prd_identity_id+'::매물 전속기한 만료일입니다.\n 기한연장없으면 전문중개사 선임은 자동취소됩니다.\n\n',
              company_id: maemulinfo.company_id,//선임중개사값
              maemul_info:maemulinfo_data_loca,
              reserv_date : noti_reserv_date_day,
              noti_type:14, //기한만료 당일.
              action:'update'
            }
            let notis_res2= await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(notis_info2));
            if(notis_res2){
              if(notis_res2.success){
                console.log('notis_res2 resultsss:',notis_res2);
              }else{
                alert(notis_res2.message);
              }
            }

          }else{
            //외부수임였던 매물의 경우 관련 로직작성.
            if(maemulinfo.request_mem_phone && maemulinfo.request_man_name){
              let sms_info_reserve={
                receiver: maemulinfo.request_mem_phone,
                msg: prd_identity_id+'::매물 전속기한 만료 3일전입니다.\n 기한연장없으면 전문중개사 선임은 자동취소됩니다.\n\n'+maemulinfo_data_loca+'\n\n[[기한연장]]:: https://korexpro.com/RequestExtend/'+prd_identity_id,
                msg_type : 'LMS',
                title: '전속기한만료3일전 안내',
                type:'전속기한만료3일전안내',
                rdate:last_date_targetdate,
                rtime: '0800'//오전 여덟시.
              };
              console.log('예약문자알림을 가합니다.(외부수임의뢰자 전속매물 기한만료당일, 삼일전알림):',sms_info_reserve);
              let sms_ress=await serverController.connectFetchController('/api/aligoSms','POST',JSON.stringify(sms_info_reserve));
              console.log('aligosms reserve send res reulstss:',sms_ress);

              if(sms_ress){
                if(!sms_ress.success){
                  alert('발송오류 발생::',sms_ress.message);
                }
              }

              let sms_info_reserve2={
                receiver:maemulinfo.request_mem_phone,
                msg: prd_identity_id+'::매물 전속기한 만료일입니다.\n 기한연장없으면 전문중개사 선임은 자동취소됩니다.\n\n'+maemulinfo_data_loca+'\n\n[[기한연장]]:: https://korexpro.com/RequestExtend/'+prd_identity_id,
                msg_type:'LMS',
                title:'전속기한만료일 당일안내',
                type:'전속기한만료일안내',
                rdate:last_date_date,
                rtime:'0800'
              };
              console.log('예약문자알림가합니다.(외부수임의뢰자 전속매물 기한만료당일,삼일전알림):',sms_info_reserve2);
              let sms_ress2 = await serverController.connectFetchController('/api/aligoSms','POST',JSON.stringify(sms_info_reserve2));
              console.log('aligosms reserve send res reusltss:',sms_ress2);

              if(sms_ress2){
                if(!sms_ress2.success){
                  alert('발송오류 발생::',sms_ress2.message);
                }
              }
            }else{
              alert('외부수임인 정보가 없습니다! 예약문자알림을 보낼수없습니다.');
              return;
            }                     
          }
        }
        
      }
    }
    
  }
    return (
        <Container>
          <NewRequestTopInfos/>
          <WrapRequest>
            <WrapBrokerInfo>
              <Condition>상태 : <ConditionDetail>거래 개시</ConditionDetail></Condition>
              <BrokerInfoLess setMap={setMap} probrokersingleinfo={probrokerinfo}/>{/*컴포넌트입니다.*/}
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
                  <Select onChange={(e)=>{console.log('===전속기한기간변경::',e.target.value); setExculsive_periods(e.target.value);}}>
                    <Option>기간 선택</Option>
                    <Option value='3'selected={maemulinfo.exclusive_periods==3}>3 개월</Option>
                    <Option value='6'selected={maemulinfo.exclusive_periods==6}>6 개월</Option>
                    <Option value='9'selected={maemulinfo.exclusive_periods==9}>9 개월</Option>
                    <Option value='12'selected={maemulinfo.exclusive_periods==12}>12 개월</Option>
                    <Option value='15'selected={maemulinfo.exclusive_periods==15}>15 개월</Option>
                    <Option value='18'selected={maemulinfo.exclusive_periods==18}>18 개월</Option>
                    <Option value='24'selected={maemulinfo.exclusive_periods==24}>24 개월</Option>
                  </Select>
                </SelectBox>
                <TopDesc>
                  {maemulinfo.exclusive_start_date}~{maemulinfo.exclusive_end_date}
                </TopDesc>
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
                    <InputDisabled type="text" value={maemulinfo.prd_type} disabled/>
                  </InputBox>
                  <InputBox>
                    <Label>주소</Label>
                    <InputDisabled type="text" value={maemulinfo.addr_jibun+'('+maemulinfo.addr_road+')'} disabled/>
                  </InputBox>
                  <InputBox>
                    <Label>상세<Pilsu>호수는 공개되지 않습니다.</Pilsu></Label>
                    <InputDisabled type="text" value={maemulinfo.dong_name+'동'+maemulinfo.floorname+'층'} disabled/>
                  </InputBox>
                </WrapInputBox>
                <WrapItemInfo>
                  <LongLine/>
                  <InputBox>
                    <Label>건물명<Pilsu>*</Pilsu></Label>
                    <InputTxt type="text" placeholder="건물명을 입력하여주세요." value={maemulinfo.prd_name}  disabled/>
                  </InputBox>
                  <InputBox>
                    <Label>전용면적<Pilsu>*</Pilsu></Label>
                    <Widthbox>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" value={maemulinfo.exclusive_area} disabled/>
                        <Span>m²</Span>
                      </Inbox>
                      <Same>=</Same>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" value={maemulinfo.exclusive_pyeong} disabled/>
                        <Span>평</Span>
                      </Inbox>
                    </Widthbox>
                  </InputBox>
                  <InputBox>
                    <Label>공급면적<Pilsu>*</Pilsu></Label>
                    <Widthbox>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" value={maemulinfo.supply_area} disabled/>
                        <Span>m²</Span>
                      </Inbox>
                      <Same>=</Same>
                      <Inbox>
                        <InputShort type="text" placeholder="m² 선택 or 입력" value={maemulinfo.supply_pyeong} disabled/>
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
                  <SelectMb >
                    <Option>거래유형을 선택하여주세요.</Option>
                    <Option selected={maemulinfo.prd_sel_type=='매매'}>매매</Option>
                    <Option selected={maemulinfo.prd_sel_type=='전세'}>전세</Option>
                    <Option selected={maemulinfo.prd_sel_type=='월세'}>월세</Option>
                  </SelectMb>
                </SelectBox>
                <InputBox>
                  <Label>가격<Pilsu>*</Pilsu></Label>
                  <Example>(e.g 1억 5,000)</Example>
                  <Flex>
                    <InputMidi type="text" placeholder="가격 입력" value={maemulinfo.prd_sel_type=='월세'?maemulinfo.prd_month_price+'('+maemulinfo.prd_price+')':maemulinfo.prd_price} disabled/>
                    <Dan>만원</Dan>
                  </Flex>
                </InputBox>
              </Box>
              {
                  maemulinfo.prd_type=='상가'?
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
                      <Radio type="radio" name="is_rightsprice" value='0' checked={maemulinfo.is_rightprice==0 ? true : false}  id="is_rightsprice1"/>
                      <RadioLabel for="is_rightsprice1">
                        <RadioSpan/>
                        없음
                      </RadioLabel>
                    </Radiobox>
                    <Radiobox>
                      <Radio type="radio" name="is_rightsprice" value='1' checked={maemulinfo.is_rightprice==1? true : false} id="is_rightsprice2"/>
                      <RadioLabel for="is_rightsprice2">
                        <RadioSpan/>
                        있음
                      </RadioLabel>
                    </Radiobox>
                  </InputBox>
                  
                  </Flex>
                  :
                  null
                }

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
                    {/*<SwitchButton>
                      <Switch type="checkbox" id="switch"/>
                      <SwitchLabel for="switch" onClick={()=>{setViewInput(!viewInput)}}>
                        <SwitchSpan/>
                        <SwithTxtOff className="no">없음</SwithTxtOff>
                        <SwithTxtOn className="yes">있음</SwithTxtOn>
                      </SwitchLabel>
                    </SwitchButton>*/}
                    <Radiobox>
                      <Radio type="radio" name="ismanagement" value='0' checked={maemulinfo.is_managecost=='0' ? true : false}  id="ismanagement2"/>
                      <RadioLabel for="ismanagement2" >
                        <RadioSpan/>
                        없음
                      </RadioLabel>
                    </Radiobox>
                    <Radiobox>
                      <Radio type="radio" name="ismanagement" value='1' checked={maemulinfo.is_managecost=='1'? true : false}id="ismanagement1"/>
                      <RadioLabel for="ismanagement1">
                        <RadioSpan/>
                        있음
                      </RadioLabel>
                    </Radiobox>

                  {
                    maemulinfo.is_managecost ?
                    <Flex>
                      <InputMidi type="text" placeholder="가격 입력" value={maemulinfo.managecost} disabled/>
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
                        <Check type="checkbox" id="check1" value='전기' checked={maemulinfo.include_managecost.indexOf('전기')!=-1}defaultChecked/>
                        <CheckLabel for="check1">
                          <CheckSpan/>
                          전기
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="check2"value='수도' checked={maemulinfo.include_managecost.indexOf('수도')!=-1}/>
                        <CheckLabel for="check2">
                          <CheckSpan/>
                          수도
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="check3"value='가스'checked={maemulinfo.include_managecost.indexOf('가스')!=-1}/>
                        <CheckLabel for="check3">
                          <CheckSpan/>
                          가스
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="check4"value='인터넷'checked={maemulinfo.include_managecost.indexOf('인터넷')!=-1}/>
                        <CheckLabel for="check4">
                          <CheckSpan/>
                          인터넷
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="check5"value='티비'checked={maemulinfo.include_managecost.indexOf('티비')!=-1}/>
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
                        <Radio type="radio" name="possible" id="radi1" value='1'checked={maemulinfo.is_immediate_ibju}  disabled/>
                        <RadioLabel for="radi1">
                          <RadioSpan/>
                          즉시
                        </RadioLabel>
                      </Radiobox>
                      <Radiobox>
                        <Radio type="radio" name="possible" id="radi2" value='0' checked={maemulinfo.is_immediate_ibju} disabled/>
                        <RadioLabel for="radi2">
                          <RadioSpan/>
                          날짜 선택
                        </RadioLabel>
                      {
                        !maemulinfo.is_immediate_ibju ?
                        <InputDate type="date" value={maemulinfo.ibju_specifydate} readonly/>
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
      {/*!!!!확인 버튼 , 조건문 맞춰서 액티브 됐을때 색상 바뀌어야함..!!!! 연장신청하기 관련 모달창 띄우기.*/}
            <NextButton>
              <Link className="data_link" onClick={()=>{
                nextStep();//async요청형태 가해지며->>모달창 닫힘.
                confirmModal();
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