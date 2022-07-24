//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';



//component
import ListItemCont_Maemul_T1 from '../../../../common/broker/listItemCont_Maemul_T1';


//img
import Item from '../../../../../img/main/item01.png';
import Check from '../../../../../img/map/radio.png';
import Checked from '../../../../../img/map/radio_chk.png';

//지도 모달

//server process
import serverController from '../../../../../server/serverController';

import { useSelector } from 'react-redux';

export default function ModalSelect({ setTridchklist, setPrdidvalue, setReservationItemlist, select, setSelect, offModal }) {
  const login_userinfo = useSelector(data => data.login_user);
  const [propertylist, setPropertylist] = useState([]);

  const PropertyListItem = [
    {
      p_id: 0,
      img: Item,
      date: "21.00.00 - 21.00.00",
      conditiontype: "사용자 의뢰",
      condition: "거래 개시",
      startdate: "2021.00.00",
      enddate: "2021.00.00",
      number: "2D0000324",
      title: "충남내포신도시2차대방엘리움더센트럴",
      kinds: "아파트",
      itemname: "충남내포신도시2차대방엘리움더센트럴 7층 707호",
      trade: "매매",
      username: "홍길동",
      price: "1억 5,000",
      person: "3"
    },
    {
      p_id: 1,
      img: Item,
      date: "21.00.00 - 21.00.00",
      conditiontype: "외부 수임",
      condition: "거래 개시",
      startdate: "2021.00.00",
      enddate: "2021.00.00",
      number: "2D0000324",
      title: "충남내포신도시2차대방엘리움더센트럴",
      kinds: "아파트",
      itemname: "충남내포신도시2차대방엘리움더센트럴 7층 707호",
      trade: "매매",
      username: "홍길동",
      price: "1억 5,000",
      person: "3"
    }
  ]

  //로드 시점 한번만 실행, 어떤 변화state감지하지 않겠다. 변화에 반응하지 않겠다.
  useEffect(async () => {
    if (login_userinfo.is_login) {
      let body_info = {
        memid: login_userinfo.memid,
        company_id: login_userinfo.company_id,
        user_type: login_userinfo.user_type,
        isexculsive: login_userinfo.isexculsive
      };
      console.log('JSONBDOY INFO TEST:', JSON.stringify(body_info));

      let res = await serverController.connectFetchController('/api/broker/brokerproduct_list_view2', 'POST', JSON.stringify(body_info));

      if (res) {
        console.log('-=>>>>>>res result:', res);

        setPropertylist(res.result_data);
      }
    }
  }, []);

  return (
    <>
      <MUFormControl component="fieldset">
        <RadioGroup
          aria-label="maemul"
          defaultValue=""
          name="radio-buttons-group"
        >
          <MUFormControlLabel value="전체" control={<Radio />} label="전체 검색" />
          {
            propertylist.map((value) => {
              var broker_name;
              var product_info = value['info'][0];
              //console.log('productinfoi:',product_info,product_info['request_man_name']);

              broker_name = product_info['request_man_name'];

              const type = () => {
                if (product_info.product_create_origin == "중개의뢰" || product_info['product_create_origin'] == 1) { //검토대기

                  return "#fe7a01"
                } else if (product_info.product_create_origin == "외부수임" || product_info['product_create_origin'] == 2) {//거래준비
                  return "#01684b"
                }
              }

              return (
                <MUFormControlLabel value={value.prd_identity_id} control={<Radio />}
                  label={
                    <div className="flexGlow-1">
                      <Sect_R1 className="flex-spabetween-center">
                        <div>
                          <p className="capt-00">{value.number} PRD{value.prd_identity_id}</p>
                        </div>
                      </Sect_R1>
                      <ListItemCont_Maemul_T1 mode={'PropertyList'} item={value} active={true} />
                    </div>
                  }
                />
              )
            })
          }
        </RadioGroup>
      </MUFormControl>
    </>
  );
}


const MUFormGroup = styled(FormGroup)`
  border-bottom:1px solid #e4e4e4;
`

const MUListItem = styled(ListItem)`
& .MuiListItemSecondaryAction-root{
  top: 2rem;
  right: 1rem;
  //transform: translateY(-50%);
}

&.MuiListItem-root>.MuiListItemButton-root {
  position: relative;
  padding-right: 16px;
}
`
const MUListItemButton = styled(ListItemButton)``
const MUListItemTxt = styled(ListItemText)``

const MUFormControl = styled(FormControl)`
&.MuiFormControl-root {
  width: 100%;
}
`
const MUFormControlLabel = styled(FormControlLabel)`
&.MuiFormControlLabel-root .MuiFormControlLabel-label {
  width: 100%;
}
`
const Sect_R1 = styled.div``
const Sect_R2 = styled.div``
