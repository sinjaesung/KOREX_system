//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components";


//material-ui
import TextField from '@material-ui/core/TextField';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';


//img
import Img from '../../../img/member/no_profile.png';
import Louder from '../../../img/member/louder.png';
import Checking from '../../../img/member/checking.png';
import RightArrow from '../../../img/notice/right_arrow.png';
import Plus from '../../../img/member/plus.png';
import Marker from '../../../img/member/mark.png';
//component
import PersonalAndCompany from './mypageTop/PersonalAndCompany';
import ProfessionalBroker from './mypageTop/ProfessionalBroker';
import Agency from './mypageTop/Agency';
import ProfileBottomElement from './mypageBottom/profileBottom';
import ModalCommon from '../../common/modal/ModalCommon';
import ModalEditProfileImg from './myprofileSetting/modal/ModalEditProfileImg';
import BootstrapDialogTitle from '../../common/modal/bootstrapDialogTitle';

//redux addons assetss
import { useSelector } from 'react-redux';
import { Login_userActions } from '../../../store/actionCreators';

import NewRequestTopInfos from './request/NewRequestTopInfos';


//material-ui
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

//theme
import { TtCon_Frame_B, TtCon_1col, TtCon_Frame_A2 } from '../../../theme';


export default function JoinInput({ profileedit, profileeditCheck, username, setUsername, setUserprofile, userprofile, edit, editButtonBox, editOffButtonBox }) {

  const login_user = useSelector(data => data.login_user);
  console.log(edit, 'edit');
  //@@--------------------------------------
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submitnone: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  const editProfileImgModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "프로필사진 수정",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalEditProfileImg offModal={offModal} userprofile={userprofile} setUserprofile={setUserprofile} username={username} setUsername={setUsername} profilelist={profilelist} edit={edit} editButtonBox={editButtonBox} editOffButtonBox={editOffButtonBox} profileeditCheck={profileeditCheck} /> },
      // submit: { show: true, title: "적용", event: () => { modalAdjust(); } },
      // cancle: { show: true, title: "초기화", event: () => { clearFilter(); } },
      // confirm: { show: false, title: "확인", event: () => { modalAdjust(); } }
    });
  }
  //@@--------------------------------------------------------

  const history = useHistory();

  const login_userinfodata = useSelector(data => data.login_user);

  const bunyangTeam = useSelector(data => data.bunyangTeam);

  const [open, setOpen] = useState(false);//profileBOTTOM사용 STATE값들..
  const [inputValue, setInputValue] = useState("");
  const [imgData, setImgData] = useState('');

  const valueChk = () => {
    return profileeditCheck;
  }
  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';

  const profilehead = () => {

    if (login_userinfodata.is_login == 1) {
      switch (login_userinfodata.user_type) {
        case '중개사':
          {/*전문중개사일때 나오는 부분 ( span : 관리자 / 맴버 )*/ }
          {
            if (login_userinfodata.is_login && login_userinfodata.mem_admin == 'root') {//관리자 여부 data 받아서 처리해야 한다. company member테이블에 cm_type으로 처리하기
              if (login_userinfodata.ispro) {
                return (
                  <BrokerTag>
                    <span>관리자</span>
                    <MarkerImg>전문</MarkerImg>
                  </BrokerTag>
                )

              } else {
                return (
                  <BrokerTag>
                    <span>관리자</span>
                  </BrokerTag>
                )
              }
            } else if (login_userinfodata.is_login && login_userinfodata.mem_admin == 'team') {
              if (login_userinfodata.ispro) {
                return (
                  <BrokerTag>
                    <span>맴버</span>
                    <MarkerImg>전문</MarkerImg>
                  </BrokerTag>
                )

              } else {
                return (
                  <BrokerTag>
                    <span>맴버</span>
                  </BrokerTag>
                )
              }
            }
          }

        // break;
        case '분양대행사':
          {/*분양대행사일때 나오는 부분 ( span : 관리자 / 맴버 )*/ }
          {
            if (login_userinfodata.mem_admin == 'root') {
              return (
                <BrokerTag>
                  <span>관리자</span>
                </BrokerTag>
              )
            } else {
              return (
                <BrokerTag>
                  <span>맴버</span>
                </BrokerTag>
              )
            }
          }
        case '기업':
          {/*분양대행사일때 나오는 부분 ( span : 관리자 / 맴버 )*/ }
          {
            if (login_userinfodata.mem_admin == 'root') {
              return (
                <BrokerTag>
                  <span>관리자</span>
                </BrokerTag>
              )
            } else {
              return (
                <BrokerTag>
                  <span>맴버</span>
                </BrokerTag>
              )
            }
          }
        // break;
      }
    } else {
      //로그인 오류 or 로그인 안된 상태일경우에도 일단 띄운다. 테스트용도로 비로그인상태라면 딱히 중개사or분양대행사 상태는 아니기에 두 관련 상태는 x
    }

  }


  const BulletinBoard_display = () => {
    console.log('profilemiddle함수 호출 =================>>', login_userinfodata.user_type, login_userinfodata.company_id);

    if (login_userinfodata.is_login == 1) {
      switch (login_userinfodata.user_type) {
        case '개인':

          return (
            
              <> 
              {/* <div className="par-spacing">
              <BulletinBoard>
              <Sect_BulletinCont>
                  <PersonalAndCompany />
                  </Sect_BulletinCont>
                </BulletinBoard> 
                </div> */}
                </>
              
          );
          break;

        case '기업':
          return (
            
              <>
              {/* <div className="par-spacing">
              <BulletinBoard>
              <Sect_BulletinCont>
                  <PersonalAndCompany />
                  </Sect_BulletinCont>
                </BulletinBoard> 
              </div> */}
              </>
              
          );
          break;

        case '중개사':

          //전문중개사를 확인
          if (login_userinfodata.ispro == 1) {
            return (
              <>
                <div className="par-spacing">
                  <BulletinBoard>
                    <Sect_BulletinCont>
                      <ProfessionalBroker />
                    </Sect_BulletinCont>
                  </BulletinBoard>
                </div>
              </>
            );
          } else return null;
          break;

        case '분양대행사':
          return (
            <>
              <div className="par-spacing">
                <BulletinBoard>
                  <Sect_BulletinCont>
                    <Agency bunyangTeam={bunyangTeam} />
                  </Sect_BulletinCont>
                </BulletinBoard>
              </div>
            </>
          );
          break;
      }
    } else {
      return (
        <>
          <div className="par-spacing">
            <BulletinBoard>
              <Sect_BulletinCont>
                <PersonalAndCompany />
              </Sect_BulletinCont>
            </BulletinBoard>
          </div>
        </>
      );
    }
  }


  const ShortCutBtns_display = () => {
    if (login_userinfodata.is_login == 1) {
      switch (login_userinfodata.user_type) {
        case '개인':
          return (
            <>
              {/* <div className="par-spacing tAlign-r">
                <MUButton variant="contained" disableElevation>
                  {
                    !login_userinfodata.user_name || !login_userinfodata.phone ?
                      <Link onClick={
                        () => {
                          if (window.confirm("등록된 휴대폰번호가 없습니다. 휴대폰번호 등록하시겠습니까??")) {
                            history.push('/PhoneChange');
                          }
                        }
                      }>중개의뢰하기
                      </Link>
                      :
                      <Link onClick={
                        () => {
                          history.push('/AddRequest');
                        }
                      }>중개의뢰하기
                      </Link>
                  }
                </MUButton>
              </div>
              <div className="divider-a1" /> */}
            </>
          );
          break;

        case '기업':
          return (
            <>
              {/* <div className="par-spacing tAlign-r">
                <MUButton variant="contained" disableElevation>
                  {
                    !login_userinfodata.user_name || !login_userinfodata.phone ?
                      <Link onClick={
                        () => {
                          if (window.confirm("등록된 휴대폰번호가 없습니다. 휴대폰번호 등록하시겠습니까??")) {
                            history.push('/PhoneChange');
                          }
                        }
                      }>중개의뢰하기
                      </Link>
                      :
                      <Link onClick={
                        () => {
                          history.push('/AddRequest');
                        }
                      }>중개의뢰하기
                      </Link>
                  }
                </MUButton>
              </div>
              <div className="divider-a1" /> */}
            </>
          );
          break;

        case '중개사':
          //전문중개사를 확인
          if (login_userinfodata.ispro == 1) {
            return (
              <>
                <div className="par-spacing tAlign-r">
                  <MUButton variant="contained" disableElevation>
                    {
                      !login_userinfodata.user_name || !login_userinfodata.phone ?
                        <Link onClick={
                          () => {
                            if (window.confirm("등록된 휴대폰번호가 없습니다. 휴대폰번호 등록하시겠습니까??")) {
                              history.push('/PhoneChange');
                            }
                          }
                        }>물건 등록하기
                        </Link>
                        :
                        <Link onClick={
                          () => {
                            history.push('/AddProperty');
                          }
                        }>물건 등록하기
                        </Link>
                    }
                  </MUButton>
                </div>
                <div className="divider-a1" />
              </>
            );
          } else {
            return (
              <>
                <div className="par-spacing tAlign-r">
                  <MUButton variant="contained" disableElevation>
                    {
                      login_userinfodata.mem_admin == 'root' ?
                        <Link onClick={
                          () => {
                            if (window.confirm("전문중개사로 승인된 중개업소만 물건등록 가능합니다. 전문중개사 신청하시겠습니까?")) {
                              history.push('/RegistProBroker');
                            }
                          }
                        }>물건 등록하기
                        </Link>
                        :
                        <Link onClick={
                          () => {
                            alert("전문중개사로 승인된 중개업소만 물건등록이 가능합니다. 전문중개사신청은 관리자 권한만 할 수 있습니다.")
                            // history.push('/AddProperty');
                          }
                        }>물건 등록하기
                        </Link>
                    }
                  </MUButton>
                </div>
                <div className="divider-a1" />
              </>
            )

          }
          break;
      }
    } else {
      return null;
    }
  }


  const usernameChange = (e) => {
    setInputValue(e.target.value);
    //  console.log('상태값username 변화:',e.target.value);
    setUsername(e.target.value);
  }
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
      const { currentTarget: { result } } = finishedEvent;
      setImgData(result);
    }
  }
  //사업자번호1,2,3 부분별 입력. 3-2-5자리.

  const ExpertParts_display = () => {
    if (login_userinfodata.ispro) {
      return (
        <div className="par-spacing">
          <NewRequestTopInfos userprofileChange={userprofileChange} />
        </div>
      )
    }
  }

  // -- 수정코드입니다.
  const profilelist = () => {
    console.log('동작');
    return (
      <Wrap_ProfileMemb>
        {/* {
            profileedit == 1 ?
              <ProfileImg>
                <Profile src={login_userinfodata.memprofile ? login_userinfodata.memprofile : ''} />
              </ProfileImg>
              : */}
        {/* <>
                <ProfileImg>
                  <Profile src={imgData ? imgData : Img} />
                  <File type="file" name="" id="file" onChange={userprofileChange} />
                  <Label for="file" />
                </ProfileImg>
              </> */}
        {/* // } */}
        <ProfileImg onClick={editProfileImgModal} className="cursor-p">
          <Profile src={login_userinfodata.memprofile ? login_userinfodata.memprofile : ''} />
        </ProfileImg>
        {/* <File type="file" name="" id="file222" onChange={userprofileChange} /> */}
        <ProfileTxt>
          <Name>
            {/*이름값이 존재한다면, [이름값] 출력 / 이름값이 존재하지않는다면, [이름을 설정하세요] 출력 */}
            {login_userinfodata.user_name}
          </Name>
          {
            profilehead()
          }
        </ProfileTxt>
      </Wrap_ProfileMemb>
    );
  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">마이페이지</p>
        <div className="par-indent-left">
          <div className="par-spacing flex-left-center">
            <ProfileImg onClick={editProfileImgModal} className="cursor-p">
              <Profile src={login_userinfodata.memprofile ? login_userinfodata.memprofile : ''} />
            </ProfileImg>
            <ProfileTxt>
              <p>{login_userinfodata.user_name}</p>
              {
                profilehead()
              }
            </ProfileTxt>
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          {
            login_user.user_type == '중개사' && login_user.ispro && ExpertParts_display()
          }
          {BulletinBoard_display()}
          {ShortCutBtns_display()}
          <div className="par-spacing">
            <ProfileBottomElement open={open} setOpen={setOpen} />
          </div>
        </Sect_R2>
      </Wrapper>
      {/* <ModalEditProfileImg
        open={muOpen}
        onClose={handleClose}
      /> */}
      <ModalCommon modalOption={modalOption} />
    </>
  );
}

