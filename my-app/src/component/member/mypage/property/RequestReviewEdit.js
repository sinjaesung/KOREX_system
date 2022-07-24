//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col_input, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

//component
import { Mobile, PC } from "../../../../MediaQuery"
import ConditionChangeList from "./ConditionChangeList";
import RequestReviewBasicInfo from "./RequestReviewBasicInfo";
import InputForm_ItemSpec_Basic from '../common/InputForm_ItemSpec_Basic';
import BasicInfo from '../common/BasicInfo';
import ModalPreview from './modal/ModalPreview';
//added redux actions go
import { useSelector } from 'react-redux';

// import ModalPicture from '../../../component/member/mypage/property/modal/ModalPicture';
import ModalPicture from '../../mypage/property/modal/ModalPicture';

// import ModalCommonWithoutcancel from "../../../component/common/modal/ModalCommonWithoutcancel";
import ModalCommonWithoutcancel from "../../../common/modal/ModalCommonWithoutcancel";

export default function RequsetReview({ acceptModal, cancleModal, setAccept, setCancle, disabled, brokerRequest_product, nowprdstatus, prd_id, probrokerinfo, prd_state }) {

  const [basic, setBasic] = useState(false);

  const [open, setopen] = useState(false);

  const openPreview = (open) => {
    setopen(!open);
  }

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  const [serveruploadimgs_server, setServeruploadimgs_server] = useState([]);//서버에 반영할 최종적 이미지업로드 리스트.(inserted만 진행.)
  const [changeaddedimgs_server, setChangeaddedimgs_server] = useState([]);


  const [imgfiles, setimgfiles] = useState([])

  const updateModal = (sss) => {
    console.log('나오긴하냐?', sss);
    setModalOption({
      show: true,
      setShow: offModal,
      title: '사진업로드',
      content: {
        type: "components", text: "TESESDGSDGSDG",
        component: <ModalPicture setServeruploadimgs_server={setServeruploadimgs_server} setChangeaddedimgs_server={setChangeaddedimgs_server} serveruploadimgs_server={serveruploadimgs_server} changeaddedimgs_server={changeaddedimgs_server} imgfiles={imgfiles} setimgfiles={setimgfiles} offModal={offModal} prd_id={prd_id} />
      },
      submit: {
        show: true, title: '취소', event: () => {
          console.log('serveruploadimgs_server:', serveruploadimgs_server);

          offModal();
          //모달창 새로 열때마다 state는 초기화되는 개념이라고 보면되고, state는 유지된다. 유지된 state값으로 전달되어져서 넘긴다.
          console.log('사진업로드 적용 시점때 리덕스 저장해버리기', serveruploadimgs_server);

        }
      },
      cancle: {
        show: false, title: '초기화', event: () => {
          console.log('데이터는 없다');

        }
      },
      confirm: { show: false, title: "확인" }
    });
  }

  console.log('랜더링확인 2번 brokerRequest_product1235', brokerRequest_product);  //물건정보
  console.log('랜더링확인 2번', probrokerinfo);
  console.log('랜더링확인3 ', prd_id);

  return (
    <>
      <Wrapper>
        <p className="tit-a2">물건 수정&#62; 필수정보</p>
        <div className="par-indent-left">
          <div className="par-spacing">
            <div className="clearfix desc">
              <p>상태: {brokerRequest_product.prd_status}</p>
              {brokerRequest_product.prd_create_origin == '외부수임' ?
                null
                :
                <p>소속명</p>
              }
              <p>의뢰인명: {brokerRequest_product.request_mem_name}</p>
              <p>휴대폰번호: {brokerRequest_product.request_mem_phone}</p>
              {brokerRequest_product.prd_create_origin == '외부수임' ?
                null
                :
                <p>요청사항: {brokerRequest_product.requestmessage}</p>

              }
            </div>
            {/*!!@@ 211110_이형규> 하자--- 물건수정 페이지 열릴때 해당 물건의 default값이 즉시 표시가 안됨. 버튼 클릭 필요없음.*/}

            <MUButton variant="outlined" onClick={() => { setBasic(!basic); }}>!!임시 호출</MUButton>
            <MUButton variant="outlined" onClick={() => { openPreview(open)}}>미리보기</MUButton>
           
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          <InputForm_ItemSpec_Basic brokerRequest_product={brokerRequest_product} disabled={disabled} mode={'수정'} prd_id={prd_id} setModalOption={setModalOption} updateModal={updateModal} serveruploadimgs_server={serveruploadimgs_server} changeaddedimgs_server={changeaddedimgs_server} prd_state={prd_state} />
        </Sect_R2>
      </Wrapper>
      <ModalPreview open={open} setopen={setopen} brokerRequest_product={brokerRequest_product} probrokerinfo={probrokerinfo} />
      <ModalCommonWithoutcancel modalOption={modalOption} />
    </>
  );
}


const MUButton = styled(Button)``
//---------------------------------
const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2`
  ${TtCon_Title}  
`
const Sect_R2 = styled.div`
  ${TtCon_1col_input}
`
const MUButton_Validation = MUstyled(MUButton)`
        &.MuiButtonBase-root.MuiButton-root{
          background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
        color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
        box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"};
  }
`
