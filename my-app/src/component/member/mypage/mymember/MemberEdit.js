//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//material
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

//img
import Profile from '../../../../img/member/no_profile.png';
import Plus from '../../../../img/member/plus.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import Set from '../../../../img/member/setting.png';

import { Mobile, PC } from "../../../../MediaQuery";
import MemberList from "./MemberList";

//theme
import { TtCon_Frame_B, TtCon_1col_input_2 } from '../../../../theme';

//server request>>
import serverController from '../../../../server/serverController';

import localStringData from '../../../../const/localStringData';

export default function Member({ saveModal, teamoneinfo, setName, setcmtype, name, phone, cmtype }) {
  console.log('membereEdittsss:', teamoneinfo);
  console.log('membereEdittsss:', name);
  console.log('membereEdittsss:', phone);
  console.log('membereEdittsss:', cmtype);

  const [active, setActive] = useState(false);

  const nameChange = (e) => { setName(e.target.value); }
  //const phoneChange = (e) =>{ setPhone(e.target.value); }//폰번호 변경 좀 이슈있을수있음.,폰번호 중복 로직관련 문의필요.고도화.
  const memadminChange = (e) => { setcmtype(e.target.value); }


  /*const checkVaildate = () =>{
    return name.length > 2
   }*/

  /*useEffect(()=>{
    if(checkVaildate())
       setActive(true);
    else
        setActive(false);
  },)*/

  return (
    <>
      <Wrapper>
        <p className="tit-a2">팀원 수정</p>
        <Sect_R2>
          <div className="tAlign-c mt-2">
            <ProfileImg>
              <Image src={!teamoneinfo.mem_img ? Profile : teamoneinfo.mem_img && localStringData.imagePath + teamoneinfo.mem_img} />
            </ProfileImg>
          </div>
          <div className="par-spacing mt-1">
            <MUTextField_100 variant="standard" label="이름" defaultValue={name}
              InputProps={{
                readOnly: true,
              }} />
          </div>
          <div className="par-spacing mt-0p5">
            <MUTextField_100 variant="standard" label="휴대폰" defaultValue={phone}
              InputProps={{
                readOnly: true,
              }} />
          </div>
          <div className="par-spacing mt-0p5">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">권한 선택</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cmtype}
                label="권한 선택"
                onChange={memadminChange}
              >
                <MenuItem value='1'>관리자</MenuItem >
                <MenuItem value='0'>팀원</MenuItem >
              </Select>
            </FormControl>
          </div>
          <div className="mt-3">
            <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={async () => {
              console.log('팀원 정보 수정 요청 진행>>>:', name, phone, cmtype);

              let body_info = {
                mem_id: teamoneinfo.mem_id,//memid 어떤 팀원memid에 대해 수정을 하는건지
                memadmin: cmtype//권한만 바꿀수있게하고 comapnymebmer테이블에 소속 업체의  어떤 소속업체에 소속된memid내역에 대해서 그 companyid소속업체에서의 권한값..을 지정한다.
              }
              let teamone_modify_process = await serverController.connectFetchController("/api/mypage/teamone_modify_process", "POST", JSON.stringify(body_info));
              if (teamone_modify_process) {
                console.log('teamone_moidfly process::', teamone_modify_process);
              }
              saveModal();

            }} >저장</MUButton_Validation>
          </div>
        </Sect_R2>
      </Wrapper>
    </>
  );
}

//---------------------------
const MUTextField_100 = styled(TextField)`
  &.MuiFormControl-root.MuiTextField-root {
    width: 100%;
  }
`
const MUButton = styled(Button)``

const MUButton_Validation = MUstyled(MUButton)`
        &.MuiButtonBase-root.MuiButton-root{
          background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
        color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
        box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"};
        width:100%;
  }
`

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`

const Sect_R2 = styled.div`
  ${TtCon_1col_input_2}
`


const ProfileImg = styled.div`
display: inline-block;
width:6.25rem; height:6.25rem;
border: 1px solid #979797;
border-radius: 50%;
margin-right: 1rem;
`

const Image = styled.img`
  width:100%;height:100%;border-radius:50%;
`
