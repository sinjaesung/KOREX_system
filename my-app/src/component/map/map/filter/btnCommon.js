import React from 'react';

//css
import styled from "styled-components"
import Switch from '@material-ui/core/Switch';


const CkboxCommon = ({boxId, title, noBorder, checked, onChange, id, text, dataText}) => {


    return(
        <Box id={boxId} noBorder={noBorder?true:false}>
            <SubTitle>{title}</SubTitle>
            <WrapFilter>
                <SwitchButton>
                    <Switch className="changeBtn" checked={checked} type="checkbox" data-text={dataText} onChange={(e) =>{ onChange(e) }} id={id}/>
                    {/* <SwitchLabel for={id}>
                    <SwitchSpan/>
                    </SwitchLabel> */}
                    <Span>{text}</Span>
                </SwitchButton>
            </WrapFilter>
        </Box>
    )
};

export default CkboxCommon;

const Box = styled.div`
    width:100%;
    padding:22px 17px;
    border-top:1px solid #f2f2f2;
    @media ${(props) => props.theme.mobile} {
        padding:calc(100vw*(22/428)) calc(100vw*(33/428));
    }

    ${({noBorder})=>{
        return noBorder?
        `
        border-top:none;
        padding-top:0;
        `
        :
        `
        `
    }}
`
const SubTitle = styled.h5`
  font-size:12px;
  color:#4a4a4a;transform:skew(-0.1deg);
  margin-bottom:13px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(13/428));
    font-weight:600;
  }
`
const WrapFilter = styled.div`
  width:100%;
`
const SwitchButton = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
  }
`
// const Switch = styled.input`
//   display:none;
//   &:checked+label{background:#009053}
//   &:checked+label span{left:22px;}
//   @media ${(props) => props.theme.mobile} {
//     &:checked+label span{left:calc(100vw*(24/428));}
//   }
// `
const SwitchLabel = styled.label`
  position:relative;display:inline-block;
  width:41px;
  height:15px;background:#e4e4e4;
  border-radius: 18px;
  border: solid 1px #d6d6d6;
  transition:all 0.3s;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(41/428));
    height:calc(100vw*(15/428));
  }
`
const SwitchSpan = styled.span`
  position:absolute;left:-1px;top:50%;transform:translateY(-50%);
  width:18px;height:18px;border-radius:100%;
  border: solid 1px #888888;
  background-color: #ffffff;
  transition:all 0.3s;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
    height:calc(100vw*(18/428));
  }
`
const Span = styled.span`
  display:inline-block;font-size:15px;
  font-weight:normal;transform:skew(-0.1deg);color:#4a4a4a;
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-left:calc(100vw*(10/428));
  }
`

