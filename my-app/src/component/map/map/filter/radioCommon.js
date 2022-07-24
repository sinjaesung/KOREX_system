import React from 'react';

//materia-ui
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

//css
import styled from "styled-components"

//img
// import Radio from '../../../../img/map/radi.png';
// import RadioChk from '../../../../img/map/radi_chk.png';

const RadioCommon = ({boxId, title, noBorder, isWidth, checked, onChange, name, array}) => {
// console.log(checked);
  console.log(array[checked]);


    return(
        <Box id={boxId} noBorder={noBorder?true:false}>

        <FormControl component="fieldset">
          <FormLabel component="legend">{title}</FormLabel>
          <RadioGroup
            defaultValue={array[checked]}
            row
          >
            {
              array.map((item, index) => {
                return (
                  <FormControlLabel value={item} control={<Radio
                    className="changeBtn"
                    onChange={(e) => { onChange(e, name); }}
                    name={name}
                    id={index} />} label={item} />
                )
              })
            }
           
          </RadioGroup>
        </FormControl>




            {/* <SubTitle>{title}</SubTitle>
            <WrapFilter>
                <WrapRadio>
                    {
                        array.map((item, index) => {
                            return(
                                <RadioBox key={index} isWidth={isWidth?true:false}>
                                    <InputR
                                        checked={checked == index}
                                        className="changeBtn"
                                        type="radio"
                                        data-text={item}
                                        data-num={index}
                                        onChange={(e) => {onChange(e, name);}}
                                        name={name}
                                        id={`${name}${index+1}`}
                                    />
                                    <LabelR for={`${name}${index+1}`} >
                                    <SpanR/>
                                    {item}
                                    </LabelR>
                                </RadioBox>
                            )
                        })
                    }
                </WrapRadio>
            </WrapFilter> */}

        </Box>
    )
};

export default RadioCommon;

const Box = styled.div`
    width:100%;
    padding:1rem;
    border-top:1px solid #f2f2f2;
    /* @media ${(props) => props.theme.mobile} {
        padding:calc(100vw*(22/428)) calc(100vw*(33/428));
    } */

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
  /* @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(13/428));
    font-weight:600;
  } */
`
const WrapFilter = styled.div`
  width:100%;
`
const WrapRadio = styled.div`
  width:100%;display:flex;justify-content:flex-start;align-items:center;
  flex-wrap:wrap;
`
const RadioBox = styled.div`
    ${({isWidth})=>{
        return isWidth?
        `
        width:50%;
        `
        :
        `
        width:33%;
        `
    }}
`

// const InputR = styled.input`
//   display:none;
//   &:checked+label span{background:url(${RadioChk}) no-repeat; background-size:100% 100%;}
// `
const LabelR = styled.label`
  display:inline-block;
  margin-bottom:10px;
  /* font-weight:normal;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(20/428));
  } */
`
const SpanR = styled.span`
  display:inline-block;width:22px;height:22px;
  margin-right:8px;vertical-align:middle;
  background:url(${Radio}) no-repeat;background-size:100% 100%;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));
  } */
`