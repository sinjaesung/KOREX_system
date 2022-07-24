//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

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
import { BunyangTeam } from '../../../store/actionCreators';

// import localStringData from '../../../const/localStringData';
import localStringData from '../../../const/localStringData';

//server
import serverController from '../../../server/serverController';

export default function MyBunyangTeam({ sosokList }) {

  const login_user = useSelector(data => data.login_user);

  //let history = useHistory();

  const onClickTeam = (value) => {
    console.log('bunyangTmea.updatebunyangteamsssss:[분양팀선택]]', value);
    BunyangTeam.updateBunyangTeam({ bunyangTeam: value });
    //history.goBack();
  }

 
  // !!@@ 211103_이형규> 하자--- MyTeam.js와 통합하여, 단일컴포넌트화 할 것.
  return (
    <>
      <Wrapper>
        <Sect_R2>
          {
            sosokList && sosokList.length >= 1 ?
              <ul>
                {
                  sosokList.map((value) => {
                    return (
                      <ListItem_SelectSosok user={login_user} value={value} onClickTeam={onClickTeam} />
                    )
                  })
                }
              </ul>
              :
              <p>선택 가능한 소속이 없습니다. 문의 '02-514-4114'</p>
          }
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