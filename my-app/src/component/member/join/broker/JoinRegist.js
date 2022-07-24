//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import serverController from '../../../../server/serverController';
import serverController2 from '../../../../server/serverController2';

//material-ui
import TextField from '@mui/material/TextField';
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@mui/material/Button';

//css
import styled from "styled-components"
//component
import JoinTopTxt from "./JoinTopTxt";

//img
import Check from "../../../../img/member/check.png";
import Checked from "../../../../img/member/checked.png";
import AddFileImg from "../../../../img/member/add_file.png";
import Delete from "../../../../img/member/delete_icon.png";
import Close from "../../../../img/main/modal_close.png";

export default function JoinTab() {

  const [image, setImage] = useState("");//이미지 url스트림 reader스트림 저장(이미지자체의 데이터표현)
  const [image2, setImage2] = useState("");
  const [businessmanpath, setbusinessmanpath] = useState('');//사업자등록증 첨부이미지파일
  const [mediationpath, setmediationpath] = useState('');//중개등록증 첨부이미지파일

  const [phone, setPhone] = useState("");/*기본값*/
  const [repname, setRepname] = useState("");
  const [reginum1, setReginum1] = useState("");
  const [reginum2, setReginum2] = useState("");
  const [reginum3, setReginum3] = useState("");

  /*사업자 등록 정상/오류 모달*/
  const [errorNum, setErrorNum] = useState("");
  const [errorNum2, setErrorNum2] = useState("");

  const [active, setActive] = useState(false);
  const [active2, setActive2] = useState(false);

  const phoneChange = (e) => { setPhone(e.target.value); }
  const repnameChange = (e) => { setRepname(e.target.value); }
  const reginum1Change = (e) => { setReginum1(e.target.value); }
  const reginum2Change = (e) => { setReginum2(e.target.value); }
  const reginum3Change = (e) => { setReginum3(e.target.value); }

  const checkVaildate = () => {
    return phone.length > 9
  }

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    console.log('the Filess what object??:', theFile);
    setbusinessmanpath(theFile);

    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      console.log('reader file reader onloadedds:', finishedEvent)
      const { currentTarget: { result } } = finishedEvent;
      console.log('resultsss>>>:filechange:', result);
      setImage(result);
    }
  }
  const onFileChange2 = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    console.log('the FIles what objects???:', theFile);
    setmediationpath(theFile);

    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      console.log('reader file reader onloadedss:', finishedEvent);
      const { currentTarget: { result } } = finishedEvent;
      console.log('resultsss>>>::filechanges:', result);
      setImage2(result);
    }
  }

  useEffect(() => {
    if (checkVaildate())
      setActive(true);
    else
      setActive(false);

  })

  const brokerIdentify_submit = async (e) => {
    console.log('brokerIdnetnify 중개사 인증submit 코렉스측 요청========================', phone, active, businessmanpath, mediationpath);

    var business_number = reginum1 + reginum2 + reginum3;
    if (active) {

      //xxx-xx-xxxxx 형태 문자열인가 적절여부 검사. 중개사회원 사업자등록번호 유효성 검사 여부 클라이언트 검사.(홈택스인증)
      var crnumber_sendinfo = {
        crNumber: business_number
      };
      console.log('crnubmer valition send data:', JSON.stringify(crnumber_sendinfo));
      var cr_validation_result = await serverController.connectFetchController("/api/auth/broker/crNumber_validation", "POST", JSON.stringify(crnumber_sendinfo));
      console.log('cr_validaiton_resultsss::', cr_validation_result);
      if (cr_validation_result) {
        if (cr_validation_result.result) {
          console.log("사업자등록번호 클라이언트단 유효성 검증여부 검사::", cr_validation_result.result);
          let result_object = cr_validation_result.result;

          console.log(result_object['message'].indexOf('등록되어 있지 않은'), result_object['messageEng'].indexOf('is not registered'));

          if (result_object['message'].indexOf('등록되어 있지 않은') >= 0 || result_object['messageEng'].indexOf('is not registered') >= 0) {
            //alert(result_object['trtcntn']);
            setErrorNum2(true);//사업자번호 부적절 모달 띄우기.
            return false;
          } else if (result_object['message'].indexOf('등록되어 있는') >= 0 && result_object['messageEng'].indexOf('is registered') >= 0) {
            //alert(result_object['trtcntn']);
            //setErrorNum(true);//사업자번호 적절or 정상등록 모달 띄우기.
          }
        }
      }
      //사업자번호 유효성 통과되었다면 등록 요청 진행.
      if (repname != '' && phone != '' && business_number != '' && businessmanpath && mediationpath) {
        let body_info = {
          repname: repname,
          phone: phone,
          businessnumber: business_number
        };
        let formData = new FormData();
        formData.append('repname', repname);
        formData.append('phone', phone);
        formData.append('businessnumber', business_number);
        formData.append('folder', 'realtorAuth');
        formData.append('businessmanpath', businessmanpath);
        formData.append('mediationpath', mediationpath);
        console.log('JSON.STRINGIFY(BODY_INFO):', formData);

        let res = await serverController2.connectFetchController("/api/auth/broker/brokerVerifyRequest", "POST", formData, function () { }, function (test) { console.log(test) });
        console.log('brokeverRefiyREquest res results:', res);

        if (res) {
          if (res.success) {
            setErrorNum(true);
          } else {
            alert(res.message);
          }

        } else {
          alert(res.message);
        }
      }

    }
  }

  return (
    <Container>
      <TopTxt>
        국가공간정보포털의 부동산중개업 정보에 등록된 대표공인중개사만 회원가입 가능합니다.<br />
        <br />
        담당매니저가 신청서 확인 후 연락드리겠습니다.
      </TopTxt>
      <WrapJoinInput>
        <InputTop>

          <MUTextField label="대표자명" name="repname" placeholder="대표자명을 입력해주세요." onChange={repnameChange} variant="outlined" />
          <MUTextField label="휴대전화" name="repphone" placeholder="휴대번호를 '-'를 빼고 입력해주세요." onChange={phoneChange} variant="outlined" />


          {/* <InputTitle>대표자명</InputTitle>
              <Input type="text" name="repname" placeholder="대표자명을 입력해주세요." onChange={repnameChange}/>
              <InputTitle>휴대전화</InputTitle>
              <Input type="text" name="repphone" placeholder="휴대번호를 '-'를 빼고 입력해주세요." onChange={phoneChange}/> */}
          <InputTitle>사업자 등록번호</InputTitle>
          <DIV>
            <MUTextField2 variant='outlined' name="reginum1" onChange={reginum1Change}/>
            {/* <RegistInput type="text" name="reginum1" onChange={reginum1Change}/> */}
            <Dash>-</Dash>
            <MUTextField2 variant='outlined' name="reginum2" onChange={reginum2Change}/>
            {/* <RegistInput type="text" name="reginum2" onChange={reginum2Change}/> */}
            <Dash>-</Dash>
            <MUTextField2 variant='outlined' name="reginum3" onChange={reginum3Change}/>
            {/* <RegistInput type="text" name="reginum3" onChange={reginum3Change}/> */}
          </DIV>
        </InputTop>


        {/*사진첨부*/}
        <AddFile>
          <Box>
            <InputTitle>사업자 등록증 첨부</InputTitle>
            <Files>
              {image ? (
                <ImgOn>
                  <UploadImg src={image} alt="img" />
                  <GoDelete>
                    <Link onClick={() => { setImage(false) }}>
                      <DeleteImg src={Delete} />
                    </Link>
                  </GoDelete>
                </ImgOn>
              )
                :
                <>
                  <InFile>
                    <InputFile type="file" name="" id="file1" onChange={onFileChange} />
                    <Label for="file1" />
                  </InFile>
                </>
              }
            </Files>
          </Box>
          {/*중개등록증*/}
          <Box>
            <InputTitle>중개등록증 첨부</InputTitle>
            <Files>
              {image2 ? (
                <ImgOn>
                  <UploadImg src={image2} alt="img" />
                  <GoDelete>
                    <Link onClick={() => { setImage2(false) }}>
                      <DeleteImg src={Delete} />
                    </Link>
                  </GoDelete>
                </ImgOn>
              )
                :
                <>
                  <InFile>
                    <InputFile type="file" name="" id="file2" onChange={onFileChange2} />
                    <Label for="file2" />
                  </InFile>
                </>
              }
            </Files>
          </Box>
        </AddFile>

        <SubmitButton>
          {/*정상 접수 됐을때(접수 완료 모달)*/}
          <Link onClick={brokerIdentify_submit}>
            {/* <Submit type="button" name="" active={active}>제출</Submit> */}
            <MUButton variant='contained' name="" active={active}>제출</MUButton>
          </Link>
          {/*접수 오류 됐을때(접수 오류 모달)*/}
          <Link onClick={() => { setErrorNum2(true) }} style={{ display: "none" }}>
            {/* <Submit2 type="button" name="" active={active}>제출</Submit2> */}
            <MUButton variant='contained' name="" active={active}>제출</MUButton>
          </Link>
          {/*접수 완료 모달창*/}
          {
            errorNum ?
              <ErrorModal>
                <Bg onClick={() => { setErrorNum(false) }} />
                <WrapError>
                  <CloseBtn>
                    <Link onClick={() => { setErrorNum(false) }}>
                      <CloseImg src={Close} />
                    </Link>
                  </CloseBtn>
                  <Title>접수 완료</Title>
                  <BodyTxt>
                    정상 접수되었습니다.<br />
                    담당매니저가 확인 후 신속하게 연락드리겠습니다.
                  </BodyTxt>
                  <Link to="/">
                    {/* <ConfirmBtn type="button" name="">확인</ConfirmBtn> */}
                    <Button variant='contained' name="">확인</Button>
                  </Link>
                </WrapError>
              </ErrorModal>
              :
              null
          }
          {/*접수 오류 모달*/}
          {
            errorNum2 ?

              <ErrorModal>
                <Bg onClick={() => { setErrorNum2(false) }} />
                <WrapError>
                  <CloseBtn>
                    <Link onClick={() => { setErrorNum2(false) }}>
                      <CloseImg src={Close} />
                    </Link>
                  </CloseBtn>
                  <Title>접수 오류</Title>
                  <BodyTxt>
                    사업자상태가 유효하지 않습니다.<br />
                    사업자번호를 다시 확인바랍니다.
                  </BodyTxt>
                  <ConfirmBtn type="button" name="" onClick={() => { setErrorNum2(false) }}>확인</ConfirmBtn>
                </WrapError>
              </ErrorModal>
              :
              null
          }
        </SubmitButton>
      </WrapJoinInput>
    </Container>
  );
}
const DIV = styled.div`
      display: flex;
    justify-content: center;
    align-items: center;
`

