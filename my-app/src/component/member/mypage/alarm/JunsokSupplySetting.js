//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//img
import Check from "../../../../img/map/radio.png";
import Checked from "../../../../img/map/radio_chk.png";
import Arrow from "../../../../img/member/arrow_right.png";

//material
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@mui/material/Chip';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';


//component
import { Mobile, PC } from "../../../../MediaQuery"
import ModalAlarmProbroker from "./modal/ModalAlramProbroker";

//server
import serverController from '../../../../server/serverController';

//redux
import { useSelector } from 'react-redux';

export default function ItemTabList({ value, setalramsetting, alramsetting }) {
  const login_user = useSelector(data => data.login_user);
  console.log('alram settig resultss:', alramsetting);

  const [menu2, setMenu2] = useState(false);
  const showModal2 = () => {
    setMenu2(!menu2);
  }
  const [open, setOpen] = useState(false);

  // const [filterItem, setfilterItem] = useState({ company_id: login_user.company_id });

  const [brokerRequest_productlist, setBrokerRequest_productlist] = useState([]);//전문중개사 전용 전속매물공급 알림설정페이지인데, 전문중개사회원 기업체에서 수임하고있는 매물리스트조회
  useEffect(async () => {
    console.log('전속매물공급 알람셋팅 부속 페이지 실행>>>>>>>>>>>>>>>>>>>>', serverController);

    let send_info = {
      login_memid: login_user.memid,
      company_id: login_user.company_id
    };
    // let res_resultss = await serverController.connectFetchController('/api/broker/BrokerRequest_productlist', 'POST', JSON.stringify(send_info));

    const filterItem = {
      default: { company_id: login_user.company_id }
    }
    
    let res_resultss2 = await serverController.connectFetchController(`/api/products?prd_field_all=1&filter=${JSON.stringify({ filterItem })}`, 'GET');
    // console.log('res reusltss:', res_resultss2);
    console.log('확인하기1235!!:', res_resultss2);
    // console.log('확인하기1235!!:', res_resultss2);



    if (res_resultss2) {
      if (res_resultss2.success) {
        if (res_resultss2.data) {
          setBrokerRequest_productlist(res_resultss2.data);
        }
      }
    }
  }, []);

  useEffect(() => {
    console.log('모달확인2', brokerRequest_productlist);
  }, [brokerRequest_productlist])

  const notiset_prd_change = async (e) => {
    if (e.target.checked) {
      let body_info = {
        change_value: 1,
        target: 'notiset_prd',
        mem_id: login_user.memid,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      };
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res resultss:', res);

          setalramsetting(res.result);
        } else {
          alert(res.message);
        }
      }
    } else {
      let body_info = {
        change_value: 0,
        target: 'notiset_prd',
        mem_id: login_user.memid,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      };
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res resultss:', res);

          setalramsetting(res.result);
        } else {
          alert(res.message);
        }
      }
    }
  }
  const notiset_rsv_prd_manage_change = async (e) => {
    if (e.target.checked) {
      let body_info = {
        change_value: 1,
        target: 'notiset_rsv_prd_manage',
        mem_id: login_user.memid,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      };
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res resultss:', res);

          setalramsetting(res.result);
        } else {
          alert(res.message);
        }
      }
    } else {
      let body_info = {
        change_value: 0,
        target: 'notiset_rsv_prd_manage',
        mem_id: login_user.memid,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      };
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res resultss:', res);

          setalramsetting(res.result);
        } else {
          alert(res.message);
        }
      }
    }
  }

  const notiset_rsv_change = async (e) => {
    if (e.target.checked) {
      let body_info = {
        change_value: 1,
        target: 'notiset_rsv',
        mem_id: login_user.memid,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      };
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res resultsss:', res);

          setalramsetting(res.result);
        } else {
          alert(res.message);
        }
      }
    } else {
      let body_info = {
        change_value: 0,
        target: 'notiset_rsv',
        mem_id: login_user.memid,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      };
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res reusltsss:', res);

          setalramsetting(res.result);
        } else {
          alert(res.message);
        }
      }
    }
  }
  return (
    <>
      <div className="par-spacing mb-1">
        {/* <Input type="checkbox" id="check1" checked={alramsetting['notiset_rsv'] == 1 ? true : false} onChange={notiset_rsv_change} />
        <Label for="check1">
          <Span />
          예약된 알림 요약
        </Label> */}
        <FormControlLabel
          label="예약된 알림 요약"
          control={<Checkbox checked={alramsetting['notiset_rsv'] == 1 ? true : false} onChange={notiset_rsv_change} />}
        />
        <p className="par-indent-left-2x capt-a1">
          모든 알림을 7:00 오후에 일일 요약 알림으로 받습니다. 전송 시간을 맞춤설정하려면 탭하세요.
        </p>
      </div>
      <div className="par-spacing mb-1">
        {/* <Input type="checkbox" id="check2" checked={alramsetting['notiset_prd'] == 1 ? true : false} onChange={notiset_prd_change} />
        <Label for="check2">
          <Span />
          물건관리(상태)
        </Label> */}
        <FormControlLabel
          label="물건관리(상태)"
          control={<Checkbox checked={alramsetting['notiset_prd'] == 1 ? true : false} onChange={notiset_prd_change} />}
        />
        <p className="par-indent-left-2x capt-a1">
          알림수신: 상태 변경시
        </p>
      </div>
      <div className="par-spacing mb-1">
        {/* <Input type="checkbox" id="check3" checked={alramsetting['notiset_rsv_prd_manage'] == 1 ? true : false} onChange={notiset_rsv_prd_manage_change} />
        <Label for="check3">
          <Span />
          물건관리(투어예약)
        </Label> */}
        <FormControlLabel
          label="물건관리(투어예약)"
          control={<Checkbox checked={alramsetting['notiset_rsv_prd_manage'] == 1 ? true : false} onChange={notiset_rsv_prd_manage_change} />}
        />
        <p className="par-indent-left-2x capt-a1">
          알림수신: 예약 접수,수정,취소시
        </p>
      </div>
      {/* <ItemSetting onClick={() => { setOpen(true) }}>
        <Txt>물건별 관리</Txt>
        <p className="par-indent-left-2x capt-a1">
          각 물건별 알림을 별도 설정할 수 있습니다.
        </p>
        <ArrowImg src={Arrow} />
      </ItemSetting> */}
      <MUListItem disablePadding>
        <MUListItemButton onClick={() => { setOpen(true) }}>
          <MUListItemText>
            <SubdirectoryArrowRightIcon className="vAlign-b"/>
            <span className="vAlign-b mr-1 muCheckbox-label">물건별 설정</span>
            <span className="capt-a1 vAlign-b">
              각 물건별 알림 별도 설정
            </span>
          </MUListItemText>

          <ChevronRightIcon />
        </MUListItemButton>
      </MUListItem>
      {
        open ?
          <ModalAlarmProbroker open={open} setOpen={setOpen} brokerproductlist={brokerRequest_productlist} />
          :
          null
      }
    </>
  );
}


