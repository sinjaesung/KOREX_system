//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"

//material-ui
import Button from '@material-ui/core/Button';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import FaceIcon from '@mui/icons-material/Face';

//theme
import { TtCon_Frame_A } from '../../../../theme';

//img
import Louder from '../../../../img/member/louder.png';
import Checking from '../../../../img/member/checking.png';
import LiveUser from '../../../../img/member/live_user.png';
import serverController from '../../../../server/serverController'

export default function Agency({ bunyangTeam }) {

  const [liveSetting,setLiveSetting] = useState({});//기본값 1(EDIT버튼)
  const [visitcount,setvisitcount] = useState(0);// 현재의 분양방문 신청건수.
  const [liveregicount,setliveregicount] = useState(0);

  useEffect(async()=> {
    if(bunyangTeam.bunyangTeam && !bunyangTeam.bunyangTeam.bp_id )
      return;
     
    let live_resultss = await serverController.connectFetchController(`/api/bunyang/reservation/setting?bp_id=${bunyangTeam.bunyangTeam && bunyangTeam.bunyangTeam.bp_id}&tour_type=4`,'GET',null);
    console.log('livesetting lastests:',live_resultss);

    if(live_resultss){
      if(live_resultss.success == 1){
        setLiveSetting(live_resultss.data.length == 0 ? [] : live_resultss.data[0]);
        
        let visit_result = await serverController.connectFetchController(
          `/api/bunyang/reservation?bp_id=${bunyangTeam.bunyangTeam&&bunyangTeam.bunyangTeam.bp_id}&tr_type=1`,
          'GET',
          null);

        if(visit_result && visit_result.success == 1){
          console.log('bunyang ream resultsss resultssss:',visit_result);
          setvisitcount(visit_result.data.length);
        }

        let lastest_livetourid=live_resultss&& live_resultss.data[0] && live_resultss.data[0].tour_id;
        let livecount_result = await serverController.connectFetchController(
          `/api/bunyang/reservation?bp_id=${bunyangTeam.bunyangTeam&&bunyangTeam.bunyangTeam.bp_id}&tr_type=2&tour_id=${lastest_livetourid}`,
          'GET',
          null);
            
        if(livecount_result && livecount_result.success == 1){
          let data = livecount_result.data;
          console.log('udpateREsvation분양라이브 신청리스트 특정tourid에 신청한 내역들 로컬조회:',data);
          
          setliveregicount(data.length);
        }
      }
    }
   
  },[bunyangTeam]);

  const getDate = () => {
    if (!liveSetting || !liveSetting.tour_end_date)
      return "";
    let date = new Date(liveSetting.tour_end_date.split('T')[0].replace(/-/gi, '/'));
    const dateArray = ['일', '월', '화', '수', '목', '금', '토'];


    if (new Date(liveSetting.tour_end_date.split('T')[0].replace(/-/gi, '/')).getTime() < new Date().getTime()) {
      return liveSetting.tour_end_date.split('T')[0].replace(/-/gi, '.') + " " + dateArray[date.getDay()] + "요일 " + liveSetting.td_starttime.slice(0, -3) + " [기간 만료]";
    }

    return liveSetting.tour_end_date.split('T')[0].replace(/-/gi, '.') + " " + dateArray[date.getDay()] + "요일 " + liveSetting.td_starttime.slice(0, -3);
  }

  return (
    <Container>
      <Wrapper>
        <Sect_1>
          <Bob>
            <SubTitle>Live 시청예약</SubTitle>
            <MUButton variant="contained" disableElevation startIcon={<FaceIcon />}>
              <Link to="/MyLiveManage" className="data_link"></Link>
              {/* <IconImg src={LiveUser} /> */}
              {/* <CountData>{bunyangTeam.liveCount}</CountData> */}
              <CountData>{liveregicount}명</CountData>
            </MUButton>
          </Bob>
          <Dates>{getDate()}</Dates>
        </Sect_1>
        <Sect_2>
          <Bob>
            <SubTitle>방문예약</SubTitle>
            {/* <Visit>
                방문예약 {bunyangTeam.visitCount} 
              </Visit> */}
            <MUButton variant="contained" disableElevation startIcon={<FaceIcon />}>
              <Link to="/MyVisitManage" className="data_link"></Link>
              {/* <IconImg src={LiveUser} /> */}
              {/* <CountData> {bunyangTeam.visitCount}</CountData> */}
              <CountData>{visitcount}명</CountData>
            </MUButton>
          </Bob>
        </Sect_2>
      </Wrapper >
    </Container >
  );
}


const MUButton = styled(Button)``

const Container = styled.div`
  ${TtCon_Frame_A}
`

const Wrapper = styled.div``

const Sect_1 = styled.div`
text-align:center;
margin-bottom: 1.25rem;
`

const Sect_2 = styled.div`
`

const Bob = styled.div`
  display:flex;justify-content:center;align-items:center;
`

const SubTitle = styled.p`
  margin-right: 1rem;
`
const IconImg = styled.img`
  display:inline-block;
  width:20px;
  margin-right:11px;
  color:white;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    margin-right:calc(100vw*(8/428));
    } */
`
const CountData = styled.p`
`
const Dates = styled.p`
  font-size: ${(props)=>props.theme.typography.fontSize.sm}
`
