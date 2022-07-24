//react
import React ,{useState, useEffect,useRef} from 'react';
import {Link} from "react-router-dom";

//server process
import serverController from '../../../../server/serverController';
import serverController2 from '../../../../server/serverController2';
//css
import styled from "styled-components"

//img
import Delete from '../../../../img/main/modal_close.png';

import ArrowTop from '../../../../img/map/arrow_top.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import Enter from '../../../../img/member/enter.png';
import CheckImg from '../../../../img/map/radio.png';
import CheckedImg from '../../../../img/map/radio_chk.png';
import RadioImg from '../../../../img/map/radi.png';
import RadioChkImg from '../../../../img/map/radi_chk.png';
import Picture from '../../../../img/member/picture.png';

import EditBtn from '../../../../img/member/edit_btn.png';
import SaveBtn from '../../../../img/member/save_btn.png';

import {useSelector } from 'react-redux';

export default function Request({setPicture,confirmModal,updateModal,serveruploadimgs_server,changeaddedimgs_server}) {
  const [activeIndex,setActiveIndex] = useState(-1);
  const [openMore, setOpenMore] = useState(false);
  const [park,setPark] = useState(false);
  const [modalOption,setModalOption] = useState({show : false,setShow:null,link:"",title:"",submit:{},cancle:{},confirm:{},confirmgreen:{},content:{}});

  const maemulimgs= useRef();

  const rotate=()=>{
    if(openMore == true) {
      return "rotate(180deg)"
    }else{
      return "rotate(0deg)"
    }
  }
  var globe_aws_url='https://korexdata.s3.ap-northeast-2.amazonaws.com/';

  const brokerRequest_product_data= useSelector(data => data.brokerRequest_product);
  console.log('=>>유지 된 정보들 기본입력정보들:',brokerRequest_product_data);

  //추가정보 입력페이지 입력정보들 state형태로 저장.
  const [roomcount,setRoomcount] = useState('');
  const [bathroomcount,setBathroomcount] = useState('');
  const [is_duplex_floor,setIsduplexfloor] = useState('');
  const [isparking,setIsparking] = useState('');
  const [parking_option,setParkingoptions] = useState('');
  const [iselevator,setIselevator] = useState('');
  const [is_pet,setIswithpet] = useState('');
  const [istoilet,setIsToilet] = useState(0);
  const [isinterior,setIsInterior] =useState(0);
  const [recommend_jobstore,setRecommendjobstore] = useState('');
  const [room_structure,set_Ofi_room_structure] = useState('');
 
  const [direction,setDirection] = useState('');
  const [entrance,setEntrance] = useState('');
  const [heatmethod,setHeatmethod] = useState('');
  const [heatfuel,setHeatfuel] = useState('');

  const [standardspace_option,setStandardspace_option] = useState('');
  const [officetelspace_option,setOfficetelspace_option] = useState('');
  const [officeteloption,setOfficeteloption] = useState('');
  const [storeofficeoption,setStoreofficeoption] = useState('');

  const [standardspace_optionarray,setStandardspace_optionarray]= useState([]);
  const [officetelspace_optionarray,setOfficetelspace_optionarray] = useState([]);
  const [officeteloptionarray,setOfficeteloptionarray] = useState([]);
  const [storeofficeoptionarray,setStoreofficeoptionarray]= useState([]);
  
  const [security_option,setSecurityoption] = useState('');
  const [security_optionarray,setSecurityoptionarray] = useState([]);

  const [space_option,setSpaceoption] = useState('');
  const [prd_option,setMaemuloption] =useState('');

  const [is_contract_renewal,setIscontractrenewal] = useState('');
  const [loanprice,setLoanprice] = useState('');
  const [guaranteeprice,setGuaranteeprice] = useState('');
  const [prd_description,setMaemul_description] = useState('');
  const [prd_description_detail,setMaemul_descriptiondetail] = useState('');

  //파일 이미지 처리 비동기/동기 관련 처리로직.state객체
  const [imageprocess_isedit,setImageprocess_isedit] = useState(false);//기본값 조회값. false -> true반복. true형태라고하면 수정모드상태. 
 // const [changeadded_filearrays,setChangeadded_filearrays] = useState([]);//변화된 파일이미지 데이터배열 저장형태 뭐가 업로드될 예정인지 미리보기용도.
  //const [serveruploadimgarrays, setServeruploadimgarrays] = useState([]);//서버에 업로드될 이미지파일객체(데이터스트림이아님) 배열형태로 지정 보내기 insert로 추가.
  const [pageload_productimgarrays,setpageload_productimgarrays] = useState([]);//페이지로드후 또는 수정한것 저장후에 갱신된 내역을 보여주는 state배열.
  //기존 업로드된 내역들 불러오는 영역에 이미지별로는 삭제하기 버튼제공하며, 삭제시 특정 그 url에 해당하는 (그 url별 유니트할것임.)대상체 삭제처리.버튼 누를시마다 fetch통신하는형태로.


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
  const change_direction = (e) => {
    setDirection(e.target.value);
  } 
  const change_entrance = (e) => {
    setEntrance(e.target.value);
  }
  const change_heatmethod = (e) => {
    setHeatmethod(e.target.value);
  }
  const change_istoilet = (e) =>{
    setIsToilet(e.target.value);
  }
  const change_recommend_jobstore =(e) => {
    setRecommendjobstore(e.target.value);
  }
  const change_isinterior= (e) => {
    setIsInterior(e.target.value);
  }
  const change_heatfuel = (e) => {
    setHeatfuel(e.target.value);
  }
  /*const change_apartspace_option = (e) => {
    var apart_space_options=document.getElementsByClassName('apartspace_options');
    
    var checked_apartspace_options=[];
    for(let i=0,c=0; i<apart_space_options.length; i++){
      if(apart_space_options[i].checked){
        console.log('채크된 항목:',apart_space_options[i]);
        checked_apartspace_options[c]= apart_space_options[i].value;
        c++;
      }
    }
    console.log('현재 체크된 변화상황 체크 아파트공간옵션요소:',checked_apartspace_options,checked_apartspace_options.join(','));
    setApartspace_option(checked_apartspace_options.join(','));
  }*/
  //공갑옵션 변경 관련 state배열지정.
  const changeCheckBox = (e,state,setState,setState2) => {
    let newArr=state;
    console.log('chanbgechekckboxxxsss:',newArr);

    if(e.target.checked){
      newArr.push(e.target.value);
    }else{
      newArr = newArr.filter(item => item!==e.target.value);
    }
    console.log('new Arrss:',newArr,setState);
    //setState2(newArr.join(','));
    setState([...newArr]);
  }
  /*const change_space_option = (e) => {
    var space_options=document.getElementsByClassName('space_options');
    
    var checked_space_options=[];
    for(let i=0,c=0; i<space_options.length; i++){
      console.log('공간옵션 상태체크여부:',space_options[i].checked);
      if(space_options[i].checked){
        console.log('체크된 항목:',space_options[i]);
        checked_space_options[c]= space_options[i].value;
        c++;
      }
    }
    console.log('현재 체크된 변화상황 체크 공간옵션요소:',checked_space_options,checked_space_options.join(','));

    setSpaceoption(checked_space_options.join(','));
  } */

  const change_security_option = (e) => {
    var security_options=document.getElementsByClassName('security_options');
    
    var checked_security_options=[];
    for(let i=0,c=0; i<security_options.length; i++){
      if(security_options[i].checked){
        checked_security_options[c]= security_options[i].value;
        c++;
      }
    }
    console.log('현재 체크된 변화상황 체크 보안옵션요소:',checked_security_options,checked_security_options.join(','));

    setSecurityoption(checked_security_options.join(','));
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

  //파일읽기 promise함수.
  const readuploadedfile = (inputfile) => {
    let filereader= new FileReader();
    
    return new Promise((resolve,reject) => {
      filereader.onload = ()=>{
        console.log('대상파일개체 다읽음',filereader.result);
        resolve(filereader.result);
      };
      filereader.onerror =()=>{
        console.log('대상파일개체읽음 오류:');
        filereader.abort();
        reject(new DOMException('problme parsing input filess..'));
      };
      filereader.readAsDataURL(inputfile);
    });    
  }

  /*const maemulimgsChange = async (e) => {
    console.log('file upload onchangess event starts=====>>');
    const {
      target : {files}
    } = e; //여러개로 가져온 파일들을 변화발생시마다 add하는형태로진행, add를하고 / add를 한 시점에 즉시 반영!! 반영상태에선 삭제도 가능.(현재 가지고있는 목록이 띄워질뿐임.)
    const theFiles= files;//여러개 업로드한 파일 대상체들
    console.log('files changeers the filess:',theFiles);

    setServeruploadimgarrays(theFiles);//업로드하기로 된 파일객체 object arrayss...>>>>

    var imgdata_array=[];

    for(let j=0; j<theFiles.length; j++){
      let item=theFiles[j];
      console.log('file itmess:',item);

      try{
        const filecontents= await readuploadedfile(item);
        console.log('filecontnetsss;',filecontents);

        imgdata_array.push(filecontents);//흠 동기로 처리 await되기에 실행흐름순서대로 처리가능하다.
      }catch(e){
        console.log('file read await errorss:',e.message);
      }
    }
    console.log('>>>>>>uploaded files contentss:',imgdata_array);
    setChangeadded_filearrays(imgdata_array);
  }*/



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

 useEffect( async() => {
     setRoomcount(brokerRequest_product_data.roomcount);
     setBathroomcount(brokerRequest_product_data.bathroomcount);
     setIsduplexfloor(brokerRequest_product_data.is_duplex_floor);
     setIsparking(brokerRequest_product_data.isparking);
     setParkingoptions(brokerRequest_product_data.parking_option);
     setIselevator(brokerRequest_product_data.iselevator);
     setIswithpet(brokerRequest_product_data.is_pet);
     setIsToilet(brokerRequest_product_data.istoilet);
     setIsInterior(brokerRequest_product_data.isinterior);
     setRecommendjobstore(brokerRequest_product_data.recommend_jobstore);
     set_Ofi_room_structure(brokerRequest_product_data.room_structure);

     setDirection(brokerRequest_product_data.direction);
     setEntrance(brokerRequest_product_data.entrance);
     setHeatmethod(brokerRequest_product_data.heatmethodtype);
     setHeatfuel(brokerRequest_product_data.heatfueltype);

     setStandardspace_option(brokerRequest_product_data.standardspace_option);
     setOfficetelspace_option(brokerRequest_product_data.officetelspace_option);
     setOfficeteloption(brokerRequest_product_data.officeteloption);
     setStoreofficeoption(brokerRequest_product_data.storeofficeoption);
     setSecurityoption(brokerRequest_product_data.security_option);

     setStandardspace_optionarray(brokerRequest_product_data.standardspace_option&&brokerRequest_product_data.standardspace_option.indexOf(',')!=-1?brokerRequest_product_data.standardspace_option.split(','):[]);
     setOfficetelspace_optionarray(brokerRequest_product_data.officetelspace_option&&brokerRequest_product_data.officetelspace_option.indexOf(',')!=-1?brokerRequest_product_data.officetelspace_option.split(','):[]);
     setOfficeteloptionarray(brokerRequest_product_data.officeteloption&&brokerRequest_product_data.officeteloption.indexOf(',')!=-1?brokerRequest_product_data.officeteloption.split(','):[]);
     setStoreofficeoptionarray(brokerRequest_product_data.storeofficeoption&&brokerRequest_product_data.storeofficeoption.indexOf(',')!=-1?brokerRequest_product_data.storeofficeoption.split(','):[]);
     //setSecurityoptionarray(brokerRequest_product_data.security_option&&brokerRequest_product_data.security_option.indexOf(',')!=-1?brokerRequest_product_data.security_option.split(','):[]);

     setIscontractrenewal(brokerRequest_product_data.is_contract_renewal);
     setLoanprice(parseInt(brokerRequest_product_data.loanprice));
     setGuaranteeprice(parseInt(brokerRequest_product_data.monthbaseguaranteeprice));
     setMaemul_description(brokerRequest_product_data.maemuldescription);
     setMaemul_descriptiondetail(brokerRequest_product_data.maemuldescriptiondetail);
     if(brokerRequest_product_data.prdimgs && brokerRequest_product_data.prdimgs!=''){
       setpageload_productimgarrays(brokerRequest_product_data.prdimgs.split(','));
     }
     
 },[]);

    return (
        <Container>
          <WrapRequest>
            <WrapBox>
              <Box>
                <SubTitle>
                  <Title>물건정보</Title>
                  <Line/>
                </SubTitle>
                {
                  brokerRequest_product_data.maemultype=='아파트' || brokerRequest_product_data.maemultype=='오피스텔'?
                  <InputBox>
                   <Label>방수/욕실수<Pilsu>*</Pilsu></Label>
                    <Widthbox>
                      <InboxRoom>
                        <InputRoom type="text" placeholder="방수 입력" value={roomcount}onChange={change_roomcount}/>
                      </InboxRoom>
                      <SpanRoom>개</SpanRoom>
                      <InboxRoom>
                        <InputRoom type="text" placeholder="욕실수 입력" value={bathroomcount}onChange={change_bathroomcount}/>
                      </InboxRoom>
                      <SpanRoom>개</SpanRoom>
                    </Widthbox>
                  </InputBox>
                  :
                  null
                }
                
                {
                  brokerRequest_product_data.maemultype=='오피스텔'?
                  <SelectBox>
                    <Label>방구조<Pilsu>*</Pilsu></Label>
                    <SelectMb onChange={room_structure_change}>
                      <Option value='방구조선택' >방구조 선택</Option>
                      <Option value='오픈형원룸'selected={room_structure=='오픈형원룸'?true:false}>오픈형원룸</Option>
                      <Option value='분리형원룸'selected={room_structure=='분리형원룸'?true:false}>분리형원룸</Option>
                      <Option value='거실보유형'selected={room_structure=='거실보유형'?true:false}>거실보유형</Option>
                    </SelectMb>
                  </SelectBox>
                  :
                  null
                }
               {/*오피스텔일때 복층여부~반려동물 추가*/}
               {
                 brokerRequest_product_data.maemultype=='오피스텔'?
                 <MoreBox>
                  <Label>복층여부<Pilsu>*</Pilsu></Label>
                  <WrapCheck>
                    <Radiobox>
                      <Radio type="radio" name="is_duplex_floor" checked={is_duplex_floor == 0 ? true : false} value={0} id="floor1" defaultChecked onChange={change_is_duplex_floor}/>
                      <RadioLabel for="floor1">
                        <RadioSpan/>
                        단층
                      </RadioLabel>
                    </Radiobox>
                    <Radiobox>
                      <Radio type="radio" name="is_duplex_floor" checked={is_duplex_floor == 1 ? true : false} value={1} id="floor2" onChange={change_is_duplex_floor}/>
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
                  brokerRequest_product_data.maemultype!='아파트'?
                  <>
                  <MoreBox>
                    <Label>주차<Pilsu>*</Pilsu></Label>
                    <WrapCheck>
                      <Radiobox>
                        <Radio type="radio" name="parking" checked= {isparking == 0 ? true : false}value='0'id="park1" defaultChecked onChange={change_isparking}/>
                        <RadioLabel for="park1" onClick={()=>{setPark(false)}}>
                          <RadioSpan/>
                          불가
                        </RadioLabel>
                      </Radiobox>
                      <Radiobox>
                        <Radio type="radio" name="parking" checked= {isparking == 1 ? true : false} value='1' id="park2" onChange={change_isparking}/>
                        <RadioLabel for="park2" onClick={()=>{setPark(true)}}>
                          <RadioSpan/>
                          가능
                        </RadioLabel>
                      </Radiobox>
                      {
                        isparking==1 || park ?
                        <InputPark type="text" placeholder="(e.g 1대 가능)" value={parking_option} onChange={change_parking_option}/>
                        :
                        null
                      }
                    </WrapCheck>
                  </MoreBox>
                  <MoreBox>
                    <Label>엘리베이터<Pilsu>*</Pilsu></Label>
                    <WrapCheck>
                      <Radiobox>
                        <Radio type="radio" name="elevate" checked={iselevator == 0 ? true : false} id="elevate1" value='0'defaultChecked onChange={change_iselevator}/>
                        <RadioLabel for="elevate1">
                          <RadioSpan/>
                          없음
                        </RadioLabel>
                      </Radiobox>
                      <Radiobox>
                        <Radio type="radio" name="elevate" checked={iselevator ==1 ? true : false} id="elevate2" value='1'onChange={change_iselevator}/>
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
                  brokerRequest_product_data.maemultype=='오피스텔'?
                  <MoreBox>
                    <Label>반려동물<Pilsu>*</Pilsu></Label>
                    <WrapCheck>
                      <Radiobox>
                        <Radio type="radio" name="pet" checked={is_pet == 0 ? true : false}id="pet1" value='0'defaultChecked onChange={change_is_pet}/>
                        <RadioLabel for="pet1">
                          <RadioSpan/>
                          불가
                        </RadioLabel>
                      </Radiobox>
                      <Radiobox>
                        <Radio type="radio" name="pet" checked={is_pet == 1 ? true : false}id="pet2" value='1'onChange={change_is_pet}/>
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
                brokerRequest_product_data.maemultype == '상가' || brokerRequest_product_data.maemultype == '사무실' ?
                 
                  <MoreBox>
                    <Label>화장실</Label>
                    <WrapCheck>
                      <Radiobox>
                        <Radio type='radio' name='is_toilet' checked={istoilet==0 ? true : false} id='is_toilet1' value='0' onChange={change_istoilet}/>
                        <RadioLabel for='is_toilet1'>
                          <RadioSpan/>불가
                        </RadioLabel>
                        <Radio type='radio' name='is_toilet' checked={istoilet==1 ? true: false} id='is_toilet2' value='1' onChange={change_istoilet}/>
                        <RadioLabel for='is_toilet2'>
                          <RadioSpan/>가능
                        </RadioLabel>
                        </Radiobox>
                     </WrapCheck>
                    </MoreBox>
                  :
                  null
              }
                <InputBox>
                  <Label>사진 편집/추가<Pilsu>*</Pilsu></Label>
                    <Widthbox>
                      <inputFileLabel for='picture' onClick={()=>{updateModal()}}>사진 추가</inputFileLabel>
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
                  {
                   /* imageprocess_isedit == false ?
                    <Imgicon src={EditBtn} onClick={()=> {
                      setImageprocess_isedit(true);
                      //이미지 편집 모드로 이어지며, ui가 추가될뿐이며 서버 통신은 없습니다.
                    }}/>
                    :
                    <Imgicon src={SaveBtn} onClick={async()=> {
                      setImageprocess_isedit(false);
                      //이미지 편집한것에대한 저장모드로(저장액션)이며 ui가 해제되며, 서버통신 발생합니다. 저장 폴더명/이미지file array개체들.
                      //console.log('serveruplaod imagss:',serveruploadimgarrays);

                      
                      //업로드한것 수정한 내역들에 대해서 수정한내역들로 upload및 디비처리하기전에 기존 prev 배열에있었던 이미지들을 처리후에 골라서 지운다. 기존의 배열에 있었던 경로의 내역들 다 처리후에 지운다.
                      let replace_front_url_dynamic='https://korexdata.s3.ap-northeast-2.amazonaws.com/';//이 url은 전역변수로써 처리할예정이고 나중에, 매번 동적으로 바뀔수있기에 변수로써 저장하며 이 앞 front url하의 관련 저장되어있을것이기에 그 하에 있는 기존 파일폴더경로들이 있다면 삭제처리한다.
                      let prev_info_request= {
                        prd_identity_id : brokerRequest_product_data.prdidentityid
                      }
                      let prev_res = await serverController.connectFetchController('/api/broker/brokerProduct_prev_prdimgs','POST',JSON.stringify(prev_info_request));
                      var prev_img_arrays;//기존 삭제할 대상들.
                      if(prev_res){
                        console.log('prev_res resultss:',prev_res);
                        if(prev_res.success){
                          prev_img_arrays = prev_res.result.prd_imgs;
                        }
                      }
                      console.log('=>>>prev img sarraysss:',prev_img_arrays);//기존에 있던 이미지가 없다면 업로드 된 이미지가 없다는것, 삭제할것도 없다.

                      if(prev_img_arrays && prev_img_arrays!='' && prev_img_arrays.indexOf(',')!=-1){
                        //url/folder명/파일명 으로 일단 기준으로 진행한다>>>
                        let delete_prev_folderimg_arrays=[];
                        let prd_img_arrays= prev_img_arrays.split(',');
                        for(let s=0; s<prd_img_arrays.length; s++){
                          let item_local=prd_img_arrays[s];//각 값들.
                          console.log('item_localsss:',item_local);
                          delete_prev_folderimg_arrays.push(item_local.replace(replace_front_url_dynamic,''));//폴더명 파일명만 남기게한다.
                        }
                        console.log('prev deltee target igmsss:',delete_prev_folderimg_arrays);

                        let sendinfo={
                          prd_identity_id : brokerRequest_product_data.prdidentityid,
                          folder : 'productImgs',
                          delete_images : delete_prev_folderimg_arrays.join(',')
                        }

                        let file_delete_process= await serverController.connectFetchController('/api/fileDelete/specify_foldertarget_deleteprocess','POST',JSON.stringify(sendinfo));
                        if(file_delete_process){
                          if(file_delete_process.success){
                            console.log('file detele process reulsss:',file_delete_process);
                          }else{
                            alert('기존 매물이미지 삭제에 문제가 있음.');
                          }
                        }
                      }
                      
                      //기존것 삭제후 update되면 등록된 이미지들 업로드 처리 및 디비처리.
                      let formData=new FormData();
                      formData.append('folder','productImgs');
                      formData.append('prd_identity_id',brokerRequest_product_data.prdidentityid);

                      for(let f=0; f<serveruploadimgarrays.length; f++){
                        let file_item=serveruploadimgarrays[f];
                        formData.append('productimgs',file_item);
                      }
                      //formData.append('productimgs',serveruploadimgarrays);//배열로 보낼수있나??
                      console.log('formData>>>:',formData);

                      let res = await serverController2.connectFetchController('/api/broker/brokerProduct_prdimgs_process','POST',formData);
                      if(res){
                        if(res.success){
                          console.log('res reusltss:',res);

                          let update_result=res.update_result;//업데이트 처리하고 난 후의 매물관련 정보리턴(origin정보)한개 리턴.

                          let prd_imgs=update_result['prd_imgs'];//매물 업로드 이미지들 url들 array형태 split형태 변환 리턴.
                          console.log('prd_imgss what??:',prd_imgs);
                          setpageload_productimgarrays(prd_imgs.split(','));//매물 리스트 배열로 리턴한 형태로 저장.
                        }
                      }
                    
                    }
                  }/>
                  */
                  }
                    {/*조회,수정모드 할것없이 모두 공통적 보이는 현재 매물의 적용되어있는 매물사진리스트 arraylist*/}
                    <Label>기존 업로드 사진</Label>
                    <Widthbox>
                      <NowMaemulimgs>
                        {
                          pageload_productimgarrays.map((value,index) => {
                            console.log('페이지로드시점 매물url:',globe_aws_url+value);
                            return(
                              <ImgWrap>
                                <UploadImg src={globe_aws_url+value}/>
                                <Delbtn src={Delete} onClick={ async()=> {
                                  
                                  //이미지 삭제 기능 fetch형태로 기존업로드 되어있던것에 한해서 삭제누를시마다 그 페이지에서 즉석으로 바로 업로드이미지리스트 삭제처리!!
                                 
                                    //폴더명/파일명만 이으면 해당 값을 키로하여 유니크하게 대상별 제거가능.
                                    //let delete_arrays=[];
                                   // delete_arrays.push(value);           
                                    let sendinfo={
                                      prd_identity_id : brokerRequest_product_data.prdidentityid,
                                      folder : 'productImgs',
                                      delete_images : value //단일요소
                                    }
            
                                    let file_delete_process= await serverController.connectFetchController('/api/fileDelete/specify_foldertarget_deleteprocess','POST',JSON.stringify(sendinfo));
                                    if(file_delete_process){
                                      if(file_delete_process.success){
                                        console.log('file detele process reulsss:',file_delete_process);

                                        let after_product_result=file_delete_process.result;
                                        if(after_product_result.prd_imgs && after_product_result.prd_imgs!=''){
                                          setpageload_productimgarrays(after_product_result.prd_imgs.split(','));
                                        }else{
                                          setpageload_productimgarrays([]);
                                        }
                                        
                                      }else{
                                        alert('기존 매물이미지 삭제에 문제가 있음.');
                                      }
                                    }
                                  
                                }}/>
                              </ImgWrap>
                            )
                          })
                        }
                      </NowMaemulimgs>
                    </Widthbox>                   
                    
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
                      <Option selected={direction == '남향' ? true : false} value='남향'>남향</Option>
                      <Option selected={direction == '남동향' ? true : false}value='남동향'>남동향</Option>
                      <Option selected={direction == '동향' ? true : false}value='동향'>동향</Option>
                      <Option selected={direction == '서향' ? true : false}value='서향'>서향</Option>
                      <Option selected={direction == '남서향' ? true : false}value='남서향'>남서향</Option>
                      <Option selected={direction == '남향' ? true : false}value='남향'>남향</Option>
                      <Option selected={direction == '북동향' ? true : false}value='북동향'>북동향</Option>
                      <Option selected={direction == '북향' ? true : false}value='북향'>북향</Option>
                      <Option selected={direction == '북서향' ? true : false}value='북서향'>북서향</Option>
                    </SelectMb>
                  </SelectBox>
                  {
                    brokerRequest_product_data.maemultype=='아파트' || brokerRequest_product_data.maemultype=='오피스텔'?
                    <SelectBox>
                      <Label>현관구조</Label>
                      <SelectMb onChange={change_entrance}>
                        <Option>현관구조를 선택하여주세요.</Option>
                        <Option selected={entrance == '복도식' ? true : false }value='복도식'>복도식</Option>
                        <Option selected={entrance == '계단식' ? true : false } value='계단식'>계단식</Option>
                      </SelectMb>
                    </SelectBox>
                    :
                    null  
                  }
                  
                  {/*현관구조*/}
                  <SelectBox>
                    <Labelblock>난방</Labelblock>
                    <SelectMbShort onChange={change_heatmethod}>
                      <Option>방식 선택</Option>
                      <Option selected={heatmethod == '개별난방' ? true : false }value='개별난방'>개별난방</Option>
                      <Option selected={heatmethod == '중앙난방' ? true : false }value='중앙난방'>중앙난방</Option>
                    </SelectMbShort>
                    <SelectMbShort onChange={change_heatfuel}>
                      <Option>연료 선택</Option>
                      <Option selected={heatfuel == '도시가스' ? true : false }value='도시가스'>도시가스</Option>
                      <Option selected={heatfuel == 'LPG' ? true : false }value='LPG'>LPG</Option>
                    </SelectMbShort>
                  </SelectBox>

                  {
                    brokerRequest_product_data.maemultype=='상가'?
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
                  {/*오피스텔제외공간, 표준공간옵션 */}
                  {
                    brokerRequest_product_data.maemultype!='오피스텔'?
                    <MoreBox style={{display:"block"}}>
                      <Label>옵션(공간)</Label>
                      <WrapCheck>
                        <Checkbox>
                          <Check type="checkbox" checked={standardspace_optionarray && standardspace_optionarray.indexOf('발코니')!=-1 ? true : false} value='발코니' className='standard_space_option'onChange={e => changeCheckBox(e,standardspace_optionarray,setStandardspace_optionarray)} id="standard_space_option1" defaultChecked/>
                          <CheckLabel for="standard_space_option1">
                            <CheckSpan/>
                            발코니 
                          </CheckLabel>
                        </Checkbox>
                        <Checkbox>
                          <Check type="checkbox" checked={standardspace_optionarray && standardspace_optionarray.indexOf('베란다')!=-1 ? true : false} value='베란다'className='standard_space_option' onChange={e => changeCheckBox(e,standardspace_optionarray,setStandardspace_optionarray)} id="standard_space_option2"/>
                          <CheckLabel for="standard_space_option2">
                            <CheckSpan/>
                            베란다
                          </CheckLabel>
                        </Checkbox>
                        <Checkbox>
                          <Check type="checkbox" checked={standardspace_optionarray && standardspace_optionarray.indexOf('테라스')!=-1 ? true : false }  value='테라스'className='standard_space_option' onChange={e => changeCheckBox(e,standardspace_optionarray,setStandardspace_optionarray)} id="standard_space_option3"/>
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
                  {/*오피스텔 공간 옵션*/}
                  {
                    brokerRequest_product_data.maemultype=='오피스텔'?
                    <MoreBox>
                      <Label>옵션(공간)</Label>
                      <WrapCheck>
                        <Checkbox>
                          <Check type="checkbox" checked={officetelspace_optionarray && officetelspace_optionarray.indexOf('베란다')!=-1 ? true : false }value='베란다' className='officetel_space_option'onChange={e=> changeCheckBox(e,officetelspace_optionarray,setOfficetelspace_optionarray)}id="officetel_space_option1"/>
                          <CheckLabel for="officetel_space_option1">
                            <CheckSpan/>
                            베란다
                          </CheckLabel>
                        </Checkbox>
                        <Checkbox>
                          <Check type="checkbox" checked={officetelspace_optionarray && officetelspace_optionarray.indexOf('테라스')!=-1 ? true : false }value='테라스' className='officetel_space_option'onChange={e=> changeCheckBox(e,officetelspace_optionarray,setOfficetelspace_optionarray)}id="officetel_space_option2"/>
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
                  
                  {/*오피스텔옵션*/}
                  {
                    brokerRequest_product_data.maemultype=='오피스텔'?
                    <MoreBox>
                      <TopOptionTxt>옵션</TopOptionTxt>
                      <Label>내부</Label>
                      <WrapCheck>
                      {
                        officeteloption_array.map((value) => {
                          return(
                            <Checkbox>
                              <Check type="checkbox" checked={officeteloptionarray && officeteloptionarray.indexOf(value.label)!=-1 ? true : false}onChange={e=> changeCheckBox(e,officeteloptionarray,setOfficeteloptionarray)} className='officeteloption'value={value.label} id={"officeteloption"+value.oi_id} defaultChecked={value.default ? true:false}/>
                              <CheckLabel for={"officeteloption"+value.oi_id}>
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
                    brokerRequest_product_data.maemultype=='상가' || brokerRequest_product_data.maemultype=='사무실'?
                    <MoreBox>
                      <TopOptionTxt>옵션</TopOptionTxt>
                      <Label>내부</Label>
                      <WrapCheck>
                      {
                        storeofficeoption_array.map((value) => {
                          return(
                            <Checkbox>
                              <Check type="checkbox" checked={storeofficeoptionarray && storeofficeoptionarray.indexOf(value.label)!=-1? true:false} id={"storeofficeoption"+value.oi_id} className='storeofficeoption' onChange={e => changeCheckBox(e, storeofficeoptionarray, setStoreofficeoptionarray)} value={value.label} defaultChecked={value.default ? true:false}/>
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
                    brokerRequest_product_data.maemultype!='아파트'?
                    <MoreBox>
                      <Label>보안</Label>
                      <WrapCheck>
                      {
                        OptionProtect.map((value) => {
                          return(
                            <Checkbox>
                              <Check type="checkbox" checked={security_option && security_option.indexOf(value.label)!=-1 ? true : false} onChange={change_security_option} className='security_options' value={value.label} id={"security_option"+value.op_id} defaultChecked={value.default ? true:false}/>
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
                      <Radio type="radio" onChange={change_is_contract_renewal} checked={  is_contract_renewal == '0'? true : false}value='0'name="is_contract_renewal" id="radi1" defaultChecked/>
                      <RadioLabel for="radi1">
                        <RadioSpan/>
                        미확인
                      </RadioLabel>
                    </Radiobox>
                    <Radiobox>
                      <Radio type="radio" onChange={change_is_contract_renewal} checked={ is_contract_renewal == '1' ? true: false} value='1' name="is_contract_renewal" id="radi2"/>
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
                    <InputMidi type="text" value={loanprice} onChange={change_loanprice} placeholder="가격 입력"/>
                    <Dan>만원</Dan>
                  </Flex>
                </InputBox>
                <InputBox>
                  <Label>기보증금 / 월세</Label>
                  <Example>(e.g 1억 5,000)</Example>
                  <Flex>
                    <InputMidi type="text" value={guaranteeprice} onChange={change_guaranteeprice} placeholder="가격 입력"/>
                    <Dan>만원</Dan>
                  </Flex>
                </InputBox>
                <InputBox>
                  <Label>설명</Label>
                  <InputTxt type="text" value={prd_description}onChange={change_prd_description}placeholder="매물 요약 입력"/>
                  <Textarea type="textarea" value={prd_description_detail}onChange={change_prd_description_detail} placeholder="매물 설명 입력"/>
                </InputBox>
              </Box>
            </WrapBox>

      {/*!!!!다음 버튼 , 조건문 맞춰서 액티브 됐을때 색상 바뀌어야함..!!!! */}
            <NextButton>
              <Link>
                <Next type="button" onClick={ async ()=>{
                  //지금까지의 모든 저장정보 merged하여 서버에 요청제출필요하다. 
                  console.log('=>>유지 된 정보들 기본입력정보들:',brokerRequest_product_data);
                  console.log('=>>추가입력정보들 state정보값들:',roomcount,bathroomcount,is_duplex_floor,isparking,parking_option,iselevator,is_pet,direction,entrance,heatmethod,heatfuel,space_option,prd_option,security_option,is_contract_renewal,loanprice,guaranteeprice,prd_description,prd_description_detail);
                  console.log('roomcount:',roomcount);
                  console.log('bathroomcount:',bathroomcount);
                  console.log('isduxplexfloor:',is_duplex_floor);
                  console.log('isparking:',isparking);
                  console.log('parking_option:',parking_option);
                  console.log('iselevator:',iselevator);
                  console.log('is_pet:',is_pet);
                  console.log('istoilet:',istoilet);
                  console.log('isinterior:',isinterior);
                  console.log('recommend_jobstore:',recommend_jobstore);
                  console.log('room_structure:',room_structure);

                  console.log('direction:',direction);
                  console.log('entrance:',entrance);
                  console.log('heatmethod:',heatmethod);
                  console.log('heatfuel:',heatfuel);
                  console.log('standardspace_option:',standardspace_option);
                  console.log('officetelspace_option:',officetelspace_option);
                  console.log('officetloption:',officeteloption);
                  console.log('storeofficeoption',storeofficeoption);
                  console.log('standardspace_optionarray:',standardspace_optionarray);
                  console.log('officetelspace_optionarray:',officetelspace_optionarray);
                  console.log('officeteloptionarray:',officeteloptionarray);
                  console.log('storeofficeoptionarray:',storeofficeoptionarray);

                  console.log('security_option:',security_option);
                  console.log('security_optionarray:',security_optionarray);

                  console.log('space_option:',space_option);
                  console.log('prd_option:',prd_option);

                  console.log('is_contract_renewal:',is_contract_renewal);
                  console.log('loanprice:',loanprice);
                  console.log('guaranteeprice:',guaranteeprice);
                  console.log('prd_description:',prd_description);
                  console.log('prd_description_detail:',prd_description_detail);
                  
                  //기존 사진에 대한 어떠한 의존성 연산은 하지 않음. 그냥 새로이 추가되는것들에 대해서 추가로 insert연산만 할뿐이며, 새로운 것들중 뭐를 삭제하고 최종적으로 추가할지의 클라이언트 연산만 진행 정해진 요소들을 그냥 insert만 할뿐임. 다만 기존에 앞에 mergeed하는 형태로 덭붙임으로써 새로 추가되는 항목들중에서 각 업로드된 사진의 앞 순서부터로 최근순으로 사진이 보여지게됨(사진 드래그드롭으로 위치조정은 추가개발로...공수 큼)

                  console.log('업로드한 추가사진들',serveruploadimgs_server);

                  /*if(serveruploadimgs_server.length < 3){
                    alert('사진은 최소 3장이상 등록해주세요!');
                    return false;
                  }*/
                  //해당 정보들 모두 취합하여 body_info보내어서, product에 저장한다. insert추가한다?update?? product에는 이미 있는것들에 대해서 이기에, 그 이미 있는 그 존재에 대해서 update를 진행한다. 수정은 내역을 추가해진 않음. 일단 내역을 수정update하는걳으로, 관련된 내역들 모두 수정, 내역을 추가하는것은 상태변경이 그러함. 바꿀 정보(바꿀or바뀌어진)들만 수정연산.
                  let body_info={
                    //address : brokerRequest_product_data.address,
                    companyid : brokerRequest_product_data.companyid,//수임사업체
                    exculsivedimension : brokerRequest_product_data.exculsivedimension,//전용면적
                    exculsivepyeong: brokerRequest_product_data.exculsivepyeong,//전용면적평
                    is_immediate_ibju: brokerRequest_product_data.is_immediate_ibju,//즉시입주여부
                    ibju_specifydate : brokerRequest_product_data.ibju_specifydate==''?"1999-09-09 00:00:00":brokerRequest_product_data.ibju_specifydate,
                    maemulname : brokerRequest_product_data.maemulname,
                    //maemultype : brokerRequest_product_data.maemultype,
                    managecost : brokerRequest_product_data.managecost,//관리비
                    ismanagementcost : brokerRequest_product_data.ismanagementcost ? brokerRequest_product_data.ismanagementcost : 0,//관리비여부false true
                    is_current_biz_job : brokerRequest_product_data.is_current_biz_job,//상가 업종여부
                    current_biz_job : brokerRequest_product_data.current_biz_job,//상가업종.
                    usetype : brokerRequest_product_data.officetelusetype,//오피스텔이용형태
                    //name : brokerRequest_product_data.name,
                    //phone : brokerRequest_product_data.phone,
                    prdidentityid : brokerRequest_product_data.prdidentityid,//매물고유 idnentitiyid값.
                    //requestmanname: brokerRequest_product_data.requestmanname,
                    //requestmemid : brokerRequest_product_data.requestmemid,
                    //requestmemphone : brokerRequest_product_data.requestmemphone,

                    sellprice : brokerRequest_product_data.sellprice,//매물 매매가,전세가,월세가(월세가의 경우 월 월세액이 아닌 월세보증금 입력값)
                    monthsellprice: brokerRequest_product_data.monthsellprice,//말그대로 월별 나가는 월세액
                    selltype : brokerRequest_product_data.selltype,//판매타입 매매,전세,월세
                    supplydimension : brokerRequest_product_data.supplydimension,//전용면적
                    supplypyeong: brokerRequest_product_data.supplypyeong,//전용면적평
                    include_managecost : typeof brokerRequest_product_data.include_managecost =='object' ?brokerRequest_product_data.include_managecost.join(','):brokerRequest_product_data.include_managecost, //관리비포함항목들.
                    is_rightsprice : brokerRequest_product_data.is_rightsprice,//권리금유무
                    
                    roomcount_val : roomcount,//방수 int
                    bathroomcount_val : bathroomcount,//욕실수 int 아파트
                    is_duplex_floor_val : is_duplex_floor,//복층여부
                    isparking_val : isparking,//주차가능여부(상가,사무실,오피)
                    parking_option_val : parking_option, //주차가능시 관련옵션.
                    iselevator_val : iselevator, //엘레베이터여부
                    istoilet : istoilet,
                    isinterior : isinterior,
                    recommend_jobstore : recommend_jobstore,
                    room_structure : room_structure,

                    is_pet_val : is_pet,//반려동물가능여부with
                    direction_val : direction, //방향
                    entrance_val : entrance,//복도형태
                    heatmethod_val : heatmethod,//난방형태
                    heatfuel_val : heatfuel,//난방원료

                    standardspace_option_val : standardspace_optionarray.join&&standardspace_optionarray.join(','),//표준공간옵션
                    officetelspace_option_val : officetelspace_optionarray.join(','),
                    officeteloption_val : officeteloptionarray.join(','),
                    storeofficeoption_val : storeofficeoptionarray.join(','),
                    security_option_val : security_option,//보안옵션

                    is_contract_renewal_val : is_contract_renewal,//계약갱신청구권행사여부
                    loanprice_val : loanprice, //융자금
                    guaranteeprice_val : guaranteeprice,//기보증금(월세)
                    prd_description_val : prd_description,//매물간략설명
                    prd_description_detail_val: prd_description_detail,//매물상세설명.
                  }
                  console.log('물건수정(사용자의뢰,외부수임) 물건에 대한 수정::',body_info);

                  let res= await serverController.connectFetchController('/api/broker/brokerRequest_productconfirmupdate','POST',JSON.stringify(body_info));
                  console.log('res resultss:',res);

                  if(res.success){

                    //매물이 등록된 후에 얻은 그 insertede된 prdidneitiy or prdid매물에 대해서 그 수정하고자 하는 매물에 대해서 update쿼리로써 별도로 매물 외부수임등록수정 사진등록수정 추가 쿼리진행. 사진 등록하지 않은 경우라면 이 관련 코드는 실행되지않음.
                    console.log('업로드 한 사진들!!:',serveruploadimgs_server);

                    if(serveruploadimgs_server.length>=1){
                      //이미지업로드한 경우에만 관련 처리.
                      let formData= new FormData();
                      formData.append('folder','productImgs');
                      formData.append('prd_identity_id',brokerRequest_product_data.prdidentityid);

                      for(let f=0; f<serveruploadimgs_server.length; f++){
                        let file_item = serveruploadimgs_server[f];
                        formData.append('productimgs',file_item);

                      }
                      let res2= await serverController2.connectFetchController('/api/broker/brokerRequest_prdimgs_process_modify','POST',formData);
                      if(res2){
                        if(res2.success){
                          console.log('res2reeultssss:',res2);

                          let update_result=res2.update_result;

                          let prd_imgs=update_result['prd_imgs'];
                        }
                      }
                    }
                    
                    confirmModal();

                  }else{
                    alert('처리에 문제가 있습니다.');
                  }
                                   
                }}>확인</Next>
              </Link>
            </NextButton>
           </WrapRequest>
        </Container>
  );
}

const Container = styled.div`
   width:408px;
  margin:43px auto 0;
  @media ${(props) => props.theme.mobile} {
    margin:calc(100vw*(43/428)) auto 0;
    width:calc(100vw*(380/428));
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
const Imgicon = styled.img`
    width:20px;height:auto;
`;
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
    }
`
const UploadedMaemulimgs = styled.div`
    width:100%;height:auto;
    display:flex;flex-flow:row wrap;
`;
const UploadImg = styled.img`
    width:100px;height:100px; 
`;
const ImgWrap = styled.div`
  width:100px;height:100px; position:relative;
`;
const Delbtn = styled.img`
  display:inline-block;cursor:pointer;
  width:20%;height:20%;position:absolute;right:0;top:0
`;
const NowMaemulimgs = styled.div`
    width:100%;height:auto;
    display:flex;flex-flow:row wrap
`;

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
