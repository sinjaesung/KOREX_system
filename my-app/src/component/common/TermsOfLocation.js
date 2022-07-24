//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//style
import Sstyled from "styled-components"

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


//img
import CalIcon from "../../img/main/icon_cal.png";
// import CloseIcon from "../../img/main/modal_close.png";


//server
import serverController from '../../server/serverController';


export default function ModalTest3({ termlocation, openTermLocation }) {
  const [terms_content,setTerms_content] = useState([]);
  const [selectTerms,setSelectTerms] = useState({});

  const [terms, setTerms] = useState([]);
  const [termsList, setTermsList] = useState([]);

  useEffect(async() => {
    let body_info={
      type : 1,
      request_data:'terms'
    }
    let res= await serverController.connectFetchController(`/api/commondata/request`,"POST",JSON.stringify(body_info),function(){},function(test){console.log(test)});
    console.log('res results:',res);
    //alert(res);
    if(res){
      if(res.success){
        setTerms_content(res.result);
        setSelectTerms(res.result[0]);//기본값은 서버에서가져온 가장 최근 날짜로 해서 등록지정해놓은 최근 약관값.
      }
    }
    
  },[]);
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
    let termsTemp = await serverController.connectFetchController('/api/terms?terms_type=2','GET');
    setTermsList(termsTemp.data);
    setTerms(termsTemp.data[0]);
  }, [])

 const getTermsDetail = async (id) =>{
    let termsTemp = await serverController.connectFetchController(`/api/term?terms_type=2&terms_id=${id}`,'GET');
    setTerms(termsTemp.data[0]);
  }

//모달창
  if(termlocation == false)
    return null;
    return (
      <Container>
        <Dialog
          onClose={() => { openTermLocation(false) }}
          open={termlocation}
          maxWidth={'md'}
          fullWidth={true}
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { openTermLocation(false) }}>
            위치기반 서비스 이용 약관
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

        </Dialog>
        {/* <ModalBg onClick={()=>{openTermLocation(false)}}></ModalBg>
        <ModalContent>
          <ModalClose>
            <Link onClick={()=>{openTermLocation(false)}}>
              <CloseImg src={CloseIcon}/>
            </Link>
          </ModalClose>
          <ModalTop>
            <Title>위치기반 서비스 이용약관</Title>
            <select className="term1">
              <option value="" disabled selected>이전 위치기반 서비스 약관 보기</option>
              <option value="1">2020년 1월 2일</option>
              <option value="2">2020년 3월 2일</option>
            </select> */}
          {/*
            <PrevTerms>
              <Txt>이전 서비스 이용약관 보기</Txt>
              <CalImg src={CalIcon}/>
            </PrevTerms>
            */}
          {/* </ModalTop>
          <TextArea>
            {
              selectTerms.terms_detail
            }
          </TextArea>
        </ModalContent> */}

      </Container>
    );
}

const Container = Sstyled.div`
  width:100%;
`
const MUDialogContent = styled(DialogContent)`
  width: 100%;
  height: 65vh;
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
  @media ${(props) => props.theme.tablet} {
      width:90%;
      height:calc(100vw*(500/1700));
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