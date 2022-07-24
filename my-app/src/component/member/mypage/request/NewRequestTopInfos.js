//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"

//redux
import { useSelector } from 'react-redux';

//server
import serverController from '../../../../server/serverController';

//material-ui
import Chip from '@material-ui/core/Chip';
import Stack from '@material-ui/core/Stack';

//theme
import { TtCon_Title, } from '../../../../theme';

export default function RequestTop() {
  const login_user = useSelector(data => data.login_user);
  const [probrokerinfo, setprobrokerinfo] = useState({});

  useEffect(async () => {
    console.log('로드시점떄 실행>>>>>>>', login_user.company_id);
    if (login_user.user_type == '중개사' && login_user.ispro == 1) {

      //로드시점 companyid get
      let res = await serverController.connectFetchController(`/api/realtors/${login_user.company_id}/pro/category`, 'GET');

      if (res) {
        console.log('res reusltss:', res);

        setprobrokerinfo(res.data);
      }
    }
  }, []);


  //각 전문중개사별 전문종목!!!
  return (
    <>
      {/* <Title>전문 종목</Title> */}
      <MUStack direction="row" spacing={1}>
        {/* 아파트 / 오피스텔 선택했을 경우 */}
        {
          probrokerinfo && probrokerinfo.pro_apt_id ?
            //<Ea>- 아파트 : {probrokerinfo.apt_name} {probrokerinfo.apply_apt_addr}({probrokerinfo.pro_apt_id})</Ea>
            <MUChip label={`아파트 : ${probrokerinfo.apt_name}(${probrokerinfo.apt_jibun})`} />
            :
            null
        }
        {
          probrokerinfo && probrokerinfo.pro_oft_id ?
            //<Ea>- 오피스텔 : {probrokerinfo.oft_name} {probrokerinfo.apply_op_addr}({probrokerinfo.pro_oft_id})</Ea>
            <MUChip label={`오피스텔 : ${probrokerinfo.oft_name}(${probrokerinfo.oft_jibun})`} />
            :
            null
        }
        {
          probrokerinfo && probrokerinfo.is_pro_store ?
            // <Ea>- 상가 </Ea>
            <MUChip label="상가" />
            :
            null
        }
        {
          probrokerinfo && probrokerinfo.is_pro_office ?
            // <Ea>- 사무실 </Ea>
            <MUChip label="사무실" />
            :
            null
        }
        {/* 상가 / 사무실 선택했을 경우 */}
        {/* <MUChip>- 상가,사무실</MUChip> */}
      </MUStack>
    </>
  );
}

const MUStack = styled(Stack)`
    flex-wrap: wrap;
`
const MUChip = styled(Chip)``