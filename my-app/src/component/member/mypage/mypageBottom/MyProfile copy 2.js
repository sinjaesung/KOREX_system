//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";
//css
import styled from "styled-components";

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

//redux addons assetss
import {useSelector} from 'react-redux';

export default function JoinInput({profileedit,profileeditCheck}) {

  console.log('myProfile컴포넌트 실행=========== 실행시마다 리덕스에서 로그인여부 검사하고 로그인됐으면 정보 가져와서 뿌리기');

  const login_userinfodata= useSelector(data => data.login_user);

  console.log('data.login_userinfo refer infoi:',login_userinfodata);

  const [open, setOpen] = useState(false);

  //state에 저장 redux->state옮기기.
  
  /* 
  const [memid,setMemid] = useState('');
  const [company_id,setCompany_id] = useState('');
  const [user_username, setUser_username] = useState('');
  const [phone,setPhone] = useState('');
  const [email,setEmail] = useState('');
  const [username,setUsername] = useState('');
  const [memimg,setMemimg] = useState('');
  const [usertype,setUsertype] = useState('');
  const [registertype,setRegistertype] = useState('');
  const [memadmin,setMemadmin] = useState('');
  const [islogin,setIslogin]= useState('');
  
  useEffect(() => {
    //상태 변화 감지에 따라 상태변화가 감지될때에만 정보 지정한다.
    console.log('=->>>>myprofile useEffect실행>>>>');
    setMemid(login_userinfodata.memid);
    setCompany_id(login_userinfodata.company_id);
    setUser_username(login_userinfodata.user_username);
    setPhone(login_userinfodata.phone);
    setEmail(login_userinfodata.email);
    setUsername(login_userinfodata.user_name);
    setMemimg(login_userinfodata.mem_img);
    setUsertype(login_userinfodata.user_type);
    setRegistertype(login_userinfodata.register_type);
    setMemadmin(login_userinfodata.mem_admin);
    setIslogin(login_userinfodata.is_login);
  },[]);*/

  const valueChk = () =>{
    return profileeditCheck;
  }

  const profilehead = () => {
    console.log('profilehead함수 호출==========>>>',login_userinfodata.user_type);
     switch(login_userinfodata.user_type){

      case '전문중개사':
         {/*전문중개사일때 나오는 부분 ( BrokerKinds : 관리자 / 맴버 )*/}
         return (
          <BrokerTag>
            <BrokerKinds>관리자</BrokerKinds>
            <MarkerImg>전문</MarkerImg>
          </BrokerTag> 
        );
      break;
    
      case '분양대행사':
        {/*분양대행사일때 나오는 부분 ( BrokerKinds : 관리자 / 맴버 )*/}
        return(
            <BrokerTag>
              <BrokerKinds>관리자</BrokerKinds>
            </BrokerTag>
          );
        break;
     }
  }

  const profilemiddle_display = () => {
    console.log('profilemiddle함수 호출 =================>>',login_userinfodata.user_type);
     
    switch(login_userinfodata.user_type){
      case '개인':
         return(
          <PersonalAndCompany/>
         );
      break;

      case '기업':
        return(
          <PersonalAndCompany/>
         );
      break;

      case '전문중개사':

      break;

      case '분양대행사':

      break;
    }
     {/*개인&기업일때 상단*/}
     {
                
      
    }
  {/*중개사(일반)일때 없음*/}

  {/*전문중개사일때*/}
    {<ProfessionalBroker/>}
  {/*분양대행사일때*/}
    <Agency/>
  }
  //수정버튼
  const profilelist = () => {
      switch(profileedit){
          case 1 :
                  return (
                    <ProfileTop>
                      <ProfileImg>
                        <Profile src={Img}/>
                      </ProfileImg>

                      <ProfileName>
                        <Input type="text" name="" placeholder="이름을 설정해주세요." value={login_userinfodata.user_name} disabled/>
                        {
                          profilehead()
                        }
                      </ProfileName>
                    </ProfileTop>
                  );
          case 2 :
                  return (
                    <ProfileTop>
                      <ProfileImg>
                        <Profile src={Img}/>
                        <File type="file" name="" id="file"/>
                        <Label for="file"/>
                      </ProfileImg>
                      <ProfileName>
                        <InputBorder type="text" name="" placeholder="이름을 설정해주세요." value=''/>
                        {
                          profilehead()
                        }
                      </ProfileName>
                    </ProfileTop>
                  );
          default : return null;
      }
    }

    return (
        <Container>
          <WrapProfile>
            <MypageTxt>마이페이지</MypageTxt>
            {
              profilelist()
            }

            <ProfileMiddle> {/*컴포넌트로 분리했습니다! (mypageTop 폴더)*/}
              {/*개인&기업일때 상단*/}
                {
                
                  <PersonalAndCompany/>
                }
              {/*중개사(일반)일때 없음*/}

              {/*전문중개사일때*/}
                {<ProfessionalBroker/>}
              {/*분양대행사일때*/}
                <Agency/>
            </ProfileMiddle>


            <ProfileBottom>
              <Ul>
              {/*

                -개인회원
                (+거래정보 상단)
                1) 내관심 2) 내 물건투어예약 3) 내 중개의뢰 4) 내 알림

                -기업회원(관리자)
                (+거래정보 상단)
                1) 내관심 2) 내 물건투어예약 3) 내 중개의뢰
                4) 회사 프로필 설정 5) 팀원관리 6) 내 알림

                - 기업회원(팀원) ( 개인과 동일 )
                (+거래정보 상단)
                1) 내관심 2) 내 물건투어예약 3) 내 중개의뢰 4) 내 알림

                **) 중개업소는 일반중개업소/전문중개업소로 나뉩니다.
                **) 중개업소는 거래정보 상단 부분 없음.

                - 중개업소 (관리자)
                1) 내관심 2) 내 물건투어예약 3) 내 Live 시청예약
                4) 내 방문예약 5)전문중개사무소 신청 6) 회사프로필 설정
                7) 팀원 관리 8) 내 알림

                - 중개업소(팀원)
                  1) 내관심 2) 내 물건투어예약 3) 내 Live 시청예약
                  4) 내 방문예약 5) 내 알림

                - 전문 중개업소(관리자)

                  1) 내관심 2) 내 물건투어예약 3) 내 Live 시청예약
                  4) 내 방문예약 5) 물건 관리 6) 물건투어예약접수 관리
                  7) 회사 프로필 설정 8)팀원관리 9) 내알림

                -전문 중개업소(팀원)
                  1) 내관심 2) 내 물건투어예약 3) 내 Live 시청예약
                  4) 내 방문예약 5) 물건 관리 6) 물건투어예약접수 관리
                  7) 내 알림

                - 분양대행사(관리자)
                (+분양대행 상단)
                1) 분양프로젝트 관리 2) 회사프로필 설정 3) 팀원관리
                4) 내 알림

                - 분양대행사(팀원)
                (+분양대행 상단)
                1) 내 알림

                */}
                <Li>
                  {login_userinfodata.memid}
                  회원타입: {login_userinfodata.user_type}<br/>
                  가입타임: {login_userinfodata.register_type}<br/>
                  관리자여부: {login_userinfodata.mem_admin}
                </Li>
                <Li>
                  <Link to="/MyLike" className="data_link"></Link>
                  <LinkTxt>내 관심</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
                <Li>
                  <Link to="/Reservation" className="data_link"></Link>
                  <LinkTxt>내 물건 투어 예약</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
                <Li>
                  <Link to="/MyLive" className="data_link"></Link>
                  <LinkTxt>내 Live 시청 예약</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
                <Li>
                  <Link to="/BrokerReservation" className="data_link"></Link>
                  <LinkTxt>내 방문예약</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
            {/*전문중개사(관리자)*/}
                <Li>
                  <Link to="/PropertyManagement" className="data_link"></Link>
                  <LinkTxt>물건관리</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
                <Li>
                  <Link className="data_link"></Link>
                  <LinkTxt>물건투어예약접수 관리</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
                <Li>
                  <Link className="data_link"></Link>
                  <LinkTxt>전문중개사무소 신청</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
                <Li>
                  <Link to="/Request" className="data_link"></Link>
                  <LinkTxt>내 중개 의뢰</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
                <Li>
                  <LiPJ>
                    <Link className="data_link" onClick={() =>{setOpen(!open)}}/>
                    <LinkTxt>분양프로젝트 관리</LinkTxt>
                    <ArrowRotate src={RightArrow}/>
                  </LiPJ>
                  { open ?
                    <SubDepth>
                      <SubLi><Link to="/MyLiveSetting" className="data_link"/>- Live 시청예약세팅</SubLi>
                      <SubLi><Link to="/MyVisitSetting" className="data_link"/>- 방문예약세팅</SubLi>
                    </SubDepth>
                    :
                    null}
                </Li>

                <Li>
                  <Link to="/CompanyProfile" className="data_link"></Link>
                  <LinkTxt>회사 프로필 설정</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
                <Li>
                  <Link to="/MyMember" className="data_link"></Link>
                  <LinkTxt>팀원 관리</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
                <Li>
                  <Link to="/MyAlarm" className="data_link"></Link>
                  <LinkTxt>내 알림</LinkTxt>
                  <Arrow src={RightArrow}/>
                </Li>
              </Ul>
            </ProfileBottom>
          </WrapProfile>
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
    padding:40px 0 250px;
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(370/428));
      padding:calc(100vw*(40/428)) 0 calc(100vw*(150/428));
      }
