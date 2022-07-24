//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//img
import TopLogo from '../../img/main/top_logo.png';
import Icon1 from '../../img/main/main_icon1.png';
import Icon2 from '../../img/main/main_icon2.png';
import Icon3 from '../../img/main/main_icon3.png';
import Icon4 from '../../img/main/main_icon4.png';
import Icon5 from '../../img/main/main_icon5.png';


export default function MainBody() {
    return (
        <Container>
            <WrapContent>
              <LeftContent>
                <LeftLine></LeftLine>
                <Text>
                  <Top>
                    하나의
                    <ColorTxt style={{color:"#01684b"}}>매물</ColorTxt>
                  </Top>
                  <Middle>
                    하나의
                    <ColorTxt style={{color:"#fe7a01"}}>신뢰</ColorTxt>
                  </Middle>
                  <Bottom>
                  Real estate is the land along with any permanent improvements<Pb></Pb>
                  attached to the land, whether natural or man-made—including water, trees,<Pb></Pb>
                  minerals, buildings, homes, fences, and bridges. Real estate is a form of real property.
                  </Bottom>
                </Text>
              </LeftContent>
              <RightContent>
                <IconImg>
                  <Icon src={Icon1}/>
                  <Icon src={Icon2}/>
                  <Icon src={Icon3}/>
                  <Icon src={Icon4}/>
                  <Icon src={Icon5}/>
                </IconImg>
                <RightLineDiv>
                  <RightLine></RightLine>
                </RightLineDiv>
              </RightContent>
            </WrapContent>
        </Container>
  );
}

const Container = styled.div`
    position:relative;
    width: 100%;
`
const WrapContent = styled.section`
  width:100%;
  margin-top:272px;
  display:flex;
  justify-content:flex-start;

  @media ${(props) => props.theme.mobile} {
        display:block;
        margin-top:calc(100vw*(100/414));
    }

`
const LeftContent = styled.div`
  display:flex;
  justify-content:flex-start;
  width:50%;

  @media ${(props) => props.theme.mobile} {
        display:block;
        width:100%;
        text-align:center;
    }

`
const LeftLine = styled.div`
  width:327px;
  height:2px;
  margin-top:76px;
  background:linear-gradient(to left, #fe7a01, #d7760f 66%, #726d33 37%, #2b664d);
  border-radius:5px;

  @media ${(props) => props.theme.tablet} {
        width:calc(100vw*(327/1700));
        margin-top:calc(100vw*(76/1700));
    }

  @media ${(props) => props.theme.mobile} {
        display:block;
        width:calc(100vw*(150/414));
        margin-top:0;
    }

`
const Text = styled.div`
  margin-left:53px;

  @media ${(props) => props.theme.tablet} {
        margin-left:calc(100vw*(53/1700));
    }
  @media ${(props) => props.theme.mobile} {
        margin-left:0;
    }
`
const Top = styled.div`
  font-size:34px;
  margin-bottom:22px;
  letter-spacing: 3.4px;
  color:#979797;
  @media ${(props) => props.theme.tablet} {
        font-size:calc(100vw*(34/1700));
        margin-bottom:calc(100vw*(22/1700));
    }
  @media ${(props) => props.theme.mobile} {
        font-size:calc(100vw*(22/414));
        margin-top:calc(100vw*(30/414));
    }

`
const Middle = styled(Top)`
  margin-left:66px;
  margin-bottom:62px;
  @media ${(props) => props.theme.tablet} {
        margin-left:calc(100vw*(66/1700));
    }

  @media ${(props) => props.theme.mobile} {
        margin-left:0;
        margin-top:0;
    }
`
const Bottom = styled.div`
  width:100%;
  font-size:14.8px;
  text-align:left;
  line-height:1.67;
  color:#4a4a4a;
  @media ${(props) => props.theme.tablet} {
        width:117%;
        font-size:calc(100vw*(14.8/1700));
    }

  @media ${(props) => props.theme.mobile} {
        text-align:center;
        font-size:calc(100vw*(14/414));
        word-break:break-word;
        padding: 0 calc(100vw*(10/414));
    }

`
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
const ColorTxt = styled.span`
  font-size:81px;
  margin-left:44px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
  vertical-align:baseline;

  @media ${(props) => props.theme.tablet} {
        font-size:calc(100vw*(81/1700));
        margin-left:calc(100vw*(44/1700));
    }

  @media ${(props) => props.theme.mobile} {
        font-size:calc(100vw*(50/414));
        margin-left:calc(100vw*(20/414));

    }
`


const RightContent = styled.div`
  width:50%;
  @media ${(props) => props.theme.mobile} {
        width:100%;
    }
`
const IconImg = styled.div`
  margin-right:95px;
  margin-top:178px;
  text-align:right;

  @media ${(props) => props.theme.tablet} {
        margin-right:calc(100vw*(95/1700));
        margin-top:calc(100vw*(178/1700));
    }

  @media ${(props) => props.theme.mobile} {
        margin-top:calc(100vw*(50/414));
        margin-right:0;
        text-align:center;
    }
`
const Icon = styled.img`
  width:65.4px;
  margin-right:27px;
  display:inline-block;
  vertical-align:bottom;
  &::last-child {
    margin-right:0;
  }

  @media ${(props) => props.theme.tablet} {
        width:calc(100vw*(65.4/1700));
        margin-right:calc(100vw*(27/1700));
    }

  @media ${(props) => props.theme.mobile} {
        width:calc(100vw*(40/414));
        margin-right:calc(100vw*(15/414));
    }
`
const RightLine = styled.div`
  display:inline-block;
  width:85%;
  height:2px;
  margin-top:35px;
  background: linear-gradient(to right, #fe7a01, #d7760f 34%, #726d33 63%, #2b664d);
  border-radius:5px;

  @media ${(props) => props.theme.tablet} {
        width:80%;
        margin-top:calc(100vw*(35/1700));
    }


  @media ${(props) => props.theme.mobile} {
        width:55%;
        margin-top:calc(100vw*(35/414));
    }

  
`

const RightLineDiv = styled.div`
  width:100%;
  text-align:right;
`

// 이 방법도 있음 !! !
// const ColorOrange = styled(ColorGreen)`
//   color:#fe7a01;
//
// `