const MUButton = MUstyled(Button)`
  // margin-bottom: 10px;
  width: 100%;
`
const MUTextField = MUstyled(TextField)`
  margin-bottom: 10px;
  width: 100%;
`
const MUTextField2 = MUstyled(TextField)`
  width : 30%;
`

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
    width:600px;
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
  margin-bottom:50px;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(13/428));
      margin-bottom:calc(100vw*(40/428));
    }
`
const InputTop = styled.div`
    position:relative;
    width:100%;
    @media ${(props) => props.theme.mobile} {

      }
`
const InputTitle = styled.label`
    display:block;
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
  color:#4a4a4a;
  text-align:center;
  border-radius:4px;
  border:1px solid #e4e4e4;
  margin-bottom:10px;
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(14/428));
    }
`
const RegistInput = styled.input`
  width:124px;height:43px;
  text-align:center;
  font-weight:600;
  font-size:15px;
  color:#4a4a4a;
  border-radius:4px;
  border:1px solid #e4e4e4;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(113/428));
      font-size:calc(100vw*(14/428));
      height:calc(100vw*(43/428));
    }
`
const Dash = styled.span`
  display:inline-block;
  margin:0 6px;vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
      margin:0 calc(100vw*(5/428));
      font-size:calc(100vw*(10/428));
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
  background:${({ active }) => active ? "#01684b" : "#979797"};
  border:${({ active }) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(60/428));
      line-height:calc(100vw*(54/428));
      font-size:calc(100vw*(15/428));
    }
