//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components";
//theme
import { TtCon_Frame_B, TtCon_1col_input, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

//img
import Check from '../../../../img/map/radio.png';
import Checked from '../../../../img/map/radio_chk.png';
import Search from '../../../../img/map/search.png';
import Close from '../../../../img/main/modal_close.png';
import AddFileImg from "../../../../img/member/add_file.png";
import Delete from "../../../../img/member/delete_icon.png";

import { Mobile, PC } from "../../../../MediaQuery";

import MapApi from './MapApi.js';

//server request
import serverController2 from '../../../../server/serverController2';
import serverController from '../../../../server/serverController';

//redux
import { useSelector } from 'react-redux';

export default function RegistSecond({ submitModal, confirmModal }) {

  const temp_probrokerRegister = useSelector(data => data.temp_probrokerRegister);
  console.log('>>>temp proborkerREIGSER:', temp_probrokerRegister);
  const login_user = useSelector(data => data.login_user);
  const [companyinfo, setcompanyinfo] = useState({});
  useEffect(async () => {
    let body_info = {
      company_id: login_user.company_id
    }
    let companyinfo = await serverController.connectFetchController('/api/broker/companyinfo_get', 'POST', JSON.stringify(body_info));

    if (companyinfo) {
      console.log('companyinfoss sss:', companyinfo);
      if (companyinfo.success) {
        let result = companyinfo.result;

        setcompanyinfo(result);
      }

    }
  }, []);
  return (
    <>
      <Wrapper>
        <p className="tit-a2">신청서 확인</p>
        <Sect_R2>
          <div className="par-spacing">
            <Sect_Flex>
              <Sect_C1>중개업소등록번호 : </Sect_C1>
              <Sect_C2>{companyinfo && companyinfo.realtor_reg_no}</Sect_C2>
            </Sect_Flex>
            <Sect_Flex>
              <Sect_C1>중개업소명 : </Sect_C1>
              <Sect_C2>{companyinfo && companyinfo.company_name}</Sect_C2>
            </Sect_Flex>
            <Sect_Flex>
              <Sect_C1>중개업소주소 : </Sect_C1>
              <Sect_C2>{companyinfo && companyinfo.addr_road}</Sect_C2>
            </Sect_Flex>
            <Sect_Flex>
              <Sect_C1>대표자명 : </Sect_C1>
              <Sect_C2>{companyinfo && companyinfo.ceo_name}</Sect_C2>
            </Sect_Flex>
          </div>
          <div className="divider-a1" />
          <div className="par-spacing">
            <Title_Sub>전문 종목 {temp_probrokerRegister.isapart + temp_probrokerRegister.isofficetel + temp_probrokerRegister.isstore + temp_probrokerRegister.isoffice}건</Title_Sub>
            <div className="par-indent-left">
              {
                temp_probrokerRegister.isapart == 1 ?
                  <div>
                    <Kind>1. 아파트</Kind>
                    <Address>{temp_probrokerRegister.apartaddr_road}({temp_probrokerRegister.apartname})</Address>
                  </div> :
                  null
              }
              {
                temp_probrokerRegister.isofficetel == 1 ?
                  <div>
                    <Kind>2. 오피스텔</Kind>
                    <Address>{temp_probrokerRegister.officeteladdr_road}({temp_probrokerRegister.officetelname})</Address>
                  </div> :
                  null
              }

              {
                temp_probrokerRegister.isstore == 1 ?
                  <Kind>3. 상가</Kind> : null
              }
              {
                temp_probrokerRegister.isoffice == 1 ?
                  <Kind>4. 사무실</Kind> : null
              }
            </div>
          </div>
          <div className="divider-a1" />
          <div className="par-spacing">
            <p>위와 같이 전문중개업소를 신청합니다.<br />
              전문중개업소로 선정될 시, 관련 법령을 준수하고 부동산 정보 서비스의 선진화 공정한
              거래질서를 위하여 신의성실의 원칙을 지키겠습니다.</p>
          </div>
          <div className="par-spacing">
            <MUButton_100 variant="contained" type="submit" onClick={async () => {

              const formData = new FormData();

              formData.append('folder', 'probrokerAuth');
              formData.append('user_id', login_user.memid);
              formData.append('apply_apt_addr', temp_probrokerRegister.apartaddr_road);
              formData.append('apt_name', temp_probrokerRegister.apartname);
              formData.append('isapart', temp_probrokerRegister.isapart);
              formData.append('is_apply_office', temp_probrokerRegister.isoffice);
              formData.append('isofficetel', temp_probrokerRegister.isofficetel);
              formData.append('is_apply_store', temp_probrokerRegister.isstore);
              formData.append('apply_oft_addr', temp_probrokerRegister.officeteladdr_road);
              formData.append('oft_name', temp_probrokerRegister.officetelname);
              formData.append('companyregfile', temp_probrokerRegister.companyregfile);
              formData.append('realtorfile', temp_probrokerRegister.realtorfile);
              console.log('>>>>>form dataaa::', formData);

              let server_request = await serverController2.connectFetchController(`/api/realtors/${login_user.company_id}/pro/apply`, 'POST', formData);

              if (server_request) {
                console.log('>>>>server_requestss:', server_request);

                if (server_request.success) {

                } else {
                  alert(server_request.message);
                }
              }
              submitModal();

            }}>제출</MUButton_100>
          </div>

        </Sect_R2>
      </Wrapper>
    </>
  );
}



const MUButton = styled(Button)``

const Divider_Line = styled.div`
  height:1px;
  background-color: ${(props) => props.theme.palette.line.main};
`
//--------------------------------------------------

const Wrapper = styled.div`
    ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R1 = styled.div`
  border-bottom:1px solid ${(props) => props.theme.palette.line.main};
`
const Sect_R2 = styled.div`
${TtCon_1col_input}
`
const Sect_R2_1 = styled.div`
margin:0.5rem 0;
`

const Sect_Flex = styled.div`
 display: flex;
`
const Sect_C1 = styled.div`
  flex-grow:1;
  flex-basis:0;
`
const Sect_C2 = styled.div`
  flex-grow:1.5;
  flex-basis:0;
`
const Title_Sub = styled.h3`
  display:flex;align-items:center;
`
const Sect_Sub = styled.div`
  margin-left: 1rem;
`
const Kind = styled.div``
const Address = styled.div`
  margin-left:1rem;
`
const Sect_EndButton = styled.div`
  margin: 1.25rem 0 2.5rem;
`
const MUButton_100 = styled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    width:100%;
  }
`


