//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

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

//server request>>
import serverController from '../../../../server/serverController';

import localStringData from '../../../../const/localStringData';

export default function Member({saveModal,teamoneinfo,setName,setcmtype, name,phone,cmtype}) {
  console.log('membereEdittsss:',teamoneinfo);
  
  const [active,setActive] = useState(false);
  
  const nameChange = (e) =>{ setName(e.target.value); }
  //const phoneChange = (e) =>{ setPhone(e.target.value); }//폰번호 변경 좀 이슈있을수있음.,폰번호 중복 로직관련 문의필요.고도화.
  const memadminChange = (e) => {setcmtype(e.target.value); }

  
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
        <Container>
          <WrapMember>
            <TopTitle>팀원 수정</TopTitle>
            <WrapEdit>
              <ProfileImg>
                <Img src={!teamoneinfo.mem_img?Profile:teamoneinfo.mem_img&&localStringData.imagePath+teamoneinfo.mem_img}/>
               
              </ProfileImg>
              <WrapInput>
                <InputTxt type="text" value={name} readonly/>
                <InputTxt type="text" value={phone} readonly/>
                <Select onChange={memadminChange}>
                  <Option value='1' selected={cmtype=='1'?'true':'false'}>관리자</Option>
                  <Option value='0' selected={cmtype=='0'?'true':'false'}>팀원</Option>
                </Select>
              </WrapInput>
              <SaveButton>
                <SaveBtn type="submit" active={active} onClick={ async () => {
                  console.log('팀원 정보 수정 요청 진행>>>:',name,phone,cmtype);

                  let body_info ={
                    mem_id : teamoneinfo.mem_id,//memid 어떤 팀원memid에 대해 수정을 하는건지
                    memadmin : cmtype//권한만 바꿀수있게하고 comapnymebmer테이블에 소속 업체의  어떤 소속업체에 소속된memid내역에 대해서 그 companyid소속업체에서의 권한값..을 지정한다.
                  }
                  let teamone_modify_process = await serverController.connectFetchController("/api/mypage/teamone_modify_process","POST",JSON.stringify(body_info));
                  if(teamone_modify_process){
                    console.log('teamone_moidfly process::',teamone_modify_process);
                  }
                  saveModal();
                  
                }}>저장</SaveBtn>
              </SaveButton>
            </WrapEdit>
          </WrapMember>
  </Container>
  );
}

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
    padding:24px 0 250px;
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(380/428));
      padding:calc(100vw*(30/428)) 0 calc(100vw*(150/428));
      }
`
const TopTitle = styled.h2`
  font-size:20px;color:#707070;
  text-align:left;padding-left:30px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding-left:calc(100vw*(16/428));
    }
`
const WrapMember = styled.div`
  width:100%;

`
const WrapEdit = styled.div`
  width:430px; margin:60px auto 0;
  display:flex;justify-content:flex-start;
  align-items:flex-start;flex-wrap:wrap;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    margin:calc(100vw*(40/428)) auto 0;
    }
`
const ProfileImg = styled.div`
  position:relative;
  width:95px;height:95px;
  border:5px solid #979797;
  border-radius:100%;
  margin-right:24px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(73/428));
    height:calc(100vw*(73/428));
    margin-right:calc(100vw*(17/428));
    margin-left:calc(100vw*(40/428));
  }
`
const Img = styled.img`
  display:inline-block;
  width:100%;height:100%;border-radius:50%
`
const File = styled.input`
  display:none;
`
const Label = styled.label`
  display:inline-block;
  width:27px;height:27px;
  position:absolute;right:0;bottom:0;
  background:url(${Plus}) no-repeat;background-size:100% 100%;
  cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(27/428));
    height:calc(100vw*(27/428));
    right:calc(100vw*(-5/428));
    bottom:calc(100vw*(-5/428));
    }
`
const WrapInput = styled.div`
  width:295px;
  margin-top:25px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(187/428));
    margin-top:calc(100vw*(20/428));

    }
`
const InputTxt = styled.input`
  width:100%;height:43px;
  border-radius:4px;border:1px solid #a3a3a3;
  text-align:center;font-size:15px;font-weight:600;
  transform:skew(-0.1deg);
  margin-bottom:13px;
  @media ${(props) => props.theme.mobile} {
    text-align: left;
    width:100%;height:calc(100vw*(41/428));
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(6/428));
    padding-left: calc(100vw * (23 / 428));
    }
`
const Select = styled.select`
  width:100%;height:43px;
  border-radius:4px;border:1px solid #a3a3a3;
  text-align-last:center;
  text-align:center;
  font-size:15px;font-weight:600;
  transform:skew(-0.1deg);
  appearance:none;
  background:url(${ArrowDown}) no-repeat 250px center;background-size:10px;
  @media ${(props) => props.theme.mobile} {
    text-align-last:left;
    text-align: left;
    width:100%;height:calc(100vw*(41/428));
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(6/428));
    padding-left: calc(100vw * (23 / 428));
    appearance:none;
    background:url(${ArrowDown}) no-repeat calc(100vw * (158/428)) center;
    background-size:calc(100vw * (12/428));
    }
`
const Option = styled.option`
  font-family:'nbg',sans-serif;
`
const SaveButton = styled.div`
  width:100%;padding-left:23px;
  margin-top:60px;
  @media ${(props) => props.theme.mobile} {
    padding-left:0;
    margin-top:calc(100vw*(46/428));
  }
`
const SaveBtn = styled.button`
  width: 408px;
  height: 66px;
  line-height:60px;
  border-radius: 11px;
  transition:all 0.3s;
  color:#fff;
  font-size:20px;font-weight:800;transform:skew(-0.1deg);
  background:${({active}) => active ? "#01684b" : "#979797"};
  border:${({active}) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.mobile} {
    width:100%;
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
  }
`