`
const Submit2 = styled(Submit)`
  background:${({ active2 }) => active2 ? "#01684b" : "#979797"};
  border:${({ active2 }) => active2 ? "3px solid #04966d" : "3px solid #e4e4e4"};
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
      bottom:calc(100vw*(18/428));
      font-size:calc(100vw*(12/428));
    }
`
const AddFile = styled.div`
  width:100%;
  display:flex;justify-content:space-between;
  margin:14px 0 60px;
  @media ${(props) => props.theme.mobile} {
      width:100%;
      margin:calc(100vw*(14/428)) 0 calc(100vw*(60/428));
    }
`
const Box = styled.div`
  width:195px;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(177/428));
    }

`
const Files = styled.div`
  width:100%;height:auto;
`
const InFile = styled.div`
  width:100%;
  height:106px; border-radius:4px;border:1px solid #a3a3a3;
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(96/428));
    }
`
const InputFile = styled.input`
  display:none;
`
const Label = styled.label`
  display:inline-block;
  width:100%;height:100%;cursor:pointer;
  background:url(${AddFileImg}) no-repeat center center;background-size:46px 46px;
  @media ${(props) => props.theme.mobile} {
      background-size:calc(100vw*(38/428)) calc(100vw*(38/428));
    }
`
const ImgOn = styled.div`
  position:relative;
  width:100%;max-height:260px;
  border:1px solid #a3a3a3;border-radius:4px;
  @media ${(props) => props.theme.mobile} {
      max-height:calc(100vw*(260/428));
    }