`
const WrapProfile = styled.div`
  width:100%;
`
const MypageTxt = styled.h2`
  font-size:20px;font-weight:600;transform:skew(-0.1deg);
  padding-left:30px;color:#707070;
  margin-bottom:35px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding-left:calc(100vw*(20/428));
    margin-bottom:calc(100vw*(35/428));
    }
`
const ProfileTop = styled.div`
  width:100%;
  display:flex;justify-content:flex-start;align-items:center;
  padding-left:100px;
  @media ${(props) => props.theme.mobile} {
    padding-left:0;
    justify-content:center;
    }
`
const ProfileImg = styled.div`
  position:relative;
  width:95px;height:95px;
  border-radius:100%;
  border:5px solid #979797;
  display:inline-block;
  margin-right:24px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(72/428));
    height:calc(100vw*(72/428));
    margin-right:calc(100vw*(24/428));
    }
`
const File = styled.input`
  display: none;
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
const Profile = styled.img`
  width:100%;height:100%;
`
const ProfileName = styled.div`
  display:inline-block;
  width:295px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(250/428));
    }

`
const Input = styled.input`
  width:100%;height:43px;
  color:#4a4a4a;
  padding-left:28px;
  font-size:15px;
  background:transparent;
  font-weight:800;transform:skew(-0.1deg);
  &::placeholder{color:#4a4a4a;font-weight:600;transform:skew(-0.1deg);}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    height:calc(100vw*(43/428));
    padding-left:calc(100vw*(20/428));
    }
`
const InputBorder = styled(Input)`
  border:1px solid #e4e4e4;
  border-radius:5px;
`
const ProfileMiddle = styled.div`
  width:100%;
  border-top:6px solid #f2f2f2;
  border-bottom:6px solid #f2f2f2;
  padding:40px 0;
  margin-top:30px;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(40/428)) 0;
    margin-top:calc(100vw*(30/428));
    }
`
const FlexBox = styled.div`
  display:flex;width:100%;
  justify-content:center;align-items:center;
  margin-bottom:25px;
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(25/428));
    }
`
const Left = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  margin-right:88px;
`
const Icon = styled.img`
  display:inline-block;
  width:20px;margin-right:12px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    margin-right:calc(100vw*(12/428));
    }
