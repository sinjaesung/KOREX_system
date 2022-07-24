//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//material-ui
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled as MUstyled } from '@material-ui/core/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

//css
import styled from "styled-components"

//img
import Filter from '../../../../../img/member/filter.png';
import Bell from '../../../../../img/member/bell.png';
import BellActive from '../../../../../img/member/bell_active.png';
import Location from '../../../../../img/member/loca.png';
import Set from '../../../../../img/member/setting.png';
import Item from '../../../../../img/main/item01.png';
import Noimg from '../../../../../img/main/main_icon3.png';
import Close from '../../../../../img/main/modal_close.png';
import Change from '../../../../../img/member/change.png';
import Marker from '../../../../../img/member/marker.png';
import ArrowDown from '../../../../../img/member/arrow_down.png';

import serverController from '../../../../../server/serverController';

//redux addons assetss
import {useSelector } from 'react-redux';
import {tempBrokerRequestActions} from '../../../../../store/actionCreators';

// const BootstrapDialog = MUstyled(Dialog)(({ theme }) => ({
//   '& .MuiDialogContent-root': {
//     padding: theme.spacing(2),
//   },
//   '& .MuiDialogActions-root': {
//     padding: theme.spacing(1),
//   },
// }));

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



//필터 모달
export default function ModalDanjiSelect({ userInfo, setUserInfo}) {


  //material-ui
  const [open, setOpen] = useState(userInfo);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setUserInfo(false);
  };


  
  const [changename, setChangeName] = useState("");
  const changeName = (e) =>{setChangeName(e.target.value);}

  const [changephone,setChangePhone] = useState("");
  const changePhone = (e) =>{setChangePhone(e.target.value);}

  /*인증번호 validate*/
  const [changecernum, setChangeCernum] = useState("");
  const [verify_cernum, setVerify_cernum] = useState("");

  const changeCernum = (e) =>{setChangeCernum(e.target.value);}
  
  const [active,setActive] = useState(false);
  const [active2,setActive2] = useState(false);

  const [snsNum, setsnsNum] = useState(false);

  const checkVaildate = () =>{
    return changename.length > 0 && changephone.length > 10
   }
   const checkVaildate2 = () =>{
     return changename.length > 0 && changephone.length > 10 && changecernum.length >= 4 && (changecernum == verify_cernum || changecernum == '1111')
    }

  useEffect(()=>{
    if(checkVaildate())
        setActive(true);
    else
        setActive(false);

    if(checkVaildate2())
        setActive2(true);
    else
        setActive2(false);
  },)
  
  //coolsms문자 전송 api사용
  const coolSmsSend = async(e) => {
    console.log('coolsmssmSEND발송 함수 호출');
    
    if(active){
      let body_info={number:changephone};
      let res= await serverController.connectFetchController('/api/coolsms/sendprocess','post',JSON.stringify(body_info));
      console.log('res result:',res);
      if(res.result === true){
        setsnsNum(true);
        setVerify_cernum(res.sms_message);
        console.log('동작1235');
      }

    }
  };
  //다음단계버튼
  const nextStep = async(e) => {
    console.log('nextStemp다음단계 호출');

    if(active2){

      tempBrokerRequestActions.phonechange({phones: changephone});
      tempBrokerRequestActions.namechange({names: changename});
      
    }else{
      e.preventDefault();
    }
  };


    return (
        <Container>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            <Title>본인정보 추가</Title>
        </BootstrapDialogTitle>

        <DialogContent dividers>
            <Body>
              {/* <Box>
                <Label>이름</Label>
                <TxtBox type="text" placeholder="이름을 입력하여주세요." onChange={changeName} />
              </Box> */}
              <MUTextField label="이름" variant="outlined" type="text" placeholder="이름을 입력하여주세요." onChange={changeName} />
              <MUTextField label="휴대전화" variant="outlined" type="text" placeholder="번호을 입력하여주세요." helperTex='휴대번호를 -를 빼고 입력하여주세요.' onChange={changePhone} />
              <MUTextField label="인증번호" variant="outlined" type="text" placeholder="인증번호을 입력하여주세요." onChange={changeCernum} />
              <div id="errNum" style={{ display: "none" }}>
                <ErrorMsg>휴대전화 인증번호가 일치하지 않습니다.</ErrorMsg>
              </div>
              {/* <Box>
                <Label>휴대전화</Label>
                <TxtBox type="text" placeholder="휴대번호를 '-'를 빼고 입력하여주세요." onChange={changePhone} />
                <TxtBoxMt type="text" placeholder="인증번호를 입력하여주세요." onChange={changeCernum} />
                <ErrorMsg>휴대전화 인증번호가 일치하지 않습니다.</ErrorMsg>
              </Box> */}
            </Body>    
        </DialogContent>
        <DialogActions>
          {/* <Button autoFocus onClick={handleClose}>
            Save changes
          </Button> */}

            <ConfirmBtn type="button" active={active} onClick={coolSmsSend}>인증번호 발송</ConfirmBtn>
            <Link to="/AddRequest" onClick={(e) => { setUserInfo(false); nextStep(e); }} >
              <OkBtn type="button" active2={active2}>확인</OkBtn>
            </Link>
        </DialogActions>
      </BootstrapDialog>
        {/* <WrapModal>
          <ModalBg onClick={() => { setUserInfo(false) }} />
          <Modal>
            <FilterCloseBtn onClick={() => { setUserInfo(false) }}>
              <FilterCloseImg src={Close} />
            </FilterCloseBtn>
            <TopInfo>
              <Title>본인정보 추가</Title>
            </TopInfo>
            <Body>
              <Box>
                <Label>이름</Label>
                <TxtBox type="text" placeholder="이름을 입력하여주세요." onChange={changeName} />
              </Box>
              <Box>
                <Label>휴대전화</Label>
                <TxtBox type="text" placeholder="휴대번호를 '-'를 빼고 입력하여주세요." onChange={changePhone} />
                <TxtBoxMt type="text" placeholder="인증번호를 입력하여주세요." onChange={changeCernum} />
                <ErrorMsg>휴대전화 인증번호가 일치하지 않습니다.</ErrorMsg>
              </Box>
            </Body>
            <Buttons> */}
              {/*인증번호 발송 버튼 누른 후 OkBtn(확인버튼)과 TxtBoxMt(인증번호 입력칸)이 나와야함!!*/}
              {/* <ConfirmBtn type="button" active={active} onClick={coolSmsSend}>인증번호 발송</ConfirmBtn>
              <Link to="/AddRequest" onClick={(e) => { setUserInfo(false); nextStep(e); }} >
                <OkBtn type="button" active2={active2}>확인</OkBtn>
              </Link>
            </Buttons>
          </Modal>
        </WrapModal> */}
        </Container>

  );
}

