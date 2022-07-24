//react
import React ,{useState, useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";

//server process
import serverController from '../../../../server/serverController';
import serverController2 from '../../../../server/serverController2';

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
import Picture from '../../../../img/member/picture.png';

import { Mobile, PC } from "../../../../MediaQuery"

//component
import SearchApartOfficetel from "./SearchApartOfficetel";
import SearchStoreOffice from "./SearchStoreOffice";
import SearchApartOfficetelSelectInfo from "./SearchApartOfficetelSelectInfo";
import ModalCommon from '../../../common/modal/ModalCommon';

import {useSelector} from 'react-redux';
import tempBrokerRequest from '../../../../store/modules/tempBrokerRequest';

export default function Request({updateModal,serveruploadimgs_server,changeaddedimgs_server}) {
  const [activeIndex,setActiveIndex] = useState(-1);
  const [openMore, setOpenMore] = useState(false);
  const [park,setPark] = useState(false);
  const [modalOption,setModalOption] = useState({show : false,setShow:null,link:"",title:"",submit:{},cancle:{},confirm:{},confirmgreen:{},content:{}});

  const history = useHistory();

  const rotate=()=>{
    if(openMore == true) {
      return "rotate(180deg)"
    }else{
      return "rotate(0deg)"
    }
  }
  //오피스텔일때 옵션
  const officeteloption_array =[
  {oi_id : 0,label:"침대",default:true},
  {oi_id : 1,label:"붙박이장",default:false},
  {oi_id : 2,label:"옷장",default:false},
  {oi_id : 3,label:"신발장",default:false},
  {oi_id : 4,label:"싱크대",default:false},
  {oi_id : 5,label:"가스레인지",default:false},
  {oi_id : 6,label:"인덕션",default:false},
  {oi_id : 7,label:"냉장고",default:false},
  {oi_id : 8,label:"세탁기",default:false},
  {oi_id : 9,label:"샤워부스",default:false},
  {oi_id : 10,label:"비데",default:false},
  {oi_id : 11,label:"벽걸이에어컨",default:false},
  {oi_id : 12,label:"스탠드에어컨",default:false},
  {oi_id : 13,label:"천장에어컨",default:false}
]
const storeofficeoption_array=[
  {oi_id : 0,label:"벽걸이에어컨",default:false},
  {oi_id : 1,label:"스탠드에어컨",default:false},
  {oi_id : 2,label:"천장에어컨",default:false}
]
const OptionProtect =[
  {op_id : 0,label:"CCTV",default:true},
  {op_id : 1,label:"경비원",default:false},
  {op_id : 2,label:"사설경비",default:false},
  {op_id : 3,label:"현관보안",default:false},
  {op_id : 4,label:"방범창",default:false},
  {op_id : 5,label:"비디오폰",default:false},
  {op_id : 6,label:"인터폰",default:false},
  {op_id : 7,label:"카드키",default:false},
  {op_id : 8,label:"화재경보기",default:false},
  {op_id : 9,label:"무인택배함",default:false}
]

  const temp_brokerRequest=useSelector(data => data.tempBrokerRequest);
  const login_user=useSelector(data => data.login_user);//리덕스 로그인회원정보 데이터 접근(memid,companyid,유저이다이,폰,이메일,유저이름,usertype,registertype,memadmin,islogin,isexculsive전문중개사여부)
  const temp_selectComplexinfo = useSelector(data => data.temp_selectComplexinfo);

  //console.log('>>>>유지된 정보들 기본입력정보들(inserted임시 입력정보들):',temp_brokerRequest);
  //console.log('>>>>마이페이지 로그인 중개사회원 companyid(어떤중개사의회원):',login_user);

  //추가정보 입력페이지 입력정보들 state형태로 저장한다.
  const [roomcount,setRoomcount] = useState('');
  const [bathroomcount,setBathroomcount] = useState('');
  const [is_duplex_floor,setIsduplexfloor] = useState('');
  const [isparking,setIsparking] = useState('');
  const [parking_option,setParkingoptions] = useState('');
  const [iselevator,setIselevator] = useState('');
  const [is_pet,setIswithpet] = useState('');
  const [istoilet,setIsToilet] = useState('');
  const [isinteriror,setIsInteriror] = useState('');
  const [recommend_jobstore,setRecommendjobstore] = useState('');
  const [room_structure,set_Ofi_room_structure] = useState('');

  const [direction,setDirection] = useState('');
  const [entrance,setEntrance] = useState('');
  const [heatmethod,setHeatmethod] = useState('');
  const [heatfuel,setHeatfuel] = useState('');

  const [standardspace_option,setStandardspace_option] = useState(["발코니"]);//표준 공간옵션
  const [officetelspace_option,setOfficetelspace_option] = useState(["침대"]);//오피스텔 공간옵션
  const [officeteloption,setOfficeteloption] = useState([]);//오피스텔옵션
  const [storeofficeoption,setStoreofficeoption] = useState([]);//상가사무실옵션
  const [security_option,setSecurityoption] = useState(["CCTV"]);//보안옵셥

  const [is_contract_renewal,setIscontractrenewal] = useState(0);//계약갱신권청구
  const [loanprice,setLoanprice] = useState('');//융자금
  const [guaranteeprice,setGuaranteeprice] = useState('');//월세 기보증금
  const [prd_description,setMaemul_description] = useState('');//매물요약
  const [prd_description_detail,setMaemul_descriptiondetail] = useState('');//매물상세설명

  const room_structure_change = (e) => {
    set_Ofi_room_structure(e.target.value);
  }
  const change_roomcount = (e) => {
    setRoomcount(e.target.value);
  }
  const change_bathroomcount = (e) => {
    setBathroomcount(e.target.value);
  }
  const change_is_duplex_floor = (e) => {
    setIsduplexfloor(e.target.value);
  }
  const change_isparking = (e) => {
    setIsparking(e.target.value);
  }
  const change_parking_option = (e) => {
    setParkingoptions(e.target.value);
  }
  const change_iselevator = (e) => {
    setIselevator(e.target.value);
  }
  const change_is_pet = (e) => {
    setIswithpet(e.target.value);
  }
  const change_istoilet= (e) => {
    setIsToilet(e.target.value);
  }
  const change_direction = (e) => {
    setDirection(e.target.value);
  } 
  const change_entrance = (e) => {
    setEntrance(e.target.value);
  }
  const change_heatmethod = (e) => {
    setHeatmethod(e.target.value);
  }
  const change_recommend_jobstore = (e) => {
    setRecommendjobstore(e.target.value);
  }
  const change_isinterior=(e)=>{
    setIsInteriror(e.target.value);
  }
  const change_heatfuel = (e) => {
    setHeatfuel(e.target.value);
  }

  const changeCheckBox = (e, state, setState) => {
    let newArr = state;
    if(e.target.checked){
      newArr.push(e.target.value);
    }else{
      newArr = newArr.filter(item => item !== e.target.value);
    }
    setState([...newArr]);
  }
  const change_is_contract_renewal = (e) => {
    setIscontractrenewal(e.target.value);
  }
  const change_loanprice = (e) => {
    setLoanprice(e.target.value);
  }
  const change_guaranteeprice = (e) => {
    setGuaranteeprice(e.target.value);
  }
  const change_prd_description = (e) => {
    setMaemul_description(e.target.value);
  }
  const change_prd_description_detail = (e) => {
    setMaemul_descriptiondetail(e.target.value);
  }
  
  //모달 끄는 식
  const offModal = ()=>{
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  const failModal = () =>{
    //여기가 모달 키는 거에엽
    setModalOption({
      show:true,
      setShow:offModal,
      title:"물건 등록",
      content:{type:"text",text:`해당물건은 전속매물이 아닙니다.\n이미 다른 중개사에게 의뢰되었거나\n거래중인 물건은 시스템에 등록할 수 없습니다.\n상기 사유에 해당하지 않는 경우,\n고객센터로 문의해주세요.`,component:""},
      submit:{show:false , title:"확인" , event : ()=>{offModal();}},
      cancle:{show:false , title:"취소" , event : ()=>{offModal(); }},
      confirm:{show:false , title:"확인" , event : ()=>{offModal(); }},
      confirmgreen:{show:true , title:"확인" ,  event : ()=>{offModal(); }}
    });
  }
  
  //다음버튼 누릀때 서버로 지금껏 정보 모두 보낸다.(외부수임물건전달방식 전닭. 다른 처리로 외부수임처리이기에.)
  const nextStep = async () => {
    //지금껏까지의 모든 저장정보 mereeged하여 서버에 요청제출필요ㅕ하다.
    console.log('>>>유지된 정보들 기본입력정보들:',temp_brokerRequest);
    console.log('>>>추가입력정보들 state정보값들:',roomcount,bathroomcount,is_duplex_floor,isparking,parking_option,is_pet,istoilet,isinteriror,recommend_jobstore,room_structure,direction,entrance,heatmethod,heatfuel,standardspace_option,officetelspace_option,security_option,officeteloption,storeofficeoption,is_contract_renewal,loanprice,guaranteeprice,prd_description,prd_description_detail);
    console.log('roomcount:',roomcount);
    console.log('bathroomcount:',bathroomcount);
    console.log('is_duplex_floor:',is_duplex_floor);
    console.log('ispakring:',isparking);
    console.log('parking_optionmss:',parking_option);
    console.log('is_pet::',is_pet);
    console.log('istoilet:',istoilet);
    console.log('isinteriror:',isinteriror);
    console.log('recommend_jobstore:',recommend_jobstore);
    console.log('room_structure:',room_structure);
    console.log('direction:',direction);
    console.log('entrance:',entrance);
    console.log('heatmeathod',heatmethod);
    console.log('heatfuel:',heatfuel);
    console.log('stadnardspace_option:',standardspace_option);
    console.log('officetelspace_option:',officetelspace_option);
    console.log('securittyoption:',security_option);
    console.log('officeteloption:',officeteloption);
    console.log('storeofficeoption:',storeofficeoption);
    console.log('is_contract_renewal:',is_contract_renewal);
    console.log('loanprice;',loanprice);
    console.log('guranteeprice:',guaranteeprice);
    console.log('prd_description:',prd_description);
    console.log('maemul_desciptiondeatil:',prd_description_detail);
    console.log('isrightprice::',tempBrokerRequest.isrightprice);
    console.log('업로드한 사진들!::',serveruploadimgs_server);

    //istoilet,isinteriror,recojkmmend_jobstore,room_structure, standardspace_option,officetelspace_option,officeteloptioin,storeofficeoption
    if( ( (temp_brokerRequest.maemultype=='아파트' || temp_brokerRequest.maemultype=='오피스텔') && (!roomcount || !bathroomcount)) ){
      alert('방수/욕실수 입력해주세요!');
      return false;
    }
    if( (temp_brokerRequest.maemultype=='오피스텔' && (!room_structure || !is_duplex_floor))){
      alert('방구조 , 복층여부 입력해주세요!');
      return false;
    }
    if( (temp_brokerRequest.maemultype!='아파트' && (!isparking || !iselevator) )){
      alert('주차여부,엘레베이터여부 입력해주세요!');
      return false;
    }
    if( ((temp_brokerRequest.maemultype=='상가' || temp_brokerRequest.maemultype=='사무실') && (!istoilet)) ){
      alert('전용화장실 여부 입력해주세요!');
      return false;
    }
    if( (temp_brokerRequest.maeultype=='오피스텔' && !is_pet)){
      alert('반려동물 여부 입력해주세요!');
      return false;
    }
    if(!is_contract_renewal){
      alert('계약갱신권 행사여부 입력해주세요!');
      return false;
    }
    if(!temp_brokerRequest.x || !temp_brokerRequest.y){
      alert('건물의 데이터베이스(x,y)위치정보가 유효하지 않습니다.건물을 다시 선택해주세요.');
      return false;
    }
    if(serveruploadimgs_server.length<3){
      alert('사진은 최소 3장이상 등록해주세요!');
      return false;
    }

    //요청전에 단수체크 알고리즘 사젅 검사후에 통과시에 물건외부수임 등록 처리를 합니다. 
    //상가사무실 dangijubnaddress,dangoradoaddrss,floor특정주소에 존재하는 선태갛ㄴ 특정건물의 층 선택, 그 추가하려는 매물종류(floor,ho_idhosil)이 proudct,transction상에 가능한 상태값으로써 존재하고있는지 여부 검사
    if(temp_brokerRequest.maemultype =='상가' || temp_brokerRequest.maemultype == '사무실'){
      let request_possible_sendinfo={
        dangijibunaddress : temp_brokerRequest.dangijibunaddress,
        dangiroadaddress: temp_brokerRequest.dangiroadaddress,
        floor: temp_brokerRequest.floor,
        req_type : 'storeoffice'
      }
      let request_avail = await serverController.connectFetchController('/api/mypage/brokerRequest_avail_process','POST',JSON.stringify(request_possible_sendinfo));//외부수임하여 등록하려는 물건이 그냥 코렉스시스템상에 단수 적용가능한지 여부 검사한다.
      if(request_avail){
        console.log('해당 의뢰매물or외부수임 매물 코렉스 시스템상에서 등록가능한 단수매물인지 여부 검사(사무실,상가):',request_avail);

        if(request_avail.success){
          //등록이 가능하다.
        }else{
          console.log('등록불가');
          failModal();
          return;
        }
      }
    }else{
      let request_possible_sendinfo={
        dangijibunaddress:temp_brokerRequest.dangijibunaddress,
        dangiroadaddress:temp_brokerRequest.dangiroadaddress,
        hosil:temp_brokerRequest.hosil,
        req_type: 'apartofficetel'
      }
      let request_avail = await serverController.connectFetchController('/api/mypage/brokerRequest_avail_process','POST',JSON.stringify(request_possible_sendinfo));//외부수임하여 등록하려는 물건이 그냥 코렉스시스템상에 단수적용가능한지 여부 검사한다.
      if(request_avail){
        console.log('해당 의뢰매물or외부수임 매물 코렉스시스템상에서 등로각능한지 여부 단수매물인지 여부검사(아파트,오피):',request_avail);

        if(request_avail.success){

        }else{
          console.log('등록불가');
          failModal();
          return;
        }
      }
    }

    if(temp_brokerRequest.floorname.indexOf('지하')!=-1){
      var floorint = temp_brokerRequest.floorname.replace('지하','');
      console.log('floorint>>>>>:',floorint);
      floorint = 0 - parseInt(floorint);
    }else{
      var floorint = temp_brokerRequest.floorname.replace('지상','');
      console.log('floorint>>>>:',floorint);
      floorint = parseInt(floorint);
    }

    let body_info={
      dangi : (temp_brokerRequest.maemultype=='아파트' || temp_brokerRequest.maemultype=='오피스텔')?temp_selectComplexinfo.complexname:'',//아파트,오피스텔 단지명.
      dangijibunaddress: temp_brokerRequest.dangijibunaddress,//단지주소지번
      dangiroadaddress : temp_brokerRequest.dangiroadaddress,//단지주소로드
      companyid: login_user.company_id,//어떤 로그인 중개사회원 중개사아이디인지.
      exculsivedimension: temp_brokerRequest.jeonyongdimension,//전용면적
      exculsivepyeong: temp_brokerRequest.jeonyongpyeong,//전용평
      is_immediate_ibju: temp_brokerRequest.is_immediate_ibju,
      ibju_specifydate : temp_brokerRequest.ibju_specifydate,
      maemulname: temp_brokerRequest.maemulname,
      maemultype: temp_brokerRequest.maemultype,
      managecost : temp_brokerRequest.managecost,
      ismanagementcost : temp_brokerRequest.ismanagementcost,//관리비유무
      requestmanname: temp_brokerRequest.name,//여기선 외부수임요청자 정보(이름,휴대폰)
      requestmemphone: temp_brokerRequest.phone,
      sellprice: temp_brokerRequest.sellprice,//매매가,전세가,월세가 (보증금,거래액)
      monthsellprice:temp_brokerRequest.monthsellprice,//월세액
      selltype : temp_brokerRequest.selltype, //판매타입
      supplydimension : temp_brokerRequest.supplydimension,//공급면적
      supplypyeong: temp_brokerRequest.supplypyeong,//공급면적평
      x:temp_brokerRequest.x,//좌표값.매물의 위치경도위도좌표값.
      y:temp_brokerRequest.y,
      current_biz_job: temp_brokerRequest.current_biz_job,//상가업종
      is_current_biz_job: temp_brokerRequest.is_current_biz_job,//상가 업종여부.
      usetype : temp_brokerRequest.officetelusetype,//오피스텔 이용형태
      isrightprice :temp_brokerRequest.isrightprice,//상가 권리금유무

      dong: (temp_brokerRequest.maemultype=='아파트' || temp_brokerRequest.maemultype=='오피스텔')?temp_brokerRequest.dong:'',//아파트나 오피인경우에만 
      hosil : (temp_brokerRequest.maemultype=='아파트' || temp_brokerRequest.maemultype=='오피스텔')?temp_brokerRequest.hosil:'',
      floor : temp_brokerRequest.floor,//층id값
      dong_name: temp_brokerRequest.dong_name,//동이름 n동
      ho_name: temp_brokerRequest.ho_name,//호실이름 n호
      floorname: temp_brokerRequest.floorname,//층이름 n층
      floorint : floorint,//층수 int형태값.
      //dangi: temp_brokerRequest.dangi,
      exclusive_periods: temp_brokerRequest.exclusive_periods,//전속기간
      include_managecost: temp_brokerRequest.include_managecost.join(','),//관리비포함항목들.
      storeofficebuildingfloor : temp_brokerRequest.storeofficebuildingfloor,

      roomcount_val :roomcount?roomcount:'',//아파트,오피스텔
      bathroomcount_val : bathroomcount?bathroomcount:'',//아파트오피
      is_duplex_floor_val : is_duplex_floor?is_duplex_floor:'',//복층여부 오피
      isparking_val : isparking?isparking:'',//주차여부
      parking_option_val : parking_option?parking_option:'',
      iselevator_val : iselevator?iselevator:'',//엘베여부
      is_pet_val : is_pet?is_pet:'',//펫여부
      direction_val : direction?direction:'',//방향
      istoilet_val : istoilet?istoilet:'',//전용화장실여부
      isinteriror_val : isinteriror?isinteriror:'',//인테리어여부
      recommend_jobstore_val : recommend_jobstore?recommend_jobstore:'',//추천업종
      room_structure_val : room_structure?room_structure:'',//오피스텔 방구조

      entrance_val : entrance?entrance:'',//현관구조
      heatmethod_val : heatmethod?heatmethod:'',
      heatfuel_val : heatfuel?heatfuel:'',

      standardspace_option_val : standardspace_option?standardspace_option.join(','):'',//표준공간옵션
      officetelspace_option_val : officetelspace_option?officetelspace_option.join(','):'',//오피스텔공간옵션

      security_option_val : security_option?security_option.join(','):'',//보안옵션

      officeteloption_val : officeteloption?officeteloption.join(','):'',//오피스텔옵션
      storeofficeoption_val : storeofficeoption?storeofficeoption.join(','):'',//상가사무실옵션

      is_contract_renewal_val : is_contract_renewal,//계약갱신청구권행사여부
      loanprice_val : loanprice,//융자금
      guaranteeprice_val : guaranteeprice,//기보증금월세액
      prd_description_val : prd_description,
      prd_description_detail_val : prd_description_detail,

      prdstatus_generator: login_user.memid, //외부수임물건 등록 거래준비 상태변경 요인자는 외부수임인아라긴 보단 수임받아 등록하는 중개사회원memid일것임.
      prdstatus_change_reason: ''
    }

    console.log('>>>JSON SUBMIT DATA:',body_info,JSON.stringify(body_info));

    let res = await serverController.connectFetchController('/api/broker/user_brokerOuterRequest','POST',JSON.stringify(body_info));
    console.log('->>>>>res resultsss:',res);
    
    if(res.success){
      alert('외부수임 매물 등록 완료!');

      //매물이 등록된 후에 얻은 그 inserted된 prd_idenittiyid or prd_id매물에 대해서 update쿼리로써 별도로 매물 외부수임등록 사진등록 쿼리진행.사진을 등록하지 않은 경우라면 이 관련된 코드는 실행되지않음.
      console.log('업로드한 사진들!::',serveruploadimgs_server);

      let formData=new FormData();
      formData.append('folder','productImgs');
      formData.append('prd_identity_id',res.insert_result);

      for(let f=0; f<serveruploadimgs_server.length; f++){
        let file_item= serveruploadimgs_server[f];
        formData.append('productimgs',file_item);

      }
      let res2=await serverController2.connectFetchController('/api/broker/brokerProduct_prdimgs_process','POST',formData);
      if(res2){
        if(res2.success){
          console.log('resa22 resultssss:',res2);

          let update_result=res2.update_result;

          let prd_imgs=update_result['prd_imgs'];

        }
      }
      history.push('/MyPage');
    }else{
      alert('처리에 문제가 있습니다.');
    }
  };

    return (
        <Container>
          <WrapRequest>
            <TopTitle>추가정보 입력/수정</TopTitle>
            <WrapBox>
              <Box>
                <SubTitle>
                  <Title>물건정보</Title>
                  <Line/>
                </SubTitle>
                {
                  temp_brokerRequest.maemultype=='아파트' || temp_brokerRequest.maemultype=='오피스텔'?
                  <InputBox>
                    <Label>방수/욕실수<Pilsu>*</Pilsu></Label>
                    <Widthbox>
                      <InboxRoom>
                        <InputRoom type="text" placeholder="방수 입력" value={roomcount} onChange={change_roomcount}/>
                      </InboxRoom>
                      <SpanRoom>개</SpanRoom>
                      <InboxRoom>
                        <InputRoom type="text" placeholder="욕실수 입력" value={bathroomcount} onChange={change_bathroomcount}/>
                      </InboxRoom>
                      <SpanRoom>개</SpanRoom>
                    </Widthbox>
                  </InputBox>
                  :
                  null
                }
                {
                  temp_brokerRequest.maemultype=='오피스텔'?
                  <SelectBox>
                    <Label>방구조<Pilsu>*</Pilsu></Label>
                    <SelectMb onChange={room_structure_change}>
                      <Option value='방구조선택'>방구조 선택</Option>
                      <Option value='오픈형원룸'>오픈형원룸</Option>
                      <Option value='분리형원룸'>분리형원룸</Option>
                      <Option value='거실보유형'>거실보유형</Option>
                    </SelectMb>
                  </SelectBox>
                  :
                  null
                }
            {/*오피스텔일때 복층여부~반려동물 추가*/}
               {
                 temp_brokerRequest.maemultype=='오피스텔'?
                 <MoreBox>
                  <Label>복층여부<Pilsu>*</Pilsu></Label>
                  <WrapCheck>
                    <Radiobox>
                      <Radio type="radio" name="is_duplex_floor" id="floor1" defaultChecked value='0' onChange={change_is_duplex_floor}/>
                      <RadioLabel for="floor1">
                        <RadioSpan/>
                        단층
                      </RadioLabel>
                    </Radiobox>
                    <Radiobox>
                      <Radio type="radio" name="is_duplex_floor" id="floor2" value='1' onChange={change_is_duplex_floor}/>
                      <RadioLabel for="floor2">
                        <RadioSpan/>
                        복층
                      </RadioLabel>
                    </Radiobox>
                  </WrapCheck>
                </MoreBox>
                :
                null
               }
                {
                  temp_brokerRequest.maemultype!='아파트'?
                  <>
                    <MoreBox>
                    <Label>주차<Pilsu>*</Pilsu></Label>
                    <WrapCheck>
                      <Radiobox>
                        <Radio type="radio" name="parking" id="park1" defaultChecked value='0' onChange={change_isparking}/>
                        <RadioLabel for="park1" onClick={()=>{setPark(false)}}>
                          <RadioSpan/>
                          불가
                        </RadioLabel>
                      </Radiobox>
                      <Radiobox>
                        <Radio type="radio" name="parking" id="park2" value='1' onChange={change_isparking}/>
                        <RadioLabel for="park2" onClick={()=>{setPark(true)}}>
                          <RadioSpan/>
                          가능
                        </RadioLabel>
                      </Radiobox>
                      {
                        park ?
                        <InputPark type="text" placeholder="(e.g 1대 가능)" value={parking_option} onChange={e => setParkingoptions(e.target.value)}/>
                        :
                        null
                      }
                    </WrapCheck>
                  </MoreBox>
                  <MoreBox>
                  <Label>엘리베이터<Pilsu>*</Pilsu></Label>
                  <WrapCheck>
                    <Radiobox>
                      <Radio type="radio" name="elevate" id="elevate1" defaultChecked value='0' onChange={change_iselevator}/>
                      <RadioLabel for="elevate1">
                        <RadioSpan/>
                        없음
                      </RadioLabel>
                    </Radiobox>
                    <Radiobox>
                      <Radio type="radio" name="elevate" id="elevate2" value='1' onChange={change_iselevator}/>
                      <RadioLabel for="elevate2">
                        <RadioSpan/>
                        있음
                      </RadioLabel>
                    </Radiobox>
                  </WrapCheck>
                </MoreBox>
                </>
                  :
                  null
                }
                
                {
                  temp_brokerRequest.maemultype=='오피스텔'?
                    <MoreBox>
                    <Label>반려동물<Pilsu>*</Pilsu></Label>
                    <WrapCheck>
                      <Radiobox>
                        <Radio type="radio" name="pet" id="pet1" defaultChecked value='0' onChange={change_is_pet}/>
                        <RadioLabel for="pet1">
                          <RadioSpan/>
                          불가
                        </RadioLabel>
                      </Radiobox>
                      <Radiobox>
                        <Radio type="radio" name="pet" id="pet2" value='1' onChange={change_is_pet}/>
                        <RadioLabel for="pet2">
                          <RadioSpan/>
                          가능
                        </RadioLabel>
                      </Radiobox>
                    </WrapCheck>
                  </MoreBox>
                  :
                  null
                }
                {
                  temp_brokerRequest.maemultype=='상가' || temp_brokerRequest.maemultype=='사무실'?
                  <MoreBox>
                    <Label>화장실<Pilsu>*</Pilsu></Label>
                    <WrapCheck>
                      <Radiobox>
                        <Radio type="radio" name="is_toilet" id="is_toilet1" defaultChecked value='0' onChange={change_istoilet}/>
                        <RadioLabel for="is_toilet1">
                          <RadioSpan/>
                          공용
                        </RadioLabel>
                      </Radiobox>
                      <Radiobox>
                        <Radio type="radio" name="is_toilet" id="is_toilet2" value='1' onChange={change_istoilet}/>
                        <RadioLabel for="is_toilet2">
                          <RadioSpan/>
                          전용
                        </RadioLabel>
                      </Radiobox>
                    </WrapCheck>
                  </MoreBox>
                  :
                  null
                }
                
                <InputBox>
                  <Label>사진<Pilsu>*</Pilsu></Label>
                  <Widthbox>
                    <InputFileLabel for="picture" onClick={()=>{updateModal()}}>사진 추가</InputFileLabel>
                  </Widthbox>
                    <UploadedMaemulimgs>
                    {
                      changeaddedimgs_server.map((value,index)=>{
                        return(
                          <UploadImg src={value}/>
                        )
                      })
                    }
                    </UploadedMaemulimgs>
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
                  <SelectBox>
                    <Label>방향</Label>
                    <SelectMb onChange={change_direction}>
                      <Option>방향을 선택하여주세요.</Option>
                      <Option value='남향'>남향</Option>
                      <Option value='남동향'>남동향</Option>
                      <Option value='동향'>동향</Option>
                      <Option value='서향'>서향</Option>
                      <Option value='남서향'>남서향</Option>
                      <Option value='남향'>남향</Option>
                      <Option value='북동향'>북동향</Option>
                      <Option value='북향'>북향</Option>
                      <Option value='북서향'>북서향</Option>
                    </SelectMb>
                  </SelectBox>
                  {/*현관구조*/}
                  {
                    temp_brokerRequest.maemultype=='아파트' || temp_brokerRequest.maemultype=='오피스텔'?
                    <SelectBox>
                      <Label>현관구조</Label>
                      <SelectMb onChange={change_entrance}>
                        <Option>현관구조를 선택하여주세요.</Option>
                        <Option value='복도식'>복도식</Option>
                        <Option value='계단식'>계단식</Option>
                      </SelectMb>
                    </SelectBox>
                    :
                    null
                  }
                  
                  <SelectBox>
                    <Labelblock>난방</Labelblock>
                    <SelectMbShort onChange={change_heatmethod}>
                      <Option>방식 선택</Option>
                      <Option value='개별난방'>개별난방</Option>
                      <Option value='중앙난방'>중앙난방</Option>
                    </SelectMbShort>
                    <SelectMbShort onChange={change_heatfuel}>
                      <Option>연료 선택</Option>
                      <Option value='도시가스'>도시가스</Option>
                      <Option value='LPG'>LPG</Option>
                    </SelectMbShort>
                  </SelectBox>

                  {
                    temp_brokerRequest.maemultype=='상가'?
                    <>
                      <MoreBox>
                        <Label>인테리어</Label>
                        <WrapCheck>
                          <Radiobox>
                            <Radio type="radio" name="is_interior" id="is_interior1" defaultChecked value='0' onChange={change_isinterior}/>
                            <RadioLabel for="is_interior1">
                              <RadioSpan/>
                              없음
                            </RadioLabel>
                          </Radiobox>
                          <Radiobox>
                            <Radio type="radio" name="is_interior" id="is_interior2" value='1' onChange={change_isinterior}/>
                            <RadioLabel for="is_interior2">
                              <RadioSpan/>
                              있음
                            </RadioLabel>
                          </Radiobox>
                        </WrapCheck>
                      </MoreBox>
                      <MoreBox>
                        <InputBox>
                          <Label>추천업종</Label>
                          <Flex>
                            <InputMidi type="text" placeholder="추천업종" value={recommend_jobstore} onChange={change_recommend_jobstore}/>
                          </Flex>
                        </InputBox>
                     </MoreBox>
                    </>
                    :
                    null
                  }
                  
                {/*오피스텔제외공간. 표준공간옵션*/}
                {
                  temp_brokerRequest.maemultype!='오피스텔' ?
                  <MoreBox style={{display:"block"}}>
                    <Label>옵션(공간)</Label>
                    <WrapCheck>
                      <Checkbox>
                        <Check type="checkbox" id="standard_space_option1" value='발코니' className='standard_space_option' onChange={e => changeCheckBox(e, standardspace_option, setStandardspace_option)} defaultChecked/>
                        <CheckLabel for="standard_space_option1">
                          <CheckSpan/>
                          발코니
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="standard_space_option2" value='베란다' className='standard_space_option' onChange={e => changeCheckBox(e, standardspace_option, setStandardspace_option)}/>
                        <CheckLabel for="standard_space_option2">
                          <CheckSpan/>
                          베란다
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="standard_space_option3" value='테라스' className='standard_space_option' onChange={e => changeCheckBox(e, standardspace_option, setStandardspace_option)}/>
                        <CheckLabel for="standard_space_option3">
                          <CheckSpan/>
                          테라스
                        </CheckLabel>
                      </Checkbox>
                    </WrapCheck>
                  </MoreBox>
                  :
                  null
                }
                {/*오피스텔공간옵션*/}
                 {
                  temp_brokerRequest.maemultype=='오피스텔' ?
                  <MoreBox style={{display:"block"}}>
                    <Label>옵션(공간)</Label>
                    <WrapCheck>
                      <Checkbox>
                        <Check type="checkbox" id="officetel_space_option1" value='베란다' className='officetel_space_option' onChange={e => changeCheckBox(e, officetelspace_option, setOfficetelspace_option)}/>
                        <CheckLabel for="officetel_space_option1">
                          <CheckSpan/>
                          베란다
                        </CheckLabel>
                      </Checkbox>
                      <Checkbox>
                        <Check type="checkbox" id="officetel_space_option2" value='테라스' className='officetel_space_option' onChange={e => changeCheckBox(e, officetelspace_option, setOfficetelspace_option)}/>
                        <CheckLabel for="officetel_space_option2">
                          <CheckSpan/>
                          테라스
                        </CheckLabel>
                      </Checkbox>
                    </WrapCheck>
                  </MoreBox>
                  :
                  null
                }     

              {/*오피스텔 옵션*/}
              {
                temp_brokerRequest.maemultype=='오피스텔'?
                <MoreBox>
                  <TopOptionTxt>옵션</TopOptionTxt>
                  <Label>내부</Label>
                  <WrapCheck>
                  {
                    officeteloption_array.map((value) => {
                      return(
                        <Checkbox>
                          <Check type="checkbox" id={"officteloption"+value.oi_id} className='officteloption' onChange={e => changeCheckBox(e, officeteloption, setOfficeteloption)} value={value.label} defaultChecked={value.default ? true:false}/>
                          <CheckLabel for={"officteloption"+value.oi_id}>
                            <CheckSpan/>
                            {value.label}
                          </CheckLabel>
                        </Checkbox>
                      )}
                    )}
                  </WrapCheck>
                </MoreBox>
                :
                null
              }
              {/*상가사무실옵션*/}
              {
                temp_brokerRequest.maemultype=='상가' || temp_brokerRequest.maemultype=='사무실'?
                <MoreBox>
                  <TopOptionTxt>옵션</TopOptionTxt>
                  <Label>내부</Label>
                  <WrapCheck>
                  {
                    storeofficeoption_array.map((value) => {
                      return(
                        <Checkbox>
                          <Check type="checkbox" id={"storeofficeoption"+value.oi_id} className='storeofficeoption' onChange={e => changeCheckBox(e, storeofficeoption, setStoreofficeoption)} value={value.label} defaultChecked={value.default ? true:false}/>
                          <CheckLabel for={"storeofficeoption"+value.oi_id}>
                            <CheckSpan/>
                            {value.label}
                          </CheckLabel>
                        </Checkbox>
                      )}
                    )}
                  </WrapCheck>
                </MoreBox>
                :
                null
              }
               {
                 temp_brokerRequest.maemultype!='아파트'?
                  <MoreBox>
                  <Label>보안</Label>
                  <WrapCheck>
                  {
                    OptionProtect.map((value) => {
                      return(
                        <Checkbox>
                          <Check type="checkbox" id={"security_option"+value.op_id} className='security_options' onChange={e => changeCheckBox(e, security_option, setSecurityoption)} value={value.label} defaultChecked={value.default ? true:false}/>
                          <CheckLabel for={"security_option"+value.op_id}>
                            <CheckSpan/>
                            {value.label}
                          </CheckLabel>
                        </Checkbox>
                      )}
                    )}
                  </WrapCheck>
                </MoreBox>
                :
                null
               }   
              
            </MoreView>
            :
            null

            }
              </WrapMoreView>
              <Box>
                <SubTitle>
                  <Title>거래정보</Title>
                  <Line/>
                </SubTitle>
                <MoreBox>
                  <Label>계약갱신권 행사여부<Pilsu>*</Pilsu></Label>
                  <WrapCheck>
                    <Radiobox>
                      <Radio type="radio" onChange={change_is_contract_renewal} value='0' name="is_contract_renewal" id="radi1" defaultChecked/>
                      <RadioLabel for="radi1">
                        <RadioSpan/>
                        미확인
                      </RadioLabel>
                    </Radiobox>
                    <Radiobox>
                      <Radio type="radio" onChange={change_is_contract_renewal} value='1' name="is_contract_renewal" id="radi2"/>
                      <RadioLabel for="radi2">
                        <RadioSpan/>
                        확인
                      </RadioLabel>
                    </Radiobox>
                  </WrapCheck>
                </MoreBox>
                <InputBox>
                  <Label>융자금</Label>
                  <Example>(e.g 1억 5,000)</Example>
                  <Flex>
                    <InputMidi type="text" placeholder="가격 입력" value={loanprice} onChange={change_loanprice}/>
                    <Dan>만원</Dan>
                  </Flex>
                </InputBox>
                <InputBox>
                  <Label>기보증금 / 월세</Label>
                  <Example>(e.g 1억 5,000)</Example>
                  <Flex>
                    <InputMidi type="text" placeholder="가격 입력" value={guaranteeprice} onChange={change_guaranteeprice}/>
                    <Dan>만원</Dan>
                  </Flex>
                </InputBox>
                <InputBox>
                  <Label>설명</Label>
                  <InputTxt type="text" placeholder="매물 요약 입력" value={prd_description} onChange={change_prd_description}/>
                  <Textarea type="textarea" placeholder="매물 설명 입력" value={prd_description_detail} onChange={change_prd_description_detail}/>
                </InputBox>
              </Box>
            </WrapBox>
      {/*!!!!다음 버튼 , 조건문 맞춰서 액티브 됐을때 색상 바뀌어야함..!!!! */}
            <NextButton>
              <Next onClick={nextStep} type="button">확인</Next>
            </NextButton>
           </WrapRequest>
           <ModalCommon modalOption={modalOption}/>
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
      width:calc(100vw*(370/428));
      padding:calc(100vw*(30/428)) 0 calc(100vw*(100/428));
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
    width:100%;
    }
`
const Box = styled.div`
  width:100%;
  margin-bottom:55px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(50/428));
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
const SelectBox = styled.div`
  width:100%;
  display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;
`
const Label = styled.label`
  display:inline-block;
  font-size:12px;font-weight:600;
  transform:skew(-0.1deg);color:#4a4a4a;
  margin-bottom:10px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(10/428));
    }
`
const Labelblock = styled(Label)`
  display:block;width:100%;
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
    font-size:calc(100vW*(15/428));
    background-size:calc(100vw*(11/428));
    }
`
const SelectMb = styled(Select)`
  margin-bottom:30px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(30/428));
    }
`
const SelectMbShort = styled(Select)`
  width:190px;margin-bottom:30px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(170/428));
    margin-botom:calc(100vw*(30/428));
    }
`
const Option = styled.option`
 transform:skew(-0.1deg);
 font-family:'nbg',sans-serif;
`
const WrapInputBox = styled.div`
  width:100%;
`
const InputBox = styled.div`
  position:relative;
  margin-bottom:25px;
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(15/428));
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
const Textarea = styled.textarea`
  width:100%;height:220px;
  resize:none;border:1px solid #e4e4e4;
  border-radius:4px;padding:15px;
  font-size:15px; transform:skeW(-0.1deg);
  color:#4a4a4a;margin-top:10px;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(220/428));
    font-size:calc(100vw*(15/428));
    margin-top:calc(100vw*(10/428));
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
    width:calc(100vw*(167/428));
    height:calc(100vw*(43/428));
    }
