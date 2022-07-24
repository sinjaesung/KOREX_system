//react
import React, { useState, useEffect, useRef} from 'react';
import {Link,useHistory } from "react-router-dom";


//material-ui
import TextField from '@material-ui/core/TextField';
import { styled as MUstyled } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import DialogContent from '@mui/material/DialogContent';


//css
import styled from "styled-components"
import IconSearch from '../../img/main/icon_search.png';
//components
import MbSearch from './mobilecomp/MbSearchBody';

// redux
import { MapProductEls } from '../../store/actionCreators';
import { useSelector } from 'react-redux';
// import { Button } from '@material-ui/core';

import MobileSearchModal from './MobileSearchModal';
import ApartmentIcon from '@material-ui/icons/Apartment';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import StoreIcon from '@material-ui/icons/Store'
import BusinessIcon from '@material-ui/icons/Business';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';



// code
import serverController from '../../server/serverController'
import initFilter from '../map/initFilter';
import MobileSearchMainSecond from './MobileSearchMainSecond';
import { mapHeader } from '../../store/actionCreators';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


// export default function MobileSearch({activeText}) {
export default function MobileSearch() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const [value, setValue] = useState(0);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeText, setActiveText] = useState("apart");

  const handleChange = (event, newValue) => {

    switch (newValue) {
      case 0:
        setActiveIndex(newValue);
        setActiveText("apart");
        mapHeader.updateprdtype({ prdtypes: "apart" });
        break;
      case 1:
        setActiveIndex(newValue);
        setActiveText("officetel");
        mapHeader.updateprdtype({ prdtypes: "officetel" });
        break;
      case 2:
        setActiveIndex(newValue);
        setActiveText("store");
        mapHeader.updateprdtype({ prdtypes: "store" });
        break;
      case 3:
        setActiveIndex(newValue);
        setActiveText("office");
        mapHeader.updateprdtype({ prdtypes: "office" });
        break;

      default:
        break;
    }
    setValue(newValue)
  };

  return (
    <Container>
        <WrapMainSearch>
       
        <MUTextField
          id="outlined-basic"
          label="검색어 하기"
          placeholder='지역,지하철,대학교,물건명 검색'
          variant="outlined"
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <SearchIcon onClick={handleClickOpen} />
                {/* <SearchIcon onClick={() => { history.push('./Mbsearch')} } /> */}
                {/* <SearchBtn type="submit" name="" /> */}
              </InputAdornment>
            ),
          }}
          onClick={handleClickOpen}
        // onClick={() => {history.push('./Mbsearch') }}
        />
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>


              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                검색하기
              </Typography>


            </Toolbar>
          </AppBar>
          <DialogContent>

            <MUTabs value={value} onChange={handleChange} TabIndicatorProps={{ style: { display: "none" } }}>
              <MUTab label="아파트" />
              <MUTab label="오피스텔" />
              <MUTab label="상가" />
              <MUTab label="사무실" />
              <MUTab label="전문중개사" disabled />
            </MUTabs>

            <MobileSearchMainSecond activeText={activeText} />


          </DialogContent>

        </Dialog>
        {/* <Button onClick={}>테스트</Button> */}

        {/* <Link to="/MbSearch" className="data_link"></Link>
            <MainSearch>
              <SearchInput type="text" name="" placeholder="지역,지하철,대학교,물건명 검색"/>
              <Link to={`/Map/${activeText}`}>
                <SearchBtn type="submit" name=""/>
              </Link>
            </mainSearch>
            <SearchResult></SearchResult> */}
       




        </WrapMainSearch>
    </Container>
  );
}

const MUTabs = styled(Tabs)`

& .MuiTabs-flexContainer {
  flex-wrap: wrap;
  justify-content: center;
}
`
const MUTab = styled(Tab)`
&.MuiButtonBase-root.MuiTab-root.Mui-selected, &.MuiButtonBase-root.MuiTab-root.Mui-disabled  {
  color:${(props) => props.theme.palette.secondary.main};
  background-color: rgb(0,0,0,0.04);
}
`

