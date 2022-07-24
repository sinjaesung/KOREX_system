//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//style
import styled from "styled-components"

//component
import BunyangList from "./BunyangList";
import BunyangDetailPreview from "./BunyangDetailPreview"; 
import BunyangDetailCont from './BunyangDetailCont'
//mateiral-ui
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

//img
import CalIcon from "../../../img/main/icon_cal.png";
// import CloseIcon from "../../../img/main/modal_close.png";
import IconSearch from "../../../img/main/icon_search.png";
import IconRecent from "../../../img/main/icon_view.png";
import ItemImg from "../../../img/main/item01.png";

import { Mobile, PC } from "../../../MediaQuery"



export default function BunyangPreview({ bunyang, openBunyang, setLive, bunyangDetail, setDetailImg, setCal,  readOnly, setReadOnly}) {


  function numberWithCommas(x) {
    // console.log(x);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

  const [BunyangDate, setBunyangDate] = useState([])


  const body = document.querySelector('html');
  if(bunyang == true)
      body.style.overflow = 'hidden';
  else
      return null;

      
  const closeModal = ()=>{
    openBunyang(false);
    setReadOnly(false);
    body.style.overflow = 'auto';
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
  console.log(bunyangDetail);
//모달창
  if(bunyang == false)
    return null;

    return (
      <Container>
        <PC>
          <Dialog
            onClose={closeModal}
            open={bunyang}
            maxWidth={'lg'}
            fullWidth={true}
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
              미리보기
            </BootstrapDialogTitle>
            <MUDialogContent>
              <BunyangDetailCont bunyangDetail={bunyangDetail} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} numberWithCommas={numberWithCommas}  readOnly={readOnly} setReadOnly={setReadOnly} setBunyangDate={setBunyangDate} BunyangDate={BunyangDate} />;
              {/* <BunyangDetailPreview bunyangDetail={bunyangDetail} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} setBunyangDate={setBunyangDate} BunyangDate={BunyangDate} />; */}
            </MUDialogContent>

          </Dialog>



          {/* <ModalBg onClick={closeModal}></ModalBg>
          <ModalContent>
            <ModalClose>
              <Link onClick={closeModal}>
                <CloseImg src={CloseIcon}/>
              </Link>
            </ModalClose>
            <BunyangDetailPreview bunyangDetail={bunyangDetail} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} setBunyangDate={setBunyangDate} BunyangDate={BunyangDate}/>;
          </ModalContent> */}




        </PC>
        <Mobile>
          <Dialog
            onClose={closeModal}
            open={bunyang}
            // maxWidth={'lg'}
            fullScreen
            fullWidth={true}
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
              미리보기
            </BootstrapDialogTitle>
            <MUDialogContent>
              {/* <BunyangDetailPreview bunyangDetail={bunyangDetail} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} setBunyangDate={setBunyangDate} BunyangDate={BunyangDate} />; */}
               <BunyangDetailCont bunyangDetail={bunyangDetail} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} numberWithCommas={numberWithCommas}  readOnly={readOnly} setReadOnly={setReadOnly} setBunyangDate={setBunyangDate} BunyangDate={BunyangDate} />
            </MUDialogContent>

          </Dialog>


          {/* <ModalBg onClick={()=>{openBunyang(false)}}></ModalBg>
          <ModalContent>
            <ModalClose>
              <Link onClick={()=>{openBunyang(false)}}>
                <CloseImg src={CloseIcon}/>
              </Link>
            </ModalClose>
            <BunyangDetailPreview bunyangDetail={bunyangDetail} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} setBunyangDate={setBunyangDate} BunyangDate={BunyangDate}/>;
          </ModalContent> */}
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

const Container = styled.div`
  width:100%;
  @media ${(props) => props.theme.mobile} {
    display:none;
  }
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
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {display: none;}

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
