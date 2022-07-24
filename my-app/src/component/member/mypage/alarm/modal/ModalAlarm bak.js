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

//css
import Sstyled from "styled-components"

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

//serverprocess process
import serverController from '../../../../../server/serverController';

//redux
import {useSelector} from 'react-redux';

//지도 모달
export default function ModalAlarm({ item, setItem ,brokerRequest_productlist }) {

//material-ui
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


  const login_user= useSelector(data=>data.login_user);
  const bunyangTeam=useSelector(data=>data.bunyangTeam);
  const [alramsetting_tiny,setalramsetting_tiny] = useState({});
 

  const AlarmItem =[
  {
    ai_id : 0,
    condition1:"사용자 의뢰",
    condition2:"검토 대기",
    startdate:"2020.01.01",
    enddate:"2020.01.01",
    number:1234567889,
    title:"충남내포신도시2차대방엘리움더센트럴",
    kind:"아파트",
    itemname:"충남내포신도시2차대방엘리움더센트럴",
    trade:"매매",
    username:"홍길동",
    type:"request"
  },
  {
    ai_id : 1,
    condition1:"외부 수임",
    condition2:"검토 대기",
    startdate:"2020.01.01",
    enddate:"2020.01.01",
    number:1234567889,
    title:"충남내포신도시2차대방엘리움더센트럴",
    kind:"아파트",
    itemname:"충남내포신도시2차대방엘리움더센트럴",
    trade:"매매",
    username:"홍길동",
    type:"out"
  }
  ]
  
  useEffect(async()=>{
    let body_info ={
      mem_id:login_user.memid,
      user_type:login_user.user_type,
      company_id:login_user.company_id,
      bp_id:bunyangTeam.bunyangTeam.bp_id

    }
    let res=await serverController.connectFetchController('/api/alram/alramSetting_status','POST',JSON.stringify(body_info));

    if(res){
      console.log('resultss alramsettingss tinysss:',res);
      if(res.success){
        let result=res.result;
        if(result){
          setalramsetting_tiny(result);
        }
      }else{
        alert(res.message);
      }
    }
  },[]);

  const brokerprd_alramcheck_toggle_change= async(e) => {
    console.log('체크알림요소 prdidientityid값::',e.target.value);

    if(e.target.checked){
      let body_info = {
        mem_id:login_user.memid,
        action:'insert',
        prd_identity_id:e.target.value,
        company_id:login_user.company_id,//이게 가능한것은 개인기업뿐이고,개인에 대해서도 분기가 필요함.
        user_type:login_user.user_type
      }
      let res=await serverController.connectFetchController('/api/alram/alramSetting_process_brokerprdlist','POST',JSON.stringify(body_info));
      if(res){
        if(res.success){
          console.log('res resultsss:',res.result);
          setalramsetting_tiny(res.result);
        }else{
          alert(res.message);
        }
      }
    }else{
      let body_info = {
        mem_id:login_user.memid,
        action:'delete',
        prd_identity_id:e.target.value,
        company_id:login_user.company_id,
        user_type:login_user.user_type
      }
      let res=await serverController.connectFetchController('/api/alram/alramSetting_process_brokerprdlist','POST',JSON.stringify(body_info));
      if(res){
        if(res.success){
          console.log('res reusltsss:',res.result);
          setalramsetting_tiny(res.result);
        }else{
          alert(res.message);
        }
      }
    }
  }
  if(item == false)
    return null;
    return (
        <Container>

        <MUModal
          onClose={() => { setItem(false) }}
          open={item}

        >
          {/* 타이틀 */}
          <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { setItem(false) }}>
            <ModalItemTitle>알림설정 물건</ModalItemTitle>
          </BootstrapDialogTitle>

          {/* 컨탠츠 */}
          <MUDialogContent>
            {
              brokerRequest_productlist.map((value) => {
                let prditem = value.prd_id_history_child;
                let transactionitem = value.match_transaction_row;
                const type = () => {
                  if (prditem[0].prd_create_origin == "중개의뢰") {
                    return "#fe7a01"
                  } else if (prditem[0].prd_create_origin == "외부수임") {
                    return "#01684b"
                  }

                  if (transactionitem[0].txn_status == '의뢰철회' || transactionitem[0].txn_status == '의뢰거절' || transactionitem[0].txn_status == '위임취소' || transactionitem[0].txn_status == '수임취소') {
                    return '#707070';
                  }
                }
                return (
                  <AlarmList>
                    <Div>
                      <Top>
                        <Left>
                          <ItemImg src={prditem[0].prd_imgs ? prditem[0].prd_imgs.split(',')[0] : Item} />
                        </Left>
                        <Right>
                          <Condition>
                            <Orange color={type}>{prditem[0].prd_create_origin}</Orange> 상태 : <Condi>{transactionitem[0].txn_status}</Condi>
                          </Condition>
                          <TopBox>
                            <ColorGreen>전속</ColorGreen>
                            <WrapDate>
                              <StartDate>{'2020.01.01'}</StartDate>
                              <Line>~</Line>
                              <EndDate>{'2020.01.01'}</EndDate>
                            </WrapDate>
                          </TopBox>
                          <OnOff>
                            <AlarmCheck type="checkbox" value={prditem[0].prd_identity_id} checked={alramsetting_tiny['notiset_brokerprd_part'] && alramsetting_tiny['notiset_brokerprd_part'].indexOf(prditem[0].prd_identity_id) != -1 ? true : false} id={"alarm" + prditem[0].prd_identity_id} onChange={brokerprd_alramcheck_toggle_change} />
                            <Label for={"alarm" + prditem[0].prd_identity_id} />
                          </OnOff>
                        </Right>
                      </Top>
                      <Bottom>
                        <Number>{prditem[0].prd_identity_id}</Number>
                        <Title>{prditem[0].prd_name}</Title>
                        <WrapInfoBox>
                          <InfoBox>
                            <SubTitle>물건종류</SubTitle>
                            <Sub>{prditem[0].prd_type}</Sub>
                          </InfoBox>
                          <InfoBox>
                            <SubTitle>건물명</SubTitle>
                            <Sub>{prditem[0].prd_name}</Sub>
                          </InfoBox>
                          <InfoBox>
                            <SubTitle>거래유형</SubTitle>
                            <Sub>{prditem[0].prd_sel_type}</Sub>
                          </InfoBox>
                          <InfoBox>
                            <SubTitle>의뢰인명</SubTitle>
                            <Sub>{prditem[0].request_mem_name}</Sub>
                          </InfoBox>
                        </WrapInfoBox>
                      </Bottom>
                    </Div>
                  </AlarmList>
                )
              }
              )
            }
          </MUDialogContent>
        </MUModal>

          {/* <WrapModalItem>
            <ModalItemBg onClick={()=>{setItem(false)}}/>
            <ModalItem>
              <ItemCloseBtn>
                <Link onClick={()=>{setItem(false)}}>
                  <ItemCloseImg src={Close}/>
                </Link>
              </ItemCloseBtn>
              <ModalItemTitle>알림설정 물건</ModalItemTitle>
              <WrapAlarmList>
              {
                  brokerRequest_productlist.map((value) => {
                    let prditem=value.prd_id_history_child;
                    let transactionitem=value.match_transaction_row;
                    const type=()=>{
                      if(prditem[0].prd_create_origin == "중개의뢰") {
                        return "#fe7a01"
                      }else if(prditem[0].prd_create_origin == "외부수임") {
                        return "#01684b"
                      } 

                      if(transactionitem[0].txn_status == '의뢰철회' || transactionitem[0].txn_status=='의뢰거절' || transactionitem[0].txn_status=='위임취소' || transactionitem[0].txn_status=='수임취소'){
                        return '#707070';
                      }
                    }
                    return(
                      <AlarmList>
                        <Div>
                          <Top>
                            <Left>
                              <ItemImg src={prditem[0].prd_imgs?prditem[0].prd_imgs.split(',')[0]:Item}/>
                            </Left>
                            <Right>
                              <Condition>
                                <Orange color={type}>{prditem[0].prd_create_origin}</Orange> 상태 : <Condi>{transactionitem[0].txn_status}</Condi>
                              </Condition>
                              <TopBox>
                                <ColorGreen>전속</ColorGreen>
                                <WrapDate>
                                  <StartDate>{'2020.01.01'}</StartDate>
                                  <Line>~</Line>
                                  <EndDate>{'2020.01.01'}</EndDate>
                                </WrapDate>
                              </TopBox>
                              <OnOff>
                                <AlarmCheck type="checkbox" value={prditem[0].prd_identity_id} checked={alramsetting_tiny['notiset_brokerprd_part']&&alramsetting_tiny['notiset_brokerprd_part'].indexOf(prditem[0].prd_identity_id)!=-1?true:false} id={"alarm"+prditem[0].prd_identity_id} onChange={brokerprd_alramcheck_toggle_change}/>
                                <Label for={"alarm"+prditem[0].prd_identity_id}/>
                              </OnOff>
                            </Right>
                          </Top>
                          <Bottom>
                            <Number>{prditem[0].prd_identity_id}</Number>
                            <Title>{prditem[0].prd_name}</Title>
                            <WrapInfoBox>
                              <InfoBox>
                                <SubTitle>물건종류</SubTitle>
                                <Sub>{prditem[0].prd_type}</Sub>
                              </InfoBox>
                              <InfoBox>
                                <SubTitle>건물명</SubTitle>
                                <Sub>{prditem[0].prd_name}</Sub>
                              </InfoBox>
                              <InfoBox>
                                <SubTitle>거래유형</SubTitle>
                                <Sub>{prditem[0].prd_sel_type}</Sub>
                              </InfoBox>
                              <InfoBox>
                                <SubTitle>의뢰인명</SubTitle>
                                <Sub>{prditem[0].request_mem_name}</Sub>
                              </InfoBox>
                            </WrapInfoBox>
                          </Bottom>
                        </Div>
                      </AlarmList>
                    )
                  }
                )
              }
            </WrapAlarmList>
            </ModalItem>
          </WrapModalItem> */}



        </Container>
  );
}

