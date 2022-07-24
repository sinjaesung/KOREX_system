//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';


import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';  
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Chip from '@material-ui/core/Chip';
import Stack from '@mui/material/Stack';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';
import Radio from '@material-ui/core/Radio';
import Avatar from '@mui/material/Avatar';

//css
import styled from "styled-components"

//img

import Profile from '../../../../img/member/no_profile.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import Set from '../../../../img/member/setting.png';

import { Mobile, PC } from "../../../../MediaQuery"

//server request
import serverController from '../../../../server/serverController';

export default function Member({ value, setTeamonelistresult }) {
  //console.log('value memimg what??:',value.mem_img);
  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log('987789',value);
  };
  const handleClose = () => {
    setAnchorEl(null);

  };

  const moev =()=>{
    console.log('987789', value.mem_id);
  }


  const moreVertMenu = () => {
    return (
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          {/* <Link to={"/MyMemberEdit/" + value.mem_id} className="data_link" />/ */}
          <Link to={`/MyMemberEdit/${value.mem_id}`} className="data_link" />
          수정
        </MenuItem>
        <MenuItem>
          <div className="data_link cursor-p" onClick={async () => {
            console.log('해당 팀원 삭제 처리 진행요청:', value, value.mem_id);

            if (window.confirm('해당 팀원을 삭제하시겠습니까??')) {
              //삭제 처리 갱신후에 value에 해당하는 그 상위부모 member콤퍼넌트 및 member page콤퍼너늩으의 teamonelist state배열 변경하여 갱신처리되게끔 한다. spa형태.
              let body_info = {
                delete_target_memid: value.mem_id,//삭제할 팀원.삭제시에 관련user테이블 row랑,companymember삭제처리한다. memid를 기준으로삭제. 
                company_id: value.company_id//소속 팀원이 소속된 업체companyid조회, 그리고 그 업체id에 소속된 팀원들 삭제이후 조회한 쿼리를 받기위함.
              }
              let teamone_delete_process = await serverController.connectFetchController('/api/mypage/teamone_delete_process', 'POST', JSON.stringify(body_info));
              if (teamone_delete_process) {
                console.log('teamone delete_process resultss:', teamone_delete_process);

                if (teamone_delete_process.success) {
                  setTeamonelistresult(teamone_delete_process.result);
                } else {
                  alert(teamone_delete_process.message);

                }
              }
            }
          }} />삭제</MenuItem>
      </Menu>
    )
  }


  return (
    <MUListItem
      disablePadding
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          {moreVertMenu()}
        </>
      }
    >
      <MUListItemButton>
        <div className="flex-left-center clearfix">
          <Avatar
            alt="프로필이미지"
            src={(value.mem_img == '' || !value.mem_img) ? Profile : globe_aws_url + value.mem_img}
            sx={{ width: "3.5rem", height: "3.5rem" }}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          {/* <Item_Thumb className="img-centering respHgt-100pct">
            <img src={(value.mem_img == '' || !value.mem_img) ? Profile : globe_aws_url + value.mem_img} />
          </Item_Thumb> */}
          <div>
            <p className="capt-00">{value.create_date}</p>
            <p classNAme="list-subtit">{value.user_name} {value.phone}</p>
            <p className="list-tag">{value.cm_type == 1 ? '관리자' : '팀원'}</p>
          </div>
        </div>
      </MUListItemButton>
    </MUListItem>
  );
}

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


const Sect_R1 = styled.div``
const Sect_R2 = styled.div``



const Item_Thumb = styled.div`
  float: left;
  width:6rem;
`











const MemberList = styled.div`
  width:100%;
  position:relative;
  display:flex;
  justify-content:flex-start;
  align-items:center;
  padding:38px 57px;

  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(20/428)) 0 calc(100vw*(34/428)) calc(100vw*(30/428));
  }
`
const ProfileImg = styled.div`
  width:95px;
  height:95px;
  border:3px solid #979797;
  margin-right:65px;
  border-radius:100%;

  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(70/428));
    height:calc(100vw*(70/428));
    margin-right:calc(100vw*(30/428));
  }
`
const Img = styled.img`
  width:100%;height:100%;
  border-radius:100%;
`
const MemberInfo = styled.div`
`
const Name = styled.h4`
  font-size:15px;
  color:#4a4a4a;
  font-weight:800;
  transform:skew(-0.1deg);
  margin-bottom:10px;

  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(7/428));
  }
`
const Grade = styled.p`
  font-size:15px;
  color:#979797;
  font-weight:600;
  transform:skew(-0.1deg);
  margin-bottom:5px;

  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(5/428));
  }
`
const Phone = styled(Grade)`
  color:#fe7a01;
`
const RegiDate = styled(Grade)`
  margin-bottom:0;
`
const MemberSetting = styled.div`
  position:absolute;
  display:flex;
  align-items:center;
  justify-content:center;
  width:36px;
  height:36px;
  right:57px;
  top:38px;
  text-align:center;
  border:1px solid #979797;
  border-radius:5px;
  cursor:pointer;

  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(31/428));
    height:calc(100vw*(31/428));
    top:calc(100vw*(22/428));
    right:calc(100vw*(40/428));
  }
`
const Setting = styled.img`
  display:inline-block;
  width:20px;
  height:20px;
  vertical-align:middle;

  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
    height:calc(100vw*(18/428));
  }
`

const InMenu = styled.ul`
  position:absolute;
  top:0;
  left:44px;
  width:60px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;

  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(35/428));
    left:calc(100vw*(0/428));
    width:calc(100vw*(60/428));
  }

`
const Div = styled.li`
  position:relative;
  font-size:13px;
  transform:skew(-0.1deg);
  border-radius:8px;
  padding:4px 0 4px 0px;
  transition:all 0.3s;
  &:hover{background:#f8f7f7;}
  &:first-child{padding-top:8px;}
  &:last-child{padding-bottom:8px;}
  
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    padding:calc(100vw*(4/428)) 0 calc(100vw*(4/428)) calc(100vw*(0/428));
    &:first-child{padding-top:calc(100vw*(8/428));}
    &:last-child{padding-bottom:calc(100vw*(8/428));}
  }
`
const InDiv = styled.div`
  width:100%;height:100%;
`
