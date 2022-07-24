//react
import React, { useState, useEffect } from 'react';

//css
import styled from "styled-components"

//component
import MainHeader from '../../component/common/MainHeader';
import SubTitle from '../../component/common/SubTitle';
import MbBunyangList from '../../component/common/bunyang/mobilecomp/MbBunyangList';
import MainFooter from '../../component/common/MainFooter';
import TermService from '../../component/common/TermsOfService';
import TermPrivacy from '../../component/common/TermsOfPrivacy';
import TermLocation from '../../component/common/TermsOfLocation';
import ModalCommon from '../../component/common/modal/ModalCommon';
// import ModalFilter from '../../component/common/modal/ModalFilter';
import ModalFilter from '../../component/common/bunyang/modal/ModalFilter';

import { Mobile, PC } from "../../MediaQuery"

import CommonFooter from '../../component/common/commonFooter';
import { useSelector } from 'react-redux';
import serverController from '../../server/serverController';

//채널상담 서비스관련 콤퍼넌트
import ChannelServiceElement from '../../component/common/ChannelServiceElement';

export default function MainPage() {

  ChannelServiceElement.shutdown();

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  const loginUser = useSelector(state => { return state.login_user });
  const [currentFilter, setCurrentFilter] = useState({
    sort: 0,
    view: 0,
  });

  const [searchVal, setSearchVal] = useState("");
  const [byList, setByList] = useState([]);

  useEffect(() => {
    getBunyangList("");
  }, [])

  // korex 프론트 수정 -------------------------------------

  const getBunyangList = async (searchKey) => {
    console.log(currentFilter);
    let result = await serverController.connectFetchController(`/api/bunyang?mem_id=${loginUser.memid ? loginUser.memid : 0}sort=${currentFilter.sort}&live=${currentFilter.view}${searchKey ? `&search=${searchKey}` : ""}`, "get", null);
    setByList([...result.data]);
  }
  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }


  const onChangeSort = (e) => {
    setCurrentFilter(ob => { ob.sort = e.target.value; return ob; })
  }
  const onChangeCondi = (e) => {
    setCurrentFilter(ob => { ob.view = e.target.value; return ob; })
  }

  const onClickSearch = () => {
    getBunyangList(searchVal);
  }

  const updateModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "필터",
      content: {
        type: "components",
        text: `Testsetsetsetsetestse`,
        component: <ModalFilter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} onChangeSort={onChangeSort} onChangeCondi={onChangeCondi} />
      },
      submit: { show: true, title: "적용", event: () => { offModal(); getBunyangList(searchVal ? searchVal : ""); } },
      cancle: { show: true, title: "초기화", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        <MainHeader rank={true} />
        <SubTitle title={"분양"} rank={false} />
        <MbBunyangList loginUser={loginUser} searchVal={searchVal} setSearchVal={setSearchVal} onClickSearch={onClickSearch} byList={byList} setByList={setByList} updateModal={updateModal} currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />
        <ModalCommon modalOption={modalOption} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}