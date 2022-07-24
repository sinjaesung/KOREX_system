//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//material-ui
import { styled } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

//style
import Sstyled from "styled-components"

//img
import CalIcon from "../../img/main/icon_cal.png";
// import CloseIcon from "../../img/main/modal_close.png";


//server
import serverController from '../../server/serverController';


export default function TermsOfService({ termservice, openTermService}) {

  const [terms, setTerms] = useState([]);
  const [termsList, setTermsList] = useState([]);

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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
      </DialogTitle>
    );
  };



  useEffect(async () => {
    let termsTemp = await serverController.connectFetchController('/api/terms?terms_type=0','GET');
    setTermsList(termsTemp.data);
    setTerms(termsTemp.data[0]);
  }, [])

 const getTermsDetail = async (id) =>{
    let termsTemp = await serverController.connectFetchController(`/api/term?terms_type=0&terms_id=${id}`,'GET');
    setTerms(termsTemp.data[0]);
  }

//모달창
  if(termservice == false)
    return null;
    return (
      <Container>
        {/* <ModalBg onClick={()=>{openTermService(false)}}>xcxc</ModalBg> */}

{/*         
        <ModalContent>
          <ModalClose>
            <Link onClick={()=>{openTermService(false)}}>
              <CloseImg src={CloseIcon}/>
            </Link>
          </ModalClose>
          <ModalTop>
            <Title>이용약관</Title>
            <select className="term1">
              <option value="" disabled selected>이전 서비스 이용약관 보기</option>
              <option value="1">2020년 1월 2일</option>
              <option value="2">2020년 3월 2일</option>
            </select> */}

          {/*
            <PrevTerms>
              <Txt>이전 서비스 이용약관 보기</Txt>
              <CalImg src={CalIcon}/>
            </PrevTerms>
            */}

{/* 
          </ModalTop>
          <TextArea>
            {
              selectTerms.terms_detail
            }
          </TextArea>
        </ModalContent> */}
        <MUModal
          onClose={() => { openTermService(false) }}
          open={termservice}
          maxWidth={'md'}
          fullWidth={true}
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { openTermService(false) }}>
            서비스 이용약관
            &nbsp;&nbsp;
            <select className="term1" onChange={(e)=>{getTermsDetail(e.target.value)}}>
              <option value="0" disabled selected >이전 서비스 이용약관 보기</option>
              {
                termsList.map((value)=>{
                  return <option value={value.terms_id}>{value.terms_title}</option>;
                })
              }
              
            </select>
          </BootstrapDialogTitle>


          <MUDialogContent dividers>
            <Typography gutterBottom>
              {
                terms.terms_detail
              }
            </Typography>
          </MUDialogContent>

        </MUModal>
      </Container>
    );
}

const MUDialogContent = styled(DialogContent)`
  width: 100%;
  height: 65vh;
`
const MUModal = styled(Dialog)`

`

const Container = Sstyled.div`
  width:100%;

`

const ModalBg = Sstyled.div`
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 90;
  background:rgba(0,0,0,0.05);

`
const ModalContent = Sstyled.div`
  position:fixed;
  width:1146px;
  height:752px;
  background:#fff;
  left:50%;top:50%;transform:translate(-50%,-50%);
  border-radius:24px;
  padding: 26.1px 46.7px 65.8px 95.8px;
  overflow-y:scroll;
  z-index:100;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
}
  @media ${(props) => props.theme.mobile} {
      width:90%;
      height:calc(100vw*(500/428));
      padding:0 calc(100vw*(20/428)) calc(100vw*(20/428));
    }

`
const ModalClose = Sstyled.div`
  position:absolute;
  right:24px;top:24px;
  @media ${(props) => props.theme.mobile} {
      right:calc(100vw*(24/428));
      top:calc(100vw*(24/428));
    }

`
const CloseImg = Sstyled.img`
  width:17px;
  height:18px;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(12/428));
      height:calc(100vw*(13/428));
    }
`
const ModalTop = Sstyled.div`
  width:100%;
  display:flex;
  justify-content:flex-start;
  align-items:center;
  margin-top:22px;
  border-bottom:solid 1px #a3a3a3;
  padding-bottom:14px;
  @media ${(props) => props.theme.mobile} {
      justify-content:space-between;
      width:100%;
      margin-top:calc(100vw*(60/428));
      padding-bottom:calc(100vw*(14/428));
    }
`
const Title = Sstyled.h1`
  font-size:20px;
  color:#707070;
  margin-right:36px;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(13/428));
      margin-right:0;
    }
`
const TextArea = Sstyled.div`
  width:100%;
  height:90%;
  overflow-y:scroll;
  font-size:13px;
  color:#555;
  transform:skew(-0.1deg);
    padding:10px;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(13/428));
      padding:calc(100vw*(10/428));
      margin-right:0;
    }
`