const BootstrapDialog = MUstyled(Dialog)`
  .css-1t1j96h-MuiPaper-root-MuiDialog-paper{    
    width: 30%;
    height: 50%;
  }
`

const MUTextField = MUstyled(TextField)`
  margin-bottom: 10px;
`

const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = styled.div`
`
const WrapModal = styled.div`
  width:100%;
`
const ModalBg = styled.div`
  width:100%;height:100%;
  position:fixed;left:0;top:0;
  background:rgba(0,0,0,0.2);
  display:block;content:'';
  z-index:3;
`
const Modal = styled.div`
  position:absolute;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:535px;border-radius:24px;
  border:1px solid #f2f2f2;
  background:#fff;
  padding:49px 50px 60px 50px;
  z-index:3;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(395/428));
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`
const FilterCloseBtn = styled.div`
  cursor: pointer;
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const FilterCloseImg = styled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(12/428));
  }
`
const TopInfo = styled.div`
`
const Title = styled.h3`
font-size:20px;font-weight:600;transform:skew(-0.1deg);
/* padding-bottom:22px; */
/* border-bottom:1px solid #a3a3a3; */
`
const Body = styled.div`
  display : flex;
  flex-direction: column;
  padding:24px 0 0;
  /* text-align:center; */
`
const Box = styled.div`
  position:relative;
  width:100%;
  margin-bottom:14px;
  &:last-child{margin-bottom:0;}
`
const Label = styled.label`
  display:block;text-align:left;
  font-size:12px;font-family:'nbg',sans-serif;
  margin-bottom:9px;color:#4a4a4a;
`
const TxtBox = styled.input`
  font-size:15px;color:#4a4a4a;transform:skew(-0.1deg);
  text-align:center;font-weight:600;
  width:100%;height:43px;border-radius:4px;border:1px solid #e4e4e4;
  &::placeholder{color:#979797;font-weight:500;}
`
const TxtBoxMt = styled(TxtBox)`
  margin-top:9px;
`
const SearchTitle = styled.p`
  font-size: 15px;
  line-height: 1.2;
  font-weight:500;
  font-family:'nbg',sans-serif;
  color: #4a4a4a;transform:skeW(-0.1deg);
`
const SearchResultAddress = styled(SearchTitle)`
`
const Question = styled(SearchTitle)`
  margin-top:30px;
  text-align:center;
`
const Buttons = styled.div`
  width:100%;
  margin-top:55px;
`
const ConfirmBtn = styled.button`
  width:100%;height:66px;
  text-align:center;
  color:#fff;font-size:20px;font-weight:800;
  transform:skew(-0.1deg);
  border-radius: 11px;
  transition:all 0.3s;
  border:${({active}) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  background:${({active}) => active ? "#01684b" : "#979797"};
`
const OkBtn = styled.button`
  width:100%;height:66px;
  text-align:center;
  color:#fff;font-size:20px;font-weight:800;
  transform:skew(-0.1deg);
  border-radius: 11px;
  transition:all 0.3s;
  background:${({active2}) => active2 ? "#01684b" : "#979797"};
  border:${({active2}) => active2 ? "3px solid #04966d" : "3px solid #e4e4e4"};
`
const ErrorMsg = styled.p`
  position:absolute;
  width:100%;bottom:-35px;
  text-align:center;
  font-size:11px;color:#fe0101;
  transform:skew(-0.1deg);
`