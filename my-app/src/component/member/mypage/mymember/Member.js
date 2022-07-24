//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"

//material-ui
import Button from '@material-ui/core/Button';
import { styled as MUstyled } from '@material-ui/core/styles';
//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col, } from '../../../../theme';

//img

import Profile from '../../../../img/member/no_profile.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import Set from '../../../../img/member/setting.png';

import { Mobile, PC } from "../../../../MediaQuery";
import MemberList from "./MemberList";

import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';

export default function Member({ teamonelistresult, setTeamonelistresult }) {

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  /*data map*/
  const MemberListItem = [
    {
      m_id: 0,
      src: Profile,
      path: "/MyMemberAdd",
      name: "홍길동",
      grade: "관리자",
      phone: "01012345689",
      regidate: "2020.01.01"
    },
    {
      m_id: 1,
      src: Profile,
      path: "/MyMemberAdd",
      name: "홍길순",
      grade: "팀원",
      phone: "01012345689",
      regidate: "2020.01.01"
    },
    {
      m_id: 2,
      src: Profile,
      path: "/MyMemberAdd",
      name: "홍길자",
      grade: "팀원",
      phone: "01012345689",
      regidate: "2020.01.01"
    }
  ]

  const topInfoContent = () => {
    return (
      <>
        {/* <Link to="/MyMemberAdd">
        <AddMember>추가</AddMember>
      </Link> */}
      </>
    )
  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">팀원 관리</p>
        <div className="par-spacing">
          <div className="flex-right-center">
            <MUButton variant="contained" disableElevation><Link to="/MyMemberAdd" className="data_link" />추가</MUButton>
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          <div className="par-spacing">
            <CommonTopInfo length={teamonelistresult.length} leftComponent={topInfoContent()} />
          </div>
          <div className="par-spacing-after">
            <ul className="scroll-y">
              {
                teamonelistresult.map((value) => {
                  console.log('팀원리스트 각 values:', value);
                  return (
                    <MemberList value={value} setTeamonelistresult={setTeamonelistresult} />
                  )
                }
                )
              }
            </ul>
          </div>
        </Sect_R2>
      </Wrapper>
    </>
  );
}

const MUButton = styled(Button)``
//------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Sect_R2 = styled.div`
  ${TtCon_1col}
`

const ListUl = styled.ul`
  width:100%;
`
// const Container = Sstyled.div`
//     width:680px;
//     margin:0 auto;
//     padding:24px 0 250px;
//     @media ${(props) => props.theme.mobile} {
//       width:calc(100vw*(380/428));
//       padding:calc(100vw*(30/428)) 0 calc(100vw*(150/428));
//       }
// `
// const WrapMember = Sstyled.div`
//   width:100%;
// `
// const TopTitle = Sstyled.h2`
//   font-size:20px;color:#707070;
//   text-align:left;padding-left:30px;
//   font-weight:800;transform:skew(-0.1deg);
//   @media ${(props) => props.theme.mobile} {
//     font-size:calc(100vw*(14/428));
//     padding-left:calc(100vw*(16/428));
//     }
// `
const TopSect = styled.div`
   border-bottom:1px solid ${(props) => props.theme.palette.line.main};
`
const AddMember = styled(Button)` 
width:80px;height:30px;
  border-radius:4px;border:2px solid #2b664d;
  line-height:26px;
  font-size:13px;
  color:#2b664d;
  font-weight:600;
  transform:skew(-0.1deg);
  text-align:center;

  @media ${(props) => props.theme.mobile} {
    /* width:calc(100vw*(80/428)); */
    /* height:calc(100vw*(30/428)); */
    line-height:calc(100vw*(28/428));
    /* font-size:calc(100vw*(13/428)); */
  }
`
