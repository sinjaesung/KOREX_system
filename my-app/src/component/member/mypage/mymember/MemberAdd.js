//react
import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";
import crypto from 'crypto-js';

//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_1col_input_2, } from '../../../../theme';

//material-ui
import TextField from '@material-ui/core/TextField';
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Profile from '../../../../img/member/no_profile.png';
import Plus from '../../../../img/member/plus.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import Set from '../../../../img/member/setting.png';
import Add from '../../../../img/member/add_Btn.png';

//img

import { Mobile, PC } from "../../../../MediaQuery";

import MemberList from "./MemberList";
//server process
import serverController from '../../../../server/serverController';

//redux
import { useSelector } from 'react-redux';

export default function Member({ }) {
  //암호화 관련 처리
  console.log('crypto is 존재????:', crypto);

  const encrypt = (data, key) => {
    return crypto.AES.encrypt(data, key).toString();
  };

  const decrypt = (text, key) => {
    try {
      const bytes = crypto.AES.decrypt(text, key);
      // return JSON.parse(bytes.toString(crypto.enc.Utf8));
      return bytes.toString(crypto.enc.Utf8);
    } catch (err) {
      console.log('errorsss:', err);
    }
    return;
  }

  const login_user = useSelector(data => data.login_user);
  const history = useHistory();
  const [phonelist, setPhonelist] = useState([
    {
      id: 0
    },

  ]);/*기본값*/
  const [phoneindex, setPhoneindex] = useState(0);//mysql의 auto_increment 원리 사용.

  //phonelist wrap ref
  const phonelistRef = useRef();

  const [active, setActive] = useState(false);

  const [Option, setOption] = useState(false);
  /*const Encrypt = (theText) => {
    var output =new String;
    var Temp =new Array();
    var Temp2 = new Array();
    var Textsize= theText.length;

    for(let i=0; i<Textsize; i++){
     let rnd = Math.round(Math.random()*122) + 68;
      Temp[i] = theText.charCodeAt(i) + rnd;
      Temp2[i] = rnd;
    }
    for(let i=0; i<Textsize; i++){
      output += String.fromCharCode(Temp[i],Temp2[i]);
    }
    return output;
  }
  const unEncrypt = (theText) => {
    var output = new String;
    var Temp =new Array();
    var Temp2 = new Array();

    var Textsize=theText.length;
    for(let i=0; i<Textsize; i++){
      Temp[i] = theText.charCodeAt(i);
      Temp2[i] = theText.charCodeAt(i + 1);
    }
    for(let i=0; i<Textsize; i=i+2){
      output += String.fromCharCode(Temp[i] - Temp2[i]);
    }
    return output;
  }*/

  const aligoSmsSend = async (e) => {
    console.log("동작");
    console.log(active);
    if (active) {
      var body_info = {
        msg_type: 'LMS',
        title: '초대장전송'
      };
      let phonelist_sendcnt = phonelist.length; //총 보낼수. 수신번호<>수신메시지 매칭카운트수.
      body_info['cnt'] = phonelist_sendcnt;
      //rec1~500,msg1~500 ,msg:cnt 메시지 전송건수,titl둠나제조목,

      let invite_memid = login_user.memid;
      let invite_companyid = login_user.company_id;//어떤 사업체id의 소속인 관리자가 초대한건지
      let invite_mem_phone = login_user.phone;
      let invite_mem_usertype = login_user.user_type;//중개사,기업,분양대행사

      for (let i = 0; i < phonelist.length; i++) {
        let rec_string = 'rec_' + (i + 1);//rec_1,2,3,,4,.....수신자전화번호 키프로퍼티  총 보내어질 수신자의 종류수.
        let phone_value = String(phonelist[i].input_value); //각 수신자 휴대폰번호. 
        let msg_string = 'msg_' + (i + 1);//msg_1~2,3,4,,...수신자각 전화번호로 보낼 메시지 매칭메시지.
        //01092073834

        let info_querystring = 'invite_memid:' + invite_memid + ',invite_companyid:' + invite_companyid + ',invite_mem_phone:' + invite_mem_phone + ',invite_mem_usertype:' + invite_mem_usertype + ',receiver_phone:' + phone_value;
        console.log('info_querystringss:', info_querystring);

        console.log('info_querystringss encryptt:', encrypt(info_querystring, 'infoquerystring'));
        let info_querystring_encrypt = encrypt(info_querystring, 'infoquerystring');
        let info_querystring_recover = decrypt(info_querystring_encrypt, "infoquerystring");
        console.log('recoer quewrystingsss:', info_querystring_recover);

        // /기준으로 자른다. [] [] [] .....>> 그리고 스페이스형태로 처리.  xxx yyyy zzzz dddd 형태로 젅달되게 스페이스를 기준으로 일단 배열화하고 스페이스형태로 해서 합병한다.그리고 합병된 문자열이걸 스페이스를 기주으로 해서 배열로 한다음 각 배열부분에 /로 붙임.
        let info_querystring_encrypt_array = info_querystring_encrypt.split('/');
        let merge_querystring = '';
        for (let j = 0; j < info_querystring_encrypt_array.length; j++) {
          let item = info_querystring_encrypt_array[j];
          if (j == info_querystring_encrypt_array.length - 1) {
            merge_querystring += item;
          } else {
            merge_querystring += (item + ' ');
          }

        }
        console.log('넘길 쿼리스트링url:', merge_querystring);

        body_info[rec_string] = phone_value;
        body_info[msg_string] = '팀원으로의 초대장입니다. 아래의 링크를 복사하여 브라우저로 접속해주세요.\n\n https://korexpro.com/TeamLogin/' + merge_querystring; //초대자계정memid(로그인유저memid,휴대폰번호,받는사람번호,로그인초대자의 소속:(중개사인지,분양사인지,기업인지)/기업체명)                 
      }

      console.log('message send boy_Info data:', body_info);
      let res = await serverController.connectFetchController('/api/aligoSms_multiple', 'POST', JSON.stringify(body_info));
      console.log('aligosmsms send rse resultsss:', res);

      if (res.success) {
        alert('초대장이 전송되었습니다!');
        history.push('/Mypage');
      } else {
        alert('초대장 전송에 문제가 있습니다!');
      }
    } else {
      alert('휴대폰 번호가 잘못 입력 됐습니다. 다시 입력해주세요.');
    }
  }

  const phonelist_add = () => {
    console.log('phonelist state참조:', phonelist, phonelist.length);
    let make_phoneadd = {};
    let phoneindex_val = phoneindex;
    phoneindex_val++;
    setPhoneindex(phoneindex_val++);//+1씩증가. 추가할때마다 1씩증가.

    make_phoneadd['id'] = phoneindex_val; //0,1,2,3,4,...
    let new_phonelist = phonelist.concat(make_phoneadd);
    setPhonelist(new_phonelist);

  }

  //다중리스트 폰 정보 입력에 따른 처리.
  /*const phoneChange = (e) =>{ 
   var phonelistwrap_ref= phonelistRef.current;
   console.log('phonelistwrap ref참조:',phonelistwrap_ref);

   var phonelist_children=phonelistwrap_ref.children;
   console.log('pohonelist_children:',phonelist_children);
   var validation=true;
   for(let j=0; j<phonelist_children.length; j++){
     let child_div= phonelist_children[j];
     let get_input_element;
     for(let s=0; s<child_div.children.length; s++){
       if(child_div.children[s].tagName == 'INPUT'){
         get_input_element = child_div.children[s];
       }
     }
     if(get_input_element.value.length < 9){
       //항목중 하나라도 9자리 이하인게 발견된다면.유효성 비통과
       validation=false;
     }
   }
   console.log('validation check:',validation);
   
   setActive(validation);
  }*/
  useEffect(() => {
    console.log('phonelist state changes!!!:', phonelist);

    let is_valid = true;
    for (let u = 0; u < phonelist.length; u++) {
      if (phonelist[u].input_value) {
        if (phonelist[u].input_value.length < 9 || phonelist[u].input_value == '') {
          is_valid = false;
        }
      }
    }
    setActive(is_valid);
    /*if(checkVaildate())
       setActive(true);
    else
        setActive(false);*/
  }, [phonelist])


  return (
    <>
      <Wrapper>
        <p className="tit-a2">팀원 추가</p>
        <Sect_R2>
          {/* <InputTitle>휴대폰번호</InputTitle> */}
          <div id='phonelist_wrap' ref={phonelistRef} className="mt-1">
            {/*
                <InputInvite>
                  <Input type="email" name="" placeholder="휴대번호를 ’-‘를 빼고 입력하여주세요." onChange={phoneChange}/>
                  <Delete src={Close} alt="delete" onClick={phonelist_del}/>
                </InputInvite>
                <InputInvite>
                  <Input type="email" name="" placeholder="휴대번호를 ’-‘를 빼고 입력하여주세요." onChange={phoneChange}/>
                  <Delete src={Close} alt="delete" onClick={phonelist_del}/>
                </InputInvite>
                */}
            {
              phonelist.map((value, index) => {
                console.log('index what:', value.id, value);

                return (
                  <div className="par-spacing">
                    <MUTextField_100
                      placeholder="휴대번호를 '-' 빼고 입력해주세요."
                      id="outlined-basic"
                      label="휴대번호"
                      variant="outlined"
                      type="tel"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <Delete src={Close} alt="delete" onClick={() => {
                              console.log('해당 버튼 관련 요소 삭제 index::고유 지정index값 auto_increment형태:', value.id);
                              let prev_phonelist = [...phonelist];
                              let update_phonelist = prev_phonelist.filter(element => {
                                return element.id != value.id
                              });
                              setPhonelist(update_phonelist);
                              console.log('반영 phonelist:', phonelist);
                            }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        console.log(active);
                        console.log('각 휴대전화 요소 변경시에 관련 대상 state배열 요소 item 관련값 변경!');
                        const phoneRegex = /[^0-9\b]+$/;
                        let now_phonelist = [...phonelist];
                        for (let j = 0; j < now_phonelist.length; j++) {
                          if (now_phonelist[j].id == value.id) {
                            now_phonelist[j]['input_value'] = e.target.value
                          }
                        }
                        console.log(now_phonelist);
                        console.log('여기확인  ', value.input_value);
                        if (value.input_value == '') {
                          setOption(false);
                        } else {
                          setOption(true);
                        }
                        setPhonelist(now_phonelist);
                      }}
                    />
                    {/* <Input type="tel" name="" placeholder="휴대번호를 ’-‘를 빼고 입력하여주세요." value={value['input_value']} onChange={(e) => {
                            console.log('각 휴대전화 요소 변경시에 관련 대상 state배열 요소 item 관련값 변경!');
                            const phoneRegex = /[^0-9\b]+$/;
                            let now_phonelist=[ ... phonelist];
                            for(let j=0; j<now_phonelist.length; j++){
                              if(now_phonelist[j].id == value.id){
                                now_phonelist[j]['input_value'] = e.target.value
                              }
                            }
                            console.log(now_phonelist);
                            setPhonelist(now_phonelist);
                          }}/>
                          <Delete src={Close} alt="delete" onClick={()=>{
                            console.log('해당 버튼 관련 요소 삭제 index::고유 지정index값 auto_increment형태:',value.id);
                            let prev_phonelist=[ ... phonelist];
                            let update_phonelist=prev_phonelist.filter( element => {
                              return element.id != value.id
                            });
                            setPhonelist(update_phonelist);
                            console.log('반영 phonelist:',phonelist);
                          }}
                          /> */}
                  </div>
                )
              })
            }
          </div>
          {/* <AddBtn onClick={phonelist_add} /> */}
          <div className="par-spacing tAlign-r">
            <MUButton type="button" variant="outlined" onClick={phonelist_add}> 추가 </MUButton>
          </div>

          {/* <InviteButton>
            <Invite type="submit" active={active} onClick={() => {
              // /('정상적으로 초대 되었습니다.');
              // 이걸 누를시에 그냥 바로 알리고 문자 전송.초대장 전송. 피초대인 번호의 피초대인들한테 문자알리고발송진행..  
              // 초대인 소속, 초대인번호, 피초대인식별자포함 초대링크 생성.  초대링크에 포함되어있어야할것ㅇ 추정  초대인 아이디(memid),초대인번호, 피초대인번호 등 정보 포함.
              aligoSmsSend();
            }}>초대</Invite>
          </InviteButton> */}
          <div className="par-spacing mt-3">
            <MUButton_Validation variant="contained" disabled={!Option} type="submit" name="" active={Option} onClick={() => {
              // /('정상적으로 초대 되었습니다.');
              //이걸 누를시에 그냥 바로 알리고 문자 전송.초대장 전송. 피초대인 번호의 피초대인들한테 문자알리고발송진행..  
              //초대인 소속, 초대인번호, 피초대인식별자포함 초대링크 생성.  초대링크에 포함되어있어야할것ㅇ 추정  초대인 아이디(memid),초대인번호, 피초대인번호 등 정보 포함.
              aligoSmsSend();
            }}>초대</MUButton_Validation>
          </div>
        </Sect_R2>
      </Wrapper>
    </>
  );
}

