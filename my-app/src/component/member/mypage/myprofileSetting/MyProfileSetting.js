//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
//css
import styled from "styled-components"

//img
import Img from '../../../../img/member/no_profile.png';
import RightArrow from '../../../../img/notice/right_arrow.png';
import Plus from '../../../../img/member/plus.png';
import Marker from '../../../../img/member/mark.png';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InputAdornment from '@mui/material/InputAdornment';

//theme
import { TtCon_Frame_B, TtCon_1col, } from '../../../../theme';

//component
import CommonList from '../commonList/commonList'
import { Modal_ProfileImgEdit } from '../common/modal_ProfileImgEdit';

//redux;
import { useSelector } from 'react-redux';

//-----
import serverController2 from '../../../../server/serverController2'
import serverController from '../../../../server/serverController'
import { Login_userActions } from '../../../../store/actionCreators';
//-----

export default function JoinInput({ logoutModal, secessionModal, editProfileImgModal }) {
  const login_user = useSelector(data => data.login_user);
  const listData = [
    { title: "이메일 변경", link: "EmailChange" },
    { title: "휴대폰번호 변경", link: "PhoneChange" },
    { title: "비밀번호 변경", link: "PasswordChange" },
  ]

  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');

  const [active, setActive] = useState(false);

  //@@------------------------------------------
  const login_userinfodata = useSelector(data => data.login_user);
  const [imgData, setImgData] = useState('');

  const userprofileChange = (e) => {
    const {
      target: { files }
    } = e;
    const theFile = files[0];
    console.log('fielshcnagerss the fiess:', theFile);

    setUserprofile(theFile);

    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      console.log('대상 파일 다 읽음::', finishedEvent);
      const { currentTarget: { result } } = finishedEvent;
      console.log('currentTarget,resultss:', result);
      setImgData(result);
    }
  }


  const Input = styled('input')({
    display: 'none',
  });

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //---------------------------------------------------------------
  const editOffButtonBox = async () => {
    console.log('subtitle 저장버튼 클릭시에 실행발발,임의 페이지 저장요소 형태,저장버튼을 눌렀을때!!!,다시 2->1 조회상태로 처리.', username, userprofile);
    // setEditChk(1);

    if (username && userprofile['name'] != '' && userprofile['size'] > 0) {
      console.log('update names and file upload 모두 진행한경우>>>');
      let formData = new FormData();
      formData.append('username_val', username);
      formData.append('folder', 'userProfile');
      formData.append('memid_val', login_user.memid);
      formData.append('userprofile_val', userprofile);

      let profilechange_request = await serverController2.connectFetchController('/api/mypage/profilechange_request', 'POST', formData);
      if (profilechange_request) {
        console.log('profilechange request resultss:', profilechange_request);

        if (profilechange_request.success) {
          let result = profilechange_request.result;
          console.log('==>>>파일업로드 등 프로필업로드 처리진행>>:', result);
          Login_userActions.memprofilechange({ memprofile: globe_aws_url + result.mem_img });
          alert('반영완료!');
        } else {
          alert(profilechange_request.message);
        }
      }
      Login_userActions.usernamechange({ usernames: username });
    } else {
      alert('변경사항 없음!');
    }
    // return setValueChk(1);
  }

  const userNameChange = (e) => {
    console.log(e.target.value);
    setUsername(e.target.value);
  }

  const [openModalProfileImgEdit, setOpenModalProfileImgEdit] = useState(false);

  const hdOpenModalProfileImgEdit = (bool) => {
    setOpenModalProfileImgEdit(bool);
  }

  //----------------------------------------------------------------
  return (
    <>
      <Wrapper>
        <Sect_R2>
          <div>
            <p className="tit-a2">계정</p>
            <div className="par-indent-left">
              {
                login_user.user_type != '개인' ?
                  <MUListItem disablePadding>
                    <MUListItemButton >
                      <Link to="/EmailChange" className="data_link"></Link>
                      <MUListItemTxt primary="이메일 변경" />
                      <ChevronRightIcon />
                    </MUListItemButton>
                  </MUListItem>
                  :
                  null
              }
              {
                login_user.user_type == '개인' ?

                  <MUListItem disablePadding>
                    <MUListItemButton >
                      <Link to="/PhoneChange" className="data_link"></Link>
                      <MUListItemTxt primary="휴대폰번호 변경" />
                      <ChevronRightIcon />
                    </MUListItemButton>
                  </MUListItem>
                  :
                  null
              }

              <MUListItem disablePadding>
                <MUListItemButton >
                  <Link to="/PasswordChange" className="data_link"></Link>
                  <MUListItemTxt primary="비밀번호 변경" />
                  <ChevronRightIcon />
                </MUListItemButton>
              </MUListItem>
              <MUListItem disablePadding>
                <MUListItemButton onClick={() => { logoutModal(); }}>
                  <MUListItemTxt primary="로그아웃" />
                </MUListItemButton>
              </MUListItem>
              <MUListItem disablePadding>
                <MUListItemButton onClick={() => { secessionModal(); }}>
                  <MUListItemTxt primary="회원탈퇴" />
                </MUListItemButton>
              </MUListItem>
            </div>
          </div>
          <br /><br /><br />
          <div>
            <p className="tit-a2">프로필</p>
            <div className="par-indent-left">
              <div className="par-indent-left">
                <div className="par-spacing">
                  <Wrap_Profile>
                    <ProfileImg onClick={() => hdOpenModalProfileImgEdit(true)} className="cursor-p">
                      {/* <Image src={login_userinfodata.memprofile ? login_userinfodata.memprofile : ''} /> */}
                      <Image src={login_userinfodata.memprofile ? login_userinfodata.memprofile : imgData} />
                      {
                        imgData != '' ?
                          <Profile_change src={imgData ? imgData : ''} />
                          :
                          null
                      }
                    </ProfileImg>
                    <Button variant="text" onClick={() => hdOpenModalProfileImgEdit(true)}>
                      이미지 변경
                    </Button>
                    {/* <MUButton onClick={() => { editProfileImgModal(); }}>프로필 사진 변경</MUButton> */}
                  </Wrap_Profile>
                </div>

                <div className="par-spacing">
                  <MUTextField variant="standard" label="이름" defaultValue={login_userinfodata.user_name} type="text" placeholder="이름을 입력해주세요." onChange={userNameChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end"><MUButton_Validation type="submit" name="" active={active} onClick={editOffButtonBox}>저장</MUButton_Validation></InputAdornment>,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Sect_R2>
      </Wrapper>
      <Modal_ProfileImgEdit open={openModalProfileImgEdit} handleOpen={hdOpenModalProfileImgEdit} setProfileImg={setUserprofile}/>
    </>
  );
}

const MUListItem = styled(ListItem)``
const MUListItemButton = styled(ListItemButton)``
const MUListItemTxt = styled(ListItemText)``
const MUTextField = styled(TextField)``
const MUButton = styled(Button)``
const Divider_Line = styled.div`
  height:1px;
  background-color: ${(props) => props.theme.palette.line.main};
`
//-------------------------------------------------
const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Sect_R1 = styled.div`
  border-bottom:1px solid ${(props) => props.theme.palette.line.main};
`
const Sect_R2 = styled.div`
${TtCon_1col}
`
const Wrap_Profile = styled.div`
  display:flex;
`
const Title = styled.h2``

const Title_Sub = styled.h3``

const ProfileImg = styled.div`
display: inline-block;
width: 3.125rem; height: 3.125rem;
border: 1px solid #979797;
border-radius: 50%;
margin-right: 1rem; position:relative;
`
const Image = styled.img`
width: 100%; height: 100%; border-radius: 100%;
`
const Profile_change = styled.img`
  position:absolute;left:0;top:0;z-index:2; 
  width:100%;height:100%;border-radius:100%;
`

const File = styled.input`
display: none;
`

const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`