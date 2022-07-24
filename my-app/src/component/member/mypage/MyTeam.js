//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//material-ui
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

//css
import styled from "styled-components"
import Item from '../../../img/member/item.png';
import NoImg from '../../../img/member/company_no.png';
import RightArrow from '../../../img/notice/right_arrow.png';

//component
import ListItem_SelectSosok from './listItem_SelectSosok';
import { TtCon_Frame_B, TtCon_1col } from '../../../theme';

//react redux
import { useSelector } from 'react-redux';
import { Login_userActions } from '../../../store/actionCreators';

//server
import serverController from '../../../server/serverController';

export default function MyTeam({ sosokList }) {

  const login_user = useSelector(data => data.login_user);
  //분양사회원인 경우 로그인한 회원memid에게 부여된 분양프로젝트들리스트가 띄워진다. 중개사나 기업인경우는 그냥 소속id ocmpanyname하나가 뜨면된다.

  const onClickTeam = async (value) => {
    // 클릭 id
    // console.log(value.Team_id);
    console.log('클릭 teamid및 소속업체명:', value.company_name, value.company_id);

    Login_userActions.companynamechange({ company_name: value.company_name });
    //소속change시에 소속회사명 / 소속정보 등 쿼리한다.
    Login_userActions.companyidchange({ companyids: value.company_id });
    let body_info = {
      //로그인한 memid에 대한 uupdate쿼리진행.
      mem_id: login_user.memid,
      change_sosok_companyid: value.company_id//선택한 companyid소속id업체에 대해서 udpate처리진행.  
    }
    let res = await serverController.connectFetchController('/api/mypage/sosok_change_process', 'POST', JSON.stringify(body_info));
    if (res) {
      if (res.success) {
        console.log('소속 변경 관련 처리결과::', res);
      }
    }
  }


  return (
    <>
      <Wrapper>
        <Sect_R2>
          <ul>
            {
              sosokList && sosokList.map((value) => {
                return (
                  <ListItem_SelectSosok user={login_user} value={value} onClickTeam={onClickTeam} />
                )
              })
            }
          </ul>
        </Sect_R2>
      </Wrapper>
    </>
  );
}


const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Sect_R2 = styled.div`
  ${TtCon_1col}
`