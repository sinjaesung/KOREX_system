//react
import React ,{useState, useEffect} from 'react';

//components
import ImgDetail from './bunyang/ImgDetail';
import LiveModal from './bunyang/LiveModal';
import ModalCalendar from './bunyang/ModalCalendar';
import Bunyang from './bunyang/Bunyang';
import MainHeader from './MainHeader';
import { NonceProvider } from 'react-select';


const CommonHeader = (props) => {
    
//이용약관
  const [termservice, setTermService] = useState(false);
  const openTermService = (onOff) =>{ setTermService(onOff);}

  //개인정보처리방침
  const [termprivacy, setTermPrivacy] = useState(false);
  const openTermPrivacy = (onOff) =>{ setTermPrivacy(onOff);}

  //위치기반서비스 이용약관
  const [termlocation, setTermLocation] = useState(false);
  const openTermLocation = (onOff) =>{ setTermLocation(onOff);}
 
   //분양 모달(Default:분양목록)
  const [bunyang, setBunyang] = useState(false);
  const openBunyang = (onOff) => { setBunyang(onOff);}

  //분양상세
  const [bunyangDetail , setBunyangDetail] = useState({}); 
  //-- 분양 이미지 배열입니다. 이 배열을 통하여 분양상세이미지와 확대보기를 보여줍니다.
  const [imgArr, setImgArr] = useState([]);
  //-- 확대보기 모달
  const [detailimg, setDetailImg] = useState(false);
  //--LIVE시청예약 모달
  const [live, setLive] = useState(false);
  //--방문예약 모달
  const [cal, setCal] = useState(false);

    return(
        <>
          <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg} imgArr={imgArr}/>
          <LiveModal bunyangDetail={bunyangDetail} live={live} setLive={setLive}/>
          {/* <ModalCalendar bunyangDetail={bunyangDetail} cal={cal} setCal={setCal}/> */}
          <Bunyang zeta={bunyang} bunyangDetail={bunyangDetail} setBunyangDetail={setBunyangDetail} bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} setImgArr={setImgArr} imgArr={imgArr}/>
          <MainHeader openBunyang={openBunyang}/>
        </>
    )
};

export default CommonHeader;