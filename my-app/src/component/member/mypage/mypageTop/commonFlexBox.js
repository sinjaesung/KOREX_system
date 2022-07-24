
import React from 'react';

//css
import styled from "styled-components"

//img
import Louder from '../../../../img/member/louder.png';
import Checking from '../../../../img/member/checking.png';


const CommonFlexBox = ({ icon, subTitle, price, jeonse, monthly }) => {

  return (
    <FlexBox>
      <LeftSect>
        <Icon src={icon} alt="icon" />
        <SubTitle>{subTitle}</SubTitle>
      </LeftSect>
      <RightSect>
        <Txt>매매{price}</Txt>
        <Part />
        <Txt>전세{jeonse}</Txt>
        <Part />
        <Txt>월세{monthly}</Txt>
      </RightSect>
    </FlexBox>
  )
};

export default CommonFlexBox;

const FlexBox = styled.div`
display: flex;flex-wrap: wrap;justify-content:space-between;
`
const LeftSect = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
`
const Icon = styled.img`
  width:20px;
  margin-right:12px;
`
const SubTitle = styled.p`
`
const RightSect = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
`
const Txt = styled.p`
`
const Part = styled.p`
  width:1px;height:1rem;
  background:#979797;vertical-align:middle;
  margin:0 1.125rem;
  @media ${(props) => props.theme.breakpoints.sm} {
    margin:0 0.875rem;
  }
`