`
const UploadImg = styled.img`
  width:100%;
`
const GoDelete = styled.div`
  position:absolute;
  right:5px;top:5px;
  width:29px;height:29px;
  text-align:center;
  border-radius:3px;border:1px solid #d0d0d0;
  background:#fff;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(29/428));
      height:calc(100vw*(29/428));
      right:calc(100vw*(5/428));top:calc(100vw*(5/428));
    }
`
const DeleteImg = styled.img`
  display:inline-block;
  width:17px;margin-top:5px;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(17/428));
      margin-top:calc(100vw*(5/428));
    }
`
const NextBtn = styled.button`
  width:100%;
  height:66px;
  line-height:60px;
  font-size:20px;
  color:#fff;
  border-radius:11px;
  border:3px solid #e4e4e4;
  transition:all 0.3s;
  font-weight:800;
  background:${({ active }) => active ? "#01684b" : "#979797"};
  border:${({ active }) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(60/428));
      line-height:calc(100vw*(54/428));
      font-size:calc(100vw*(15/428));
    }
`
const ErrorBtn = styled(NextBtn)`
`
const ErrorModal = styled.div`
  width:100%;
  position:fixed;
  left:0;top:0;height:100%;
  z-index:4;
`
const Bg = styled.div`
  position:fixed;
  left:0;top:0;
  width:100%;height:100%;background:rgba(0,0,0,0.2);
  z-index:1;content:'';display:block;
`

const WrapError = styled.div`
  position:Absolute;
  width:535px;height:520px;
  padding:87px 64px 0;
  border-radius:24px;
  border:1px solid #f2f2f2;
  left:50%;top:50%;transform:translate(-50%,-50%);
  background:#fff;
  z-index:2;box-sizing:border-box;
  @media ${(props) => props.theme.container} {
      height:calc(100vw*(650/1436));
    }

  @media ${(props) => props.theme.mobile} {
      width:90%;
      height:calc(100vw*(400/428));
      padding:calc(100vw*(64/428)) calc(100vw*(20/428)) 0;
    }
`
const CloseBtn = styled.div`
  position:absolute;
  right:48px;top:48px;
  @media ${(props) => props.theme.mobile} {
      right:calc(100vw*(24/428));
      top:calc(100vw*(24/428));
    }
`
const CloseImg = styled.img`
  width:15px;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(12/428));
    }
`
const Title = styled.h2`
  font-size:20px;color:#707070;
  padding-bottom:20px;transform:skew(-0.1deg);
  font-weight:600;
  border-bottom:1px solid #a3a3a3;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
      padding-bottom:calc(100vw*(15/428));
    }
`
const BodyTxt = styled.div`
  padding:85px 0;text-align:center;transform:skew(-0.1deg);
  font-size:15px;color:#4a4a4a;line-height:2;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
      padding:calc(100vw*(70/428)) 0;
    }
`
const ConfirmBtn = styled.button`
  width:100%;height:66px;line-height:60px;color:#fff;
  background:#01684b;border:3px solid #04966d;transform:skew(-0.1deg);
  border-radius:11px;font-size:20px;font-weight:600;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
      height:calc(100vw*(60/428)); line-height:calc(100vw*(54/428));
    }
`