const MUButton = styled(Button)``

//-----------------------------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Sect_R2 = styled.div`
  ${TtCon_1col}
`
const Wrap_ProfileMemb = styled.div`
display:flex;align-items:center;
`
const Profile = styled.img`
width: 100%; height: 100%; border-radius: 100%;
`
const ProfileImg = styled.div`
display: inline-block;
width:6.25rem; height:6.25rem;
border: 1px solid #979797;
border-radius: 50%;
margin-right: 1rem;
`
const File = styled.input`
display: none;
`
const ProfileTxt = styled.div`
display: inline-block;
`
const Name = styled.div``

const BrokerTag = styled.div`
display:${({ is_agency }) => true ? 'block' : 'none'};
display:${({ is_realtor }) => true ? 'block' : 'none'};
`
const BulletinBoard = styled.div`
  padding:1.25rem 0;
  border:1px solid #dadce0;
  border-radius:12px;
`
const Sect_BulletinCont = styled.div`
    width:70%;
    margin: 0 auto;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {}
    @media (max-width: 550px) {width:80%;}
`

const MarkerImg = styled.span`
  display:inline-block;
  margin-left:17px;
  width: 42px;
  height: 20px;
  border-radius: 4px;
  border: solid 1px #2b664d;
  background-color: #fbfbfb;
  line-height:20px;
  color:#2b664d;font-size:10px;font-family:'nbg',sans-serif;
  font-weight:600;
  padding-left:17px;
  background:url(${Marker}) no-repeat 4.5px center; background-size:9px 9px;
`