`
const SubTitle = styled.p`
  font-size:15px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    }
`
const Right = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
`
const Txt = styled.p`
  font-size:15px;color:#4a4a4a;
  color:#979797;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    }
`
const TxtHave = styled(Txt)`
  color:#4a4a4a;
`
const Part = styled.p`
  width:1px;height:16px;
  background:#979797;vertical-align:middle;
  margin:0 12px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(1/428));
    height:calc(100vw*(16/428));
    margin:0 calc(100vw*(12/428));
    }
`
const ProfileBottom = styled.div`
  width:100%;
`
const Ul = styled.ul`
  width:100%;
`
const Li = styled.li`
  position:relative;
  width:100%;
  display:felx;justify-content:space-between;align-items:center;flex-wrap:wrap;
  padding:36px 40px;
  border-bottom:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(30/428)) calc(100vw*(20/428)) calc(100vw*(30/428)) calc(100vw*(30/428));
    }
`
const LiPJ = styled.div`
width:100%;
position:relative;
display:flex;justify-content:space-between;align-items:center;
`
const SubDepth = styled.ul`
  width:100%;
  padding:25px 0 0 15px;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(15/428)) 0 0 calc(100vw*(15/428));
    }
`
const SubLi = styled.li`
  position:Relative;
  font-size:15px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  margin-bottom:10px;
  &:last-child{margin-bottom:0;}
`
const LinkTxt = styled.p`
  font-size:15px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    }
`
const Arrow = styled.img`
  width:8px;vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(8/428));
    }
`
const ArrowRotate= styled(Arrow)`
  transform:rotate(90deg);
`
const BrokerTag = styled.div`
  padding-left:28px;
  display:${({is_agency})=> true ? 'block' : 'none'};
  display:${({is_realtor})=> true ? 'block' : 'none'};
  @media ${(props) => props.theme.mobile} {
    padding-left:calc(100vw*(20/428));
    }
`
const BrokerKinds = styled.span`
  font-size:15px;font-weight:600;transform:skew(-0.1deg);
  color:#979797;font-family:'nbg',sans-serif;
  vertical-align:middle;display:inline-block;margin-top:0;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    margin-top:calc(100vw*(3/428));
    }
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
  color:#2b664d;font-size:10px;font-fmaily:'nbg',sans-serif;
  font-weight:600;
  padding-left:17px;
  background:url(${Marker}) no-repeat 4.5px center; background-size:9px 9px;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(8/428));
    padding-left:calc(100vw*(17/428));
    width:calc(100vw*(42/428));
    height:calc(100vw*(20/428));
    line-height:calc(100vw*(20/428));
    font-size:calc(100vw*(10/428));
    background:url(${Marker}) no-repeat calc(100vw*(5/428)) center; background-size:calc(100vw*(9/428)) calc(100vw*(9/428));
    }
`
