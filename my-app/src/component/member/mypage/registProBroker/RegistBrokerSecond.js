//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col_input, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

//img
import Check from '../../../../img/map/radio.png';
import Checked from '../../../../img/map/radio_chk.png';
import Search from '../../../../img/map/search.png';
import Close from '../../../../img/main/modal_close.png';
import AddFileImg from "../../../../img/member/add_file.png";
import Delete from "../../../../img/member/delete_icon.png";

import { Mobile, PC } from "../../../../MediaQuery";

import MapApi from './MapApi.js';

//redux
import { useSelector } from 'react-redux';
import { temp_ProbrokerRegister } from '../../../../store/actionCreators';

export default function RegistSecond({ }) {
  const history = useHistory();

  const temp_probrokerRegister = useSelector(data => data.temp_probrokerRegister);

  console.log('===>>registsecond registebrokerSecondss:', temp_probrokerRegister);

  const [image, setImage] = useState("");//사업자등록증 이미지 데이터
  const [image2, setImage2] = useState(""); //중개등록증 이미지 데이터
  const [companyregpath, setcompanyregpath] = useState('');
  const [realtorregpath, setrealtorregpath] = useState('');
  const [active, setactive] = useState(false);

useEffect(() => {
  console.log("변한다");
  if(image == '' || image2 == '' ){
    setactive(false);
  }else{
    setactive(true);
  }
}, [image,image2])


  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    setcompanyregpath(theFile);

    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent;
      setImage(result);
    }
  }
  const onFileChange2 = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    setrealtorregpath(theFile);

    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent;
      setImage2(result);
    }
  }

  const nextStep = () => {
    if(active == true){

      if (companyregpath && realtorregpath) {
        temp_ProbrokerRegister.companyregfilechange({ companyregfile: companyregpath });
        temp_ProbrokerRegister.realtorfilechange({ realtorfile: realtorregpath });
        
        history.push('/RegistProBrokerThird');
      }
    }else{
      
    }
  }


  return (
    <>
      <Wrapper>
        <p className="tit-a2">등록증 첨부</p>
        {/* <Sect_R1>
          <div className="par-indent-left">
            <div className="par-spacing">
              <Desc>
                <p>
                  전문중개업소로 승인된 중개사회원만 KOREX 전속매물을 등록 거래할 수 있습니다.<br />
                  종목별로 복수 선택은 가능하며, 단지는 아파트, 오피스텔별로 각각 1개씩만 신청 가능합니다.<br />
                  전문중개업소 심사를 위해서 담당매니저가 신청서 확인 후 연락 드립니다.
                </p>
              </Desc>
            </div>
          </div>
        </Sect_R1> */}
        <div className="divider-a1" />
        {/*사진첨부*/}
        <Sect_R2>
          <div className="par-spacing">
            <div className="flex-spabetween-center">
              <MUFormControl>
                <FormLabel >사업자등록증 첨부</FormLabel>
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
              </MUFormControl>
              {/*중개등록증*/}
              <MUFormControl>
                <FormLabel >중개등록증 첨부</FormLabel>
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
              </MUFormControl>
            </div>
          </div>
        <div className="par-spacing">
            <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={nextStep}>다음</MUButton_Validation>
        </div>
        {/* <OldButton onClick={nextStep}> */}
        {/*<Link to="/RegistProBrokerThird" className="data_link"/>*/}
        {/* <Next type="submit">다음</Next>
          </OldButton> */}
      </Sect_R2>
    </Wrapper>
    </>
  );
}

const MUFormGroup = styled(FormGroup)`
    &.MuiFormGroup-root {
        flex-direction: row;
        flex-wrap: nowrap;
    }
`
const MUCheckbox = styled(Checkbox)``

const MUFormControl = styled(FormControl)`
  &.MuiFormControl-root {
    width:100%;
 }
`
const MUButton = styled(Button)``

const MUTextField = styled(TextField)`
  &.MuiFormControl-root.MuiTextField-root {
    width: 100%;
  }
  & .MuiInputBase-root.MuiInput-root {
    //margin-top:16px;
  } `

const ButtonAddrSearch = styled(MUButton)`
float:right;
`
//--------------------------------------------------

const Wrapper = styled.div`
    ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R1 = styled.div``

const Sect_R2 = styled.div`
${TtCon_1col_input}
`
const Desc = styled.div`
font-size:${(props) => props.theme.typography.fontSize.sm};
`

const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`

const Files = styled.div`
  margin:0.5rem 1rem 1rem;
`

const InFile = styled.div`
  &:after {
  content: "";
  display: block;
  padding-bottom: 100%;
  }
  position:relative;
  border-radius:4px;
  border:1px solid #a3a3a3;
`
const InputFile = styled.input`
  display:none;
`
const Label = styled.label`
  display:inline-block;
  width:100%;height:100%;
  position:absolute;
  cursor:pointer;
  background:url(${AddFileImg}) no-repeat center center;background-size:3rem 3rem;
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