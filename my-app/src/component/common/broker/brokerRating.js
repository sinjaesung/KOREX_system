import React, { useState, useEffect } from 'react'
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { styled as MUstyled } from '@material-ui/core/styles';

//css
import styled from "styled-components"

//image
import Like from '../../../img/member/like.png';
import Smile from '../../../img/member/smile.png';

const BrokerRating = ({ title, score }) => {

    const [value, setvalue] = useState(score)

    useEffect(() => {
        setvalue(score);
    }, [score])
    
    const iconSrc = () =>{
        if(title === "전문성") {
            return Like;
        }
        if(title === "중개매너") {
            return Smile;
        }
    }

    return (
        <>
            <FlexBox>
                <LeftSect>
                    <Icon src={iconSrc()} alt="icon"/>
                    <SubTitle>{title}</SubTitle>
                </LeftSect>
                <RightSect>
                    <MURating
                        value={value}
                        readOnly
                    />
                </RightSect>
            </FlexBox>
        </>
    )
}

export default BrokerRating;

const MURating = styled(Rating)`
    &.css-ryrseu-MuiRating-root {
        color : ${(props) => props.Color};
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
