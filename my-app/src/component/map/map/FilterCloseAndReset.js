//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//img
import ChangeGreen from '../../../img/map/change_green.png';
import FilterClose from '../../../img/map/filter_close.png';
import FilterDown from '../../../img/map/filter_down_arrow.png';

// components
import { Mobile, PC } from "../../../MediaQuery";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SyncIcon from '@material-ui/icons/Sync';
import Button from '@material-ui/core/Button';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';


// redux
import { MapFilterRedux } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

// Init
import initFilter from '../initFilter';

export default function MapFilter({setOpen}) {

  const onClickReset = () => {
    MapFilterRedux.updateFilterRest(initFilter);
  }

  return (
    <Container>
      <Button variant="text" onClick={() => { onClickReset() }} startIcon={<SyncIcon/>} className={["changeBtn"]}>초기화</Button>

      {/* <CloseAndReset>
        <Arrow src={FilterDown} onClick={()=>{setOpen(false)}}/>
        <WrapReset className="changeBtn" onClick={() => {onClickReset()}}>
          <Reset src={ChangeGreen}/>
          <ResetTitle>초기화</ResetTitle>
        </WrapReset>
      </CloseAndReset> */}
    </Container>
  );
}
const ExpandMore = MUstyled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} className={["changeBtn"]}/>;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Container = styled.div` 
  background-color: #FFF;
`
const CloseAndReset = styled.div`
  width:100%;
  padding:10px 17px 15px;
  border-top:1px solid #f2f2f2;
  display:flex;justify-content:space-between;align-items:center;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(12/428)) calc(100vw*(22/428)) calc(100vw*(15/428));
  }
`
const Arrow = styled.img`
  cursor:pointer;
  display:inline-block;width:16px;
  transform:rotate(180deg);
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(13/428));
  }
`
const WrapReset = styled.div`
  display:flex;justify-content:flex-end;align-items:center;
  cursor:pointer;
`
const Reset = styled.img`
  width:20px;
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(13/428));
  }
`
const ResetTitle = styled.span`
  font-size:15px;
  color:#01684b;font-weight:800;transform:skew(-0.1deg);
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-left:calc(100vw*(10/428));
  }
`
