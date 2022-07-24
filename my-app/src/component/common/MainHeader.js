//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
//css
import styled from "styled-components"
import NavIcon from '../../img/main/nav_btn.png';
import Logo from '../../img/main/header_logo.png';
import PCLogo from '../../img/main/pc_header_logo.png';
import Mypage from '../../img/main/mypage_icon.png';

//material-ui
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

//theme
import { TtCon_Frame_H, TtHeader_Pos } from '../../theme';

// components
import { Mobile, PC } from "../../MediaQuery";


export default function MainHeader({ openBunyang, rank }) {

  const history = useHistory();
  const type = useSelector(data => data.login_user.user_type);
  const login_user = useSelector(data => data.login_user);
  //console.log(rank);
  const onClickBunyang = () => {
    if (type !== "중개사") {
      alert("분양정보는 중개사 전용입니다. 중개사회원으로 로그인해주세요.");
      return;
    }
    console.log('동작');
    openBunyang(true);
  }

  const onClickMbBunyang = () => {
    if (type !== "중개사") {
      alert("분양정보는 중개사 전용입니다. 중개사회원으로 로그인해주세요.");
      return;
    }
    history.push('/MbBunyang');
  }

  return (
    <Container>
      <Wrapper>
        <PC>
          <MUButton color="inherit">
            <Link to="/">
              <LogoImg src={PCLogo} />
            </Link>
          </MUButton>
          <div style={{ flexGrow: "1" }}></div>
          <MUButton variant="contained" variant="contained" disableElevation onClick={() => { onClickBunyang() }}>분양</MUButton>
          <Tooltip title="마이페이지">
            <MUIconButton>          
              <Link to="/Mypage">
                {/* {login_user.memprofile ? <MyImg src={login_user.memprofile}/> : <AccountCircleIcon />} */}
                <MyImg src={login_user.memprofile ? login_user.memprofile : Mypage} />
              </Link>
            </MUIconButton>
          </Tooltip>
        </PC>

        <Mobile>
          <MUIconButton>
            <Link to="/">
              <MobLogoImg src={Logo} />
            </Link>
          </MUIconButton>
          <div style={{ flexGrow: "1" }}></div>
          <MUButton variant="contained" disableElevation onClick={() => { onClickMbBunyang()}}>분양</MUButton>
          <MUIconButton> 
          <Link to="/Mypage">
            <MyImg src={login_user.memprofile ? login_user.memprofile : Mypage} />
          </Link>
          </MUIconButton>
        </Mobile>
      </Wrapper>
    </Container>
  );
}

const MUButton = styled(Button)``
const MUIconButton = styled(IconButton)``
//----------------------------------------------------------------

const Container = styled.header`
    position:relative;
    z-index:2;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.08);

    @media ${(props) => props.theme.breakpoints.sm} {
          z-index:3;
      }
`
const Wrapper = styled.div`
    ${TtCon_Frame_H}
    ${TtHeader_Pos}
    display:flex;
    justify-content:space-between;
    align-items:center;
`

const LogoImg = styled.img`
    width:108px;
`
const MobLogoImg = styled.img`
    @media ${(props) => props.theme.md} {
      width:40px;
      }
      @media ${(props) => props.theme.sm} {
      width:30px;
      }
`
const MyImg = styled.img`
    width:32px;
    border-radius:100%;
`