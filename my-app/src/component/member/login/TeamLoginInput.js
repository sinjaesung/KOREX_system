//react
import React ,{useState, useEffect} from 'react';
import {Link,useHistory} from "react-router-dom";
import serverController from '../../../server/serverController';

//css
import styled from "styled-components"

export default function JoinInput({authinfo}) {
  const history=useHistory();
  console.log('teamlogin inputs::',authinfo);

    var invite_memid= authinfo.split(',')[0];
    invite_memid = invite_memid.split(":")[1];
    var invite_companyid= authinfo.split(',')[1];
    invite_companyid = invite_companyid.split(":")[1];
    var invite_mem_phone= authinfo.split(',')[2];
    invite_mem_phone = invite_mem_phone.split(":")[1];
    var invite_mem_usertype= authinfo.split(',')[3];
    invite_mem_usertype = invite_mem_usertype.split(":")[1];
    var receiver_phone= authinfo.split(',')[4];
    receiver_phone = receiver_phone.split(":")[1];


  const [phone,setPhone] = useState("");/*기본값*/
  const [pwd,setPwd] = useState("");/*기본값*/
  const [active,setActive] = useState(false);

  const phoneChange = (e) =>{ setPhone(e.target.value); }
  const pwdChange = (e) =>{ setPwd(e.target.value); }

  const checkVaildate = () =>{
    return phone.length > 9 && pwd.length > 7
   }
   useEffect(()=>{
     console.log('Teamonelogin inputs>>useEffect호출상태변화=============',phone,pwd);
     if(checkVaildate())
        setActive(true);
     else
        setActive(false);
   },)

   const team_login_submit = async (e) => {
     console.log('teamone_login_submit 기업 로그인 submit onclick발생=============',phone,pwd,active);

     if(active==true){
       let body_info={
         login_phone: phone,
         login_password: pwd,
         user_type:invite_mem_usertype,
         company_id:invite_companyid,
         register_type:'team',
         mem_admin:'team'
       };
       console.log('JSON.STRINGIFY(BODY_INFO):',JSON.stringify(body_info));

       let res= await serverController.connectFetchController("/api/auth/team/team_login_request","POST",JSON.stringify(body_info),function(){},function(test){console.log(test)});
       console.log('res results:',res);
       //alert(res);

      if(!res.success){
         document.getElementById('loginfail').style.display='block';
       }else{
         document.getElementById('loginfail').style.display='none';
         alert(res.message);

         let get_teamuser_memid= res.result;
         console.log('get_teamuser_memid:',get_teamuser_memid);

         //window.location.href='/'; 초대장 참여(팀원) 페이지로 이동한다.
          
         //초대장 화면 참여 페이지로 spa이동시킴. 이 페이지에서 참여 누르면
         history.push('/TeamInvitefinal/'+get_teamuser_memid);//가입성공한 memid를 보낸다.
         //window.location.href='/';
       }
     }
   }

    return (
        <Container>
          <WrapJoinInput>
            <TopTxt>초대링크 팀원 로그인&회원가입</TopTxt>
            <TopTxt>
                memid:{invite_memid} companyid:{invite_companyid} {invite_mem_phone}님이 초대함. <br/>
                초대자 usertype: {invite_mem_usertype} 피초대자 {receiver_phone}님
            </TopTxt>
            <InputTop>
              <InputTitle>휴대전화</InputTitle>
              <Input type="text" name="" placeholder="휴대번호를 '-' 빼고 입력해주세요." onChange={phoneChange}/>
              <InputTitle>비밀번호</InputTitle>
              <Input type="password" name="" placeholder="비밀번호를 입력해주세요." onChange={pwdChange}/>
              {/*아이디 또는 비밀번호가 일치하지 않을때 Msg*/}
              <ErrorMsg style={{display:"none"}} id='loginfail'>휴대폰번호 또는 비밀번호가 일치하지 않습니다.</ErrorMsg>
            </InputTop>
            <SubmitButton>
              <Submit type="submit" name="" active={active} onClick={team_login_submit}>로그인</Submit>
              <BottomBtns>
                <Div>
                  <Link to="/TeamJoin">
                    <GoTxt>회원가입</GoTxt>
                  </Link>
                </Div>
               
              </BottomBtns>
            </SubmitButton>
          </WrapJoinInput>
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
    width:450px;
    margin:50px auto 0;
    padding-bottom:150px;
    @media ${(props) => props.theme.mobile} {
        width:calc(100vw*(370/428));
        margin:calc(100vw*(40/428)) auto 0;
        padding-bottom:calc(100vw*(100/428));
      }
`
const WrapJoinInput = styled.div`
    width:410px;
    margin:0 auto;
    @media ${(props) => props.theme.mobile} {
        width:100%;
      }
`
const TopTxt = styled.h2`
  font-size:15px;
  font-weight:800;
  transform:skew(-0.1deg);
  text-align:center;
  margin-bottom:80px;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(13/428));
      margin-bottom:calc(100vw*(40/428));
    }
`
const InputTop = styled.div`
    position:relative;
    width:100%;
    padding-bottom:60px;
    @media ${(props) => props.theme.mobile} {
        padding-bottom:calc(100vw*(30/428));
      }
`
const InputTitle = styled.label`
    display:inline-block;
    font-size:12px;
    padding-left:7px;
    margin-bottom:10px;
    font-weight:600;
    transform:skew(-0.1deg);
    @media ${(props) => props.theme.mobile} {
        font-size:calc(100vw*(12/428));
        padding-left:calc(100vw*(7/428));
        margin-bottom:calc(100vw*(9/428));
      }
`
const Input = styled.input`
  width:100%;
  height:43px;
  transform:skew(0.1deg);
  font-weight:600;
  font-size:15px;
  margin-bottom:15px;
  color:#4a4a4a;
  text-align:center;
  border-radius:4px;
  border:1px solid #e4e4e4;
  &:nth-child(6){margin-bottom:0;}
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(14/428));
      margin-bottom:calc(100vw*(15/428));
    }
`

const SubmitButton = styled.div`
  width:100%;
`
const Submit = styled.button`
  width:100%;
  height:66px;
  line-height:60px;
  font-size:20px;
  color:#fff;
  border-radius:11px;
  border:3px solid #e4e4e4;
  transition:all 0.3s;
  font-weight:800;
  background:${({active}) => active ? "#01684b" : "#979797"};
  border:${({active}) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(60/428));
      line-height:calc(100vw*(54/428));
      font-size:calc(100vw*(15/428));
    }
`
const ErrorMsg = styled.p`
  position:absolute;
  left:0;
  bottom:30px;
  width:100%;
  font-size:12px;color:#fe0101;
  font-weight:600;transform:skew(-0.1deg);
  text-align:center;
  @media ${(props) => props.theme.mobile} {
      bottom:calc(100vw*(15/428));
      font-size:calc(100vw*(12/428));
    }
`
const BottomBtns = styled.div`
  width:100%;
  margin-top:10px;
  display:flex;justify-content:space-between;
  align-items:center;
  @media ${(props) => props.theme.mobile} {
      margin-top:calc(100vw*(10/428));
    }
`
const Div = styled.div`

  @media ${(props) => props.theme.mobile} {

    }
`
const GoTxt = styled.p`
  font-size:13px;
  font-weight:600;
  display:inline-block;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    }
`
