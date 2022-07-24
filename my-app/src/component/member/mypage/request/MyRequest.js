//react
import React ,{useState, useEffect,useRef} from 'react';
import {Link,useHistory} from "react-router-dom";

//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';


//img
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Location from '../../../../img/member/loca.png';
import Set from '../../../../img/member/setting.png';
import Item from '../../../../img/main/item01.png';
import Noimg from '../../../../img/member/company_no.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';

import { Mobile, PC } from "../../../../MediaQuery"

import serverController from '../../../../server/serverController';

//component
import RequestList from "./RequestList";
import RequestSorting from "./RequestSorting";
import ModalAddUserInfo from './modal/ModalAddUserInfo';
import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';

//redux addons assets;
import { useSelector } from 'react-redux';
import login_user from '../../../../store/modules/login_user';

export default function Request({mannerModal,startModal,filterModal,cancleModal,completeModal,cancle2Modal,setFilter,value,type,brokerproductlist,setBrokerproductlist,alramsetting_tiny,setalramsetting_tiny}) {
 
  const history = useHistory();
  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  //const [is_serveron,setIs_serveron] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  const login_user_redux = useSelector(data => data.login_user);//로그인 정보 저장 리덕스.로그인 mem_id조회.

  /*data map*/
  const RequestListItem = [
    {
      prd_identity_id: 0,
      prd_img: Item,
      date: "21.00.00 - 21.00.00",
      prd_status: "검토 대기",
      modify_date: "2021.00.00",
      prd_name: "충남내포신도시2차대방엘리움더센트럴",
      prd_type: "아파트",
      address: "자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      addr_detail: "자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      prd_sel_type: "매매",
    },
    {
      prd_identity_id: 1,
      prd_img: Item,
      date: "21.00.00 - 21.00.00",
      prd_status: "거래 준비",
      modify_date: "2021.00.00",
      prd_name: "충남내포신도시2차대방엘리움더센트럴",
      prd_type: "아파트",
      address: "자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)  강남구 서초동 서초동 서초동",
      addr_detail: "자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)  강남구 서초동 서초동 서초동",
      prd_sel_type: "매매"
    },
    {
      prd_identity_id: 2,
      prd_img: Noimg,
      date: "21.00.00 - 21.00.00",
      prd_status: "의뢰 철회",
      modify_date: "2021.00.00",
      prd_name: "충남내포신도시2차대방엘리움더센트럴",
      prd_type: "아파트",
      address: "자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      addr_detail: "자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      prd_sel_type: "매매",
    },
    {
      prd_identity_id: 3,
      prd_img: Noimg,
      date: "21.00.00 - 21.00.00",
      prd_status: "위임 취소",
      modify_date: "2021.00.00",
      prd_name: "충남내포신도시2차대방엘리움더센트럴",
      prd_type: "아파트",
      address: "자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      addr_detail: "자이 3층 203호 서울시 강남구 서초동 (OO읍 OO리)",
      prd_sel_type: "매매",
    }
  ]

  const topInfoContent = () => {
    return (
      <div className="flex-right-center">
        <IconButton onClick={() => { filterModal(); }}>
          <FilterListIcon />
        </IconButton>
      </div>
    )
  }

  console.log('여기확인 : ',login_user_redux.user_name);
  console.log('여기확인 : ',login_user_redux.phone);

  return (
    <>


    
      <Wrapper>
        <p className="tit-a2">내 중개의뢰</p>
        <div className="par-spacing">
          <div className="flex-right-center">

            {
              !login_user_redux.user_name || !login_user_redux.phone ?

                <MUButton variant="contained" disableElevation onClick={() => { setUserInfo(true) }}>추가</MUButton>
                :
                <MUButton variant="contained" disableElevation><Link to="/AddRequest" className="data_link" />추가</MUButton>
            }

          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          <div className="par-spacing">
            <CommonTopInfo length={brokerproductlist.length ? brokerproductlist.length : 0} leftComponent={topInfoContent()} />
          </div>

          <div className="par-spacing-after">
            <ul className="scroll-y">
              {
                brokerproductlist.length > 0 ?
                  brokerproductlist.map((value) => {

                    let local_item = value['prd_id_history_child'][0];//prdidienitiyid요소의 자식들중 히스토리내역중 가장 최근것 0번 가장 초기origin요소(x,y포함한 모든 최근 수정정보까지 매물정보) 그 이후의 내역들은 사실상 상태변경의 내역들만 저장하고있을뿐이다.
                    let match_transaction_item = value['match_transaction_row'][0];//그 각 그룹prdiientityi별 하나별의 최근 transaciton내역한개를 정보저장.
                    const type = () => {
                      if (match_transaction_item.prd_status == '대기' || match_transaction_item.prd_status == '검토대기') {
                        return 1
                      } else if (match_transaction_item.prd_status == '거래준비') {
                        return 1
                      } else if (match_transaction_item.prd_status == '의뢰철회') {
                        return 0.5
                      } else if (match_transaction_item.prd_status == '위임취소') {
                        return 0.5
                      }
                    }

                    return (
                      <RequestList setFilter={setFilter} type={type} value={local_item} match_transaction_item={match_transaction_item} filterModal={filterModal} mannerModal={mannerModal} cancleModal={cancleModal} startModal={startModal} cancle2Modal={cancle2Modal} completeModal={completeModal} alramsetting_tiny={alramsetting_tiny} setalramsetting_tiny={setalramsetting_tiny} setBrokerproductlist={setBrokerproductlist} />
                    )

                  })
                  : null
              }

            </ul>
          </div>
        </Sect_R2>
      </Wrapper>
      {
        userInfo ?
          <ModalAddUserInfo setUserInfo={setUserInfo} userInfo={userInfo} />
          :
          null
      }
    </>
  );
}


const MUButton = styled(Button)``
//------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col}
`