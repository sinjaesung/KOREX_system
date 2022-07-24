import React from 'react';

//css
import styled from "styled-components"

//material-ui
import Slider from '@material-ui/core/Slider';

// function valuetext(value) {
//   return `${value}°C`;
// }

const RangeDetail = ({ bool, id, title, price, min, max, value, getValue, snapPoints, txt, txt2, txt3, txt4, btn }) => {

  console.log('value:', value);
  console.log('price:', price);
  const [reValue, setValue] = React.useState(value);
  console.log('reValue:', reValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    getValue(reValue);
  };

  if (!bool) { return (<></>) }
  return (
    <Box id={id}>
      <SubTitle>{title}</SubTitle>
      <WrapFilter>
        <PriceView>{price}</PriceView>
        <Slider
          size="small"
          min={min}
          max={max}
          value={reValue}
          onChange={handleChange}
          //step={5}
          //valueLabelDisplay="auto"
          //valueLabelFormat={price}
        />
      </WrapFilter>
    </Box>
  );
};

export default RangeDetail;

const Box = styled.div`
  width:100%;
  /* padding:22px 17px;
  border-top:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(22/428)) calc(100vw*(33/428));
  } */
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
const PriceView = styled.div`
  width:100%;
  font-size:15px;font-weight:800;transform:skew(-0.1deg);
  color:#01684b;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(20/428));
`