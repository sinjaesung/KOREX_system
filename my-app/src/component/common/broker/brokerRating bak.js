import React, { useState, useEffect } from 'react'
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { styled as MUstyled } from '@material-ui/core/styles';

//css
import styled from "styled-components"


const BrokerRating = (props) => {
    const [value, setvalue] = useState(props.starlength)
    const [starColor, setstarColor] = useState("#01684b")

    useEffect(() => {
        setvalue(props.starlength);
        if(props.color == false){
            setstarColor("#fe7a01")
        }
        
    }, [props.starlength])

    return (
        <div>
            <FlexBox>
                <LeftSect>
                    <Icon src={props.icon} alt="icon" />
                    <SubTitle>{props.title}</SubTitle>
                </LeftSect>
                <RightSect>
                    <MURating
                        value={value}
                        readOnly
                        // Color={starColor}
                    />
                </RightSect>
            </FlexBox>
        </div>
    )
}

export default BrokerRating;

const MURating = styled(Rating)`
    &.css-ryrseu-MuiRating-root {
        color : ${(props) =>props.Color};
    }
`

const FlexBox = styled.div`
display: flex;flex-wrap: wrap;justify-content:space-between;
`
const LeftSect = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
`
const Icon = styled.img`
  width:20px;margin-right:12px;
`
const SubTitle = styled.p`

`
const RightSect = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  `