const MUButton = styled(Button)``
const MUTextField = styled(TextField)``
const MUTextField_100 = styled(MUTextField)`
        &.MuiFormControl-root.MuiTextField-root {
          width:100%;    
  }
        `
//----------------------------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col_input_2}
`

const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`

const Delete = styled.img`
  display:inline-block;position:absolute;right:0;
  top:50%;transform:translateY(-50%);
  cursor:pointer;
  width:15px;
  margin-right : 10px;
  @media ${(props) => props.theme.mobile} {
    top: calc(100vw * (22/428));
    right: calc(100vw * (-35/428));
    width:calc(100vw*(15/428));
    }
`

// const WrapAdd = styled.div`
//   width:410px; margin:60px auto 0;
//   display:flex;justify-content:flex-start;
//   align-items:flex-start;flex-wrap:wrap;
//   flex-direction: column;
//   @media ${(props) => props.theme.mobile} {
//     width:100%;
//     margin:calc(100vw*(40/428)) auto 0;
//     flex-direction: column;
//     }
// `
// const InputTitle = styled.label`
//   display:inline-block;
//   font-size:12px;
//   padding-left:7px;
//   margin-bottom:10px;
//   font-weight:600;
//   transform:skew(-0.1deg);
//   @media ${(props) => props.theme.mobile} {
//       font-size:calc(100vw*(12/428));
//       padding-left:calc(100vw*(7/428));
//       margin-bottom:calc(100vw*(9/428));
//     }
// `
// const InputInvite = styled.div`
//   position:relative;
//   width:100%;
//   margin-bottom:10px;
//   &:last-child{margin-bottom:0;}
//   @media ${(props) => props.theme.mobile} {
//     margin-bottom:calc(100vw*(8/428));
//     &:last-child{margin-bottom:0;}
//     }
// `
// const Input = styled.input`
//   width:400px;height:43px;
//   border-radius:4px;text-align:center;
//   border:1px solid #e4e4e4;
//   font-size:15px;color:#707070;font-weight:600;transform:skew(-0.1deg);
//   &::placeholder{color:#979797;}
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(335/428));
//     height:calc(100vw*(43/428));
//     font-size:calc(100vw*(15/428));
//     padding-left: calc(100vw * (29 / 428));
//     }
// `

// const AddBtn = styled.div`
//   cursor:pointer;
//   width:43px;height:43px;
//   border-radius:4px;border:1px solid #707070;
//   background:#f8f7f7 url(${Add}) no-repeat center center;background-size:19px 19px;
//   margin:50px auto 60px;
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(43/428));
//     height:calc(100vw*(43/428));
//     margin:calc(100vw*(43/428)) auto;
//     background:#f8f7f7 url(${Add}) no-repeat center center;background-size:calc(100vw*(19/428)) calc(100vw*(19/428));
//     }
// `
// const InviteButton = styled.div`
//   width:100%;
// `
// const Invite = styled(Button)`
//   width: 100%;
//   height: 66px;
//   line-height:60px;
//   border-radius: 11px;
//   transition:all 0.3s;
//   color:#fff;
//   font-size:20px;font-weight:800;transform:skew(-0.1deg);
//   background:${({ active }) => active ? "#01684b" : "#979797"};
//   border:${({ active }) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
//   @media ${(props) => props.theme.mobile} {
//     width:100%;
//     /* height:calc(100vw*(60/428)); */
//     line-height:calc(100vw*(54/428));
//     /* font-size:calc(100vw*(15/428)); */
//   }
// `
