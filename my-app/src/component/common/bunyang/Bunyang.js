//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//style
import styled from "styled-components"

//component
import BunyangList from "./BunyangList";
import BunyangDetail from "./BunyangDetail";

//img
import CalIcon from "../../../img/main/icon_cal.png";
// import CloseIcon from "../../../img/main/modal_close.png";
import IconSearch from "../../../img/main/icon_search.png";
import IconRecent from "../../../img/main/icon_view.png";
import ItemImg from "../../../img/main/item01.png";
import BackBtn from '../../../img/notice/back_btn.png';

//material-ui
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { Mobile, PC } from "../../../MediaQuery"
import BunyangVisitReserve from './BunyangVisitReserve';


export default function Bunyang({ bunyang, openBunyang, bunyangDetail, setBunyangDetail, setLive, setDetailImg, cal, setCal, setImgArr, imgArr }) {


  //모달창 내 페이지 이동
  const [pageIndex, setPageIndex] = useState(0);

  const [BunyangDate, setBunyangDate] = useState([])
  console.log('분양디테일_____', bunyangDetail);

  // 클락한 리스트의 아이디
  const [clickId, setClickId] = useState(0);

  const Value = 0;

  const pageLoader = () => {
    switch (pageIndex) {
      case 0: return <BunyangList setBunyangDetail={setBunyangDetail} updatePageIndex={updatePageIndex} setBunyangDate={setBunyangDate} BunyangDate={BunyangDate} setClickId={setClickId} />;
      case 1: return <BunyangDetail bunyangDetail={bunyangDetail} updatePageIndex={updatePageIndex} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} setBunyangDate={setBunyangDate} BunyangDate={BunyangDate} clickId={clickId} setImgArr={setImgArr} imgArr={imgArr} />;
      case 2: return <BunyangVisitReserve bunyangDetail={bunyangDetail} updatePageIndex={updatePageIndex} setBunyangDate={setBunyangDate} setBunyangDetail={setBunyangDetail}/>;
      default: return <BunyangList setBunyangDetail={setBunyangDetail} updatePageIndex={updatePageIndex} setBunyangDate={setBunyangDate} BunyangDate={BunyangDate} />;
    }
  }

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <MUDialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MUDialogTitle>
    );
  };

  const updatePageIndex = (index) => {
    if (pageIndex + index < 0)
      setPageIndex(0);
    // else if (pageIndex + index > 1)
    //   setPageIndex(1);
    else
      setPageIndex(index);
  }

  const body = document.querySelector('html');
  if (bunyang == true)
    body.style.overflow = 'hidden';
  else
    return null;


  const closeModal = () => {
    setPageIndex(0);
    openBunyang(false);
    body.style.overflow = 'auto';
  }

  const modalTitle = () => {

    switch (pageIndex) {
      case 0:
        return <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
          분양
        </BootstrapDialogTitle>
      case 1:
        return <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
          <IconButton onClick={() => { updatePageIndex(0) }}><ArrowBackIosNewIcon /></IconButton>분양 상세
        </BootstrapDialogTitle>
      case 2:
        return <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
          <IconButton onClick={() => { updatePageIndex(1) }}><ArrowBackIosNewIcon /></IconButton>방문 예약
        </BootstrapDialogTitle>

      default:
        break;
    }
  }


  //모달창
  if (bunyang == false)
    return null;
  return (
    <Container>
      <PC>
        {/* <ModalBg onClick={closeModal}></ModalBg> */}
        {/* <ModalContent>
            <ModalClose>
              <Link onClick={closeModal}>
                <CloseImg src={CloseIcon}/>
              </Link>
            </ModalClose>
            {
              pageLoader()
            }
          </ModalContent> */}
        <Dialog
          onClose={closeModal}
          open={bunyang}
          maxWidth={'lg'}
          fullWidth={true}
        >
          {/* <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
            분양
          </BootstrapDialogTitle> */}
          {
            modalTitle()
          }

          {/* <MUDialogContent dividers> dividers : padding-top 과 같은 역할 */}
          <MUDialogContent dividers childrenIndex={pageIndex}>
            {
              pageLoader()
            }
          </MUDialogContent>

        </Dialog>

      </PC>
      <Mobile>
        <ModalBg onClick={() => { openBunyang(false) }}></ModalBg>
        <ModalContent>
          <ModalClose>
            <Link onClick={() => { setPageIndex(0); openBunyang(false) }}>
              <CloseImg src={CloseIcon} />
            </Link>
          </ModalClose>
          {
            pageLoader()
          }
        </ModalContent>
      </Mobile>
    </Container>
  );
}


const MUDialogTitle = styled(DialogTitle)``

const MUDialogContent = styled(DialogContent)`
  &.MuiDialogContent-root {
    height: 70vh;
    overflow-y:auto;
    ${({ childrenIndex }) => {
    return childrenIndex ?
      `
      `
      :
      `
      padding: 0;
      `
  }}
  }
`

//------------------------------------------------------------------
const Container = styled.div`
  @media ${(props) => props.theme.mobile} {
    display:none;
  }
`

const ImgBack = styled.img`
  width:9px;
`

const ModalBg = styled.div`
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 999;
  background:rgba(0,0,0,0.05);
`
const ModalContent = styled.div`
  position:fixed;
  width:1146px;
  height:660px;
  background:#fff;box-shadow: 0 0 10px 1px rgb(0 0 0 / 10%);
  left:50%;top:50%;transform:translate(-50%,-50%);
  border-radius:24px;
  padding: 47px 90px 30px 90px;
  overflow-y:scroll;
  z-index:1000;
  //scrollbar-width: none;
  //-ms-overflow-style: none;
  //&::-webkit-scrollbar {display: none;}

  @media ${(props) => props.theme.container} {
      width:90%;
      height:calc(100vw*(800/1436));
      overflow:hidden;
    }

`
const ModalClose = styled.div`
  position:absolute;
  right:90px;top:47px;
  z-index:2;

`
const CloseImg = styled.img`
  width:17px;
  height:18px;
`