const Closebtn = styled.p`
  display:inline-block; cursor:pointer;
  font-size:calc(100vw*(14/428));
  font-weight:600; margin-left:20px;
  color:#898989;transform:skew(-0.1deg);
`

const Bg = styled.div`
  position:fixed;
  width:100%;height:100%;
  left:0;top:0;display:block;content:'';
  background:transparent;
`

const MUTextField = MUstyled(TextField)`
  width:100%;
  transform: skew(-0.1deg);
`
const Container = styled.div`
`
const WrapMainSearch = styled.div`
  position:relative;
  width:100%;
  height:auto;
  border-radius:9px;
  /*border:1px solid #D0D0D0;*/
`
const MainSearch = styled.div`
  display:inline-flex;
  justify-content:space-between;
  align-items:center;
  width:100%;
  height:48px;
  background:#f8f7f7;
  padding:13px 23.3px 14px 34px;
  box-sizing:border-box;
  border-radius:9px;

  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      padding:calc(100vw*(11/428)) calc(100vw*(21/428)) calc(100vw*(13/428)) calc(100vw*(27/428));
    }
`
const SearchInput = styled.input`
  width:375px;
  background:none;
  font-size:16px;
  transform: skew(-0.1deg);
  color:#707070;
  font-weight:bold;
  &::placeholder{color:#979797;}

  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(280/428));
      font-size:calc(100vw*(14/428));
    }
`
const SearchBtn = styled.button`
  width:30px;
  height:30px;
  background:transparent url(${IconSearch}) no-repeat center center;
  background-size:19px 18px;

  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(30/428));
      height:calc(100vw*(30/428));
      font-size:calc(100vw*(14/428));
      background-size:calc(100vw*(16/428)) calc(100vw*(15/428));
    }
`

const SearchResult = styled.div`
  position:Absolute;
  width:100%;
  height:460px;
  top:44px;
  @media ${(props) => props.theme.container} {
      width:90%;
      height:calc(100vw*(460/1436));
    }
  @media ${(props) => props.theme.mobile} {
      display:none;
    }
`
const NoneHisto = styled.div`
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  top:0;
  display:flex;justify-content:space-between;
  width:1029px;
  height:460px;
  background:#fff;
  padding:26px 20px;
  border:1px solid #e2e2e2;
  z-index:2;
`
const SearchArea = styled.div`
  width:301px;
`
const TopTxt = styled.div`
  position:relative;
  width:100%;
  font-size:16px;
  color:#4a4a4a;
  padding-bottom:15px;
  padding-left:20px;
  font-weight:600;
  transform:skew(-0.1deg);
  &:after{
    position:absolute;left:0;bottom:0px;content:'';display:block;
    width:100%;height:1px;
    border-bottom:1px solid #4a4a4a;}
`
const SearchSubway = styled(SearchArea)`
`
const SearchUniv = styled(SearchArea)`
`
const Line = styled.div`
  width:1px; height:100%;background:#f2f2f2;
`
const NoneHistory = styled.p`
  position:absolute;
  left:50%;
  top:186px;
  transform:translateX(-50%) skew(-0.1deg);
  font-size:14px;color:#979797;font-weight:600;
`
const WrapDeleteBtn = styled.div`
  position:absolute;
  right:16px;
  bottom:10px;
  z-index:3;
`
const DeleteMsg = styled.p`
  display:inline-block;
  font-size:13px;
  margin-left:11px;
  height:18px;
  line-height:18px;
  font-weight:600;
  color:#898989;transform:skew(-0.1deg);
`
const HaveHisto = styled.div`
  position:absolute;
  width:400px;
  padding:33px 36px;
  top:0px;
  left:0;
  height:460px;
  background:#fff;border:1px solid #e2e2e2;box-sizing:border-box;
  z-index:2;
`
const History = styled.ul`

`
const HistoryList = styled.li`
  font-size:16px;
  font-weight:600;
  transform:skew(-0.1deg);
  color:#4a4a4a;
  margin-bottom:10px;
`
const SearchList = styled.ul`
  padding:0 22px;
  width:100%;
  margin-top:17px;
`
const Listtxt = styled(HistoryList)`
`