`
const InboxRoom = styled(Inbox)`
  width:150px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(150/428));
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
const Part = styled.div`
  display:inline-block;
  margin:0 9px;
  @media ${(props) => props.theme.mobile} {
    margin:calc(100vw*(9/428));
    }
`
const InputRoom = styled(InputShort)`
  width:100%
`
const InputFileLabel = styled.label`
  width:100%;height:43px;border-radius:4px;
  border:1px solid #e4e4e4;cursor:pointer;
  text-align:center;vertical-align:middle;line-height:43px;
  font-size:15px;color:#707070;transform:skew(-0.1deg);
  background:url(${Picture}) no-repeat 95% center; background-size:21px;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(43/428));
    font-size:calc(100vw*(15/428));
    background-size:calc(100vw*(21/428));
    line-height:calc(100vw*(43/428));
    }
`

const Span = styled.span`
  vertical-align:middle;
  font-size:15px;font-weight:600;
  color:#4a4a4a;transform:skew(-0.1deg);
  margin-left:10px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-eleft:calc(100vw*(10/428));
    }
`
const SpanRoom =styled(Span)`
  color:#707070;
  margin-left:0;
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
  display:inline-block;
  font-size:12px;transform:skew(-0.1deg);
  color:#4a4a4a;margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-left:calc(100vw*(5/428));
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
    margin-top:calc(100vw*(-13/428));
    margin-right:calc(100vw*(20/428));
    width:calc(100vw*(19/428));
    }
`
const ShortLine = styled(Line)`
  width:250px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(220/428));
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
  padding-bottom:25px;
  @media ${(props) => props.theme.mobile} {
    padding-bottom:calc(100vw*(25/428));
    }
`
const MoreBox = styled.div`

`
const SwitchButton = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin-top:20px;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
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
    top:calc(100vw*(-3/428));
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
  display:flex;justify-content:felx-start;align-items:center;
  flex-wrap:wrap;margin-top:10px;
  margin-bottom:30px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(20/428));
    margin-bottom:calc(100vw*(30/428));
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
  font-size:15px;font-family:'nbg',sans-serif;
  transform:skew(-0.1deg);color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const CheckSpan = styled.span`
  display:inline-block;width:20px;height:20px;
  background:url(${CheckImg}) no-repeat; background-size:100% 100%;
  margin-right:8px;vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));margin-right:calc(100vw*(8/428));
  }
`
const Radiobox = styled.div`
  margin-right:30px;
  &:last-child{margin-right:0;}
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(30/428));
  }
`
const Radio = styled.input`
  display:none;
  &:checked+label span{background:url(${RadioChkImg}) no-repeat; background-size:100% 100%;}
`
const RadioLabel = styled.label`
  font-size:15px;font-family:'nbg',sans-serif;
  transform:skew(-0.1deg);color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const RadioSpan = styled.span`
  display:inline-block;width:20px;height:20px;
  background:url(${RadioImg}) no-repeat; background-size:100% 100%;
  margin-right:8px;vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));margin-right:calc(100vw*(8/428));
  }
`
const InputDate = styled(InputTxt)`
  margin-top:20px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(20/428));
  }
`
const InputPark = styled(InputTxt)`
  width:183px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(145/428));
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
const TopOptionTxt = styled.div`
  font-size:15px;color:#4a4a4a;transform:skew(-0.1deg);
  margin-bottom:30px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
  }
`
const UploadedMaemulimgs = styled.div`
    width:100%;height:auto;
    display:flex;flex-flow:row wrap;
`;
const UploadImg = styled.img`
    width:100px;height:100px;
`;

