//react
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//theme
import { TtCon_1col_input_2 } from '../../../../theme';

//material-ui
import Button from '@material-ui/core/Button';

//Img
import AppleImg from "../../../../img/member/apple.png";
import FacebookImg from "../../../../img/member/facebook.png";
import KakaoImg from "../../../../img/member/kakao.png";
import NaverImg from "../../../../img/member/naver.png";

import AppleLogin from 'react-apple-login'

export default function JoinSns() {

  const appleRef = useRef();

  return (
    <>
      <Wrapper>
        <div className="par-spacing">
          <MUButton variant="outlined" href='https://korexpro.com/api/auth/social/kakao'>
            <LogoImg src={KakaoImg} />
            <FlexGrow_1 />SIGN IN WITH KAKAO<FlexGrow_1 />
          </MUButton>
        </div>
        <div className="par-spacing">
          <MUButton variant="outlined" href='https://korexpro.com/api/auth/social/naver' >
            <LogoImg src={NaverImg} />
            <FlexGrow_1 />SIGN IN WITH NAVER<FlexGrow_1 />
          </MUButton>
        </div>
        <div className="par-spacing">
          <MUButton variant="outlined" onClick={() => appleRef.current.children[0].click()} >
            <Link className="data_link">
              <div style={{ opacity: 0, display: "none" }} ref={appleRef}>
                <AppleLogin 
                    clientId={"com.korex.applelogin"} 
                    redirectURI={"https://korexpro.com/api/apple/redirect"}   
                    responseType={"code"} 
                    responseMode={"query"}  
                    usePopup={false} 
                  />
              </div>
            </Link>
            <LogoImg src={AppleImg} />
            <FlexGrow_1 />SIGN IN WITH APPLE<FlexGrow_1 />
          </MUButton>
        </div>
        <div className="par-spacing">
          <MUButton variant="outlined" href='https://korexpro.com/api/auth/social/facebook' >
            <LogoImg src={FacebookImg} />
            <FlexGrow_1 />SIGN IN WITH FACEBOOK<FlexGrow_1 />
          </MUButton>
        </div>
      </Wrapper>
    </>
  );
}



const MUButton = styled(Button)`
  &.MuiButtonBase-root.MuiButton-root {
    width:100%;
    justify-content: space-between;
  }
`
const FlexGrow_1 = styled.div
`flex-grow:1`

//----------------------------
const Wrapper = styled.div`
  ${TtCon_1col_input_2}
`
const LogoImg = styled.img`
  width:40px;
`