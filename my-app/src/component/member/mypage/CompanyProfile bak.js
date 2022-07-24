//react
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
//server process
import serverController2 from '../../../server/serverController2';
import serverController from '../../../server/serverController';

//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_1col_input, } from '../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

//img
import Img from '../../../img/member/company_no.png';
import Louder from '../../../img/member/louder.png';
import Checking from '../../../img/member/checking.png';
import RightArrow from '../../../img/notice/right_arrow.png';
import Plus from '../../../img/member/plus.png';
import Close from '../../../img/main/modal_close.png';

//component
import { Modal_AddressApi } from '../../common/modal/modal_AddressApi';

//redux
import { useSelector } from 'react-redux';

//search address
import AddressSearchapi from '../../../component/common/addressSearchApi';

export default function JoinInput({ setcompanyname, setCompanyImg, setAddressroad, setAddressjibun, setAddressdetail, setphone, setCeoname, setCeophone, companyname, companyImg, addressdetail, addr_road, addr_jibun, phone, ceoname, ceophone, originuserinfo, store_submit, search_address, setSearch_address, active }) {
  const login_user = useSelector(data => data.login_user);
  //console.log('login_user::',login_user.company_id);

  console.log('컴포넌트 실행진행>>>', originuserinfo);
  const [hash, setHash] = useState("");
  const [addressApi, setAddressApi] = useState(false);


  //회사정보 수정. 회사프로필 수정시에 change발생시마다 insert가 이뤄지게 일단 한다.사진 이미지 변경처리.
  const CompanyImgChange = async (e) => {
    const {
      target: { files }
    } = e;
    const theFile = files[0];
    console.log('fielchangess the Filess:', theFile);

    const formData = new FormData();

    formData.append('folder', 'companyprofile');
    formData.append('company_id', login_user.company_id);
    formData.append('company_image', theFile);

    console.log('file form data:', formData);
    //setCompanyImg(theFile);

    console.log('>>>>formdata json::', JSON.stringify(formData));
    let server_request = await serverController2.connectFetchController('/api/fileupload/companyprofile_insertupdate', 'POST', formData);
    if (server_request) {
      console.log('--->>>>server requestsss:', server_request);

      if (server_request.success) {
        let result_imagelist = server_request.result;

        setCompanyImg(result_imagelist[0]);
      } else {
        alert(server_request.message);
      }
    }
  }


  const companyNameChange = (e) => {
    console.log('companynamechange:', e.target.value);
    setcompanyname(e.target.value);
  }

  const phoneChange = (e) => {
    const regex = /^[0-9\b]+$/;
    if (regex.test(e.target.value)) {
      setphone(e.target.value);
    }
  }

  const ceoNameChange = (e) => {
    setCeoname(e.target.value);
  }

  const ceoPhoneChange = (e) => {
    const regex = /^[0-9\b]+$/;
    if (regex.test(e.target.value)) {
      setCeophone(e.target.value);
    }
  }
  const hashTagChange = (e) => { setHash(e.target.value); }

  /*useEffect(()=>{
    console.log('여러 임의 요소 상태값 변겨:',search_address,companyname,addressdetail,addr_road,addr_jibun,phone,ceoname,ceophone,companyImg);
  });*/



  return (
    <>
      <Wrapper>
        <p className="tit-a2">회사 프로필 설정</p>
        <div className="par-indent-left">
          <div className="capt-00 par-spacing">
            <p>{originuserinfo.company_no}</p>
            <p>초기등록자: {originuserinfo.originusername}</p>
            <p>초기등록자 계정: {originuserinfo.originuserphone}</p>
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          <div className="par-spacing">
            <WrapProfileImg>
              <ProfileImg>
                <Image src={companyImg ? companyImg : Img} />
                <File type="file" name="" id="file" accept="image/*" onChange={CompanyImgChange} />
                <Label for="file" />
              </ProfileImg>
            </WrapProfileImg>
          </div>
          {/* <InputTitle>상호명</InputTitle>
                <InputBox type="text" name="" placeholder="상호명을 입력해주세요." onChange={companyNameChange} value={companyname}/> */}
          <div className="par-spacing">
            <MUTextField variant="standard" label="상호명" type="text" placeholder="상호명을 입력해주세요." onChange={companyNameChange} value={companyname} />
          </div>
          <br />
          <div className="par-spacing" className="clearfix">
            {/* <InputTitle>주소</InputTitle> */}
            <ButtonAddrSearch variant="contained" disableElevation onClick={() => {
              setAddressApi(true);
            }}>주소 검색</ButtonAddrSearch>
          </div>
          {/* <Flex> */}
          {/* <InputBoxShort type="text" name="" value={addr_road}/> */}
          <div className="par-spacing">
            <MUTextField disabled type="text" placeholder="도로명 주소" value={addr_road} variant="standard" />
          </div>
          {/* <SearchAddressBtn type="button" name="" onClick={() => {
                    setAddressApi(true);
                  }}>주소 검색</SearchAddressBtn> */}
          {/* </Flex> */}
          {
            addressApi ?
              // <AddressApi>
              //   <CloseImg src={Close} onClick={() => { setAddressApi(false); }} />
              //   {/* <AddressSearchapi setSearch_address={setSearch_address} setAddressApi={setAddressApi} setAddressdetail={setAddressdetail} setAddressroad={setAddressroad} setAddressjibun={setAddressjibun} /> */}
              //   <AddressSearchapi setSearch_address={setSearch_address} setAddressApi={setAddressApi} setAddressdetail={setAddressdetail} setAddressroad={setAddressroad} setAddressjibun={setAddressjibun} />
              // </AddressApi>
              <Modal_AddressApi title="주소 검색" open={addressApi} handleOpen={setAddressApi} >
                <AddressSearchapi setSearch_address={setSearch_address} setAddressApi={setAddressApi} setAddressdetail={setAddressdetail} setAddressroad={setAddressroad} setAddressjibun={setAddressjibun} />
              </Modal_AddressApi>
              :
              null
          }
          {/* <InputBoxMarginbt type="text" name="" placeholder="지번주소를 입력해주세요." value={addr_jibun}/> */}
          {/* <InputBoxMarginbt type="text" name="" placeholder="상세주소를 입력해주세요." value={addressdetail}/> */}
          <div className="par-spacing">
            <MUTextField variant="standard" disabled type="text" placeholder="지번 주소" value={addr_jibun} />
          </div>
          <div className="par-spacing">
            <MUTextField variant="standard" defaultValue="Hello world" label="상세주소" type="text" value={addressdetail} />
          </div>
          <br />

          {/* <InputTitle>전화번호</InputTitle>
                <InputBox type="text" name="" placeholder="전화번호를 ’-‘를 빼고 입력하여주세요." onChange={phoneChange} value={phone}/> */}
          <div className="par-spacing">
            <MUTextField variant="standard" label="전화번호" type="text" helperText="전화번호를 ’-‘를 빼고 입력하여주세요" onChange={phoneChange} value={phone} />
          </div>

          {/* <InputTitle>대표명</InputTitle>
                <InputBox type="text" name="" placeholder="이름을 입력하여주세요." onChange={ceoNameChange} value={ceoname}/> */}
          <div className="par-spacing">
            <MUTextField variant="standard" label="대표명" type="text" placeholder="이름을 입력하여주세요." onChange={ceoNameChange} value={ceoname} />
          </div>
          {/* <InputTitle>대표 휴대폰 번호</InputTitle>
                <InputBox type="text" name="" placeholder="휴대번호를 ’-‘를 빼고 입력하여주세요." onChange={ceoPhoneChange} value={ceophone}/> */}
          <div className="par-spacing">
            <MUTextField variant="standard" label="대표 휴대폰 번호" type="text" placeholder="휴대번호를 ’-‘를 빼고 입력하여주세요." helperText="휴대번호를 ’-‘를 빼고 입력하여주세요" onChange={ceoPhoneChange} value={ceophone} />
          </div>
          {/*전문 중개사인 경우에만 해쉬태그 노출*/}
          {/*
              <OutInputBox>
                <InputTitle>해쉬태그 입력 (e.g 상가 , 사무실 , 아파트·현대아이리스 etc)</InputTitle>
                <InputBox type="text" name="" placeholder=" ’#‘를 빼고 입력하여주세요." onChange={hashTagChange}/>
              </OutInputBox>
            */}

          {/*버튼*/}
          <div className="par-spacing">
            <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={store_submit}>저장</MUButton_Validation>
          </div>
        </Sect_R2>
      </Wrapper>
    </>
  );
}

//--------------------------------------------------------------
const MUTextField = styled(TextField)`
  &.MuiFormControl-root.MuiTextField-root {
    width: 100%;
  }
  & .MuiInputBase-root.MuiInput-root {
  }  
`
const MUButton = styled(Button)``

const CloseImg = styled.img`
  position:Absolute;top:20px;right:10px;
  width:18px;
  cursor:pointer;
`
const AddressApi = styled.div`
  position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
  width:450px;height:auto;z-index:2;
  border:1px solid #eee;
  background:#fff;
  padding:70px 10px 0;
`
//-------------------------------------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col_input}
`


const WrapProfileImg = styled.div`
  text-align: center;
`
const ProfileImg = styled.div`
  display:inline-block;
  width:101px;height:101px;
  position:relative;
  border: solid 1px #e4e4e4;
  border-radius: 9px;
`
const File = styled.input`
  display:none;
`
const Label = styled.label`
  display:inline-block;
  width:27px;height:27px;
  position:absolute;right:-5px;bottom:-5px;
  background:url(${Plus}) no-repeat;background-size:100% 100%;
  cursor:pointer;
`
const Image = styled.img`
  width:100%;height:100%;
`

const ButtonAddrSearch = styled(MUButton)`
float:right;
`
const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`