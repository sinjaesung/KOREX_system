//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

import styled from "styled-components"

//component
import MapHeader from '../../component/map/MapHeader';
import Testmap from '../../component/map/Maptest';
import ReportModal from '../../component/map/sidebar/modal/ReportModal';
import ModalMap from '../../component/map/sidebar/modal/ModalMap';
import ModalEdit from '../../component/map/sidebar/modal/ModalEdit';
import FilterCloseAndReset from '../../component/map/map/FilterCloseAndReset';
import MainFooter from '../../component/common/MainFooter';
import TermService from '../../component/common/TermsOfService';
import TermPrivacy from '../../component/common/TermsOfPrivacy';
import TermLocation from '../../component/common/TermsOfLocation';
import Bunyang from '../../component/common/bunyang/Bunyang';
import ImgDetail from "../../component/common/bunyang/ImgDetail";
import LiveModal from "../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../component/common/bunyang/ModalCalendar";
import ModalCommon from '../../component/common/modal/ModalCommon';

// redex
import { MapRight, MapProductEls , mapHeader } from '../../store/actionCreators';

export default function NoticeDetail({status}) {
  
  //이용약관
  const [termservice, setTermService] = useState(false);
  const openTermService = (onOff) =>{ setTermService(onOff);}

  //개인정보처리방침
  const [termprivacy, setTermPrivacy] = useState(false);
  const openTermPrivacy = (onOff) =>{ setTermPrivacy(onOff);}

  //위치기반서비스 이용약관
  const [termlocation, setTermLocation] = useState(false);
  const openTermLocation = (onOff) =>{ setTermLocation(onOff);}

  const [bunyangDetail , setBunyangDetail] = useState({});
  const [imgArr, setImgArr] = useState([]);
  //분양 모달
  const [bunyang, setBunyang] = useState(false);
  const openBunyang = (onOff) =>{ setBunyang(onOff);}
  //라이브 시청 모달
  const [live, setLive] = useState(false);
  //분양 상세이미지 모달
  const [detailimg, setDetailImg] = useState(false);
  const [cal, setCal] = useState(false);
  
  //신고모달
  const [report,setReport] = useState([false,0,0]);
  //단지위치 모달
  const [map,setMap] = useState(false);
  const [dangimap_data,setDangimap_data] = useState({});

  const [modalOption,setModalOption] = useState({show : false,setShow:null,link:"",title:"",submit:{},cancle:{},confirm:{},confirmgreen:{},confirmgreennone:{},content:{}});


  return (
    <>
      <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
      <LiveModal bunyangDetail={bunyangDetail} live={live} setLive={setLive}/>
      <ModalCalendar bunyangDetail={bunyangDetail} cal={cal} setCal={setCal}/>
      <Bunyang bunyangDetail={bunyangDetail} setBunyangDetail={setBunyangDetail} bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} setImgArr={setImgArr} imgArr={imgArr}/>
      <MapHeader  openBunyang={openBunyang}/>
      <Container>
          <Testmap />
      </Container>
    </>
  );
}

const Container = styled.div`
    width: 100%;
    height:calc(100vh - 80px);
    @media ${(props) => props.theme.mobile} {
      height:calc(100vh - (100vw*(64/428)));
      /* overflow: hidden; */
      /* height:calc(100vh - (100vw*(64/428))); */
    }
`