//material-ui
const MUDialogContent = styled(DialogContent)`
  width: 100%;
  /* height: 65vh; */
`
const MUModal = styled(Dialog)`
&.MuiPaper-root{
  /* width : 490px; */
}
&.css-1t1j96h-MuiPaper-root-MuiDialog-paper{
  width : 490px;

}
`

const Pb = Sstyled.b`
  display:block;
  @media ${(props) => props.theme.modal} {
        display:inline;
    }
`
const Mb = Sstyled.b`
  display:inline;
  @media ${(props) => props.theme.modal} {
        display:block;
    }
`
const Container = Sstyled.div`
    width:100%;
`

const WrapModalItem = Sstyled.div`
  width:100%;
`
const ModalItemBg = Sstyled.div`
  width:100%;height:100%;
  position:fixed;left:0;top:0;
  background:rgba(0,0,0,0.2);
  display:block;content:'';
  z-index:3;
`
const ModalItem = Sstyled.div`
  position:fixed;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:535px;border-radius:24px;height:520px;
  border:1px solid #f2f2f2;
  background:#fff;
  padding:49px 50px 60px 50px;
  z-index:3;
  @media ${(props) => props.theme.modal} {
    width:90%;
    height:calc(100vw*(450/428));
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`
const ItemCloseBtn = Sstyled.div`
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const ItemCloseImg = Sstyled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(12/428));
  }
`
const ModalItemTitle = Sstyled.h3`
  font-size:20px;font-weight:800;color:#707070;
  transform:skew(-0.1deg);
  padding-bottom:20px;
  border-bottom:1px solid #707070;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    padding-bottom:calc(100vw*(15/428));
  }

`
const WrapAlarmList= Sstyled.div`
  width:100%;
  height:330px;overflow-y:scroll;
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(300/428));
  }
`
const AlarmList = Sstyled.div`
  width:100%;
`
const Div = Sstyled.div`
  width:100%;
  padding:25px 12px;
  border-bottom:1px solid #f2f2f2;
  @media ${(props) => props.theme.modal} {
    padding:calc(100vw*(25/428)) calc(100vw*(12/428));
  }

`
const Top = Sstyled.div`
position:relative;
  display:flex;justify-content:flex-start;align-items:center;
`
const Left = Sstyled.div`
  width:80px;height:80px;
  margin-right:18px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(80/428));
    height:calc(100vw*(80/428));
    margin-right:calc(100vw*(15/428));
  }
`
const ItemImg = Sstyled.img`
  width:100%;height:100%;
  border-radius:4px;
  object-fit:cover;
`
const Right = Sstyled.div`
`
const Condition = Sstyled.div`
  margin-bottom:7px;color:#707070;
  font-size:13px;font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(13/428));
    margin-bottom:calc(100vw*(7/428));
  }
`
const Orange = Sstyled.span`
  font-size:13px;font-weight:600;transform:skew(-0.1deg);
  color:${({color}) => color};
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(13/428));
  }
`
const Condi = Sstyled(Orange)`
  color:#979797;
`

