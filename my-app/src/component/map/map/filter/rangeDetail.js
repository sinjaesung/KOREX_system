import React from 'react';

//css
import styled from "styled-components"


// Range
import Rheostat from "rheostat";
import 'rheostat/initialize';

const RangeDetail = ({bool, id, title, price, min, max, value, onChange, snapPoints, txt, txt2, txt3, txt4, btn}) => {

    if(!bool){return(<></>)}

    return(
        <Box id={id}>
            <SubTitle>{title}</SubTitle>
            <WrapFilter>
                {btn?<>{btn()}</>:null}
                <PriceView>{price}</PriceView>
                <WrapRange className="changeBtnRange">
                <Rheostat
                    min={min}
                    max={max}
                    values={value}
                    onChange={onChange}
                    snap
                    snapPoints={snapPoints}
                />
                </WrapRange>
                <BottomBar>
                {/* <BarTxt>{txt}</BarTxt>
                <BarTxtMl>{txt2}</BarTxtMl>
                <BarTxtMR2>{txt3}</BarTxtMR2>
                <BarTxt>{txt4}</BarTxt> */}
                </BottomBar>
            </WrapFilter>
        </Box>
    )
};

export default RangeDetail;

const Box = styled.div`
  width:100%;
  padding:1rem;
  border-top:1px solid #f2f2f2;

`
const SubTitle = styled.div`
  margin-bottom:0.75rem;
`
const WrapFilter = styled.div`
`
const PriceView = styled.div`
  margin-bottom:1.25rem;
`
const WrapRange = styled.div`
  position:relative;
  margin:0 auto;
`
const BottomBar = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding-top:1rem;
`
const BarTxt = styled.p`
  position:relative;
  &:before{position:absolute;content:'';display:block;left:50%;top:-15px;transform:translateX(-50%);width:1px;height:8px;background:#c7c7c7;}
  @media ${(props) => props.theme.mobile} {
    &:before{top:calc(100vw*(-10/428));height:calc(100vw*(8/428));}
  }
`
const BarTxtMl = styled(BarTxt)`
  margin-left:-17px;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(-55/428));
  }
`
const BarTxtMR = styled(BarTxt)`
  margin-right:-3px;
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(-40/428));
  }
`
const BarTxtMR2 = styled(BarTxt)`
margin-right:-3px;
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(-36/428));
  }
`
const BarTxtMl2 = styled(BarTxt)`
  margin-left:-10px;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(-16/428));
  }
`