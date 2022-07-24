//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
//css
import styled from "styled-components";

//img
import RightArrow from '../../../../img/notice/right_arrow.png';
import Plus from '../../../../img/member/plus.png';
import Marker from '../../../../img/member/mark.png';

//redux addons asetess
import { useSelector } from 'react-redux';

//material-ui
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//component
import CommonList from '../commonList/commonList'
import BunyangPreview from '../../../common/bunyang/BunyangPreview';
import LiveModal from '../../../common/bunyang/LiveModal';
import ModalCalendar from '../../../common/bunyang/ModalCalendar';

export default function ProfileBottomElement({ open, setOpen }) {

  const login_userinfodata = useSelector(data => data.login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  //분양 모달
  const [bunyang, setBunyang] = useState(false);

  const [ readOnly, setReadOnly] = useState(false);

  const openBunyang = (onOff) => { setBunyang(onOff); }
  //라이브 시청 모달
  const [live, setLive] = useState(false);
  //분양 상세이미지 모달
  const [detailimg, setDetailImg] = useState(false);
  const [cal, setCal] = useState(false);

  // -- 수정코드입니다.
  // 타이틀 / 링크
  const myLike = "[수요_전속매물/분양]__내 관심";
  const myLikeLink = "MyLike";
  const reservation = "[수요_전속매물]__내 물건투어예약";
  const reservationLink = "Reservation";
  const request = "[공급_전속매물]__내 중개의뢰";
  const requestLink = "Request";
  const myAlarm = "내 알림";
  const myAlarmLink = "MyAlarm";
  const CompanyProfile = "회사프로필 설정";
  const CompanyProfileLink = "CompanyProfile";
  const myMember = "팀원 관리";
  const myMemberLink = "MyMember";
  const myLive = "[수요_분양]__내 Live시청예약";
  const myLiveLink = "MyLive";
  const brokerReservation = "[수요_분양]__내 방문예약";
  const brokerReservationLink = "BrokerReservation";
  const registProBroker = "[공급_전속매물]__전문중개사종목 변경";
  const registProBrokerLink = "RegistProBroker";
  const propertyManagement = "[공급_전속매물]__물건 관리";
  const propertyManagementLink = "PropertyManagement";
  const propertyTourManage = "[공급_전속매물]__물건투어예약접수 관리";
  const propertyTourManageLink = "PropertyTourManage";

  // 공통 li
  // const commonReturn = (array) => {
  //   return(
  //     <>
  //         {
  //           array.map((item, index) => {
  //             return(
  //               <Li key={index}>
  //                 <Link to={`/${item.link}`} className="data_link"></Link>
  //                 <LinkTxt>{item.title}</LinkTxt>
  //                 <Arrow src={RightArrow}/>
  //               </Li>
  //             )
  //           })
  //         }
  //     </> 
  //   )
  // }
  // 분양 프로젝트 관리
  const commonProjectMana = () => {

    return (

      <MUListItem disablePadding>
        <MUListItemButton >
          <Link onClick={() => { setOpen(!open) }} className="data_link"></Link>
          <MUListItemText primary="[공급_분양]__분양프로젝트 관리"/>

          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </MUListItemButton>
        {
          open ?
            <UlSubDepth>
              {/* <SubLi><Link to="/MyLiveSetting" className="data_link"/>- Live 시청예약세팅</SubLi> */}
              {/* <SubLi><Link to="/MyVisitSetting" className="data_link"/>- 방문예약세팅</SubLi> */}
              {/* <SubLi><Link onClick={()=>{setBunyang(true)}} className="data_link"/>- 미리보기</SubLi> */}

              <MUListItem disablePadding>
                <MUListItemButton >
                  <Link to="/MyLiveSetting" className="data_link"></Link>
                  <MUListItemText primary="- Live시청예약 세팅"/>
                  <ChevronRightIcon />
                </MUListItemButton>
              </MUListItem>
              <MUListItem disablePadding>
                <MUListItemButton >
                  <Link to="/MyVisitSetting" className="data_link"></Link>
                  <MUListItemText primary="- 방문예약 세팅"/>
                  <ChevronRightIcon />
                </MUListItemButton>
              </MUListItem>
              <MUListItem disablePadding>
                <MUListItemButton >
                  <Link onClick={() => { setBunyang(true); setReadOnly(true); }} className="data_link"></Link>
                  <MUListItemText primary="- 미리보기"/>
                  <ChevronRightIcon />
                </MUListItemButton>
              </MUListItem>
            </UlSubDepth>
            :
            null
        }
      </MUListItem>


      // <Li>
      //   <LiPJ>
      //     <Link className="data_link" onClick={() =>{setOpen(!open)}}/>
      //     <LinkTxt>분양프로젝트 관리</LinkTxt>
      //     <ArrowRotate src={RightArrow}/>
      //   </LiPJ>
      //   {
      //     open ?
      //     <SubDepth>
      //       <SubLi><Link to="/MyLiveSetting" className="data_link"/>- Live 시청예약세팅</SubLi>
      //       <SubLi><Link to="/MyVisitSetting" className="data_link"/>- 방문예약세팅</SubLi>
      //       <SubLi><Link onClick={()=>{setBunyang(true)}} className="data_link"/>- 미리보기</SubLi>
      //     </SubDepth>
      //     :
      //     null
      //   }
      // </Li>
    )
  }
  // 각 분기별 리스트  
  const listData = {
    privateRoot: [
      { title: myLike, link: myLikeLink },
      { title: reservation, link: reservationLink },
      { title: request, link: requestLink },
      { title: myAlarm, link: myAlarmLink },
    ],
    privateTeam: [
      { title: myLike, link: myLikeLink },
      { title: reservation, link: reservationLink },
      { title: request, link: requestLink },
      { title: myAlarm, link: myAlarmLink },
    ],
    companyRoot: [

      { title: myLike, link: myLikeLink },
      { title: reservation, link: reservationLink },
      { title: request, link: requestLink },
      { title: CompanyProfile, link: CompanyProfileLink },
      { title: myMember, link: myMemberLink },
      { title: myAlarm, link: myAlarmLink },
    ],
    companyTeam: [
      { title: myLike, link: myLikeLink },
      { title: reservation, link: reservationLink },
      { title: request, link: requestLink },
      { title: myAlarm, link: myAlarmLink },
    ],
    brokerRoot: [
      { title: myLike, link: myLikeLink },
      { title: reservation, link: reservationLink },
      { title: myLive, link: myLiveLink },
      { title: brokerReservation, link: brokerReservationLink },
      // { title: registProBroker, link: registProBrokerLink },
      { title: CompanyProfile, link: CompanyProfileLink },
      { title: myMember, link: myMemberLink },
      { title: myAlarm, link: myAlarmLink },
    ],
    brokerTeam: [
      { title: myLike, link: myLikeLink },
      { title: reservation, link: reservationLink },
      { title: myLive, link: myLiveLink },
      // { title: brokerReservation, link: brokerReservationLink },
      { title: myAlarm, link: myAlarmLink },
    ],
    brokerExcRoot: [
      { title: myLike, link: myLikeLink },
      { title: reservation, link: reservationLink },
      { title: myLive, link: myLiveLink },
      { title: brokerReservation, link: brokerReservationLink },
      { title: registProBroker, link: registProBrokerLink },
      { title: propertyManagement, link: propertyManagementLink },
      { title: propertyTourManage, link: propertyTourManageLink },
      { title: CompanyProfile, link: CompanyProfileLink },
      { title: myMember, link: myMemberLink },
      { title: myAlarm, link: myAlarmLink },
    ],
    brokerExcTeam: [
      { title: myLike, link: myLikeLink },
      { title: reservation, link: reservationLink },
      { title: myLive, link: myLiveLink },
      { title: brokerReservation, link: brokerReservationLink },
      { title: propertyManagement, link: propertyManagementLink },
      { title: propertyTourManage, link: propertyTourManageLink },
      { title: myAlarm, link: myAlarmLink },
    ],
    bunyangRoot: [
      { title: CompanyProfile, link: CompanyProfileLink },
      { title: myMember, link: myMemberLink },
      { title: myAlarm, link: myAlarmLink },
    ],
    bunyangTeam: [
      { title: myAlarm, link: myAlarmLink },
    ],
    default: [
      { title: myLike, link: myLikeLink },
      { title: reservation, link: reservationLink },
      { title: request, link: requestLink },
      { title: myLive, link: myLiveLink },
      { title: brokerReservation, link: brokerReservationLink },
      { title: registProBroker, link: registProBrokerLink },
      { title: propertyManagement, link: propertyManagementLink },
      { title: propertyTourManage, link: propertyTourManageLink },
    ],
    defaultDown: [
      { title: CompanyProfile, link: CompanyProfileLink },
      { title: myMember, link: myMemberLink },
      { title: myAlarm, link: myAlarmLink },
    ]
  }

  //login_userinfodata.mem_admin은 companymeber의 cmtype입니다.
  // 렌터링 함수
  const profilebottom_contents_control = () => {
    if (login_userinfodata.is_login == 1) {
      if (login_userinfodata.user_type == '개인') {
        if (login_userinfodata.mem_admin == 'root') {
          return (
            <div>
              <CommonList array={listData.privateRoot} />
            </div>
          )
        } else if (login_userinfodata.mem_admin == 'team') {
          return (
            <div>
              <CommonList array={listData.privateTeam} />
            </div>
          )
        }
      }
      if (login_userinfodata.user_type == '기업') {
        if (login_userinfodata.mem_admin == 'root') {
          return (
            <div>
              <CommonList array={listData.companyRoot} />
            </div>
          )
        } else if (login_userinfodata.mem_admin == 'team') {
          return (
            <div>
              <CommonList array={listData.companyTeam} />
            </div>
          );
        }
      }
      if (login_userinfodata.user_type == '중개사' && login_userinfodata.ispro != '1') {
        if (login_userinfodata.mem_admin == 'root') {
          return (
            <div>
              <CommonList array={listData.brokerRoot} />
            </div>
          );
        } else if (login_userinfodata.mem_admin == 'team') {
          return (
            <div>
              <CommonList array={listData.brokerTeam} />
            </div>
          );
        }
      }
      if (login_userinfodata.user_type == '중개사' && login_userinfodata.ispro == '1') {
        if (login_userinfodata.mem_admin == 'root') {
          return (
            <div>
              <CommonList array={listData.brokerExcRoot} />
            </div>
          );
        } else if (login_userinfodata.mem_admin == 'team') {
          return (
            <div>
              <CommonList array={listData.brokerExcTeam} />
            </div>
          );
        }
      }
      if (login_userinfodata.user_type == '분양대행사') {
        if (login_userinfodata.mem_admin == 'root') {
          return (
            <div>
              {commonProjectMana()}
              <CommonList array={listData.bunyangRoot} />
            </div>
          );
        } else if (login_userinfodata.mem_admin == 'team') {
          return (
            <div>
              {commonProjectMana()}
              <CommonList array={listData.bunyangTeam} />
            </div>
          );
        }
      }
    } else {
      //비로그인 or 오류로 인한 상태일경우 테스트환경 조성
      return (
        <div>
          <CommonList array={listData.default} />
          {commonProjectMana()}
          <CommonList array={listData.defaultDown} />
        </div>
      );
    }
  }

  return (
    <Container>
      <Ul>
        {profilebottom_contents_control()}
      </Ul>
      <LiveModal bunyangDetail={bunyangTeam.bunyangTeam} live={live} setLive={setLive} />
      <ModalCalendar bunyangDetail={bunyangTeam.bunyangTeam} cal={cal} setCal={setCal} />
      <BunyangPreview bunyangDetail={bunyangTeam.bunyangTeam} bunyang={bunyang}  readOnly={readOnly} setReadOnly={setReadOnly} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} />
    </Container>
  )
}

const MUListItem = styled(ListItem)`
  flex-wrap:wrap;
`
const MUListItemButton = styled(ListItemButton)`
  width: 100%;
`
const MUListItemText = styled(ListItemText)`
  transform:skew(-0.1deg);
`

//-----------------------------------------------------
const Container = styled.div`

`
const Ul = styled.ul`
`
const UlSubDepth = styled.ul`
  width: 100%;
  padding:0 0 25px 15px;
` 