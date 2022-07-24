//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

//css
import styled from "styled-components"

//img
import Filter from '../../../../../img/member/filter.png';
import Bell from '../../../../../img/member/bell.png';
import BellActive from '../../../../../img/member/bell_active.png';
import Location from '../../../../../img/member/loca.png';
import Set from '../../../../../img/member/setting.png';
import open from '../../../../../img/main/item01.png';
import Noimg from '../../../../../img/main/main_icon3.png';
import Close from '../../../../../img/main/modal_close.png';
import Change from '../../../../../img/member/change.png';
import Marker from '../../../../../img/member/marker.png';
import ArrowDown from '../../../../../img/member/arrow_down.png';


//component
import BootstrapDialogTitle from '../../../../common/modal/bootstrapDialogTitle';
import RequestList from '../../request/RequestList';

//serverprocess process
import serverController from '../../../../../server/serverController';

//redux
import { useSelector } from 'react-redux';

//지도 모달
export default function ModalAlarm({ open, setOpen, brokerproductlist }) {

  //material-ui
  // const BootstrapDialogTitle = (props) => {
  //   const { children, onClose, ...other } = props;

  //   return (
  //     <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
  //       {children}
  //       {onClose ? (
  //         <IconButton
  //           aria-label="close"
  //           onClick={onClose}
  //           sx={{
  //             position: 'absolute',
  //             right: 8,
  //             top: 8,
  //             color: (theme) => theme.palette.grey[500],
  //           }}
  //         >
  //           <CloseIcon />
  //         </IconButton>
  //       ) : null}
  //     </DialogTitle>
  //   );
  // };


  const login_user = useSelector(data => data.login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);
  const [alramsetting_tiny, setalramsetting_tiny] = useState({});


  const AlarmItem = [
    {
      ai_id: 0,
      condition1: "사용자 의뢰",
      condition2: "검토 대기",
      startdate: "2020.01.01",
      enddate: "2020.01.01",
      number: 1234567889,
      title: "충남내포신도시2차대방엘리움더센트럴",
      kind: "아파트",
      itemname: "충남내포신도시2차대방엘리움더센트럴",
      trade: "매매",
      username: "홍길동",
      type: "request"
    },
    {
      ai_id: 1,
      condition1: "외부 수임",
      condition2: "검토 대기",
      startdate: "2020.01.01",
      enddate: "2020.01.01",
      number: 1234567889,
      title: "충남내포신도시2차대방엘리움더센트럴",
      kind: "아파트",
      itemname: "충남내포신도시2차대방엘리움더센트럴",
      trade: "매매",
      username: "홍길동",
      type: "out"
    }
  ]

  useEffect(async () => {
    let body_info = {
      mem_id: login_user.memid,
      user_type: login_user.user_type,
      company_id: login_user.company_id,
      bp_id: bunyangTeam.bunyangTeam.bp_id

    }
    let res = await serverController.connectFetchController('/api/alram/alramSetting_status', 'POST', JSON.stringify(body_info));

    if (res) {
      console.log('resultss alramsettingss tinysss:', res);
      if (res.success) {
        let result = res.result;
        if (result) {
          setalramsetting_tiny(result);
        }
      } else {
        alert(res.message);
      }
    }
  }, []);

  const brokerprd_alramcheck_toggle_change = async (e) => {
    console.log('체크알림요소 prdidientityid값::', e.target.value);

    if (e.target.checked) {
      let body_info = {
        mem_id: login_user.memid,
        action: 'insert',
        prd_identity_id: e.target.value,
        company_id: login_user.company_id,//이게 가능한것은 개인기업뿐이고,개인에 대해서도 분기가 필요함.
        user_type: login_user.user_type
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_brokerprdlist', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res resultsss:', res.result);
          setalramsetting_tiny(res.result);
        } else {
          alert(res.message);
        }
      }
    } else {
      let body_info = {
        mem_id: login_user.memid,
        action: 'delete',
        prd_identity_id: e.target.value,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_brokerprdlist', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res reusltsss:', res.result);
          setalramsetting_tiny(res.result);
        } else {
          alert(res.message);
        }
      }
    }
  }
  if (open == false)
    return null;
  return (
    <>
      <Dialog className="muDlog-postApi"
        // onClose={() =>{ setAddressApi(false); setisofficetel(0);}}
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { setOpen(false) }}>
          알림 설정
        </BootstrapDialogTitle>
        <DialogContent>
          {
            brokerproductlist.map((value) => {
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
                <>
                  <div className="par-spacing-after">
                    <ul className="scroll-y">
                      {
                        brokerproductlist.length > 0 ?
                          brokerproductlist.map((value) => {

                            let local_item = value['prd_id_history_child'][0];//prdidienitiyid요소의 자식들중 히스토리내역중 가장 최근것 0번 가장 초기origin요소(x,y포함한 모든 최근 수정정보까지 매물정보) 그 이후의 내역들은 사실상 상태변경의 내역들만 저장하고있을뿐이다.
                            let match_transaction_item = value['match_transaction_row'][0];//그 각 그룹prdiientityi별 하나별의 최근 transaciton내역한개를 정보저장.
                            const type = () => {
                              if (match_transaction_item.prd_status == '대기' || match_transaction_item.prd_status == '검토대기') {
                                return 1
                              } else if (match_transaction_item.prd_status == '거래준비') {
                                return 1
                              } else if (match_transaction_item.prd_status == '의뢰철회') {
                                return 0.5
                              } else if (match_transaction_item.prd_status == '위임취소') {
                                return 0.5
                              }
                            }

                            return (
                              <RequestList type={type} value={local_item} match_transaction_item={match_transaction_item} alramsetting_tiny={alramsetting_tiny} setalramsetting_tiny={setalramsetting_tiny} />
                            )

                          })
                          : null
                      }

                    </ul>
                  </div>
                </>
              )
            }
            )
          }
        </DialogContent>
      </Dialog>
    </>
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