const MUListItem = styled(ListItem)`
  flex-wrap:wrap;
`
const MUListItemButton = styled(ListItemButton)`
  width: 100%;
`
const MUListItemText = styled(ListItemText)`
  transform:skew(-0.1deg);
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
    width:680px;
    margin:0 auto;
    @media ${(props) => props.theme.mobile} {
      width:100%;
      margin:calc(100vW*(80/428)) auto;
      }
`
const TabContent = styled.div`
  position:relative;
  width:100%;
  padding:30px 0;margin-top:17px;
  margin:0 auto 17px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding:0 calc(100vw*(27/428)) calc(100vw*(23/428));
    margin:calc(100vw*(23/428)) auto;
    }
`
const WrapCheckBox = styled.div`
  width:550px;
  padding-left:30px;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding-left:calc(100vw*(30/428));
    }
`
const Old_Checkbox = styled.div`
  width:100%;
  margin-bottom:40px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    margin-bottom:calc(100vw*(50/428));
    }
`
const ItemSetting = styled(Old_Checkbox)`
  cursor:pointer;
  position:relative;
`
const Txt = styled.span`
  font-size:15px;
  color:#4a4a4a;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    } 
`
const ArrowImg = styled.img`
  display:inline-block;width:8px;
  position:absolute;right:0;
  top:50%;transform:translateY(-50%);
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(8/428));
    }
`

const Input = styled.input`
  display:none;
  &:checked+label span{ background:url(${Checked}) no-repeat; background-size:100% 100%;}
`
const Label = styled.label`
  display:inline-block;
  font-size:15px;color:#4a4a4a;
  font-weight:500;transform:skeW(-0.1deg);
  font-family:'nbg',sans-serif;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    }
`
const Span = styled.span`
  display:inline-block;
  width:20px;height:20px;
  background:url(${Check}) no-repeat; background-size:100% 100%;
  vertical-align:middle;
  margin-right:10px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    height:calc(100vW*(20/428));
    margin-right:calc(100vw*(10/428));
    }
`
const Desc = styled.div`
  padding-left:30px;
  font-size: 15px;
  margin-top:15px;transform:skew(-0.1deg);
  line-height: 1.33;
  text-align: left;
  color: #979797;
  @media ${(props) => props.theme.mobile} {
    padding-left:calc(100vw*(30/428));
    font-size:calc(100vW*(13/428));
    margin-top:calc(100vw*(15/428));
    }
`
