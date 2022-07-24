//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//img
import Check from "../../../../img/map/radio.png";
import Checked from "../../../../img/map/radio_chk.png";

//material
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

import { Mobile, PC } from "../../../../MediaQuery"

//redux
import { useSelector } from 'react-redux';

//server
import serverController from '../../../../server/serverController';

export default function ItemTabList({ value, setalramsetting, alramsetting }) {
  console.log('alrmasetting whatss:', alramsetting);
  const login_user = useSelector(data => data.login_user);
  console.log('lgoin_user sss:', login_user);
  const [menu2, setMenu2] = useState(false);
  const showModal2 = () => {
    setMenu2(!menu2);
  }

  const notiset_mrk_change = async (e) => {
    if (e.target.checked) {
      let body_info = {
        change_value: 1,
        target: 'notiset_mrk',
        mem_id: login_user.memid
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
        target: 'notiset_mrk',
        mem_id: login_user.memid
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
          {/* <Input type="checkbox" id="check1" checked={alramsetting['notiset_mrk']==1?true:false} onChange={notiset_mrk_change}/>
                  <Label for="check1">
                    <Span/>
                    마케팅 정보 수신에 대한 동의
                  </Label> */}
          <FormControlLabel
            label="마케팅 정보 수신에 대한 동의"
            control={<Checkbox checked={alramsetting['notiset_mrk'] == 1 ? true : false} onChange={notiset_mrk_change} />}
          />
          <p className="par-indent-left-2x capt-a1">KOREX가 제공하는 이벤트 및 혜택정보 등의 알림의 정보를 관계법령(「개인정보보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등)의 규정을 준수하여 모바일 앱푸시, 이메일, 문자를 통해 발송합니다.
            단, 광고성 정보 이외의 의무적으로 안내되어야 하는 정보는 수신동의 여부와 무관하게 제공됩니다.</p>
        </div>
    </>
  );
}