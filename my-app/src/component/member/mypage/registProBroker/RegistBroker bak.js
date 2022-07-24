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
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

//component
import { Mobile, PC } from "../../../../MediaQuery";
import BootstrapDialogTitle from '../../../common/modal/bootstrapDialogTitle';

import MapApi from './MapApi.js';//아파트 다음주소검색api로 나온 검색한 도로명주소,지번주소값 도로며주소(건물아파트명포함)한형태로 그냥 아파트명은 들어가게끔 처리.
import MapApi2 from './MapApi2.js'; //오피스텔이면 다음주소검색ㅁapi로 오피명까진 주소검색api에선 안나오기에 채우지못함.

//server process
import serverController from '../../../../server/serverController';

//redux
import { temp_ProbrokerRegister } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';

export default function Regist({ }) {
    const history = useHistory();
    const login_user = useSelector(data => data.login_user);

    const [addressApi, setAddressApi] = useState(false);
    const [addressApi2, setAddressApi2] = useState(false);

    const [apart_addr_road, setapart_addr_road] = useState('');//어떤 아파트도로명주소값으로 지정했는지
    const [officetel_addr_road, setofficetel_addr_road] = useState('');//어떤 오피스텔도로명주소값으로 했는지
    const [aptname, setaptname] = useState('');
    const [officetelname, setofficetelname] = useState('');
    const [isstore, setisstore] = useState(false);
    const [isoffice, setisoffice] = useState(false);//상가사무실체크여부.
    const [isapart, setisapart] = useState(false);
    const [isofficetel, setisofficetel] = useState(false);

    const [apartCheckOption, setApartCheckOption] = useState(false);  // 아파트 체크 유무
    const [OfficetelsCheckOption, setOfficetelsCheckOption] = useState(false); //오피스텔 체크 유무

    const [NextButtonOption, setNextButtonOption] = useState(false); //nextButton coloer option

    const next_step = async () => {
        if (isstore + isoffice + isapart + isofficetel == 0){
            setNextButtonOption(false)
            alert('선택된 항목이 없습니다.');
            return
        }else{
            setNextButtonOption(true)
            if (OfficetelsCheckOption == true && officetelname == ''){
                alert('오피스텔명을 입력하세요.')
                return
            }else{
                
            console.log('====>>다음단계 버튼 클릭진행>>>', apart_addr_road, officetel_addr_road, aptname, officetelname, isstore, isoffice, isapart, isofficetel);
            
            temp_ProbrokerRegister.apartaddr_roadchange({ apartaddr_road: apart_addr_road });
            temp_ProbrokerRegister.officeteladdr_roadchange({ officeteladdr_road: officetel_addr_road });
            temp_ProbrokerRegister.apartnamechange({ apartname: aptname });
            temp_ProbrokerRegister.officetelnamechange({ officetelname: officetelname });
            temp_ProbrokerRegister.isstorechange({ isstore: isstore });
            temp_ProbrokerRegister.isofficechange({ isoffice: isoffice });
            temp_ProbrokerRegister.isapartchange({ isapart: isapart });
            temp_ProbrokerRegister.isofficetelchange({ isofficetel: isofficetel });
            
            let body_info = {
                company_id: login_user.company_id
            }
            //다음단계로 넘어갈때 어디로 넘어가질지를 분기한다. comapny2테이블 현재 로그인 중개사comapnyid소속 중개사에 중개등록증,사벙바즐독증 업로드되어있는상태인지 아닌지 여부.
            let fileupload_path_exists = await serverController.connectFetchController('/api/broker/brokerVerify_fileupload_exists', 'POST', JSON.stringify(body_info));
            if (fileupload_path_exists) {
                console.log('fileupadlo path exitsss:', fileupload_path_exists);
                
                if (fileupload_path_exists.type == 'exists') {
                    temp_ProbrokerRegister.companyregfilechange({ companyregfile: '' });
                    temp_ProbrokerRegister.realtorfilechange({ realtorfile: '' });
                    history.push('/RegistProBrokerThird');
                } else if (fileupload_path_exists.type == 'notexists') {
                    history.push('/RegistProBrokerSecond');
                }
            }
        }
    }
    }
    
    useEffect(() => {
        console.log(NextButtonOption);
        console.log('변경내용 정보 진행>>>', apart_addr_road, officetel_addr_road, aptname, officetelname, 'isapart', isapart,'isofficetel', isofficetel, isstore, isoffice);
        if (isstore + isoffice + isapart + isofficetel == 0 ? false : true){
            setNextButtonOption(false)
        }else{
            setNextButtonOption(true)
        }
    }, [apart_addr_road, officetel_addr_road, aptname, officetelname, isstore, isoffice]);

    

    const ChangeOfficetelname =(e)=>{
        console.log(e.target.value);
        setofficetelname(e.target.value);
    }

    return (
        <>
            <Wrapper>
                <p className="tit-a2">전문종목 선택</p>
                <Sect_R1>
                    <div className="par-indent-left">
                        <div className="par-spacing">
                            <Desc>
                                <p>전문중개업소로 승인된 중개사회원만 KOREX 전속매물을 등록 거래할 수 있습니다.<br />
                                    종목별로 복수 선택은 가능하며, 단지는 아파트, 오피스텔별로 각각 1개씩만 신청 가능합니다.<br />
                                    전문중개업소 심사를 위해서 담당매니저가 신청서 확인 후 연락 드립니다.</p>
                            </Desc>
                        </div>
                    </div>
                </Sect_R1>
                <div className="divider-a1" />
                <Sect_R2>

                    <div className="par-spacing">


                        {/* <Checkbox>
                                <InputCheck type="checkbox" name="pro" id="pro1" onChange={(e) => {
                                    if (e.target.checked) {
                                        setisofficetel(1);
                                    } else {
                                        setisofficetel(0);
                                    }
                                }} />
                                <CheckLabel for="pro1">
                                    <Span />
                                    아파트
                                </CheckLabel>
                            </Checkbox> */}

                        <MUFormGroup>
                            <FormControlLabel control={<Checkbox checked={apartCheckOption} onChange={(e) => {
                                if (e.target.checked) {
                                    setApartCheckOption(true);
                                    setisapart(1);
                                    setAddressApi(true);
                                } else {
                                    setisapart(0);
                                    setAddressApi(false);
                                    setApartCheckOption(false);
                                    setapart_addr_road('');
                                    setaptname('');
                                }
                            }} />} label="아파트" />
                            {/* <ButtonAddrSearch variant="contained" disableElevation onClick={() => {
                                setAddressApi(true);
                                setCheckOption(true);
                            }}>주소 검색</ButtonAddrSearch> */}
                        </MUFormGroup>

                        <div className="par-indent-left">
                            <div className="par-spacing">
                                <MUTextField variant="standard" disabled type="text" placeholder="도로명 주소" value={apart_addr_road} />
                            </div>
                            {/* <div className="par-spacing">
                                <MUTextField variant="standard" disabled type="text" placeholder="지번 주소" value={aptname} />
                            </div> */}

                        </div>
                        {/* 
                        <SearchBox>
                            <TextField type="text" label="중개의뢰 가능한 단지 검색" variant="outlined" placeholder="중개의뢰 가능한 단지 검색" value={apart_addr_road} onClick={() => { setAddressApi(true); }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <SearchIcon type="submit" name="" />
                                        </InputAdornment>
                                    ),
                                }} /> */}

                        {/* 
                            <Label>중개의뢰 가능한 단지 검색</Label>
                            <InBox>
                                <InputSearch type="search" placeholder="중개의뢰 가능한 단지 검색" value={apart_addr_road} onClick={() => { setAddressApi(true); }} />
                                <SearchIcon />
                            </InBox> */}



                        {/* </SearchBox> */}


                    </div>
                    <div className="par-spacing">
                        {/* <CheckBoxN>
                                <InputCheck type="checkbox" name="pro" id="pro2" onChange={(e) => {
                                    if (e.target.checked) {
                                        setisofficetel(1);
                                    } else {
                                        setisofficetel(0);
                                    }
                                }} />
                                <CheckLabel for="pro2">
                                    <Span />
                                    오피스텔
                                </CheckLabel>
                            </CheckBoxN> */}

                        <MUFormGroup>
                            <FormControlLabel control={<Checkbox checked={OfficetelsCheckOption} onChange={(e) => {
                                if (e.target.checked) {
                                    setOfficetelsCheckOption(true);
                                    setisofficetel(1);
                                    setAddressApi2(true);
                                } else {
                                    setisofficetel(0);
                                    setAddressApi2(false);
                                    setOfficetelsCheckOption(false);
                                    setofficetel_addr_road('');
                                    setofficetelname('');
                                }
                            }} />} label="오피스텔" />
                            {/* <ButtonAddrSearch variant="contained" disableElevation onClick={() => {
                                setAddressApi2(true);
                            }}>주소 검색</ButtonAddrSearch> */}
                        </MUFormGroup>
                        <div className="par-indent-left">
                            <div className="par-spacing">
                                <MUTextField variant="standard" disabled type="text" placeholder="도로명 주소" value={officetel_addr_road} />
                            </div>
                            {/* <div className="par-spacing">
                                <MUTextField variant="standard" disabled type="text" placeholder="지번 주소" value={officetelname} />
                            </div> */}
                            <div className="par-spacing">
                                <MUTextField required variant="standard" label="오피스텔명" placeholder="오피스텔 명칭을 정확히 입력하세요" type="text" onChange={ChangeOfficetelname} value={officetelname} />
                            </div>
                        </div>
                        {/* <SearchBox>
                            <TextField type="text" label="중개의뢰 가능한 단지 검색" variant="outlined" placeholder="중개의뢰 가능한 단지 검색" value={officetel_addr_road} onClick={() => { setAddressApi2(true); }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <SearchIcon type="submit" name="" />
                                        </InputAdornment>
                                    ),
                                }} /> */}

                        {/* <Label>중개의뢰 가능한 단지 검색</Label>
                            <InBox>
                                <InputSearch type="search" placeholder="중개의뢰 가능한 단지 검색" value={officetel_addr_road} onClick={() => { setAddressApi2(true); }} />
                                <SearchIcon />
                            </InBox> */}
                        {/* </SearchBox> */}


                        {/* <OffictelName>
                            <TextField type="text" label="오피스텔명" variant="outlined" placeholder="오피스텔의 정확한 이름을 입력하여주세요." value={officetelname} onChange={(e) => {
                                setofficetelname(e.target.value);
                            }} /> */}

                        {/* <Label>오피스텔명</Label> */}
                        {/* <InputText type="text" placeholder="오피스텔의 정확한 이름을 입력하여주세요." value={officetelname} onChange={(e) => {
                                setofficetelname(e.target.value);
                            }} /> */}
                        {/* </OffictelName> */}


                    </div>
                    {/* <Box>
                            <CheckBoxN>
                                <InputCheck type="checkbox" name="pro" id="pro3" onChange={(e) => {
                                    if (e.target.checked) {
                                        setisstore(1);
                                    } else {
                                        setisstore(0);
                                    }
                                }} />
                                <CheckLabel for="pro3">
                                    <Span />
                                    상가
                                </CheckLabel>
                            </CheckBoxN>
                        </Box>
                        <Box>
                            <CheckBoxN>
                                <InputCheck type="checkbox" name="pro" id="pro4" onChange={(e) => {
                                    if (e.target.checked) {
                                        setisoffice(1);
                                    } else {
                                        setisoffice(0);
                                    }
                                }} />
                                <CheckLabel for="pro4">
                                    <Span />
                                    사무실
                                </CheckLabel>
                            </CheckBoxN>
                        </Box> */}
                    <div className="par-spacing">
                        <MUFormGroup>
                            <FormControlLabel control={<Checkbox onChange={(e) => {
                                if (e.target.checked) {
                                    setisstore(1);
                                } else {
                                    setisstore(0);
                                }
                            }} />} label="상가" />
                        </MUFormGroup>
                    </div>
                    <div className="par-spacing">
                        <MUFormGroup>
                            <FormControlLabel control={<Checkbox onChange={(e) => {
                                if (e.target.checked) {
                                    setisoffice(1);
                                } else {
                                    setisoffice(0);
                                }
                            }} />} label="사무실" />
                        </MUFormGroup>
                    </div>

                    <div className="par-spacing"> 
                        <MUButton_Validation disabled={NextButtonOption} variant="contained" type="button" name="" active={NextButtonOption} onClick={() => { next_step(); }}>다음</MUButton_Validation>
                    </div>
                    {/*사업자등록증이 DB에 없다면 사업자등록증 첨부 페이지( Second로 이동 )*/}
                    {/*<Link to="/RegistProBrokerSecond" className="data_link" />*/}
                    {/*사업자등록증이 DB에 있다면 신청서확인페이지( Third로 이동 )*/}
                    {/*<Link to="/RegistProBrokerSecond" className="data_link"/>*/}
                    {/* <Button onClick={() => {next_step();}}>
                        <Next type="submit">다음</Next>
                    </Button> */}

                    {
                        addressApi ?
                            <Dialog className="muDlog-postApi"
                                // onClose={() =>{ setAddressApi(false); setisofficetel(0);}}
                                open={addressApi}
                            >
                                <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { setAddressApi(false); setApartCheckOption(false); setisapart(0);}}>
                                    주소 검색
                                </BootstrapDialogTitle>
                                <DialogContent className="muDlogCont-postApi">
                                    <Typography>
                                        <MapApi setapart_addr_road={setapart_addr_road} setaptname={setaptname} setAddressApi={setAddressApi} />
                                    </Typography>
                                </DialogContent>
                            </Dialog>

                            // <AddressApi>
                            //     <CloseImg src={Close} onClick={() => setAddressApi(false)} />
                            //     <MapApi setapart_addr_road={setapart_addr_road} setaptname={setaptname} setAddressApi={setAddressApi} />
                            // </AddressApi>
                            :
                            null
                    }
                    {
                        addressApi2 ?
                            <Dialog className="muDlog-postApi"
                                // onClose={() => setAddressApi2(false)}
                                open={addressApi2}
                            >
                                <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { setAddressApi2(false); setisofficetel(0); setOfficetelsCheckOption(false); }}>
                                    주소 검색
                                </BootstrapDialogTitle>
                                <DialogContent className="muDlogCont-postApi">
                                    <Typography>
                                        <MapApi2 setofficetel_addr_road={setofficetel_addr_road} setofficetelname={setofficetelname} setAddressApi2={setAddressApi2} />
                                    </Typography>
                                </DialogContent>
                            </Dialog>
                            // <AddressApi>
                            //     <CloseImg src={Close} onClick={() => setAddressApi2(false)} />
                            //     <MapApi2 setofficetel_addr_road={setofficetel_addr_road} setAddressApi2={setAddressApi2} />
                            // </AddressApi>
                            :
                            null
                    }

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
   
    background:${({ active, theme }) => active ? "rgba(0, 0, 0, 0.12)" : theme.palette.primary.main};

    color:${({ active, theme }) => active ? "rgba(0, 0, 0, 0.26)" : theme.palette.primary.contrastText};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`








// const Line = Sstyled.div`
//     width:100%;
//     height:1px;
//     background:#f2f2f2;
//     margin:60px 0 50px;
//     @media ${(props) => props.theme.mobile} {
//         margin:calc(100vw*(60/428)) 0 calc(100vw*(40/428));
//     }
// `
// const BasicInfos = styled.div`
//     width:408px;
//     margin:0 auto;
//     @media ${(props) => props.theme.mobile} {
//         width:calc(100vw*(360/428));
//     }
// `
// const Box = styled.div`
//     width:100%;margin-bottom:25px;
//     @media ${(props) => props.theme.mobile} {
//         margin-bottom:calc(100vw*(25/428));
//     }
// `
// const CheckBoxN = styled.div`
//     width:100%;
//     display:flex;justify-content:flex-start;align-items:center;
// `
// const InputCheck = styled.input`
//     display:none;
//     &:checked+label span{background:url(${Checked}) no-repeat;background-size:100% 100%}
// `
// const CheckLabel = styled.label`
//     display:inline-block;
//     font-size: 15px;font-family:'NanumSquare', sans-serif;
//     font-weight: 600;color:#4a4a4a;
//     transform:skew(-0.1deg);
//     /* @media ${(props) => props.theme.mobile} {
//         font-size:calc(100vw*(15/428));
//     } */
// `
// const Span = styled.span`
//     display:inline-block;
//     width:20px;height:20px;vertical-align:middle;
//     margin-right:10px;
//     background:url(${Check}) no-repeat;background-size:100% 100%;
//     /* @media ${(props) => props.theme.mobile} {
//         width:calc(100vw*(20/428));height:calc(100vw*(20/428));
//         margin-right:calc(100vw*(10/428));
//     } */
// `
// const SearchBox = styled.div`
//     width:100%;
//     margin-top:16px;
//     /* @media ${(props) => props.theme.mobile} {
//         margin-top:calc(100vw*(16/428));
//     } */
// `
// const Label = Sstyled.label`
//     display:inline-block;
//     margin-bottom:10px;
//     font-size:12px;padding-left:7px;
//     color:#4a4a4a;transform:skew(-0.1deg);font-weight:600;
//     @media ${(props) => props.theme.mobile} {
//         margin-bottom:calc(100vw*(16/428));
//         font-size:calc(100vw*(12/428));
//         padding-left:calc(100vw*(7/428));
//     }
// `
// const InBox = Sstyled.div`
//     width: 408px;
//     height: 43px;
//     border-radius: 4px;
//     border: solid 1px #e4e4e4;
//     background-color: #ffffff;
//     display:flex;justify-content:space-between;align-items:center;
//     @media ${(props) => props.theme.mobile} {
//         width:100%;
//         height:calc(100vw*(43/428));
//     }
// `
// const InputSearch = styled.input`
//     width:100%;
//     height:100%;text-align:center;
//     padding-left:40px;
//     font-size:15px; transform:skew(-0.1deg);
//     font-weight:600;color:#707070;background:transparent;
//     &::placeholder{ font-weight:500;color:#979797;}
//     @media ${(props) => props.theme.mobile} {
//         padding-left:calc(100vw*(40/428));
//         font-size:calc(100vw*(15/428));
//     }
// `
// const OffictelName = styled.div`
//     width:100%;margin-top:15px;
//     @media ${(props) => props.theme.mobile} {
//         margin-top:calc(100vw*(15/428));
//     }
// `
// const InputText = styled(InputSearch)`
//     border:1px solid #e4e4e4;border-radius:4px;
//     display:inline-block;height:43px;width:100%;
//     padding-left:0;
//     @media ${(props) => props.theme.mobile} {
//         height:calc(100vw*(43/428));
//     }
// `
// const SearchIcon = styled.div`
//     width:43px;height:43px;
//     margin-right:10px;
//     background:url(${Search}) no-repeat center center; background-size:19px;
//     @media ${(props) => props.theme.mobile} {
//         width:calc(100vw*(43/428));
//         height:calc(100vw*(43/428));
//         margin-right:calc(100vw*(10/428));
//         background-size:calc(100vw*(18/428));
//     }
// `
// const AddressApi = styled.div`
//   position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
//   width:450px;height:auto;z-index:2;
//   border:1px solid #eee;
//   background:#fff;
//   padding:70px 10px 0;
//   @media ${(props) => props.theme.mobile} {
//         width:90%;
//         padding:calc(100vw*(70/428)) calc(100vw*(10/428)) 0;
//     }
// `
// const CloseImg = styled.img`
//   position:Absolute;top:20px;right:10px;
//   width:18px;
//   cursor:pointer;
//   @media ${(props) => props.theme.mobile} {
//         top:calc(100vw*(20/428));right:calc(100vw*(10/428));
//         width:calc(100vw*(18/428));
//     }
// `
// const Button = styled.div`
//     width:100%;position:relative;
//     margin-top:65px;
//     @media ${(props) => props.theme.mobile} {
//         margin-top:calc(100vw*(65/428));
//     }
// `
// const Next = styled.button`
//     width:100%;height:66px;
//     line-height:60px;
//     border-radius: 11px;
//     border: solid 3px #e4e4e4;
//     background-color: #979797;
//     font-weight: 800;
//     font-style: 800;font-size:20px;
//     text-align: center;
//     color: #ffffff;
//     transform:skew(-0.1deg);
/*
    액티브 됐을때
    border: solid 3px #429370;
    background-color: #2b664d;
*/
//     @media ${(props) => props.theme.mobile} {
//         height:calc(100vw*(60/428));
//         line-height:calc(100vw*(54/428));
//         font-size:calc(100v*(15/428));
//     }
// `