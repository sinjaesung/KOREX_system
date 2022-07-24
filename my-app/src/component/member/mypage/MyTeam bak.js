//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//material-ui
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

//css
import styled from "styled-components"
import Item from '../../../img/member/item.png';
import NoImg from '../../../img/member/company_no.png';
import RightArrow from '../../../img/notice/right_arrow.png';

//react redux
import { useSelector } from 'react-redux';
import { Login_userActions } from '../../../store/actionCreators';

//server
import serverController from '../../../server/serverController';

export default function SubTitle(teamsosoklist) {

  // !!@@ 211103_이형규> 하자--- teamsosoklist에 속성 teamsosoklist를 중복으로 부여한 이유가 뭔지? 특별한 이유 없다면, MyBunyangTeam참고하여 배열객체 일관성 맞추기.

  console.log('팀원소속리스트 배열::', teamsosoklist, teamsosoklist.teamsosoklist);
  const login_user = useSelector(data => data.login_user);
  //분양사회원인 경우 로그인한 회원memid에게 부여된 분양프로젝트들리스트가 띄워진다. 중개사나 기업인경우는 그냥 소속id ocmpanyname하나가 뜨면된다.

  if (login_user.user_type != '분양대행사') {
    var sosokList = [
      {
        Team_id: 0,
        path: "/Mypage",
        src: NoImg,
        title: login_user.company_name,//소속 업체(기업명,중개사명)로 리덕스 로그인유저 companyname업체명(소속업체 소속중개사,기업체명으로 소속명 변경)
        src2: RightArrow
      },

    ]
  }
  const TeamListItem = [
    {
      Team_id: 0,
      path: "/Mypage",
      src: NoImg,
      title: "삼성물산",
      src2: RightArrow
    },
    {
      /*중개사일경우*/
      Team_id: 1,
      path: "/Mypage",
      src: NoImg,
      title: "럭키공인중개사",
      src2: RightArrow
    },
    {
      /*분양대행사 일경우*/
      Team_id: 2,
      path: "/Mypage",
      src: NoImg,
      title: "AAA 프로젝트",
      src2: RightArrow
    }
  ]


  const onClickTeam = async (value) => {
    // 클릭 id
    // console.log(value.Team_id);
    console.log('클릭 teamid및 소속업체명:', value.company_name, value.company_id);

    Login_userActions.companynamechange({ company_name: value.company_name });
    //소속change시에 소속회사명 / 소속정보 등 쿼리한다.
    Login_userActions.companyidchange({companyids : value.company_id});
    let body_info = {
      //로그인한 memid에 대한 uupdate쿼리진행.
      mem_id: login_user.memid,
      change_sosok_companyid: value.company_id//선택한 companyid소속id업체에 대해서 udpate처리진행.  
    }
    let res = await serverController.connectFetchController('/api/mypage/sosok_change_process', 'POST', JSON.stringify(body_info));
    if (res) {
      if (res.success) {
        console.log('소속 변경 관련 처리결과::', res);
      }
    }
  }

  return (
    <Container>
      <WrapTeamBody>
        <TeamList>
          {
            teamsosoklist &&
            teamsosoklist.teamsosoklist.map && teamsosoklist.teamsosoklist.map((value) => {
              return (
                <List>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => onClickTeam(value)}>
                      <Link to={"/Mypage"} className="data_link"></Link>
                      <ListItemIcon>
                        <ItemImg src={value.profile_img} />
                      </ListItemIcon>
                      <ListItemText primary={value.company_name} />
                      <GoDetail>
                        <RightArrowImg src={RightArrow} />
                      </GoDetail>
                    </ListItemButton>
                  </ListItem>
                </List>

                // <List onClick={() => onClickTeam(value)}>
                //   <Link to={"/Mypage"} className="data_link"></Link>
                //     <TeamTitle>
                //       <ItemImg src={value.profile_img}/>
                //       <Title>{value.company_name}</Title>
                //     </TeamTitle>
                //     <GoDetail>
                //       <RightArrowImg src={RightArrow} />
                //     </GoDetail>
                // </List>
              )
            })
          }
        </TeamList>
      </WrapTeamBody>
    </Container>
  );
}

const Container = styled.div`
  width:100%;
  @media ${(props) => props.theme.mobile} {
        width:calc(100vw*(390/428));
        margin:0 auto;
        padding-bottom:calc(100vw*(100/428));
    }
`
const WrapTeamBody = styled.div`
  width:640px;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
        width:100%;
        margin:0 auto;
    }
`
const TeamList = styled.ul`
  width:100%;
  padding-top:15px;
  @media ${(props) => props.theme.mobile} {
        width:100%;
        padding-top:calc(100vw*(10/428));
    }
`
// const List = styled.li`
//   position:relative;
//   width:100%;
//   padding:25px 40px;
//   border-bottom:1px solid #f2f2f2;
//   display:flex;justify-content:space-between;align-items:center;
//   @media ${(props) => props.theme.mobile} {
//         width:100%;
//         padding:calc(100vw*(21/428)) calc(100vw*(27/428));
//     }
// `
const TeamTitle = styled.div`
  width:97%;
  display:flex;justify-content:flex-start;align-items:center;
  transform:skew(0.1deg);
  @media ${(props) => props.theme.mobile} {

    }
`
const ItemImg = styled.img`
  width:55px;height:55px;
  border-radius:3px;
  margin-right:20px;
  border:1px solid #e4e4e4;
  transform:skew(0.1deg);
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(55/428));height:calc(100vw*(55/428));
    margin-right:calc(100vw*(28/428));
    }
`
const Title = styled.h2`
  width:97%;
  font-size:15px;
  color:#4a4a4a;
  font-weight:800;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    }
`
const TeamDate = styled.p`
  font-size:12px;
  color:#4a4a4a;
  font-weight:600;
  transform:skew(0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
  }
`
const GoDetail = styled.span`

`
const RightArrowImg = styled.img`
  width:8px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(5/428));
  }
`
