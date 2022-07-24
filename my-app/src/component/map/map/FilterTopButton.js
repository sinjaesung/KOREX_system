//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components";
//material-ui
import LaptopIcon from '@mui/icons-material/Laptop';
import TvIcon from '@mui/icons-material/Tv';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//img
import NavIcon from '../../../img/main/nav_btn.png';
import Logo from '../../../img/main/header_logo.png';
import PCLogo from '../../../img/main/pc_header_logo.png';
import Mypage from '../../../img/main/mypage_icon.png';
import FilterClose from '../../../img/map/filter_close.png';
import FilterDown from '../../../img/map/filter_down_arrow.png';

// components
import { Mobile, PC } from "../../../MediaQuery";

//redux
import { MapFilterRedux } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

export default function MapFilter({ openBunyang, rank }) {

  const mapFilterRedux = useSelector(state => { return state.mapFilter });
  let uiData = JSON.parse(JSON.stringify(mapFilterRedux.filterUI));
  let filterArr = JSON.parse(JSON.stringify(mapFilterRedux.filterArr));

  console.log(mapFilterRedux.filterArr.prd_sel_type);

  // const onClickTrade = (e) => {
  //   const text = e.target.dataset.text;
  //   const num = e.target.dataset.num;

  //   let count = 0;
  //   if (e.target.checked) {
  //     filterArr.prd_sel_type.push(text);
  //     uiData.prd_sel_type[num] = 1;
  //   } else {
  //     uiData.prd_sel_type.map(item => { if (item) { count++; } })
  //     if (count == 1) {
  //       e.preventDefault();
  //       return;
  //     }
  //     uiData.prd_sel_type[num] = 0;
  //     filterArr.prd_sel_type = filterArr.prd_sel_type.filter(item => item != text);
  //   }

  //   MapFilterRedux.updateFilterArr({ filterArr: filterArr });
  //   MapFilterRedux.updateFilterUI({ filterUI: uiData });
  // }


  const [val, setVal] = useState(['매매', '전세','월세']);//0,1,2
  
  const handleVal = (e, newVal) => {

   // const num = e.target.dataset.num;

    //console.log("여기 동작 확인",newVal,e.target,e.currentTarget,e.target.dataset.num,e.currentTarget.dataset.num,e.target.ariaPressed,e.currentTarget.ariaPressed);
    
    let target_pressed=e.currentTarget.ariaPressed;
    let target_name=e.currentTarget.dataset.text;
    let target_index=e.currentTarget.dataset.num;//target index
    let tmp_array=[...val];
    //console.log('타깃과 타깃 선택상태여부::',target_name,target_index,target_pressed,val,tmp_array);

    if(target_pressed==false){
      if(tmp_array.length==1){
        //console.log('tmp_array가 하나만 남아있던상태::');
        //해제액션시에 1개만있던상태였으면 해제하는액션 하지않음.
        e.preventDefault();
        return;
      }else{
        //2개이상였던 상태시에만
        //console.log('특정 대상삭제해제 액션진행>>>::');
        tmp_array.splice(target_index,1);//대상 위치의 요소를 삭제한다.
        uiData.prd_sel_type[target_index] = 0;
        setVal(tmp_array);
      }
    }else{
      //선택되어있지 않던경우 그 대상을 그냥 추가한다
      //console.log('특정 대상활성화 액션진행>>>::');
      tmp_array[target_index] = target_name;
      uiData.prd_sel_type[target_index] = 1;
      setVal(tmp_array);
    }
    //console.log('처리반영 arrayss:',tmp_array);
    /*let count = 0;
    if (newVal.length) {
      setVal(newVal);
      filterArr.prd_sel_type = newVal;

      if (e.target.ariaPressed == 'true') {
        uiData.prd_sel_type.map(item => { if (item) { count++; } })
        if (count == 1) {
          e.preventDefault();
          return;
        }
        uiData.prd_sel_type[num] = 0;

      } else if (e.target.ariaPressed == 'false') {
        uiData.prd_sel_type[num] = 1;
      }

    } else {
      uiData.prd_sel_type[num] = 1;
    }

    MapFilterRedux.updateFilterArr({ filterArr: filterArr });
    MapFilterRedux.updateFilterUI({ filterUI: uiData });*/
  
  };

  return (
    <>
      <WrapFilterButton>
        {/* <Box>
          <SubTitle>거래유형</SubTitle>
          <WrapButtons>
            <Button checked={uiData.prd_sel_type[0]} onChange={(e) => { onClickTrade(e) }} data-text="매매" data-num="0" className={["trade", "changeBtn"]} type="checkbox" id="trade1" />
            <Label for="trade1">매매</Label>
            <Button checked={uiData.prd_sel_type[1]} onChange={(e) => { onClickTrade(e) }} data-text="전세" data-num="1" className={["trade", "changeBtn"]} type="checkbox" id="trade2" />
            <Label for="trade2">전세</Label>
            <Button checked={uiData.prd_sel_type[2]} onChange={(e) => { onClickTrade(e) }} data-text="월세" data-num="2" className={["trade", "changeBtn"]} type="checkbox" id="trade3" />
            <Label for="trade3">월세</Label>
          </WrapButtons>
        </Box> */}

        <ToggleButtonGroup
          color="primary"
          value={val}
          onChange={handleVal}
        >
          <ToggleButton value="매매" data-text="매매" data-num="0">
            <div className={["changeBtn"]}>매매</div>
          </ToggleButton>
          <ToggleButton value="전세" data-text="전세" data-num="1">
            <div className={["changeBtn"]}>전세</div>
          </ToggleButton>
          <ToggleButton value="월세"  data-text="월세" data-num="2">
            <div className={["changeBtn"]}>월세</div>
          </ToggleButton>
        </ToggleButtonGroup>

      </WrapFilterButton>
    </>
  );
}


const WrapFilterButton = styled.div`
  padding:1rem;
  text-align:center;
`
// const Box = styled.div`
//   width:100%;
// `
// const SubTitle = styled.div`
//   margin-bottom:0.75rem;
// `
// const WrapButtons = styled.div`
//   width:100%;
//   display:flex;justify-content:flex-start;align-items:center;
// `
// const Button = styled.input`
//   display:none;
//   &:last-child{margin-right:0;}
//   &:checked+label{background:#2b664d;color:#fff;}
// `
// const Label = styled.label`
//   display:inline-block;
//   padding:0.2rem 2rem;
//   width: 106px;
//   height: 35px;
//   line-height:2rem;
//   text-align:center;
//   border-radius:3px;
//   margin-right:5px;
//   background:#f8f7f7;color:#4a4a4a;
//   cursor:pointer;transition:all 0.15s;
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(106/428));
//     height:calc(100vw*(35/428));
//     line-height:calc(100vw*(35/428));
//     font-size:calc(100vw*(14/428));
//     margin-right:calc(100vW*(5/428));
//   }
// `