const TopBox = Sstyled.div`
  display:flex;justify-content:center;align-items:center;
  width:170px;height:26px;border:1px solid #2b664d;
  line-height:24px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(170/428));
    height:calc(100vw*(26/428));
    line-height:calc(100vw*(24/428));
    }
`
const ColorGreen = Sstyled.span`
  font-size:11px;
  font-weight:600;transform:skew(-0.1deg);
  color:#01684b;
  display:inline-block;margin-right:3px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(11/428));
    margin-right:calc(100vw*(3/428));
    }
`
const WrapDate = Sstyled.div`
  display:flex;
  justify-content:flex-start;
  align-items:center;
`
const StartDate = Sstyled.p`
  font-size:11px;
  font-weight:600;transform:skew(-0.1deg);
  color:#707070;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(11/428));
    }
`
const Line = Sstyled(StartDate)`
`
const EndDate = Sstyled(StartDate)`
`
const OnOff = Sstyled.div`
  position:absolute;
  right:0;top:0;
  margin-bottom:6px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:0;
    margin-right:calc(100vw*(5/428));
  }
`
const AlarmCheck = Sstyled.input`
  display:none;
  &:checked + label{background:url(${BellActive}) no-repeat center center; background-size:20px 20px}
  @media ${(props) => props.theme.modal} {
    &:checked + label{background:url(${BellActive}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428))}
  }
`
const Label = Sstyled.label`
  display:inline-block;
  width:36px;height:36px;
  border-radius:5px;
  border:1px solid #969696;
  background:url(${Bell}) no-repeat center center; background-size:20px 20px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(31/428));
    height:calc(100vw*(31/428));
    background:url(${Bell}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428));
  }
`
const Bottom = Sstyled.div`
  width:100%;
  margin-top:15px;
  @media ${(props) => props.theme.modal} {
    margin-top:calc(100vw*(15/428));
    }
`
const Number = Sstyled.div`
  font-size: 12px;
  font-weight: normal;
  text-align: left;
  color: #979797;transform:skew(-0.1deg);
  margin-bottom:6px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vW*(6/428));
    }
`
const Title = Sstyled.div`
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  color: #4a4a4a;transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    }
`
const WrapInfoBox = Sstyled.div`
  margin-top:13px;
  @media ${(props) => props.theme.modal} {
    margin-top:calc(100vw*(13/428));
    }
`
const InfoBox = Sstyled.div`
  width:100%;
  display:flex;justify-content:space-between;align-items:flex-start;
  margin-bottom:6px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(6/428));
    }
`
const SubTitle = Sstyled.p`
  font-size: 15px;
  font-weight: 600;
  color: #4a4a4a;transform:skew(-0.1deg);
  width:100px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    width:calc(100vw*(100/428));
    }
`
const Sub = Sstyled(SubTitle)`
  color:#979797;
  width:460px;
  text-align:right;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(260/428));
    }

`