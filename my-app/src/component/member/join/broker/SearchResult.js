//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import Button from '@mui/material/Button';
import { styled as MUstyled } from '@material-ui/core/styles';
//css
import styled from "styled-components"

//server process load
import serverController from '../../../../server/serverController';

//redux phone number clc_relators중개사국가정보포탈 정보 mng_no조회. 이 출처값을 바탕으로 x,y입력. 신규등록의 경우는 가입과정중에 x,y가 등록되진못함. 그 내역이 request내역에 등록되었다가 관리자에서 그걸 확인승인해주고나서 직접등록해주는 형태로 갈것임.
import { useSelector } from 'react-redux';
import { tempRegisterUserdataActions } from '../../../../store/actionCreators';

export default function SearchResult() {
  const temp_register_userdatainfo = useSelector(data => data.temp_register_userdata);
  const [issuccess, setissuccess] = useState(false);
  const [confirmClcinfo, setConfirmClcinfo] = useState({});

  useEffect(async () => {
    //부모요소가 리랜더링되거나 해당 페이지 새로고침 로드되는경우, 다른곳에서 넘어온경우, 내부 state값 변경시에는 미반응.
    let body_info = {
      phone: temp_register_userdatainfo.phone
    };
    let clcRealtors_result = await serverController.connectFetchController('/api/auth/broker/brokerClcRealtors_confirm', 'POST', JSON.stringify(body_info));
    if (clcRealtors_result) {
      console.log('clcRealtors_resultss::', clcRealtors_result);
      if (clcRealtors_result.success) {
        setissuccess(clcRealtors_result.success);
        setConfirmClcinfo(clcRealtors_result.data);

        tempRegisterUserdataActions.namechange({ names: clcRealtors_result.data['rep_name'] });

        tempRegisterUserdataActions.mngnochange({ clcmngnos: clcRealtors_result.data['mng_no'] });
        tempRegisterUserdataActions.businessnamechange({ businessname: clcRealtors_result.data['biz_name'] });
        tempRegisterUserdataActions.regnochange({ regno: clcRealtors_result.data['reg_no'] });
        tempRegisterUserdataActions.addrrawchange({ addrraw: clcRealtors_result.data['addr_raw'] });
        tempRegisterUserdataActions.addrjibunchange({ addrjibun: clcRealtors_result.data['addr_jibun'] });
        tempRegisterUserdataActions.addrroadchange({ addrroad: clcRealtors_result.data['addr_rn'] });//
        tempRegisterUserdataActions.xchange({ x: clcRealtors_result.data['x'] });
        tempRegisterUserdataActions.ychange({ y: clcRealtors_result.data['y'] });
      }
      else {
        setissuccess(false);
        setConfirmClcinfo(null);
      }
    } else {
      setissuccess(false);
      setConfirmClcinfo(null);
    }
  }, []);
  return (
    <Container>
      <WrapSearchResult>
        {
          issuccess == true ?
            <div>
              <WrapResultBox>
                <TopTxt>조회결과</TopTxt>
                <Ul>
                  <Li>중개사무소등록번호 : {confirmClcinfo.reg_no}</Li>
                  <Li>중개사무소명 : {confirmClcinfo.biz_name}</Li>
                  <Li>중개사무소주소 : {confirmClcinfo.addr_raw}</Li>
                  <Li>대표자명 : {confirmClcinfo.rep_name}</Li>
                </Ul>
                <Div>본인 맞으십니까?</Div>
              </WrapResultBox>
              <ConfirmBtn>
                <Link to="/BrokerRegistration">
                  <NoBtn type="button" name="">아니오</NoBtn>
                </Link>
                <Link to="/JoinBusinessNumber">
                  <YesBtn type="button" name="">예</YesBtn>
                </Link>
              </ConfirmBtn>
            </div>
            :
            <div>
              <WrapResultBox>
                <TopTxt>조회결과</TopTxt>
                <Ul>
                  <Li> 조회된 결과가 없습니다.</Li>
                </Ul>
              </WrapResultBox>
              <ConfirmBtn>
              {/* <MUButton variant="contained"> */}
                <Link to="/BrokerRegistration">
                  <MUButton variant="contained" name="">신규가입</MUButton>
                </Link>
              {/* </MUButton> */}
              </ConfirmBtn>
            </div>
        }
      </WrapSearchResult>
    </Container>
  );
}
const MUButton = MUstyled(Button)`
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
    width:450px;
    margin:35px auto 0;
    padding-bottom:150px;
    @media ${(props) => props.theme.mobile} {
        width:calc(100vw*(370/428));
        margin:calc(100vw*(35/428)) auto 0;
        padding-bottom:calc(100vw*(100/428));
      }
`
const WrapSearchResult = styled.div`
    width:100%;
`
const WrapResultBox = styled.div`
    width:100%;
    padding:30px 0 30px 40px;
    margin-bottom:50px;
    border-top:1px solid #f2f2f2;
    border-bottom:1px solid #f2f2f2;
    @media ${(props) => props.theme.mobile} {
        width:100%;
        padding:calc(100vw*(37/428)) 0 calc(100vw*(37/428)) calc(100vw*(40/428));
        margin-bottom:calc(100vw*(50/428));
      }
`

const Ul = styled.ul`
  width:100%;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
      width:100%;
      margin-bottom:calc(100vw*(20/428));
    }

`
const TopTxt = styled.h2`
  font-size:16px;font-weight:800;transform:skew(-0.1deg);
  margin-bottom:17px;
  color:#fe7a01;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(16/428));
      margin-bottom:calc(100vw*(17/428));
    }
`

const Li = styled.li`
  font-size:15px;font-weight:800;transform:skew(-0.1deg);
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }
`
const Div = styled.div`
  font-size:15px;font-weight:600;transform:skew(-0.1deg);
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }
`
const ConfirmBtn = styled.div`
    display:flex;justify-content:center;align-items:center;
    width:100%;
`
const NoBtn = styled.button`
    width:200px;height:66px;line-height:60px;
    background:#979797;color:#fff;font-size:20px;
    border:3px solid #e4e4e4;font-weight:600;transform:skew(-0.1deg);
    border-radius:11px;
    @media ${(props) => props.theme.mobile} {
        width:calc(100vw*(180/428));
        height:calc(100vw*(60/428));
        line-height:calc(100vw*(54/428));
        font-size:calc(100vw*(15/428));
      }
`
const YesBtn = styled(NoBtn)`
    background:#01684b;
    border:3px solid #04966d;
    margin-left:8px;
    @media ${(props) => props.theme.mobile} {
        margin-left:calc(100vw*(10/428));
      }
`
